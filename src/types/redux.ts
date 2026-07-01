import type { Theme } from './data'

export interface NavigationState {
  theme: Theme
  location: string
  content: string
  showTooltip: boolean
  music: boolean
  firstTutorial: boolean
  mapTourMessage: boolean
  mapLandmarkMessage: boolean
  showWeather: boolean
}
