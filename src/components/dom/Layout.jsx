import { useRef, forwardRef, useImperativeHandle, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setTheme, setMusic, setFirstTutorial } from 'redux/navigation'

const Layout = forwardRef(({ children, ...props }, ref) => {
  const localRef = useRef()
  useImperativeHandle(ref, () => localRef.current)

  const dispatch = useDispatch()

  // Digunakan untuk inisasi redux berdasarkan dengan local storage item di setiap device
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const theme = localStorage.getItem('theme')

      if (theme === null) {
        localStorage.setItem('theme', 'light')
      } else {
        dispatch(setTheme(theme))
      }

      const music = localStorage.getItem('music')

      if (music === null) {
        localStorage.setItem('music', 'true')
      } else {
        dispatch(setMusic(music === 'true'))
      }

      const firstTutorial = localStorage.getItem('firstTutorial')
      if (firstTutorial === null) {
        localStorage.setItem('firstTutorial', 'false')
      } else {
        dispatch(setFirstTutorial(firstTutorial === 'true'))
      }
    }
  }, [typeof window])

  return (
    <div {...props} ref={localRef} className=' min-h-full w-full !p-0'>
      {children}
    </div>
  )
})
Layout.displayName = 'Layout'

export default Layout
