import React, { useState, useEffect } from 'react'

import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { Preload, PerformanceMonitor } from '@react-three/drei'
// import { Perf } from 'r3f-perf'
import Background from '../Background'

import Model from './Model'
import Controls from './Control'
import round from 'lodash/round'

import clsx from 'clsx'

import { useSelector, useDispatch } from 'react-redux'
import { toggleLocation, toggleContent } from 'redux/navigation'
import { useRouter } from 'next/router'

import { Landmarks } from '../data/Landamarks'

export default function Scene({ children, ...props }) {
  const { freeControl, introduction, showTooltip } = props

  const dispatch = useDispatch()
  const navigation = useSelector((state) => state.navigation)

  // Konfigurasi posisi kamera dan FoV semakin besar semakin luas
  // camStartPosition: Initial camera position (x, y, z)
  // camSBAwalFov: Initial field of view (larger = wider view)
  const config = {
    camStartPosition: new THREE.Vector3(0, 15, 25),
    camSBAwalFov: 30,
  }

  // Camera rendering distance (clipping planes)
  // near: Objects closer than this won't render (default: 0.1)
  // far: Objects farther than this won't render (default: 500)
  // Increase 'far' to see objects at greater distances
  const CAMERA_NEAR = 0.1
  const CAMERA_FAR = 500

  // Digunakan untuk Zoom ketika object diklik
  const locationDataDefault = {
    name: 'Default',
    zoomTarget: [0, 0, 0],
    zoomCamera: [200, 0, 10],
  }

  const locationData = Landmarks.data.find((item) => item.attributes.objectName === navigation.location)?.attributes
  const router = useRouter()

  // const [landmarksData, setLandmarksData] = useState(null)
  // useEffect(() => {
  //   async function fetchLandmarksData() {
  //     const response = await fetch('http://localhost:1337/api/landmarks?populate=deep')
  //     const data = await response.json()
  //     setLandmarksData(data)
  //   }
  //   fetchLandmarksData()
  // }, [])

  // console.log('uhuy', landmarksData)

  // Logika ketika Object landmark di klik
  const toggleZoom = (e) => {
    if (navigation.location != '') {
      dispatch(toggleContent(''))
      dispatch(toggleLocation(''))
      router.push('/')
    } else if (navigation.location === '') {
      dispatch(toggleContent('landmark'))
      dispatch(toggleLocation(e))
      router.push(
        {
          pathname: '/',
          query: { content: 'landmark', location: e },
        },
        `/landmark?location=${e}`,
        { shallow: true },
      )
    }
  }

  // Performence Monitor, Device Pixel Ratio
  const [dpr, setDpr] = useState(1)
  // console.log(navigation)
  return (
    <div className={clsx('absolute h-full w-full')}>
      <Canvas
        dpr={dpr}
        // Agar tidak selalu Rendering
        frameloop='demand'
        // Memasukkan konfigurasi yang sudah dideklarasikan sebelumnya
        camera={{ fov: config.camSBAwalFov, near: CAMERA_NEAR, far: CAMERA_FAR, position: config.camStartPosition }}
        {...props}>
        {/* Set background color to white */}
        {/* <color attach='background' args={['white']} /> */}
        {/* Performen Monitor default factor 0,5 */}
        <PerformanceMonitor onChange={({ factor }) => setDpr(round(0.5 + 1 * factor, 1))}>
          {/* Fog effect to blur objects before they touch the background */}
          {/* Lightning Three */}
          <directionalLight intensity={0.75} />
          <ambientLight intensity={0.75} />
          <Preload all />
          {/* <Perf /> */}

          {/* Controls */}
          <Controls
            locationData={locationData ? locationData : locationDataDefault}
            introduction={introduction}
            freeControl={freeControl}
          />
          {/* mODEL */}
          <Model showTooltip={showTooltip} landmarksData={Landmarks} toggleZoom={toggleZoom}></Model>
          {/* Background */}
          <Background theme={navigation.theme} />
          {children}
        </PerformanceMonitor>
      </Canvas>
    </div>
  )
}
