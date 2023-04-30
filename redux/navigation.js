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
    },
  },
})

export const { toggleMusic, toggleTheme, toggleLocation, toggleContent, setShowTooltip } = navigationSlice.actions

export default navigationSlice.reducer
