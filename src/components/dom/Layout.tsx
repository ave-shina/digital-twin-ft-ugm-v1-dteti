import { useRef, forwardRef, useImperativeHandle, useEffect } from 'react'
import { useAppDispatch } from 'redux/hooks'
import { hydrate, readStoredPreferences } from 'redux/navigation'
import type { LayoutProps } from '../../types/components'

const Layout = forwardRef<HTMLDivElement, LayoutProps>(({ children, ...props }, ref) => {
  const localRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(ref, () => localRef.current as HTMLDivElement, [])

  const dispatch = useAppDispatch()

  // Rehidrasi preferensi tersimpan — SEKALI dan HANYA di sini, setelah mount.
  // State awal redux murni default (lihat redux/navigation.ts) agar identik
  // dengan HTML server; membaca localStorage saat render = hydration mismatch.
  // Penulisan ke localStorage ditangani middleware di redux/store.ts.
  useEffect(() => {
    dispatch(hydrate(readStoredPreferences()))
  }, [dispatch])

  return (
    <div {...props} ref={localRef} className=' min-h-full w-full !p-0'>
      {children}
    </div>
  )
})
Layout.displayName = 'Layout'

export default Layout
