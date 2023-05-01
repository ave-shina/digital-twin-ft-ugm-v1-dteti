import { Canvas } from '@react-three/fiber'
import { Preload, PerformanceMonitor } from '@react-three/drei'
import Model from './Model'
import Controls from './Control'
import * as THREE from 'three'
// import { Perf } from 'r3f-perf'
import Background from '../Background'
import clsx from 'clsx'
import React, { useState } from 'react'

import { useSelector, useDispatch } from 'react-redux'
import { toggleLocation, toggleContent } from 'redux/navigation'

export default function Scene({ children, ...props }) {
  const { freeControl, introduction, showTooltip } = props

  const navigation = useSelector((state) => state.navigation)
  const dispatch = useDispatch()

  const config = {
    camStartPosition: new THREE.Vector3(0, 15, 25),
    camSBAwalFov: 30,
  }

  const locationData = {
    name: '',
    target: {},
    camera: {},
  }
  switch (navigation.location) {
    case 'DTETI':
      locationData.name = 'DTETI'
      locationData.target = { x: -50.97, z: 63.76 }
      locationData.camera = { x: -120, y: 45, z: 0 }
      break
    case 'DTAP':
      locationData.name = 'DTAP'
      locationData.target = { x: -100.25, z: -70.23 }
      locationData.camera = { x: 20, y: 70, z: -10 }
      break
    case 'DTSL':
      locationData.name = 'DTSL'
      locationData.target = { x: -5.34, z: -42.67 }
      locationData.camera = { x: -80, y: 50, z: -80 }
      break
    case 'DTMI':
      locationData.name = 'DTMI'
      locationData.target = { x: -107.63, z: 60.57 }
      locationData.camera = { x: 0, y: 55, z: 10 }
      break
    case 'DTK':
      locationData.name = 'DTK'
      locationData.target = { x: -105.56, z: 16.54 }
      locationData.camera = { x: -15, y: 55, z: 65 }
      break
    case 'DTGD':
      locationData.name = 'DTGD'
      locationData.target = { x: -32.33, z: -90.66 }
      locationData.camera = { x: -60, y: 47, z: -10 }
      break
    case 'DTGL':
      locationData.name = 'DTGL'
      locationData.target = { x: 38.34, z: 30.02 }
      locationData.camera = { x: -40, y: 40, z: 65 }
      break
    case 'DTNTF':
      locationData.name = 'DTNTF'
      locationData.target = { x: 15.8, z: 60.66 }
      locationData.camera = { x: -5, y: 30, z: 15 }
      break
    case 'TUGU TEKNIK':
      locationData.name = 'TUGU TEKNIK'
      locationData.target = { x: 45.33, z: 15.06 }
      locationData.camera = { x: 150, y: 45, z: 65 }
      break
    case 'SGLC':
      locationData.name = 'SGLC'
      locationData.target = { x: -70.13, z: -5.22 }
      locationData.camera = { x: 100, y: 70, z: 75 }
      break
    case 'PERPUSTAKAAN':
      locationData.name = 'PERPUSTAKAAN'
      locationData.target = { x: -30.1, z: 65.7 }
      locationData.camera = { x: 5, y: 25, z: -10 }
      break
    case 'MUSHOLA':
      locationData.name = 'MUSHOLA'
      locationData.target = { x: -80.2, z: -38.63 }
      locationData.camera = { x: 0, y: 40, z: -20 }
      break
    case 'ERICS':
      locationData.name = 'ERICS'
      locationData.target = { x: 100.55, z: 0.4 }
      locationData.camera = { x: 200, y: 55, z: 90 }
      break
    default:
      locationData.name = 'TUGU TEKNIK'
      locationData.target = { x: 0, z: 0 }
      locationData.camera = { x: 200, y: 0, z: 10 }
  }

  const toggleZoom = (e) => {
    if (navigation.location != '') {
      dispatch(toggleContent(''))
      dispatch(toggleLocation(''))
    } else if (navigation.location === '') {
      dispatch(toggleContent('location'))
      dispatch(toggleLocation(e))
    }
  }

  const [dpr, setDpr] = useState(1)
  // console.log(navigation)
  return (
    <div className={clsx('absolute h-full w-full')}>
      <Canvas
        dpr={dpr}
        frameloop='demand'
        camera={{ fov: config.camSBAwalFov, near: 0.1, far: 500, position: config.camStartPosition }}
        {...props}>
        <PerformanceMonitor onChange={({ factor }) => setDpr(Math.round(0.5 + 1.5 * factor, 1))}></PerformanceMonitor>
        {/*  */}
        {/*  */}
        <directionalLight intensity={0.75} />
        <ambientLight intensity={0.75} />
        <Preload all />
        {/* <Perf /> */}
        {/*  */}
        {/* */}
        <Controls locationData={locationData} introduction={introduction} freeControl={freeControl} />
        <Model showTooltip={showTooltip} locationData={locationData} toggleZoom={toggleZoom}></Model>
        <Background theme={navigation.theme} />
        {/*  */}
        {/*  */}
        {children}
        {/*  */}
        {/*  */}
      </Canvas>
    </div>
  )
}
