import { useRef, useMemo } from 'react'

import * as THREE from 'three'
import { OrbitControls } from '@react-three/drei'
import { useThree, useFrame } from '@react-three/fiber'

import { useSelector } from 'react-redux'

export default function Controls(props) {
  const { introduction, locationData, freeControl } = props
  const { gl, camera } = useThree()

  const navigation = useSelector((state) => state.navigation)

  // agar mendapatkan akses kontrol
  const controls = useRef()
  const step = 0.025
  // Maximum radius for circular pan boundary (adjust this value to change the circle size)
  const maxPanRadius = 60
  const maxPanRadiusSquared = maxPanRadius * maxPanRadius

  // Reusable vectors to avoid allocations in useFrame
  const vec = useRef(new THREE.Vector3())
  const lookAt = useRef(new THREE.Vector3())
  const targetLerp = useRef(new THREE.Vector3())
  const offset = useRef(new THREE.Vector3())

  // Memoize computed values
  const isStoryBoard = introduction === 'storyBoard'
  const hasLocation = navigation.location !== ''
  const canFreeControl = introduction === '' && freeControl === true && !hasLocation

  // useFrame digunakan untuk memantau setiap perubahan vektor 3dimensi pada threejs
  useFrame((state) => {
    // ketika mulai maka fov yang berubah
    if (isStoryBoard) {
      state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, 50, step)
      state.camera.position.lerp(camera.position, step)
      state.camera.lookAt(0, 0, 0)
      state.camera.updateProjectionMatrix()
      return
    }

    // untuk zoom
    if (locationData && controls.current) {
      if (hasLocation) {
        state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, 15, step)
        vec.current.set(locationData.zoomCamera[0], locationData.zoomCamera[1], locationData.zoomCamera[2])
        state.camera.position.lerp(vec.current, step)

        const vectorLookAt = controls.current.target
        lookAt.current.set(locationData.zoomTarget[0], 0, locationData.zoomTarget[2])
        targetLerp.current.copy(vectorLookAt).lerp(lookAt.current, step)
        controls.current.target.copy(targetLerp.current)
        state.camera.lookAt(targetLerp.current)
        state.camera.updateProjectionMatrix()
      } else {
        state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, 50, step)
        state.camera.updateProjectionMatrix()
      }
    }

    // untuk control - constrain pan center to circular area (only when not zooming to a location)
    if (controls.current && canFreeControl) {
      const target = controls.current.target
      // Keep Y at 0 (horizontal plane)
      target.y = 0

      // Calculate squared distance from center on XZ plane (avoid sqrt for comparison)
      const distanceSquared = target.x * target.x + target.z * target.z

      // If target is outside the circle, clamp it to the circle boundary
      if (distanceSquared > maxPanRadiusSquared) {
        // Calculate the angle to preserve direction
        const angle = Math.atan2(target.z, target.x)
        // Store the offset before clamping
        offset.current.subVectors(camera.position, target)

        // Clamp target to circle boundary
        target.x = Math.cos(angle) * maxPanRadius
        target.z = Math.sin(angle) * maxPanRadius

        // Adjust camera position to maintain relative position to target
        camera.position.copy(target).add(offset.current)
      }
    }
  })

  // Memoize OrbitControls props to prevent unnecessary re-renders
  const orbitControlsProps = useMemo(
    () => ({
      autoRotateSpeed: isStoryBoard ? 0.5 : 0.3,
      minDistance: 130,
      maxDistance: 220,
      maxPolarAngle: Math.PI / 2 - 0.1,
      autoRotate: !hasLocation,
      enablePan: freeControl && !hasLocation,
      enableRotate: freeControl && !hasLocation,
      enableZoom: freeControl && !hasLocation,
    }),
    [isStoryBoard, hasLocation, freeControl],
  )

  return (
    <>
      <OrbitControls ref={controls} {...orbitControlsProps} args={[camera, gl.domElement]} />
    </>
  )
}
