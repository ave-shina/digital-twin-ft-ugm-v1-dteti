import { OrbitControls } from '@react-three/drei'
import { useThree, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'

export default function Controls(props) {
  const { gl, camera } = useThree()
  const controls = useRef()
  const vec = new THREE.Vector3()

  const step = 0.025

  useFrame((state) => {
    if (props.storyBoard == true) {
      state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, 50, step)
      state.camera.position.lerp(vec.set(camera.position.x, camera.position.y, camera.position.z), step)
      state.camera.lookAt(0, 0, 0)
      state.camera.updateProjectionMatrix()
    }

    if (controls.current && props.storyBoard == false && props.freeControl == true) {
      let _v = new THREE.Vector3()
      let minPan = new THREE.Vector3(0, 0, 0)
      let maxPan = new THREE.Vector3(0, 0, 0)
      _v.copy(controls.current.target)
      controls.current.target.clamp(minPan, maxPan)
      _v.sub(controls.current.target)
      camera.position.sub(_v)
    }

    // state.camera.updateProjectionMatrix()
  })

  // scene.fog = new THREE.Fog('#000000', 600, 1000)
  // console.log(props.freeControl)

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
        autoRotate={true}
        enablePan={props.freeControl}
        enableRotate={props.freeControl}
        enableZoom={props.freeControl}
        //
        //
        args={[camera, gl.domElement]}
      />
    </>
  )
}
