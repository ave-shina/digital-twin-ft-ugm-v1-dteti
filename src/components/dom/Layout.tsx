import { useRef, forwardRef, useImperativeHandle, useEffect } from 'react'
import { useAppDispatch } from 'redux/hooks'
import { setTheme, setMusic, setFirstTutorial } from 'redux/navigation'
import { NextSeo } from 'next-seo'
import type { LayoutProps } from '../../types/components'
import type { Theme } from '../../types/data'

const Layout = forwardRef<HTMLDivElement, LayoutProps>(({ children, ...props }, ref) => {
  const localRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(ref, () => localRef.current as HTMLDivElement, [])

  const dispatch = useAppDispatch()

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
        title='Virtual Tour FT UGM'
        description='Selamat datang di Virtual Tour Fakultas Teknik Universitas Gadjah Mada (FT UGM)!, Dalam perjalanan virtual ini, Anda akan diajak mengenal lebih dekat berbagai gedung akademik dan lingkungan kampus yang mendukung proses pembelajaran dan penelitian di FT UGM.'
        openGraph={{
          images: [
            {
              url: 'https://virtual-tour-ft-ugm.vercel.app/icons/android-icon-512x512.png',
              width: 512,
              height: 512,
              alt: 'Virtual Tour FT UGM Logo',
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
