import type React from 'react'
import type { ReactNode, ComponentType, RefObject } from 'react'
import type { Theme, Vec3, ImageAttributes, MapInformation, GalleryDetail, LandmarksData, PanoramaCoordinate } from './data'

/** Scene component props */
export interface SceneProps {
  children?: ReactNode
  freeControl?: boolean
  introduction: string
  showTooltip?: boolean
  /** Props yang diteruskan ke <Canvas> react-three-fiber. */
  shadows?: boolean
  colorManagement?: boolean
  shadowMap?: boolean
  className?: string
  eventSource?: RefObject<HTMLDivElement> | HTMLElement
  eventPrefix?: string
}

/** Control (OrbitControls) props */
export interface ControlProps {
  introduction: string
  locationData: {
    name: string
    zoomTarget: Vec3
    zoomCamera: Vec3
  } | null
  freeControl?: boolean
}

/** Model props */
export interface ModelProps {
  toggleZoom: (locationName: string) => void
  landmarksData: LandmarksData
  showTooltip?: boolean
}

/** Background props */
export interface BackgroundProps {
  theme: Theme
}

/** Grass props */
export interface GrassProps {
  position?: Vec3
  scale?: Vec3
  rotation?: Vec3
}

/** Map props */
export interface MapProps {
  setCurrentScene: React.Dispatch<React.SetStateAction<string | number | undefined>>
  setOpenPanorama: React.Dispatch<React.SetStateAction<boolean>>
  mapInformation: MapInformation[]
  mapImage: ImageAttributes
  mapName: string
  open: boolean
  openPanorama?: boolean
  currentIndex: { state: number }
  Message: ComponentType
}

/** Panorama props */
export interface PanoramaProps {
  currentScene: string | number
  setCurrentScene: React.Dispatch<React.SetStateAction<string | number | undefined>>
  setOpenPanorama: React.Dispatch<React.SetStateAction<boolean>>
  openPanorama: boolean
  sceneInformation: SceneInformation[]
}

/** A single panorama scene description consumed by Panorama */
export interface SceneInformation {
  sceneName: string
  scenePanoImg: ImageAttributes | null
  hotSpotsArr: PanoramaCoordinate[]
}

/** Gallery props */
export interface GalleryProps {
  galleryDetail: GalleryDetail[]
}

/** Tutorial props */
export interface TutorialProps {
  setTutorial: (show: boolean) => void
  tutorial: boolean
  setIntroduction: (intro: string) => void
}

/** StoryBoard props */
export interface StoryBoardProps {
  startVmap: () => void
}

/** ThemeIcon props */
export interface ThemeIconProps {
  isDark: boolean
  className?: string
}

/** MusicIcon props */
export interface MusicIconProps {
  isOn: boolean
  className?: string
}

/** Icon props (Tour/Faq/Info) */
export interface IconProps {
  className?: string
}

/** Layout props (forwardRef) */
export interface LayoutProps {
  children?: ReactNode
  className?: string
  style?: React.CSSProperties
  id?: string
}

/** Page props (index.jsx) */
export interface PageProps {
  ref?: RefObject<HTMLDivElement>
  title?: string
}

/** BottomLeft props */
export interface BottomLeftProps {
  setTutorial: (show: boolean) => void
}

/** BottomRight props */
export interface BottomRightProps {
  setOpenForm: (open: boolean) => void
  openForm: boolean
}

/** SpriteHover internal component (Model.jsx) */
export interface SpriteHoverProps {
  object: {
    name: string
    position: Vec3
  } | null
}
