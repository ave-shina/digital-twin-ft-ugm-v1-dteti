/**
 * Normalizer: dokumen Prismic -> bentuk data lama (src/types/data.ts).
 * Kontrak `src/types/data.ts` TIDAK diubah — komponen konsumen tetap
 * menerima LandmarksData/TourDataShape/FaqDataShape.
 */
import type {
  ImageAttributes,
  ImageData,
  ImageFormats,
  LandmarkItem,
  LandmarksData,
  MapDetail,
  MapInformation,
  FaqDataShape,
  GalleryDetail,
  TourDataShape,
  TourPanoramaData,
  PanoramaCoordinate,
} from '@/types/data'
import type {
  AboutContent,
  AboutDocument,
  FaqDocument,
  LandmarkDocument,
  PanoramaSceneDocument,
  SiteSettings,
  SiteSettingsDocument,
  TourDocument,
  TutorialStep,
} from '@/types/prismic'
import { richTextToHtml } from './richText'

const EPOCH = '1970-01-01T00:00:00.000Z'

const EXT_MIME: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
}

/** Angka Prismic (Number field bisa null) -> number aman. */
function num(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

function text(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value.length > 0 ? value : fallback
}

/** Gambar kosong dengan bentuk ImageAttributes lengkap (komponen lama mengakses semua field). */
export function emptyImage(): ImageData {
  return {
    data: {
      id: 0,
      attributes: {
        name: '',
        alternativeText: null,
        caption: null,
        width: 0,
        height: 0,
        formats: {},
        hash: '',
        ext: '',
        mime: '',
        size: 0,
        url: '',
        previewUrl: null,
        provider: 'prismic',
        provider_metadata: { public_id: '', resource_type: 'image' },
        createdAt: EPOCH,
        updatedAt: EPOCH,
      },
    },
  }
}

/**
 * Varian "large" gaya Strapi: skala lebar maks 1000px tanpa upscale — ukuran yang
 * sama dengan gambar yang benar-benar dimuat komponen (imgix w=1000). Stage peta
 * Konva (Map.tsx) mengukur dari formats.large, jadi ini wajib sinkron dengan
 * gambar yang tampil agar peta tidak molor dan pin tetap presisi.
 */
function largeFormat(attrs: {
  filename: string
  ext: string
  mime: string
  width: number
  height: number
  url: string
}): ImageFormats {
  if (!attrs.width || !attrs.height) return {}
  const scale = Math.min(1, 1000 / attrs.width)
  return {
    large: {
      name: `large_${attrs.filename}`,
      hash: `large_${attrs.filename}`,
      ext: attrs.ext,
      mime: attrs.mime,
      path: null,
      width: Math.round(attrs.width * scale),
      height: Math.round(attrs.height * scale),
      size: 0,
      url: attrs.url,
      provider_metadata: { public_id: attrs.url, resource_type: 'image' },
    },
  }
}

/** Image field Prismic -> ImageAttributes Strapi (url absolut, formats.large gaya Strapi). */
export function normalizeImage(field: {
  url?: string | null
  alt?: string | null
  dimensions?: { width?: number; height?: number } | null
}): ImageData {
  const url = field?.url ?? ''
  if (!url) return emptyImage()
  let filename = url.split('?')[0].split('/').pop() ?? 'image'
  try {
    filename = decodeURIComponent(filename)
  } catch {
    /* pakai nama mentah bila decode gagal */
  }
  const dotIndex = filename.lastIndexOf('.')
  const ext = dotIndex >= 0 ? filename.slice(dotIndex).toLowerCase() : ''
  const width = num(field?.dimensions?.width)
  const height = num(field?.dimensions?.height)
  return {
    data: {
      id: 0,
      attributes: {
        name: filename,
        alternativeText: field?.alt ?? null,
        caption: null,
        width,
        height,
        formats: largeFormat({ filename, ext, mime: EXT_MIME[ext] ?? 'image/png', width, height, url }),
        hash: dotIndex >= 0 ? filename.slice(0, dotIndex) : filename,
        ext,
        mime: EXT_MIME[ext] ?? 'image/png',
        size: 0,
        url,
        previewUrl: null,
        provider: 'prismic',
        provider_metadata: { public_id: url, resource_type: 'image' },
        createdAt: EPOCH,
        updatedAt: EPOCH,
      },
    },
  }
}

/** Group hotspot scene -> panoramaCoordinate. */
function normalizeHotspots(scene: PanoramaSceneDocument): PanoramaCoordinate[] {
  return (scene.data.hotspots ?? []).map((hotspot) => ({
    pitch: num(hotspot.pitch),
    yaw: num(hotspot.yaw),
    transition: text(hotspot.transition),
  }))
}

/** Scene -> MapInformation (mapImage = panorama scene, sesuai bentuk lama). */
function sceneToMapInformation(scene: PanoramaSceneDocument, id: number): MapInformation {
  return {
    id,
    name: text(scene.data.scene_name),
    description: text(scene.data.description),
    panoramaCoordinate: normalizeHotspots(scene),
    mapCoordinate: [num(scene.data.map_x), num(scene.data.map_y), num(scene.data.map_radius)],
    // PENTING: mapImage di MapInformation adalah panorama 360° scene,
    // bukan denah lantai (Panorama.tsx memakainya sebagai scenePanoImg).
    mapImage: normalizeImage(scene.data.panorama),
  }
}

function uidOf(link: unknown): string | null {
  if (!link || typeof link !== 'object') return null
  const uid = (link as { uid?: string | null }).uid
  return uid ?? null
}

/**
 * Kelompokkan scene milik satu landmark menjadi MapDetail[] (per lantai),
 * urut lantai sesuai `map_detail.order`, scene sesuai `scene_order`.
 */
function groupScenesIntoFloors(landmark: LandmarkDocument, scenes: PanoramaSceneDocument[]): MapDetail[] {
  const floorEntries = landmark.data.map_detail ?? []

  const scenesOfLandmark = scenes.filter((scene) => !scene.data.is_tour && uidOf(scene.data.landmark) === landmark.uid)

  const mapDetail: MapDetail[] = []
  let infoId = 0

  floorEntries
    .slice()
    .sort((a, b) => num(a.order) - num(b.order))
    .forEach((floor, index) => {
      const mapImage = normalizeImage(floor.floor_plan)
      const floorScenes = scenesOfLandmark
        .filter((scene) => text(scene.data.floor_name) === text(floor.floor_name))
        .sort((a, b) => num(a.data.scene_order) - num(b.data.scene_order))
        .map((scene) => sceneToMapInformation(scene, infoId++))

      mapDetail.push({
        id: index,
        __component: 'map.location-data',
        name: text(floor.floor_name),
        description: text(floor.floor_description),
        mapImage,
        MapInformation: floorScenes,
      })
    })

  return mapDetail
}

/** Dokumen landmark + scene terkait -> LandmarkItem (bentuk lama). */
export function normalizeLandmark(landmark: LandmarkDocument, allScenes: PanoramaSceneDocument[]): LandmarkItem {
  const data = landmark.data
  return {
    id: 0,
    attributes: {
      name: text(data.name),
      isDescription: Boolean(data.is_description),
      description: richTextHtml(data.description),
      isMap: Boolean(data.is_map),
      // null dipertahankan: Landmark.tsx mem-guard subName null/undefined
      subName: (data.sub_name ?? null) as string,
      isGallery: Boolean(data.is_gallery),
      location: text(data.location) || null,
      objectName: text(data.object_name),
      uid: landmark.uid ?? '',
      createdAt: EPOCH,
      updatedAt: EPOCH,
      publishedAt: EPOCH,
      zoomTarget: [num(data.zoom_target_x), num(data.zoom_target_y), num(data.zoom_target_z)],
      zoomCamera: [num(data.zoom_camera_x), num(data.zoom_camera_y), num(data.zoom_camera_z)],
      tooltipLocation: [num(data.tooltip_location_x), num(data.tooltip_location_y), num(data.tooltip_location_z)],
      mapCoordinate: [num(data.map_pin_x), num(data.map_pin_y), num(data.map_pin_radius)],
      mapDetail: groupScenesIntoFloors(landmark, allScenes),
      galleryDetail: (data.gallery_detail ?? []).map(
        (entry, index): GalleryDetail => ({
          id: index,
          name: text(entry.name),
          description: richTextHtml(entry.description),
          galleryImage: normalizeImage(entry.gallery_image),
        }),
      ),
      thumbnail: normalizeImage(data.thumbnail),
    },
  }
}

/** Dokumen tour + scene tour -> TourDataShape (bentuk lama). */
export function normalizeTour(tour: TourDocument, allScenes: PanoramaSceneDocument[]): TourDataShape {
  const data = tour.data
  const mapImage = normalizeImage(data.floor_plan)

  const tourScenes = allScenes
    .filter((scene) => Boolean(scene.data.is_tour))
    .sort((a, b) => num(a.data.scene_order) - num(b.data.scene_order))
    .map((scene, index) => sceneToMapInformation(scene, index))

  const panoramaData: TourPanoramaData[] = [
    {
      id: 0,
      __component: 'map.location-data',
      name: text(data.map_name, 'Peta Fakultas Teknik'),
      description: text(data.map_description),
      mapImage,
      MapInformation: tourScenes,
    },
  ]

  return {
    data: {
      id: 1,
      attributes: {
        description: richTextHtml(data.description),
        createdAt: EPOCH,
        updatedAt: EPOCH,
        publishedAt: EPOCH,
        name: text(data.heading, 'Jelajah Teknik'),
        isMap: Boolean(data.is_map),
        isGallery: Boolean(data.is_gallery),
        isDescription: Boolean(data.is_description),
        panoramaData,
        galleryDetail: (data.gallery_detail ?? []).map(
          (entry, index): GalleryDetail => ({
            id: index,
            name: text(entry.name),
            description: richTextHtml(entry.description),
            galleryImage: normalizeImage(entry.gallery_image),
          }),
        ),
      },
    },
    meta: {},
  }
}

/** Dokumen faq -> FaqDataShape (bentuk lama). */
export function normalizeFaq(faq: FaqDocument): FaqDataShape {
  const data = faq.data
  return {
    data: {
      id: 1,
      attributes: {
        name: text(data.name, 'Faq'),
        subName: text(data.sub_name) || null,
        description: richTextHtml(data.description),
        createdAt: EPOCH,
        updatedAt: EPOCH,
        publishedAt: EPOCH,
        FaqDetail: (data.faq_detail ?? []).map((entry, index) => ({
          id: index,
          __component: 'faq.faq-data',
          question: text(entry.question),
          answer: richTextHtml(entry.answer),
        })),
      },
    },
    meta: {},
  }
}

/** Dokumen about -> AboutContent. */
export function normalizeAbout(about: AboutDocument): AboutContent {
  const data = about.data
  return {
    heading: text(data.heading, 'Virtual Tour FT UGM'),
    welcomeHtml: richTextHtml(data.welcome),
    contributorsLabel: text(data.contributors_label, 'Kontributor'),
    contributors: (data.contributors ?? []).map((entry) => ({
      name: text(entry.name),
      role: text(entry.role),
      linkedinUrl: text((entry.linkedin as { url?: string } | null)?.url),
    })),
    credits: (data.credits ?? []).map((entry) => ({
      label: text(entry.label),
      value: text(entry.value),
    })),
  }
}

/** Dokumen site_settings -> SiteSettings. */
export function normalizeSettings(settings: SiteSettingsDocument): SiteSettings {
  const data = settings.data
  const tutorialSteps: TutorialStep[] = (data.tutorial_steps ?? []).map((step) => ({
    title: text(step.title),
    bodyHtml: richTextHtml(step.body),
    target: text(step.target, 'body'),
    diagram: ((): TutorialStep['diagram'] => {
      const value = step.diagram
      return value === 'desktop' || value === 'mobile' || value === 'navigate' ? value : 'none'
    })(),
  }))
  return {
    seo: {
      title: text(data.seo_title, 'Virtual Tour FT UGM'),
      description: text(data.seo_description),
      keywords: text(data.seo_keywords),
      author: text(data.seo_author),
      url: text(data.seo_url),
      ogImage: normalizeImage(data.seo_og_image).data.attributes.url,
    },
    loading: {
      title: text(data.loading_title),
      subtitle: text(data.loading_subtitle),
    },
    catatan: {
      tour: richTextHtml(data.tour_catatan),
      landmark: richTextHtml(data.landmark_catatan),
    },
    tutorialSteps,
  }
}

/** Semua landmark -> LandmarksData (meta pagination seperti Strapi). */
export function normalizeLandmarks(landmarks: LandmarkDocument[], allScenes: PanoramaSceneDocument[]): LandmarksData {
  const data = landmarks.map((landmark) => normalizeLandmark(landmark, allScenes))
  return {
    data,
    meta: {
      pagination: { page: 1, pageSize: 25, pageCount: 1, total: data.length },
    },
  }
}

/** Rich text Prismic -> string HTML (dipakai semua field deskripsi). */
function richTextHtml(field: unknown): string {
  return richTextToHtml(field as never)
}
