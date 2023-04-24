import { useRef, forwardRef, useImperativeHandle } from 'react'

const Layout = forwardRef(({ children, ...props }, ref) => {
  const localRef = useRef()
  useImperativeHandle(ref, () => localRef.current)

  return (
    <div {...props} ref={localRef} className='h-screen w-screen overflow-y-auto overflow-x-hidden bg-black !p-0'>
      {children}
    </div>
  )
})
Layout.displayName = 'Layout'

export default Layout
