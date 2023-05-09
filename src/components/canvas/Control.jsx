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

  // useFrame digunakan untuk memantau setiap perubahan vektor 3dimensi pada threejs
  useFrame((state) => {
    // ketika mulai maka fov yang berubah
    if (introduction === 'storyBoard') {
      state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, 50, step)
      state.camera.position.lerp(vec.set(camera.position.x, camera.position.y, camera.position.z), step)
      state.camera.lookAt(0, 0, 0)
      state.camera.updateProjectionMatrix()
    }

    // untuk control
    if (controls.current && introduction === '' && freeControl == true) {
      let _v = new THREE.Vector3()
      let minPan = new THREE.Vector3(0, 0, 0)
      let maxPan = new THREE.Vector3(0, 0, 0)
      _v.copy(controls.current.target)
      navigation.location === '' && controls.current.target.clamp(minPan, maxPan)
      _v.sub(controls.current.target)
      camera.position.sub(_v)
    }

    // untuk zoom
    if (locationData) {
      state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, navigation.location ? 15 : 50, step)
      state.camera.position.lerp(
        vec.set(
          navigation.location != '' ? locationData.camera.x : camera.position.x,
          navigation.location != '' ? locationData.camera.y : camera.position.y,
          navigation.location != '' ? locationData.camera.z : camera.position.z,
        ),
        step,
      )

      const vectorLookAt = controls.current.target
      const lookAt = new THREE.Vector3(locationData.target.x, 0, locationData.target.z)
      const start = new THREE.Vector3(0, 0, 0)
      state.camera.lookAt(vectorLookAt.lerp(navigation.location != '' ? lookAt : start, step))
      state.camera.updateProjectionMatrix()
    }
  })

  return (
    <>
      <OrbitControls
        ref={controls}
        //
        //
        autoRotateSpeed={0.5}
        minDistance={130}
        maxDistance={230}
        maxPolarAngle={Math.PI / 2 - 0.1}
        target={[0, 0, 0]}
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
