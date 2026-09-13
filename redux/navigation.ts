import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { NavigationState } from '@/types/redux'
import type { Theme } from '@/types/data'

/**
 * Initial state HARUS murni (tanpa membaca localStorage): render server (HTML
 * SSG) memakai nilai default yang sama. Membaca localStorage di sini membuat
 * render pertama client berbeda dari HTML server -> hydration mismatch.
 * Preferensi tersimpan di-restore SETELAH mount lewat action `hydrate`
 * (dipanggil dari src/components/dom/Layout.tsx).
 */
const initialState: NavigationState = {
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

/**
 * Baca preferensi tersimpan dari localStorage (client saja, dipanggil sekali
 * setelah mount). Default-nya sama dengan yang selama ini ditulis Layout
 * untuk pengunjung baru: theme light, music on, tutorial belum dilihat.
 */
export function readStoredPreferences(): Partial<NavigationState> {
  if (typeof window === 'undefined') return {}

  const prefs: Partial<NavigationState> = {
    theme: 'light',
    music: true,
    firstTutorial: false,
  }

  try {
    const storedTheme = window.localStorage.getItem('theme')
    if (storedTheme === 'light' || storedTheme === 'dark') {
      prefs.theme = storedTheme
    }

    const storedMusic = window.localStorage.getItem('music')
    if (storedMusic === 'true' || storedMusic === 'false') {
      prefs.music = storedMusic === 'true'
    }

    const storedFirstTutorial = window.localStorage.getItem('firstTutorial')
    if (storedFirstTutorial === 'true' || storedFirstTutorial === 'false') {
      prefs.firstTutorial = storedFirstTutorial === 'true'
    }
  } catch {
    // localStorage bisa throw (private mode, dll), abaikan.
  }

  return prefs
}

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    /** Restore preferensi tersimpan — satu-satunya jalur rehidrasi. */
    hydrate: (state, { payload }: PayloadAction<Partial<NavigationState>>) => {
      if (payload.theme !== undefined) state.theme = payload.theme
      if (payload.music !== undefined) state.music = payload.music
      if (payload.firstTutorial !== undefined) state.firstTutorial = payload.firstTutorial
    },
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
  hydrate,
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
