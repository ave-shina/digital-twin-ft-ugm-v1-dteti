/**
 * Sumber data migrasi: mengubah 3 modul data lokal (Strapi-shaped) menjadi
 * struktur dokumen "flat" siap-Prismic.
 *
 * CATATAN: konten lokal (`src/components/data/{Landmarks,Tour,Faq}.ts`) sudah
 * DIHAPUS setelah migrasi selesai dan terverifikasi (VERIFIKASI LOLOS).
 * Untuk menjalankan ulang script migrasi/verifikasi, ambil kembali modul data
 * dari tag git `pre-prismic`.
 *
 * Penanda (marker) dalam `data`:
 *   { __image: FlatImage }          -> diganti ref asset saat migrasi
 *   { __ref: 'landmark', uid }      -> diganti ref dokumen landmark
 *   { __richtext: html }            -> dikonversi htmlAsRichText (img -> asset)
 *   { __rt: RTNode[] }              -> rich text sudah jadi, dilewatan apa adanya
 *
 * Modul ini juga dipakai scripts/verify-prismic.ts untuk membandingkan hasil.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'

import { Landmarks } from '../../src/components/data/Landmarks'
import { TourData } from '../../src/components/data/Tour'
import { faqData } from '../../src/components/data/Faq'

export interface FlatImage {
  /** Kunci dedup unik: URL asli tanpa segmen versi Cloudinary */
  key: string
  url: string
  filename: string
  alt: string
  width: number
  height: number
  tags: string[]
}

export interface FlatDocument {
  type: 'landmark' | 'panorama_scene' | 'tour' | 'faq' | 'about' | 'site_settings'
  uid?: string
  title: string
  data: Record<string, unknown>
}

/* ---------------------------------- util ---------------------------------- */

function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
}

function text(value: string | null | undefined): string | null {
  return value ? value : null
}

/** Buang tag HTML sederhana (untuk field teks biasa yang tidak dirender UI). */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .trim()
}

/** Deskriptor asset dari atribut gambar Strapi/Cloudinary. */
function flatImage(attributes: any, tags: string[]): FlatImage {
  const url: string = attributes.url
  const key = url.replace(/\/v\d+\//, '/')
  const filename = decodeURIComponent(key.split('/').pop() || 'image')
  return {
    key,
    url,
    filename,
    alt: attributes.alternativeText || attributes.name || filename,
    width: attributes.width ?? 0,
    height: attributes.height ?? 0,
    tags,
  }
}

const img = (attributes: any, tags: string[]) => ({ __image: flatImage(attributes, tags) })

/** UID generator dengan suffix dedupe (-2, -3, ...). */
class UidAllocator {
  private used = new Set<string>()
  allocate(base: string): string {
    let uid = base
    let n = 2
    while (this.used.has(uid)) uid = `${base}-${n++}`
    this.used.add(uid)
    return uid
  }
}

/* -------------------------------- landmarks ------------------------------- */

export interface FlatScenesByLandmark {
  [landmarkUid: string]: FlatDocument[]
}

function buildLandmarkAndScenes(
  item: any,
  sceneAllocator: UidAllocator,
): { landmark: FlatDocument; scenes: FlatDocument[] } {
  const a = item.attributes
  const landmarkUid = a.uid || slugify(a.objectName)
  const tags = [landmarkUid]

  const landmark: FlatDocument = {
    type: 'landmark',
    uid: landmarkUid,
    title: `${a.name} (Landmark)`,
    data: {
      name: a.name,
      sub_name: text(a.subName),
      object_name: a.objectName,
      location: text(a.location),
      thumbnail: a.thumbnail?.data?.attributes
        ? img(a.thumbnail.data.attributes, [...tags, 'thumbnail'])
        : {},
      description: { __richtext: a.description },
      is_description: a.isDescription,
      is_map: a.isMap,
      is_gallery: a.isGallery,
      zoom_target_x: a.zoomTarget?.[0] ?? null,
      zoom_target_y: a.zoomTarget?.[1] ?? null,
      zoom_target_z: a.zoomTarget?.[2] ?? null,
      zoom_camera_x: a.zoomCamera?.[0] ?? null,
      zoom_camera_y: a.zoomCamera?.[1] ?? null,
      zoom_camera_z: a.zoomCamera?.[2] ?? null,
      tooltip_location_x: a.tooltipLocation?.[0] ?? null,
      tooltip_location_y: a.tooltipLocation?.[1] ?? null,
      tooltip_location_z: a.tooltipLocation?.[2] ?? null,
      map_pin_x: a.mapCoordinate?.[0] ?? null,
      map_pin_y: a.mapCoordinate?.[1] ?? null,
      map_pin_radius: a.mapCoordinate?.[2] ?? null,
      map_detail: (a.mapDetail ?? []).map((floor: any, floorOrder: number) => ({
        floor_name: floor.name,
        floor_description: floor.description ? stripHtml(floor.description) : null,
        floor_plan: floor.mapImage?.data?.attributes
          ? img(floor.mapImage.data.attributes, [...tags, 'floor-plan'])
          : {},
        order: floorOrder,
      })),
      gallery_detail: (a.galleryDetail ?? []).map((entry: any) => ({
        name: entry.name,
        description: entry.description ? { __richtext: entry.description } : { __rt: [] },
        gallery_image: entry.galleryImage?.data?.attributes
          ? img(entry.galleryImage.data.attributes, [...tags, 'gallery'])
          : {},
      })),
    },
  }

  const scenes: FlatDocument[] = []
  ;(a.mapDetail ?? []).forEach((floor: any, floorOrder: number) => {
    ;(floor.MapInformation ?? []).forEach((scene: any, sceneOrder: number) => {
      const sceneName: string | null = scene.name ?? null
      const baseUid = `${landmarkUid}--${sceneName ? slugify(sceneName) : slugify(floor.name) + '-entry'}`
      scenes.push({
        type: 'panorama_scene',
        uid: sceneAllocator.allocate(baseUid),
        title: `${floor.name} — ${sceneName ?? '(scene tanpa nama)'}`,
        data: {
          scene_name: sceneName ?? '',
          landmark: { __ref: 'landmark', uid: landmarkUid },
          is_tour: false,
          floor_name: floor.name,
          floor_order: floorOrder,
          scene_order: sceneOrder,
          panorama: scene.mapImage?.data?.attributes
            ? img(scene.mapImage.data.attributes, [...tags, 'panorama'])
            : {},
          description: text(scene.description),
          map_x: scene.mapCoordinate?.[0] ?? null,
          map_y: scene.mapCoordinate?.[1] ?? null,
          map_radius: scene.mapCoordinate?.[2] ?? null,
          hotspots: (scene.panoramaCoordinate ?? []).map((hotspot: any) => ({
            pitch: hotspot.pitch,
            yaw: hotspot.yaw,
            transition: hotspot.transition,
          })),
        },
      })
    })
  })

  return { landmark, scenes }
}

/* ---------------------------------- tour ---------------------------------- */

function buildTour(): { tour: FlatDocument; scenes: FlatDocument[] } {
  const a: any = TourData.data.attributes
  const tags = ['tour']

  const tour: FlatDocument = {
    type: 'tour',
    title: `${a.name} (Jelajah Teknik)`,
    data: {
      heading: a.name,
      description: { __richtext: a.description },
      is_description: a.isDescription,
      is_map: a.isMap,
      is_gallery: a.isGallery,
      map_name: a.panoramaData?.[0]?.name ?? null,
      map_description: a.panoramaData?.[0]?.description
        ? stripHtml(a.panoramaData[0].description)
        : null,
      floor_plan: a.panoramaData?.[0]?.mapImage?.data?.attributes
        ? img(a.panoramaData[0].mapImage.data.attributes, [...tags, 'floor-plan'])
        : {},
      gallery_detail: (a.galleryDetail ?? []).map((entry: any) => ({
        name: entry.name,
        description: entry.description ? { __richtext: entry.description } : { __rt: [] },
        gallery_image: entry.galleryImage?.data?.attributes
          ? img(entry.galleryImage.data.attributes, [...tags, 'gallery'])
          : {},
      })),
    },
  }

  const scenes: FlatDocument[] = []
  ;(a.panoramaData ?? []).forEach((floor: any, floorOrder: number) => {
    ;(floor.MapInformation ?? []).forEach((scene: any, sceneOrder: number) => {
      const sceneName: string | null = scene.name ?? null
      const baseUid = `tour--${sceneName ? slugify(sceneName) : slugify(floor.name) + '-entry'}`
      scenes.push({
        type: 'panorama_scene',
        uid: sceneAllocatorShared.allocate(baseUid),
        title: `${floor.name} — ${sceneName ?? '(scene tanpa nama)'}`,
        data: {
          scene_name: sceneName ?? '',
          is_tour: true,
          floor_name: floor.name,
          floor_order: floorOrder,
          scene_order: sceneOrder,
          panorama: scene.mapImage?.data?.attributes
            ? img(scene.mapImage.data.attributes, [...tags, 'panorama'])
            : {},
          description: text(scene.description),
          map_x: scene.mapCoordinate?.[0] ?? null,
          map_y: scene.mapCoordinate?.[1] ?? null,
          map_radius: scene.mapCoordinate?.[2] ?? null,
          hotspots: (scene.panoramaCoordinate ?? []).map((hotspot: any) => ({
            pitch: hotspot.pitch,
            yaw: hotspot.yaw,
            transition: hotspot.transition,
          })),
        },
      })
    })
  })

  return { tour, scenes }
}

// Allocator bersama agar UID scene unik lintas landmark + tour.
const sceneAllocatorShared = new UidAllocator()

/* ----------------------------------- faq ----------------------------------- */

function buildFaq(): FlatDocument {
  const a: any = faqData.data.attributes
  return {
    type: 'faq',
    title: 'FAQ',
    data: {
      heading: 'Frequently Asked Questions',
      name: a.name,
      sub_name: text(a.subName),
      description: { __richtext: a.description },
      faq_detail: (a.FaqDetail ?? []).map((entry: any) => ({
        question: entry.question,
        answer: entry.answer ? { __richtext: entry.answer } : { __rt: [] },
      })),
    },
  }
}

/* ---------------------------------- about ---------------------------------- */

function buildAbout(): FlatDocument {
  return {
    type: 'about',
    title: 'Tentang Kami',
    data: {
      heading: 'Virtual Tour FT UGM',
      welcome: {
        __rt: [
          { type: 'paragraph', text: 'Selamat datang di Virtual Tour Fakultas Teknik Universitas Gadjah Mada (FT UGM)! bersama, kami kembangkan pengalaman tur virtual yang akan membawa Anda menjelajahi Fakultas Teknik Universitas Gadjah Mada. Dalam perjalanan virtual ini, Anda akan diajak mengenal lebih dekat berbagai gedung akademik dan lingkungan kampus yang mendukung proses pembelajaran dan penelitian di FT UGM. Selain itu, Anda juga akan merasakan suasana kehidupan kampus yang penuh dengan semangat inovasi, kolaborasi, dan keberagaman.', spans: [], direction: 'ltr' },
          { type: 'paragraph', text: 'Selamat menikmati Virtual Tour FT UGM, semoga pengalaman ini memberikan wawasan dan inspirasi yang bermanfat. Selamat menjelajah!', spans: [], direction: 'ltr' },
        ],
      },
      contributors_label: 'Kontributor',
      contributors: [
        { name: 'Ave Syah Shina', role: 'Web Developer', linkedin: { link_type: 'Web', url: 'https://www.linkedin.com/in/ave-syah-shina/' } },
        { name: 'Aldo Apriliano', role: '3D Area Mapping', linkedin: { link_type: 'Web', url: 'https://www.linkedin.com/in/muhammad-apriliano-bagaskara-b30069240/' } },
        { name: 'Nabila Amalia', role: '3D Designer', linkedin: { link_type: 'Web', url: 'https://www.linkedin.com/in/nabila-amalia-578313224/' } },
        { name: 'Mahdur Alvian', role: '3D Designer', linkedin: { link_type: 'Web', url: 'https://www.linkedin.com/' } },
      ],
      credits: [
        { label: 'Aset 3D', value: 'Quaternius' },
        { label: 'Musik', value: "A Town With An Ocean View - Kiki's Delivery Service (Piano)" },
      ],
    },
  }
}

/* ------------------------------ site settings ------------------------------ */

/** Span teks biasa utk pembuatan paragraph RT. */
type RtPart = string | { label: string }

function rtParagraph(parts: RtPart[]) {
  // Format wire Prismic: blok `paragraph` berisi `text` utuh + `spans` ber-offset.
  // Part label (titik warna / ikon kamera) dibungkus satu karakter spasi.
  let text = ''
  const spans: Array<{ type: string; start: number; end: number; data?: { label?: string } }> = []
  for (const part of parts) {
    if (typeof part === 'string') {
      text += part
    } else {
      const start = text.length
      text += ' '
      spans.push({ type: 'label', start, end: start + 1, data: { label: part.label } })
    }
  }
  return { type: 'paragraph', text, spans, direction: 'ltr' }
}

function rtSingle(parts: RtPart[]) {
  return { __rt: [rtParagraph(parts)] }
}

const CATATAN_TOUR: RtPart[] = [
  'Anda dapat memulai penjelajahan Fakultas Teknik dengan menekan titik berbentuk lingkaran pada denah tersebut. Lingkaran merah ',
  { label: 'red-dot' },
  ' akan mengarahkan ke halaman detail bangunan tersebut, sementara lingkaran biru ',
  { label: 'blue-dot' },
  ' akan menampilkan panorama lingkungan di sekitar titik tersebut. Anda juga bisa memulai penjelajahan dengan menekan tombol di bawah ini. Selanjutnya, pada tampilan panorama akan ditampilkan dengan adanya simbol berbentuk kamera ',
  { label: 'camera' },
  ' . Simbol ini akan membantu Anda menavigasi dan berpindah lokasi di dalam panorama.Mari kita jelajahi bersama!',
]

const CATATAN_LANDMARK: RtPart[] = [
  'Anda dapat memulai penjelajahan dengan menekan titik berbentuk lingkaran pada denah tersebut. lingkaran biru ',
  { label: 'blue-dot' },
  ' akan menampilkan panorama lingkungan di sekitar titik tersebut . Selanjutnya, pada tampilan panorama akan ditampilkan dengan adanya simbol berbentuk kamera ',
  { label: 'camera' },
  ' .Simbol ini akan membantu Anda menavigasi dan berpindah lokasi di dalam panorama.',
]

function buildSettings(): FlatDocument {
  const ogPath = path.join(process.cwd(), 'public', 'icons', 'share.png')
  let ogImage: unknown = {} // image kosong = {} (bukan null)
  try {
    const buffer = readFileSync(ogPath)
    ogImage = {
      __buffer: buffer,
      __image: {
        key: 'local:icons/share.png',
        url: ogPath,
        filename: 'share.png',
        alt: 'Virtual Tour FT UGM',
        width: 0,
        height: 0,
        tags: ['seo'],
      } satisfies FlatImage,
    }
  } catch {
    // file tidak ada — biarkan null
  }

  const steps: Array<[string, string | null, string, string]> = [
    ['Tutorial', 'Selamat Datang di Virtual Tour FT UGM, Gunakanlah komputer untuk pengalaman pengguna yang lebih baik.', 'body', 'none'],
    ['Bangunan', 'Tombol ini digunakan untuk melihat nama bangunan yang terdapat di FT UGM. Anda bisa menekan objek bangunan untuk melihat informasi yang lebih rinci', '.show-tooltip', 'none'],
    ['Jelajah Teknik', 'Tombol ini digunakan untuk menampilkan halaman Jelajah Teknik yang akan membantu Anda dalam menjelajahi panorama teknik dengan lebih baik.', '.jelajah-teknik', 'none'],
    ['Frequently Asked Questions', 'Tombol ini digunakan untuk menampilkan halaman FaQ.', '.faq', 'none'],
    ['Tema', 'Tombol ini digunakan merubah tema halaman menjadi gelap atau terang.', '.night-mode', 'none'],
    ['Musik latar belakang', 'Tombol ini digunakan untuk memutar atau menjeda musik latar belakang Virtual Tour FT UGM.', '.tour-music', 'none'],
    ['Tentang Kami', 'Tombol ini digunakan untuk menampilkan halaman Tentang Virtual Tour FT UGM.', '.about-us', 'none'],
    ['Penggunaan Desktop', null, 'body', 'desktop'],
    ['Penggunaan Mobile', null, 'body', 'mobile'],
    ['Navigasi pada Model 3 Dimensi', 'Silahkan klik pada bangunan yang ingin Anda lihat untuk mendapatkan informasi detail lebih lengkap.', 'body', 'navigate'],
    ['Tutorial', 'Tombol ini digunakan untuk menampilkan tutorial Kembali.', '.tutorial', 'none'],
  ]

  return {
    type: 'site_settings',
    title: 'Pengaturan Situs',
    data: {
      seo_title: 'Virtual Tour FT UGM',
      seo_description:
        'Selamat datang di Virtual Tour Fakultas Teknik Universitas Gadjah Mada (FT UGM)!, Dalam perjalanan virtual ini, Anda akan diajak mengenal lebih dekat berbagai gedung akademik dan lingkungan kampus yang mendukung proses pembelajaran dan penelitian di FT UGM.',
      seo_keywords:
        'Virtual Tour, Fakultask Teknik, Universitas Gadjah Mada, Indonesia, UGM, FT, DTETI, DTSL, DTMI, DTK, DTNTF, DTGL, DTGD, DTAP',
      seo_author: 'Author',
      seo_url: 'https://www.virtual-tour-ft-ugm.com',
      seo_og_image: ogImage,
      loading_title: 'FAKULTAS TEKNIK',
      loading_subtitle: 'UNIVERSITAS GADJAH MADA',
      tour_catatan: rtSingle(CATATAN_TOUR),
      landmark_catatan: rtSingle(CATATAN_LANDMARK),
      tutorial_steps: steps.map(([title, body, target, diagram]) => ({
        title,
        body: body ? rtSingle([body]) : { __rt: [] },
        target,
        diagram,
      })),
    },
  }
}

/* --------------------------------- ekspor --------------------------------- */

export interface SourceBundle {
  landmarks: FlatDocument[]
  scenes: FlatDocument[]
  singletons: FlatDocument[]
}

let bundle: SourceBundle | null = null

export function getSourceBundle(): SourceBundle {
  if (bundle) return bundle

  const sceneAllocator = sceneAllocatorShared
  const landmarks: FlatDocument[] = []
  const landmarkScenes: FlatDocument[] = []
  ;(Landmarks.data as any[]).forEach((item) => {
    const built = buildLandmarkAndScenes(item, sceneAllocator)
    landmarks.push(built.landmark)
    landmarkScenes.push(...built.scenes)
  })

  const tour = buildTour()

  bundle = {
    landmarks,
    scenes: [...landmarkScenes, ...tour.scenes],
    singletons: [tour.tour, buildFaq(), buildAbout(), buildSettings()],
  }
  return bundle
}

/** Statistik untuk --dry-run dan verifikasi. */
export function getSourceStats() {
  const source = getSourceBundle()
  const landmarks = source.landmarks
  const scenes = source.scenes

  let floors = 0
  let hotspots = 0
  let landmarkGallery = 0
  const danglingTransitions: string[] = []

  for (const doc of landmarks) {
    floors += (doc.data.map_detail as any[]).length
    landmarkGallery += (doc.data.gallery_detail as any[]).length
  }

  const tourData = source.singletons[0].data
  const tourGallery = (tourData.gallery_detail as any[]).length

  // total hotspot + validasi transition (berlaku dalam satu lantai)
  const floorsByName = new Map<string, Set<string>>() // `${lmUid}::${floor_name}` -> scene names
  for (const scene of scenes) {
    const d = scene.data
    const key = `${d.landmark ? (d.landmark as any).uid : 'tour'}::${d.floor_name}`
    if (!floorsByName.has(key)) floorsByName.set(key, new Set())
    floorsByName.get(key)!.add((d.scene_name as string) || `__null_${scene.uid}`)
    hotspots += (d.hotspots as any[]).length
  }
  for (const scene of scenes) {
    const d = scene.data
    const key = `${d.landmark ? (d.landmark as any).uid : 'tour'}::${d.floor_name}`
    const names = floorsByName.get(key)!
    for (const h of d.hotspots as any[]) {
      if (!names.has(h.transition)) {
        danglingTransitions.push(`${scene.uid}: ${h.transition}`)
      }
    }
  }

  // gambar unik
  const images = new Map<string, FlatImage>()
  const visit = (value: unknown) => {
    if (Array.isArray(value)) return value.forEach(visit)
    if (value && typeof value === 'object') {
      const rec = value as Record<string, unknown>
      if (rec.__image) {
        const image = rec.__image as FlatImage
        if (!images.has(image.key)) images.set(image.key, image)
      }
      if (!rec.__rt && !rec.__richtext) Object.values(rec).forEach(visit)
    }
  }
  for (const doc of [...landmarks, ...scenes, ...source.singletons]) visit(doc.data)
  // gambar inline di dalam rich text
  const htmlImages = new Map<string, FlatImage>()
  const collectRtHtml = (value: unknown) => {
    if (Array.isArray(value)) return value.forEach(collectRtHtml)
    if (value && typeof value === 'object') {
      const rec = value as Record<string, unknown>
      if (typeof rec.__richtext === 'string') {
        for (const match of (rec.__richtext as string).matchAll(/<img[^>]+src=["']([^"']+)["']/g)) {
          const url = match[1]
          const key = url.replace(/\/v\d+\//, '/')
          if (!htmlImages.has(key)) {
            htmlImages.set(key, {
              key,
              url,
              filename: decodeURIComponent(key.split('/').pop() || 'inline-image'),
              alt: 'ilustrasi',
              width: 0,
              height: 0,
              tags: ['inline'],
            })
          }
        }
      }
      Object.values(rec).forEach(collectRtHtml)
    }
  }
  for (const doc of [...landmarks, ...source.singletons]) collectRtHtml(doc.data)

  return {
    landmarks: landmarks.length,
    scenes: scenes.length,
    tourScenes: scenes.filter((s) => s.data.is_tour === true).length,
    landmarkScenes: scenes.filter((s) => s.data.is_tour === false).length,
    floors,
    hotspots,
    gallery: landmarkGallery + tourGallery,
    faqItems: ((source.singletons[1].data as any).faq_detail as any[]).length,
    tutorialSteps: ((source.singletons[3].data as any).tutorial_steps as any[]).length,
    uniqueImages: images.size + htmlImages.size,
    imagesByTag: countByTag(images),
    danglingTransitions,
  }
}

function countByTag(images: Map<string, FlatImage>) {
  const counts: Record<string, number> = {}
  for (const image of images.values()) {
    const tag = image.tags.includes('panorama')
      ? 'panorama'
      : image.tags.includes('floor-plan')
        ? 'floor-plan'
        : image.tags.includes('gallery')
          ? 'gallery'
          : image.tags.includes('thumbnail')
            ? 'thumbnail'
            : 'other'
    counts[tag] = (counts[tag] ?? 0) + 1
  }
  return counts
}
