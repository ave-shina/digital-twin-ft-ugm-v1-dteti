import { useRef, useMemo, useEffect } from 'react'

import * as THREE from 'three'
import { OrbitControls } from '@react-three/drei'
import { useThree, useFrame } from '@react-three/fiber'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

import { useAppSelector } from 'redux/hooks'
import type { ControlProps } from '../../types/components'

export default function Controls(props: ControlProps) {
  const { introduction, locationData, freeControl } = props
  const { gl, camera } = useThree()

  const navigation = useAppSelector((state) => state.navigation)

  // agar mendapatkan akses kontrol
  const controls = useRef<OrbitControlsImpl>(null)
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

  // Configure mouse buttons for panning (middle mouse button, right mouse button, and trackpad)
  useEffect(() => {
    if (controls.current) {
      // Configure mouse buttons: middle mouse button and right mouse button for panning (default behavior)
      controls.current.mouseButtons = {
        LEFT: freeControl && !hasLocation ? THREE.MOUSE.ROTATE : null,
        MIDDLE: THREE.MOUSE.PAN, // Middle mouse button for panning
        RIGHT: THREE.MOUSE.PAN, // Right mouse button for panning (default behavior)
      } as typeof controls.current.mouseButtons
      // Enable trackpad/touch panning (two-finger drag for pan and zoom)
      controls.current.touches = {
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN, // Two-finger drag for panning and zooming (default behavior)
      }
    }
  }, [controls, freeControl, hasLocation])

  // useFrame digunakan untuk memantau setiap perubahan vektor 3dimensi pada threejs
  useFrame((state) => {
    const cam = state.camera as THREE.PerspectiveCamera
    // ketika mulai maka fov yang berubah
    if (isStoryBoard) {
      cam.fov = THREE.MathUtils.lerp(cam.fov, 50, step)
      cam.position.lerp(camera.position, step)
      cam.lookAt(0, 0, 0)
      cam.updateProjectionMatrix()
      return
    }

    // untuk zoom
    if (locationData && controls.current) {
      if (hasLocation) {
        cam.fov = THREE.MathUtils.lerp(cam.fov, 15, step)
        vec.current.set(locationData.zoomCamera[0], locationData.zoomCamera[1], locationData.zoomCamera[2])
        cam.position.lerp(vec.current, step)

        const vectorLookAt = controls.current.target
        lookAt.current.set(locationData.zoomTarget[0], 0, locationData.zoomTarget[2])
        targetLerp.current.copy(vectorLookAt).lerp(lookAt.current, step)
        controls.current.target.copy(targetLerp.current)
        cam.lookAt(targetLerp.current)
        cam.updateProjectionMatrix()
      } else {
        cam.fov = THREE.MathUtils.lerp(cam.fov, 50, step)
        cam.updateProjectionMatrix()
      }
    }

    // untuk control - constrain pan center to circular area (when panning, including middle mouse button)
    if (controls.current && !hasLocation) {
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
      enablePan: true, // Always enable panning for middle mouse button and trackpad
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
