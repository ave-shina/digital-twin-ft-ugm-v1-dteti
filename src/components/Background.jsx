import React, { useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

function Background({ theme }) {
  // Komponen untuk membuat Mesh yang digunakan sebagai later belakang
  const backgroundURL = useMemo(
    () => (theme === 'light' ? '/img/background/bg_light.jpg' : '/img/background/bg_dark.png'),
    [theme],
  )
  // Merubahnya menjadi Texture yang dapat digunakan di mesh
  const image = useTexture(backgroundURL)

  // Optimized geometry args - reduced segments for better performance (background doesn't need high detail)
  const geometryArgs = useMemo(() => [6, 64, 32], [])

  return (
    <mesh scale={50} position={[0, 0, 1]}>
      <sphereGeometry args={geometryArgs} />
      <meshBasicMaterial map={image} side={THREE.DoubleSide} />
    </mesh>
  )
}

export default React.memo(Background)
