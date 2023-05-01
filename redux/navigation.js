import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theme: 'light',
  location: '',
  content: '',
  showTooltip: false,
  music: true,
}

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
      localStorage.getItem('theme') === 'light'
        ? localStorage.setItem('theme', 'dark')
        : localStorage.setItem('theme', 'light')
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
      localStorage.getItem('music') === 'true'
        ? localStorage.setItem('music', false)
        : localStorage.setItem('music', true)
    },
    setMusic: (state, { payload }) => {
      state.music = payload
    },
  },
})

export const { toggleMusic, setMusic, toggleTheme, setTheme, toggleLocation, toggleContent, setShowTooltip } =
  navigationSlice.actions

export default navigationSlice.reducer
