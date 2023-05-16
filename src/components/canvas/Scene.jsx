import React, { useState } from 'react'

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
  const config = {
    camStartPosition: new THREE.Vector3(0, 15, 25),
    camSBAwalFov: 30,
  }

  // Digunakan untuk Zoom ketika object diklik
  const locationDataDefault = {
    name: 'Default',
    zoomTarget: [0, 0, 0],
    zoomCamera: [200, 0, 10],
  }
  const locationData = Landmarks.data.find((item) => item.attributes.objectName === navigation.location)?.attributes

  const router = useRouter()

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
        camera={{ fov: config.camSBAwalFov, near: 0.1, far: 500, position: config.camStartPosition }}
        {...props}>
        {/* Performen Monitor default factor 0,5 */}
        <PerformanceMonitor onChange={({ factor }) => setDpr(round(0.5 + 1 * factor, 1))}>
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
          <Model showTooltip={showTooltip} locationData={locationData} toggleZoom={toggleZoom}></Model>
          {/* Background */}
          <Background theme={navigation.theme} />
          {children}
        </PerformanceMonitor>
      </Canvas>
    </div>
  )
}
