import { useRef } from 'react'
import type { AppProps } from 'next/app'

import Header from '@/config'
import Layout from '@/components/dom/Layout'
import ErrorBoundary from '@/components/ErrorBoundary'
import '@/styles/index.css'
import 'react-image-lightbox/style.css'

import { Provider } from 'react-redux'
import { store } from 'redux/store'

import { Analytics } from '@vercel/analytics/react'

export default function App({ Component, pageProps }: AppProps<{ title?: string }>) {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <>
      {/* Analytucs Next JS */}
      <Analytics />
      {/* Provider digunakan untuk Redux */}
      <Provider store={store}>
        <ErrorBoundary>
          <Header title={pageProps.title} />
          {/* Komponen utama */}
          <Layout ref={ref}>
            <Component {...pageProps} />
          </Layout>
        </ErrorBoundary>
      </Provider>
    </>
  )
}
