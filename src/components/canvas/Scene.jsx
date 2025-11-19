import React, { useState, useMemo, useCallback } from 'react'

import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { Preload, PerformanceMonitor } from '@react-three/drei'
import Background from '../Background'

import Model from './Model'
import Controls from './Control'
import round from 'lodash/round'

import { useSelector, useDispatch } from 'react-redux'
import { toggleLocation, toggleContent } from 'redux/navigation'
import { useRouter } from 'next/router'

import { Landmarks } from '../data/Landamarks'

// Constants moved outside component to avoid recreation
const CAMERA_NEAR = 0.1
const CAMERA_FAR = 600
const CAM_START_POSITION = new THREE.Vector3(0, 15, 25)
const CAM_SB_AWAL_FOV = 30

// Digunakan untuk Zoom ketika object diklik
const LOCATION_DATA_DEFAULT = {
  name: 'Default',
  zoomTarget: [0, 0, 0],
  zoomCamera: [200, 0, 10],
}

function Scene({ children, ...props }) {
  const { freeControl, introduction, showTooltip } = props

  const dispatch = useDispatch()
  const navigation = useSelector((state) => state.navigation)
  const router = useRouter()

  // Memoize locationData calculation
  const locationData = useMemo(
    () => Landmarks.data.find((item) => item.attributes.objectName === navigation.location)?.attributes,
    [navigation.location],
  )

  // Memoize camera config
  const cameraConfig = useMemo(
    () => ({
      fov: CAM_SB_AWAL_FOV,
      near: CAMERA_NEAR,
      far: CAMERA_FAR,
      position: CAM_START_POSITION,
    }),
    [],
  )

  // Logika ketika Object landmark di klik
  const toggleZoom = useCallback(
    (e) => {
      if (navigation.location !== '') {
        dispatch(toggleContent(''))
        dispatch(toggleLocation(''))
        router.push('/')
      } else {
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
    },
    [navigation.location, dispatch, router],
  )

  // Performance Monitor, Device Pixel Ratio
  const [dpr, setDpr] = useState(1)

  // Memoize PerformanceMonitor onChange handler
  const handlePerformanceChange = useCallback(({ factor }) => {
    setDpr(round(0.5 + 1 * factor, 1))
  }, [])

  // Memoize Controls props
  const controlsLocationData = useMemo(() => locationData || LOCATION_DATA_DEFAULT, [locationData])

  return (
    <div className='absolute h-full w-full'>
      <Canvas dpr={dpr} frameloop='demand' camera={cameraConfig} {...props}>
        <PerformanceMonitor onChange={handlePerformanceChange}>
          <directionalLight intensity={0.75} />
          <ambientLight intensity={0.75} />
          <Preload all />

          <Controls locationData={controlsLocationData} introduction={introduction} freeControl={freeControl} />
          <Model showTooltip={showTooltip} landmarksData={Landmarks} toggleZoom={toggleZoom} />
          <Background theme={navigation.theme} />
          {children}
        </PerformanceMonitor>
      </Canvas>
    </div>
  )
}

export default React.memo(Scene)
