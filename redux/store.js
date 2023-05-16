import { configureStore } from '@reduxjs/toolkit'
import navigationReducer from './navigation'

export const store = configureStore({
  reducer: {
    navigation: navigationReducer,
  },
})

// Import configureStore dari @reduxjs/toolkit. configureStore adalah fungsi yang disediakan oleh @reduxjs/toolkit untuk membuat store Redux dengan konfigurasi yang telah disederhanakan.
// Import navigationReducer dari file './navigation'. navigationReducer adalah reducer yang bertanggung jawab untuk mengelola state navigasi dalam aplikasi.
