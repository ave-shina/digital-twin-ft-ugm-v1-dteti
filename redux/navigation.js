import { createSlice } from '@reduxjs/toolkit'

const initialState = {
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

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      if (typeof window !== 'undefined') {
        localStorage.getItem('theme') === 'light'
          ? localStorage.setItem('theme', 'dark')
          : localStorage.setItem('theme', 'light')
      }
    },
    setTheme: (state, { payload }) => {
      state.theme = payload
    },
    toggleLocation: (state, { payload }) => {
      state.location = state.location === '' ? payload : ''
    },
    toggleContent: (state, { payload }) => {
      state.content = state.content === '' ? payload : ''
    },
    setShowTooltip: (state, { payload }) => {
      state.showTooltip = payload
    },
    toggleMusic: (state) => {
      state.music = state.music === false ? true : false
      if (typeof window !== 'undefined') {
        localStorage.getItem('music') === 'true'
          ? localStorage.setItem('music', 'false')
          : localStorage.setItem('music', 'true')
      }
    },
    setMusic: (state, { payload }) => {
      state.music = payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('music', payload.toString())
      }
    },
    setFirstTutorial: (state, { payload }) => {
      state.firstTutorial = payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('firstTutorial', payload.toString())
      }
    },
    setMapTourMessage: (state, { payload }) => {
      state.mapTourMessage = payload
    },
    setMapLandmarkMessage: (state, { payload }) => {
      state.mapLandmarkMessage = payload
    },
    setShowWeather: (state, { payload }) => {
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
  setShowTooltip,
  setMapLandmarkMessage,
  setMapTourMessage,
  setShowWeather,
} = navigationSlice.actions

export default navigationSlice.reducer
