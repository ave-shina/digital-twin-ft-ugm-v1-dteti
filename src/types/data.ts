// Core data schemas for the virtual tour application

export type Theme = 'light' | 'dark'

export type Vec3 = [number, number, number]

export type Vec2 = [number, number]

/** Metadata returned by the upload provider (Cloudinary) */
export interface ProviderMetadata {
  public_id: string
  resource_type: string
}

/** A single image format variant (thumbnail, small, medium, large) */
export interface ImageFormat {
  name: string
  hash: string
  ext: string
  mime: string
  path: string | null
  width: number
  height: number
  size: number
  url: string
  provider_metadata: ProviderMetadata
}

/** Collection of image format variants */
export interface ImageFormats {
  thumbnail?: ImageFormat
  small?: ImageFormat
  medium?: ImageFormat
  large?: ImageFormat
  [key: string]: ImageFormat | undefined
}

/** Attributes of an uploaded media file */
export interface ImageAttributes {
  name: string
  alternativeText: string | null
  caption: string | null
  width: number
  height: number
  formats: ImageFormats
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: string | null
  provider: string
  provider_metadata: ProviderMetadata
  createdAt: string
  updatedAt: string
}

/** Wrapped image payload returned by Strapi */
export interface ImageData {
  data: {
    id: number
    attributes: ImageAttributes
  }
}

/** A hotspot inside a panorama scene */
export interface HotspotArr {
  pitch: number
  yaw: number
  transition: string
  type?: string
  name?: string
}

/** Coordinate used inside a panorama (panoramaCoordinate) */
export interface PanoramaCoordinate {
  pitch: number
  yaw: number
  transition: string
}

/** Entry in `MapInformation` array */
export interface MapInformation {
  id: number
  name: string
  description: string
  panoramaCoordinate: PanoramaCoordinate[]
  mapCoordinate: number[]
  mapImage: ImageData
}

/** Entry in `mapDetail` array (Landmarks) */
export interface MapDetail {
  id: number
  __component: string
  name: string
  description: string
  mapImage: ImageData
  MapInformation: MapInformation[]
}

/** Entry in `galleryDetail` array */
export interface GalleryDetail {
  id: number
  name: string
  description: string
  galleryImage: ImageData
}

/** A panorama location entry in Tour.panoramaData */
export interface TourPanoramaData {
  id: number
  __component: string
  name: string
  description: string
  mapImage: ImageData
  MapInformation: MapInformation[]
}

/** Tour.attributes shape */
export interface TourAttributes {
  description: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  name: string
  isMap: boolean
  isGallery: boolean
  isDescription: boolean
  panoramaData: TourPanoramaData[]
  galleryDetail: GalleryDetail[]
}

/** Root Tour data shape */
export interface TourDataShape {
  data: {
    id: number
    attributes: TourAttributes
  }
  meta: Record<string, unknown>
}

/** Landmark entry attributes */
export interface LandmarkAttributes {
  name: string
  isDescription: boolean
  description: string
  isMap: boolean
  subName: string
  isGallery: boolean
  location: string | null
  objectName: string
  uid: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  zoomTarget: Vec3
  zoomCamera: Vec3
  tooltipLocation: Vec3
  mapCoordinate: number[]
  mapDetail: MapDetail[]
  galleryDetail: GalleryDetail[]
  thumbnail: ImageData
}

/** A single Landmark item */
export interface LandmarkItem {
  id: number
  attributes: LandmarkAttributes
}

/** Root Landmarks data shape */
export interface LandmarksData {
  data: LandmarkItem[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

/** FAQ detail entry */
export interface FaqDetailItem {
  id: number
  __component: string
  question: string
  answer: string
}

/** Faq.attributes shape */
export interface FaqAttributes {
  name: string
  subName: string | null
  description: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  FaqDetail: FaqDetailItem[]
}

/** Root Faq data shape */
export interface FaqDataShape {
  data: {
    id: number
    attributes: FaqAttributes
  }
  meta: Record<string, unknown>
}

/** BMKG weather forecast entry */
export interface BmkgForecast {
  local_datetime?: string
  t?: number
  hu?: number
  ws?: number
  weather?: string
  icon?: string
}

/** BMKG location info */
export interface BmkgLocation {
  desa?: string
  kecamatan?: string
  kotkab?: string
  provinsi?: string
  [key: string]: string | undefined
}

/** BMKG weather API response (Weather.jsx) */
export interface BmkgResponse {
  lokasi?: BmkgLocation
  data: Array<{
    lokasi?: BmkgLocation
    cuaca: BmkgForecast[][]
  }>
}
