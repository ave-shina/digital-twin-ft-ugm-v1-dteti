import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import Model from './Model'
import Controls from './Control'
import * as THREE from 'three'
import { Perf } from 'r3f-perf'
import Background from '../Background'
import { useState } from 'react'

export default function Scene({ children, ...props }) {
  const config = {
    camStartPosition: new THREE.Vector3(0, 15, 25),
    camSBAwalFov: 30,
  }

  return (
    <div className='absolute h-full w-full'>
      <Canvas
        dpr={1.5}
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
        <Controls storyBoard={props.storyBoard} freeControl={props.freeControl} />
        <Model></Model>
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
