// Module declarations for third-party packages without bundled TypeScript types

declare module '@georgedrpg/pannellum-react-next' {
  import type { Component, ComponentType, ReactNode } from 'react'

  export interface HotspotDev {
    pitch: number
    yaw: number
    type?: string
    name?: string
    [key: string]: unknown
  }

  export interface PannellumProps {
    hfov?: number
    width?: string | number
    height?: string | number
    pitch?: number
    yaw?: number
    image: string
    autoLoad?: boolean
    showZoomCtrl?: boolean
    [key: string]: unknown
    children?: ReactNode
  }

  export class Pannellum extends Component<PannellumProps> {
    static Hotspot: ComponentType<HotspotDev & {
      tooltip?: (hotSpotDiv: HTMLDivElement) => void
      handleClick?: (evt: unknown, name: unknown) => void
    }>
  }

  export const Hotspot: ComponentType<HotspotDev & {
    tooltip?: (hotSpotDiv: HTMLDivElement) => void
    handleClick?: (evt: unknown, name: unknown) => void
  }>
}

declare module '@georgedrpg/pannellum-react-next/es/css/video-js.css'
declare module '@georgedrpg/pannellum-react-next/es/css/pannellum.css'
declare module '@georgedrpg/pannellum-react-next/es/css/style-textInfo.css'

declare module 'react-image-hotspots' {
  import type { ComponentType, ReactNode } from 'react'
  interface ImageHotspotsProps {
    src: string
    alt?: string
    hotspots?: Array<{
      x: number
      y: number
      content: ReactNode
    }>
    [key: string]: unknown
  }
  const ImageHotspots: ComponentType<ImageHotspotsProps>
  export default ImageHotspots
}

declare module 'react-map-interaction' {
  import type { ComponentType, ReactNode } from 'react'
  export interface MapInteractionValue {
    scale: number
    translation: { x: number; y: number }
  }
  interface MapInteractionCSSProps {
    value?: MapInteractionValue | null
    onChange?: (value: MapInteractionValue) => void
    children?: ReactNode
    [key: string]: unknown
  }
  export const MapInteractionCSS: ComponentType<MapInteractionCSSProps>
}

declare module 'react-responsive-pinch-zoom-pan' {
  import type { ComponentType } from 'react'
  interface PinchZoomPanProps {
    src?: string
    [key: string]: unknown
  }
  const PinchZoomPan: ComponentType<PinchZoomPanProps>
  export default PinchZoomPan
}

declare module 'react-reveal' {
  import type { ComponentType, ReactNode } from 'react'
  interface RevealProps {
    delay?: number
    duration?: number
    children?: ReactNode
    [key: string]: unknown
  }
  export const Zoom: ComponentType<RevealProps>
  export const Fade: ComponentType<RevealProps>
  export const Slide: ComponentType<RevealProps>
  export const Rotate: ComponentType<RevealProps>
  export const Flip: ComponentType<RevealProps>
  const Reveal: ComponentType<RevealProps>
  export default Reveal
}

declare module 'react-reveal/Zoom' {
  import type { ComponentType, ReactNode } from 'react'
  interface RevealProps {
    delay?: number
    duration?: number
    children?: ReactNode
    [key: string]: unknown
  }
  const Zoom: ComponentType<RevealProps>
  export default Zoom
}

declare module 'react-reveal/Fade' {
  import type { ComponentType, ReactNode } from 'react'
  interface RevealProps {
    delay?: number
    duration?: number
    children?: ReactNode
    [key: string]: unknown
  }
  const Fade: ComponentType<RevealProps>
  export default Fade
}

declare module 'react-loading' {
  import type { ComponentType } from 'react'
  interface ReactLoadingProps {
    type?: string
    color?: string
    height?: number | string
    width?: number | string
    [key: string]: unknown
  }
  const ReactLoading: ComponentType<ReactLoadingProps>
  export default ReactLoading
}

declare module 'react-image-mapper' {
  import type { ComponentType } from 'react'
  interface ImageMapperProps {
    src?: string
    map?: {
      name: string
      areas: Array<{
        name: string
        shape: string
        coords: number[]
        prefill?: { fillColor: string; fillOpacity: number }
        [key: string]: unknown
      }>
      [key: string]: unknown
    }
    width?: number
    height?: number
    active?: boolean
    responsive?: boolean
    parentWidth?: number
    onLoad?: () => void
    onImageClick?: () => void
    onClick?: (area: unknown) => void
    onMouseEnter?: (area: unknown) => void
    onMouseLeave?: (area: unknown) => void
    [key: string]: unknown
  }
  const ImageMapper: ComponentType<ImageMapperProps>
  export default ImageMapper
}

declare module 'pannellum-react' {
  import type { ComponentType, ReactNode } from 'react'
  interface PannellumProps {
    hfov?: number
    width?: string | number
    height?: string | number
    pitch?: number
    yaw?: number
    image: string
    autoLoad?: boolean
    showZoomCtrl?: boolean
    children?: ReactNode
    [key: string]: unknown
  }
  export const Pannellum: ComponentType<PannellumProps> & {
    Hotspot: ComponentType<{
      type?: string
      pitch: number
      yaw: number
      name?: string
      tooltip?: (hotSpotDiv: HTMLDivElement) => void
      handleClick?: (evt: unknown, name: unknown) => void
    }>
  }
}

declare module 'glsl-random' {
  const content: string
  export default content
}

// CSS module declarations
declare module '*.css'
declare module 'swiper/css'
declare module 'swiper/css/navigation'
declare module 'swiper/css/pagination'
declare module 'swiper/css/effect-fade'
