import React, { useRef } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export default function Background(props) {
  const { theme } = props
  const myRef = useRef()
  const backgroundURL = theme === 'light' ? '/img/background/bg_light.jpg' : '/img/background/bg_dark.png'
  const image = useTexture(backgroundURL)

  return (
    <mesh scale={40} position={[0, 0, 1]} ref={myRef}>
      <sphereGeometry args={[6, 100, 50]} />
      <meshBasicMaterial map={image} side={THREE.DoubleSide} opacity={1} />
    </mesh>
  )
}
