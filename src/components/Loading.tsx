import React, { useState, useEffect } from 'react'

import { useProgress } from '@react-three/drei'

import LoadingShell from '@/components/LoadingShell'

/**
 * Overlay pemuatan yang memantau progress via loading manager three.js.
 * Komponen ini di-dynamic-import dari pages/index.tsx (ssr: false) supaya
 * three.js — yang ditarik useProgress dari drei — tidak masuk bundle awal;
 * kerangka visualnya ada di LoadingShell (statis, ikut SSR).
 */
export default function Loading() {
  const [load, setLoad] = useState(true)

  const { progress } = useProgress()
  useEffect(() => {
    setLoad(progress !== 100)
  }, [progress])

  // Safety net: overlay tidak boleh memblokir halaman selamanya. Jika ada
  // resource yang gagal/hang (mis. texture atau decoder) sehingga progress
  // tidak pernah 100, overlay tetap disembunyikan setelah batas waktu.
  useEffect(() => {
    const timer = setTimeout(() => setLoad(false), 30000)
    return () => clearTimeout(timer)
  }, [])

  return <LoadingShell visible={load} progress={progress} />
}
