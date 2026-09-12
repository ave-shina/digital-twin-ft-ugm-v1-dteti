import { configureStore, Middleware } from '@reduxjs/toolkit'
import navigationReducer from './navigation'

// Middleware untuk persist state ke localStorage.
// Menggantikan side-effect di dalam reducer (anti-pattern Redux).
const localStorageMiddleware: Middleware = (storeAPI) => (next) => (action) => {
  const result = next(action)
  if (typeof window === 'undefined') return result

  try {
    const state = storeAPI.getState()
    if (state.navigation?.theme !== undefined) {
      window.localStorage.setItem('theme', state.navigation.theme)
    }
    if (state.navigation?.music !== undefined) {
      window.localStorage.setItem('music', String(state.navigation.music))
    }
    if (state.navigation?.firstTutorial !== undefined) {
      window.localStorage.setItem('firstTutorial', String(state.navigation.firstTutorial))
    }
  } catch {
    // Abaikan jika localStorage tidak dapat diakses.
  }

  return result
}

export const store = configureStore({
  reducer: {
    navigation: navigationReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
