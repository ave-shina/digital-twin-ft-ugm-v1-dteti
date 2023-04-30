import { configureStore } from '@reduxjs/toolkit'
import navigationReducer from './navigation'

export const store = configureStore({
  reducer: {
    navigation: navigationReducer,
  },
})
