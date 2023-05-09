import { useRef } from 'react'

import Header from '@/config'
import Layout from '@/components/dom/Layout'
import '@/styles/index.css'
import 'react-image-lightbox/style.css'

import { Provider } from 'react-redux'
import { store } from '../../redux/store'

import { Analytics } from '@vercel/analytics/react'

export default function App({ Component, pageProps }) {
  const ref = useRef()

  return (
    <>
      {/* Analytucs Next JS */}
      <Analytics />
      {/* Provider digunakan untuk Redux */}
      <Provider store={store}>
        <Header title={pageProps.title} />
        {/* Komponen utama */}
        <Layout ref={ref}>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </>
  )
}
