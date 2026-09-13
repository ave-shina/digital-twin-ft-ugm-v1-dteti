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
    static Hotspot: ComponentType<
      HotspotDev & {
        tooltip?: (hotSpotDiv: HTMLDivElement) => void
        handleClick?: (evt: unknown, name: unknown) => void
      }
    >
  }

  export const Hotspot: ComponentType<
    HotspotDev & {
      tooltip?: (hotSpotDiv: HTMLDivElement) => void
      handleClick?: (evt: unknown, name: unknown) => void
    }
  >
}

declare module '@georgedrpg/pannellum-react-next/es/css/video-js.css'
declare module '@georgedrpg/pannellum-react-next/es/css/pannellum.css'
declare module '@georgedrpg/pannellum-react-next/es/css/style-textInfo.css'

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

// CSS module declarations
declare module '*.css'
declare module 'swiper/css'
declare module 'swiper/css/navigation'
declare module 'swiper/css/pagination'
declare module 'swiper/css/effect-fade'
