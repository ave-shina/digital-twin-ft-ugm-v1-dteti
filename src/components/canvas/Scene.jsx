import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import Model from './Model'
import Controls from './Control'
import * as THREE from 'three'
import { Perf } from 'r3f-perf'
import Background from '../Background'
import { useState, useEffect } from 'react'
import clsx from 'clsx'
import { mode } from 'tailwind.config'

export default function Scene({ children, ...props }) {
  const { freeControl, mode, showTooltip, setContent, zoom, setZoom } = props
  const config = {
    camStartPosition: new THREE.Vector3(0, 15, 25),
    camSBAwalFov: 30,
  }

  const [location, setLocation] = useState('')

  const infografis = {
    name: '',
    target: {},
    camera: {},
  }
  switch (location) {
    case 'DTETI':
      infografis.name = 'DTETI'
      infografis.target = { x: -50.97, z: 63.76 }
      infografis.camera = { x: -120, y: 45, z: 0 }
      break
    case 'DTAP':
      infografis.name = 'DTAP'
      infografis.target = { x: -100.25, z: -70.23 }
      infografis.camera = { x: 20, y: 70, z: -10 }
      break
    case 'DTSL':
      infografis.name = 'DTSL'
      infografis.target = { x: -5.34, z: -42.67 }
      infografis.camera = { x: -80, y: 50, z: -80 }
      break
    case 'DTMI':
      infografis.name = 'DTMI'
      infografis.target = { x: -107.63, z: 60.57 }
      infografis.camera = { x: 0, y: 55, z: 10 }
      break
    case 'DTK':
      infografis.name = 'DTK'
      infografis.target = { x: -105.56, z: 16.54 }
      infografis.camera = { x: -15, y: 55, z: 65 }
      break
    case 'DTGD':
      infografis.name = 'DTGD'
      infografis.target = { x: -32.33, z: -90.66 }
      infografis.camera = { x: -60, y: 47, z: -10 }
      break
    case 'DTGL':
      infografis.name = 'DTGL'
      infografis.target = { x: 38.34, z: 30.02 }
      infografis.camera = { x: -40, y: 40, z: 65 }
      break
    case 'DTNTF':
      infografis.name = 'DTNTF'
      infografis.target = { x: 15.8, z: 60.66 }
      infografis.camera = { x: -5, y: 30, z: 15 }
      break
    case 'TUGU TEKNIK':
      infografis.name = 'TUGU TEKNIK'
      infografis.target = { x: 45.33, z: 15.06 }
      infografis.camera = { x: 150, y: 45, z: 65 }
      break
    case 'SGLC':
      infografis.name = 'SGLC'
      infografis.target = { x: -70.13, z: -5.22 }
      infografis.camera = { x: 100, y: 70, z: 75 }
      break
    case 'PERPUSTAKAAN':
      infografis.name = 'PERPUSTAKAAN'
      infografis.target = { x: -30.1, z: 65.7 }
      infografis.camera = { x: 5, y: 25, z: -10 }
      break
    case 'MUSHOLA':
      infografis.name = 'MUSHOLA'
      infografis.target = { x: -80.2, z: -38.63 }
      infografis.camera = { x: 0, y: 40, z: -20 }
      break
    case 'ERICS':
      infografis.name = 'ERICS'
      infografis.target = { x: 100.55, z: 0.4 }
      infografis.camera = { x: 200, y: 55, z: 90 }
      break
    default:
      infografis.name = 'TUGU TEKNIK'
      infografis.target = { x: 0, z: 0 }
      infografis.camera = { x: 200, y: 0, z: 10 }
  }

  const toggleZoom = (e) => {
    if (zoom === true) {
      setZoom(false)
      setContent('')
      setLocation('')
    } else if (zoom === false) {
      setZoom(true)
      setContent('location')
      setLocation(e)
    }
  }

  // useEffect(() => {
  //   if (location != '') {
  //     setZoom(true)
  //     setContent('location')
  //   } else if (location === '') {
  //     setZoom(false)
  //     setContent('')
  //   }
  // }, [location])

  return (
    <div className={clsx('absolute h-full w-full')}>
      <Canvas
        // dpr={1.5}
        frameloop='demand'
        camera={{ fov: config.camSBAwalFov, near: 0.1, far: 500, position: config.camStartPosition }}
        {...props}>
        {/*  */}
        {/*  */}
        <directionalLight intensity={0.75} />
        <ambientLight intensity={0.75} />
        <Preload all />
        {/* <Perf /> */}
        {/*  */}
        {/* */}
        <Controls zoom={zoom} infografis={infografis} mode={mode} freeControl={freeControl} />
        <Model setContent={setContent} zoom={zoom} showTooltip={showTooltip} toggleZoom={toggleZoom}></Model>
        <Background />
        {/*  */}
        {/*  */}
        {children}
        {/*  */}
        {/*  */}
      </Canvas>
    </div>
  )
}
