import { useRef, forwardRef, useImperativeHandle, useEffect } from 'react'
import { useAppDispatch } from 'redux/hooks'
import { setTheme, setMusic, setFirstTutorial } from 'redux/navigation'
import { NextSeo } from 'next-seo'
import type { LayoutProps } from '../../types/components'
import type { Theme } from '../../types/data'
import { useSettings } from '@/context/SettingsContext'

const Layout = forwardRef<HTMLDivElement, LayoutProps>(({ children, ...props }, ref) => {
  const localRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(ref, () => localRef.current as HTMLDivElement, [])

  const dispatch = useAppDispatch()
  const settings = useSettings()
  const { title, description, url, ogImage } = settings.seo
  // OG image harus URL absolut; fallback ke base URL situs bila relatif.
  const ogImageUrl = /^https?:\/\//.test(ogImage) ? ogImage : `${url.replace(/\/$/, '')}${ogImage}`

  // Digunakan untuk inisasi redux berdasarkan dengan local storage item di setiap device
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const theme = localStorage.getItem('theme')

      if (theme === null) {
        localStorage.setItem('theme', 'light')
        dispatch(setTheme('light'))
      } else {
        dispatch(setTheme(theme as Theme))
      }

      const music = localStorage.getItem('music')

      if (music === null) {
        localStorage.setItem('music', 'true')
        dispatch(setMusic(true))
      } else {
        dispatch(setMusic(music === 'true'))
      }

      const firstTutorial = localStorage.getItem('firstTutorial')
      if (firstTutorial === null) {
        localStorage.setItem('firstTutorial', 'false')
        dispatch(setFirstTutorial(false))
      } else {
        dispatch(setFirstTutorial(firstTutorial === 'true'))
      }
    }
  }, [dispatch])

  return (
    <div {...props} ref={localRef} className=' min-h-full w-full !p-0'>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          images: [
            {
              url: ogImageUrl,
              alt: title,
            },
          ],
        }}
      />
      {children}
    </div>
  )
})
Layout.displayName = 'Layout'

export default Layout
