import { useRef } from 'react'

import Header from '@/config'
import Layout from '@/components/dom/Layout'
import '@/styles/index.css'
import 'react-image-lightbox/style.css'

import { Provider } from 'react-redux'
import { store } from '../../redux/store'

export default function App({ Component, pageProps }) {
  const ref = useRef()

  return (
    <>
      <Provider store={store}>
        <Header title={pageProps.title} />
        <Layout ref={ref}>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </>
  )
}
