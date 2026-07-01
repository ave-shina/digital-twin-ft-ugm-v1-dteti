import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { NavigationState } from '@/types/redux'
import type { Theme } from '@/types/data'

// Initial state membaca dari localStorage jika ada (hanya di client-side).
// Side-effect persistence ditangani oleh middleware di store.ts, BUKAN di reducer.
function getInitialState(): NavigationState {
  const base: NavigationState = {
    theme: 'dark',
    location: '',
    content: '',
    showTooltip: true,
    music: true,
    firstTutorial: false,
    mapTourMessage: true,
    mapLandmarkMessage: true,
    showWeather: false,
  }

  if (typeof window === 'undefined') return base

  try {
    const storedTheme = window.localStorage.getItem('theme')
    if (storedTheme === 'light' || storedTheme === 'dark') {
      base.theme = storedTheme
    }

    const storedMusic = window.localStorage.getItem('music')
    if (storedMusic === 'true' || storedMusic === 'false') {
      base.music = storedMusic === 'true'
    }

    const storedFirstTutorial = window.localStorage.getItem('firstTutorial')
    if (storedFirstTutorial === 'true' || storedFirstTutorial === 'false') {
      base.firstTutorial = storedFirstTutorial === 'true'
    }
  } catch {
    // localStorage bisa throw (private mode, dll), abaikan.
  }

  return base
}

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState: getInitialState(),
  reducers: {
    // Toggle theme dengan logika yang jelas.
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
    setTheme: (state, { payload }: PayloadAction<Theme>) => {
      state.theme = payload
    },
    toggleLocation: (state, { payload }: PayloadAction<string>) => {
      state.location = state.location === '' ? payload : ''
    },
    toggleContent: (state, { payload }: PayloadAction<string>) => {
      state.content = state.content === '' ? payload : ''
    },
    // Setter eksplisit (lebih aman daripada toggle berturut-turut).
    setLocation: (state, { payload }: PayloadAction<string>) => {
      state.location = payload
    },
    setContent: (state, { payload }: PayloadAction<string>) => {
      state.content = payload
    },
    setShowTooltip: (state, { payload }: PayloadAction<boolean>) => {
      state.showTooltip = payload
    },
    toggleMusic: (state) => {
      state.music = !state.music
    },
    setMusic: (state, { payload }: PayloadAction<boolean>) => {
      state.music = payload
    },
    setFirstTutorial: (state, { payload }: PayloadAction<boolean>) => {
      state.firstTutorial = payload
    },
    setMapTourMessage: (state, { payload }: PayloadAction<boolean>) => {
      state.mapTourMessage = payload
    },
    setMapLandmarkMessage: (state, { payload }: PayloadAction<boolean>) => {
      state.mapLandmarkMessage = payload
    },
    setShowWeather: (state, { payload }: PayloadAction<boolean>) => {
      state.showWeather = payload
    },
  },
})

export const {
  setFirstTutorial,
  toggleMusic,
  setMusic,
  toggleTheme,
  setTheme,
  toggleLocation,
  toggleContent,
  setLocation,
  setContent,
  setShowTooltip,
  setMapLandmarkMessage,
  setMapTourMessage,
  setShowWeather,
} = navigationSlice.actions

export default navigationSlice.reducer
