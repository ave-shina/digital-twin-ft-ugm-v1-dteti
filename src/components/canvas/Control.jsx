import { useRef } from 'react'

import * as THREE from 'three'
import { OrbitControls } from '@react-three/drei'
import { useThree, useFrame } from '@react-three/fiber'

import { useSelector } from 'react-redux'

export default function Controls(props) {
  const { introduction, locationData, freeControl } = props
  const { gl, camera } = useThree()

  const vec = new THREE.Vector3()

  const navigation = useSelector((state) => state.navigation)

  // agar mendapatkan akses kontrol
  const controls = useRef()
  const step = 0.025
  // Maximum radius for circular pan boundary (adjust this value to change the circle size)
  const maxPanRadius = 60

  // useFrame digunakan untuk memantau setiap perubahan vektor 3dimensi pada threejs
  useFrame((state) => {
    // ketika mulai maka fov yang berubah
    if (introduction === 'storyBoard') {
      state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, 50, step)
      state.camera.position.lerp(vec.set(camera.position.x, camera.position.y, camera.position.z), step)
      state.camera.lookAt(0, 0, 0)
      state.camera.updateProjectionMatrix()
    }

    // untuk zoom
    if (locationData && controls.current) {
      if (navigation.location !== '') {
        state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, 15, step)
        state.camera.position.lerp(
          vec.set(locationData.zoomCamera[0], locationData.zoomCamera[1], locationData.zoomCamera[2]),
          step,
        )

        const vectorLookAt = controls.current.target
        const lookAt = new THREE.Vector3(locationData.zoomTarget[0], 0, locationData.zoomTarget[2])
        const targetLerp = vectorLookAt.clone().lerp(lookAt, step)
        controls.current.target.copy(targetLerp)
        state.camera.lookAt(targetLerp)
        state.camera.updateProjectionMatrix()
      } else {
        state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, 50, step)
        state.camera.updateProjectionMatrix()
      }
    }

    // untuk control - constrain pan center to circular area (only when not zooming to a location)
    if (controls.current && introduction === '' && freeControl == true && navigation.location === '') {
      const target = controls.current.target
      // Keep Y at 0 (horizontal plane)
      target.y = 0

      // Calculate distance from center on XZ plane
      const distanceFromCenter = Math.sqrt(target.x * target.x + target.z * target.z)

      // If target is outside the circle, clamp it to the circle boundary
      if (distanceFromCenter > maxPanRadius) {
        // Calculate the angle to preserve direction
        const angle = Math.atan2(target.z, target.x)
        // Store the offset before clamping
        const offset = new THREE.Vector3().subVectors(camera.position, target)

        // Clamp target to circle boundary
        target.x = Math.cos(angle) * maxPanRadius
        target.z = Math.sin(angle) * maxPanRadius

        // Adjust camera position to maintain relative position to target
        camera.position.copy(target).add(offset)
      }
    }
  })

  return (
    <>
      <OrbitControls
        ref={controls}
        //
        //
        autoRotateSpeed={introduction === 'storyBoard' ? 0.5 : 0.01}
        minDistance={130}
        maxDistance={180}
        maxPolarAngle={Math.PI / 2 - 0.1}
        // Removed fixed target to allow free camera movement
        //
        //
        autoRotate={navigation.location === ''}
        enablePan={freeControl && navigation.location === ''}
        enableRotate={freeControl && navigation.location === ''}
        enableZoom={freeControl && navigation.location === ''}
        //
        //
        args={[camera, gl.domElement]}
      />
    </>
  )
}
