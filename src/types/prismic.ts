/**
 * Tipe dokumen Prismic (hand-written, tanpa typegen) dan bentuk konten
 * hasil normalisasi yang dipakai komponen (SiteSettings, AboutContent).
 *
 * Data tour (landmark/scene) dinormalisasi ke bentuk lama di
 * `src/types/data.ts` agar komponen konsumen tidak berubah.
 */
import type {
  PrismicDocument,
  RichTextField,
  ImageField,
  SelectField,
  NumberField,
  BooleanField,
  KeyTextField,
  GroupField,
  ContentRelationshipField,
  LinkField,
  AnyRegularField,
} from '@prismicio/client'

/* ------------------------------ field helpers ----------------------------- */

/** Image field Prismic dengan props yang mungkin kosong. */
export type PrismicImage = ImageField<null> & { readonly alt?: string | null }

/* ------------------------------- landmark --------------------------------- */

export interface LandmarkMapDetailGroup {
  [key: string]: AnyRegularField
  floor_name: KeyTextField
  floor_description: KeyTextField
  floor_plan: PrismicImage
  order: NumberField
}

export interface LandmarkGalleryGroup {
  [key: string]: AnyRegularField
  name: KeyTextField
  description: RichTextField
  gallery_image: PrismicImage
}

/** Data dokumen `landmark`. */
export interface LandmarkDocumentData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
  name: KeyTextField
  sub_name: KeyTextField
  /** Nama objek 3D di kampus — join key dengan model, JANGAN diubah. */
  object_name: KeyTextField
  location: KeyTextField
  description: RichTextField
  is_description: BooleanField
  is_map: BooleanField
  is_gallery: BooleanField
  zoom_target_x: NumberField
  zoom_target_y: NumberField
  zoom_target_z: NumberField
  zoom_camera_x: NumberField
  zoom_camera_y: NumberField
  zoom_camera_z: NumberField
  tooltip_location_x: NumberField
  tooltip_location_y: NumberField
  tooltip_location_z: NumberField
  map_pin_x: NumberField
  map_pin_y: NumberField
  map_pin_radius: NumberField
  thumbnail: PrismicImage
  map_detail: GroupField<LandmarkMapDetailGroup>
  gallery_detail: GroupField<LandmarkGalleryGroup>
}

export type LandmarkDocument = PrismicDocument<LandmarkDocumentData, 'landmark'>

/* ---------------------------- panorama_scene ------------------------------ */

export interface SceneHotspotGroup {
  [key: string]: AnyRegularField
  pitch: NumberField
  yaw: NumberField
  transition: KeyTextField
}

/** Data dokumen `panorama_scene`. */
export interface PanoramaSceneDocumentData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
  /** Nama scene — dipakai hotspot transition, harus byte-exact. */
  scene_name: KeyTextField
  landmark: ContentRelationshipField<'landmark'>
  is_tour: BooleanField
  floor_name: KeyTextField
  floor_order: NumberField
  scene_order: NumberField
  panorama: PrismicImage
  description: KeyTextField
  map_x: NumberField
  map_y: NumberField
  map_radius: NumberField
  hotspots: GroupField<SceneHotspotGroup>
}

export type PanoramaSceneDocument = PrismicDocument<PanoramaSceneDocumentData, 'panorama_scene'>

/* ------------------------------- singleton -------------------------------- */

export interface TourGalleryGroup {
  [key: string]: AnyRegularField
  name: KeyTextField
  description: RichTextField
  gallery_image: PrismicImage
}

export interface TourDocumentData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
  heading: KeyTextField
  description: RichTextField
  is_description: BooleanField
  is_map: BooleanField
  is_gallery: BooleanField
  map_name: KeyTextField
  map_description: KeyTextField
  floor_plan: PrismicImage
  gallery_detail: GroupField<TourGalleryGroup>
}

export type TourDocument = PrismicDocument<TourDocumentData, 'tour'>

export interface FaqDetailGroup {
  [key: string]: AnyRegularField
  question: KeyTextField
  answer: RichTextField
}

export interface FaqDocumentData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
  heading: KeyTextField
  name: KeyTextField
  sub_name: KeyTextField
  description: RichTextField
  faq_detail: GroupField<FaqDetailGroup>
}

export type FaqDocument = PrismicDocument<FaqDocumentData, 'faq'>

export interface AboutContributorGroup {
  [key: string]: AnyRegularField
  name: KeyTextField
  role: KeyTextField
  linkedin: LinkField
}

export interface AboutCreditGroup {
  [key: string]: AnyRegularField
  label: KeyTextField
  value: KeyTextField
}

export interface AboutDocumentData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
  heading: KeyTextField
  welcome: RichTextField
  contributors_label: KeyTextField
  contributors: GroupField<AboutContributorGroup>
  credits: GroupField<AboutCreditGroup>
}

export type AboutDocument = PrismicDocument<AboutDocumentData, 'about'>

export type TutorialDiagram = 'none' | 'desktop' | 'mobile' | 'navigate'

export interface TutorialStepGroup {
  [key: string]: AnyRegularField
  title: KeyTextField
  body: RichTextField
  target: SelectField<
    'body' | '.show-tooltip' | '.jelajah-teknik' | '.faq' | '.night-mode' | '.tour-music' | '.about-us' | '.tutorial'
  >
  diagram: SelectField<TutorialDiagram>
}

export interface SiteSettingsDocumentData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
  seo_title: KeyTextField
  seo_description: KeyTextField
  seo_keywords: KeyTextField
  seo_author: KeyTextField
  seo_url: KeyTextField
  seo_og_image: PrismicImage
  loading_title: KeyTextField
  loading_subtitle: KeyTextField
  tour_catatan: RichTextField
  landmark_catatan: RichTextField
  tutorial_steps: GroupField<TutorialStepGroup>
}

export type SiteSettingsDocument = PrismicDocument<SiteSettingsDocumentData, 'site_settings'>

/* --------------------- bentuk hasil normalisasi (UI) ---------------------- */

/** Langkah tutorial (dari `site_settings.tutorial_steps`). */
export interface TutorialStep {
  title: string
  /** Body berupa HTML string (hasil render rich text). */
  bodyHtml: string
  /** CSS selector target joyride, mis. `.show-tooltip`. */
  target: string
  /** Diagram ilustratif yang dirender komponen Tutorial. */
  diagram: TutorialDiagram
}

/** Konten site_settings hasil normalisasi untuk konteks React. */
export interface SiteSettings {
  seo: {
    title: string
    description: string
    keywords: string
    author: string
    url: string
    ogImage: string
  }
  loading: {
    title: string
    subtitle: string
  }
  /** Catatan peta berupa HTML (span label blue-dot/red-dot/camera). */
  catatan: {
    tour: string
    landmark: string
  }
  tutorialSteps: TutorialStep[]
}

/** Konten halaman About hasil normalisasi. */
export interface AboutContent {
  heading: string
  welcomeHtml: string
  contributorsLabel: string
  contributors: Array<{ name: string; role: string; linkedinUrl: string }>
  credits: Array<{ label: string; value: string }>
}

/** Semua konten yang dibutuhkan halaman, diambil sekali per build. */
export interface ContentBundle {
  landmarks: import('./data').LandmarksData
  tour: import('./data').TourDataShape
  faq: import('./data').FaqDataShape
  about: AboutContent
  settings: SiteSettings
}
