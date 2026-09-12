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

import { SettingsProvider } from '@/context/SettingsContext'
import { DEFAULT_SETTINGS } from '@/lib/prismic/settings-default'
import type { SiteSettings } from '@/types/prismic'

export default function App({ Component, pageProps }: AppProps<{ title?: string; settings?: SiteSettings }>) {
  const ref = useRef<HTMLDivElement>(null)
  const settings = pageProps.settings ?? DEFAULT_SETTINGS.settings

  return (
    <>
      {/* Analytucs Next JS */}
      <Analytics />
      {/* Provider digunakan untuk Redux */}
      <Provider store={store}>
        <ErrorBoundary>
          {/* SettingsProvider membawa konten Prismic (SEO, catatan, tutorial) ke semua komponen */}
          <SettingsProvider settings={settings}>
            <Header />
            {/* Komponen utama */}
            <Layout ref={ref}>
              <Component {...pageProps} />
            </Layout>
          </SettingsProvider>
        </ErrorBoundary>
      </Provider>
    </>
  )
}
