import { useRef, forwardRef, useImperativeHandle } from 'react'
import { useDispatch } from 'react-redux'
import { setTheme, setMusic } from 'redux/navigation'

const Layout = forwardRef(({ children, ...props }, ref) => {
  const localRef = useRef()
  useImperativeHandle(ref, () => localRef.current)

  const dispatch = useDispatch()
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
  }

  return (
    <div {...props} ref={localRef} className=' min-h-screen   bg-black !p-0'>
      {children}
    </div>
  )
})
Layout.displayName = 'Layout'

export default Layout
