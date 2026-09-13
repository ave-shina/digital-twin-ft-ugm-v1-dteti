import React, { useRef, useEffect, useState, useMemo } from 'react'
import * as THREE from 'three'

import { useGLTF, Html } from '@react-three/drei'
import { useFrame, type ThreeEvent } from '@react-three/fiber'

import { useAppSelector } from 'redux/hooks'
import type { ModelProps, SpriteHoverProps } from '../../types/components'
import type { Vec3 } from '../../types/data'
import Grass from './Grass'
import { MESH_PARTS, type MeshPart } from './model-parts'

interface TooltipLocationEntry {
  name: string
  position: Vec3
}

interface PartProps {
  part: MeshPart
  nodes: { [key: string]: THREE.Mesh }
  materials: { [key: string]: THREE.Material }
}

/**
 * Mesh statis dari MESH_PARTS (penempatan hasil ekspor glTF). Props rotation
 * dan scale hanya diteruskan bila ada, persis seperti JSX aslinya.
 */
function Part({ part, nodes, materials }: PartProps) {
  return (
    <mesh
      geometry={nodes[part.g].geometry}
      material={materials[part.m]}
      position={part.p}
      {...(part.r && { rotation: part.r })}
      {...(part.s !== undefined && { scale: part.s })}
    />
  )
}

export default function Model(props: ModelProps) {
  const navigation = useAppSelector((state) => state.navigation)
  // Mendapatkan fungsi toggle zoom dari parent
  const { toggleZoom, landmarksData } = props
  const group = useRef<THREE.Group>(null)
  // import 3dModel — draco decoder di-self-host di /draco/ (bukan gstatic CDN)
  // agar load model tidak bergantung pada jaringan pihak ketiga.
  const gltf = useGLTF('object/map-min.glb', '/draco/') as unknown as {
    nodes: { [key: string]: THREE.Mesh }
    materials: { [key: string]: THREE.Material }
  }
  const { nodes, materials } = gltf

  //Deklarasi untuk Lokasi Tooltip — di-memo agar stabil sebagai dependency efek.
  const tooltipLocationData = useMemo<TooltipLocationEntry[]>(() => {
    const entries: TooltipLocationEntry[] = []
    for (let i = 0; i < landmarksData?.data.length; i++) {
      entries.push({
        name: landmarksData.data[i].attributes.objectName,
        position: landmarksData.data[i].attributes.tooltipLocation,
      })
    }
    return entries
  }, [landmarksData])

  const [object, setObject] = useState<string[]>([])
  const [hoveredPosition, setHoveredPosition] = useState<Vec3 | null>(null)

  // Hover untuk menampilkan Tooltip
  const handleHover = (e: string, _event: ThreeEvent<PointerEvent>): void => {
    if (navigation.showTooltip === false) setObject([e])
    // Get the tooltip location for lighting
    const tooltipData = tooltipLocationData.find((obj) => obj.name === e)
    if (tooltipData && tooltipData.position) {
      // Use tooltip location position (already in world coordinates)
      setHoveredPosition(tooltipData.position)
    }
    document.body.style.cursor = 'pointer'
  }
  const clearHover = (_e: ThreeEvent<PointerEvent>) => {
    if (navigation.showTooltip === false) setObject([])
    setHoveredPosition(null)
    document.body.style.cursor = 'auto'
  }

  // Filter untuk tooltip berdasarkan array yang masuk
  const [filteredLocation, setFilteredLocation] = useState<TooltipLocationEntry[]>([])
  useEffect(() => {
    setFilteredLocation(tooltipLocationData.filter((obj) => object.includes(obj.name)))
  }, [object, tooltipLocationData])

  // Menampilkan semua tooltip
  useEffect(() => {
    if (navigation.showTooltip) {
      setObject(tooltipLocationData.map((obj) => obj.name))
    } else {
      setObject([])
    }
  }, [navigation.showTooltip, tooltipLocationData])

  return (
    <>
      {/* Light effect on hover */}
      {hoveredPosition && (
        <pointLight position={hoveredPosition} intensity={1} distance={30} decay={1} color='#ffffff' />
      )}
      {/* Tooltip tampil dengan mendeteksi panjang dari object */}
      {navigation.location === '' && filteredLocation.map((item, index) => <SpriteHover key={index} object={item} />)}

      <group ref={group} {...props} dispose={null}>
        {MESH_PARTS.slice(0, 2).map((part, idx) => (
          <Part key={idx} part={part} nodes={nodes} materials={materials} />
        ))}
        {/* Grass mesh */}
        <Grass />
        {MESH_PARTS.slice(2, 228).map((part, idx) => (
          <Part key={idx} part={part} nodes={nodes} materials={materials} />
        ))}
        <mesh
          geometry={nodes.BirchTree_5_Cube055.geometry}
          material={materials.BIRCHTREE_5_BAKE}
          position={[-85.04, 5.35, 33.57]}
          rotation={[Math.PI / 2, 0, 1.51]}
          scale={navigation.location === '' ? 1.98 : 1.3}
        />
        <mesh
          geometry={nodes.BirchTree_5_Cube056.geometry}
          material={materials.BIRCHTREE_5_BAKE}
          position={[-75.59, 5.35, 35.66]}
          rotation={[Math.PI / 2, 0, 1.51]}
          scale={navigation.location === '' ? 1.55 : 1.2}
        />
        <mesh
          geometry={nodes.BirchTree_5_Cube057.geometry}
          material={materials.BIRCHTREE_5_BAKE}
          position={[-84.25, 5.35, 44.06]}
          rotation={[Math.PI / 2, 0, 1.51]}
          scale={navigation.location === '' ? 1.7 : 1.1}
        />
        <mesh
          geometry={nodes.BirchTree_5_Cube058.geometry}
          material={materials.BIRCHTREE_5_BAKE}
          position={[-76.37, 5.35, 45.89]}
          rotation={[Math.PI / 2, 0, 1.51]}
          scale={navigation.location === '' ? 1.86 : 1.2}
        />
        {MESH_PARTS.slice(228, 329).map((part, idx) => (
          <Part key={idx} part={part} nodes={nodes} materials={materials} />
        ))}
        <mesh
          geometry={nodes.CommonTree_2_Cube159.geometry}
          material={materials.COMMONTREE_2_BAKE}
          position={[-83.24, 5.35, 37.68]}
          rotation={[Math.PI / 2, 0, 1.26]}
          scale={navigation.location === '' ? 2.74 : 1}
        />
        {MESH_PARTS.slice(329, 409).map((part, idx) => (
          <Part key={idx} part={part} nodes={nodes} materials={materials} />
        ))}
        <mesh
          geometry={nodes.CommonTree_4_Cube083.geometry}
          material={materials.COMMONTREE_4_BAKE}
          position={[-76.43, 5.35, 42.64]}
          rotation={[Math.PI / 2, 0, 1.51]}
          scale={navigation.location === '' ? 2.74 : 1}
        />
        {MESH_PARTS.slice(409, 628).map((part, idx) => (
          <Part key={idx} part={part} nodes={nodes} materials={materials} />
        ))}
        <mesh
          geometry={nodes.Willow_4_Cube138.geometry}
          material={materials.WILLOWTREE_4_BAKE}
          position={[-81.45, 5.35, 39.48]}
          rotation={[Math.PI / 2, 0, 1.51]}
          scale={navigation.location === '' ? 2.22 : 1.8}
        />
        {MESH_PARTS.slice(628, 653).map((part, idx) => (
          <Part key={idx} part={part} nodes={nodes} materials={materials} />
        ))}
        <mesh
          onPointerOver={(e) => (handleHover('SGLC', e), e.stopPropagation())}
          onPointerOut={(e) => (clearHover(e), e.stopPropagation())}
          geometry={nodes.SGLC_BAKE.geometry}
          material={materials.SGLC_BAKE}
          position={[-56.13, 5.12, 25.22]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.49}
          onClick={(e) => (toggleZoom('SGLC'), e.stopPropagation())}
        />
        <mesh
          onPointerOver={(e) => (handleHover('DTK', e), e.stopPropagation())}
          onPointerOut={(e) => (clearHover(e), e.stopPropagation())}
          geometry={nodes.TEKIM_BAKE.geometry}
          material={materials.TEKIM_BAKE}
          position={[-89.56, 7.96, 24.54]}
          scale={0.49}
          onClick={(e) => (toggleZoom('DTK'), e.stopPropagation())}
        />
        <mesh
          onPointerOver={(e) => (handleHover('DTETI', e), e.stopPropagation())}
          onPointerOut={(e) => (clearHover(e), e.stopPropagation())}
          geometry={nodes.DTETI_BAKE.geometry}
          material={materials.TETI_BAKE}
          position={[-59.97, 8.8, 53.76]}
          scale={0.49}
          onClick={(e) => (toggleZoom('DTETI'), e.stopPropagation())}
        />
        <group position={[-42.71, 8.32, 34.86]} scale={0.77}>
          <mesh geometry={nodes.Cube012.geometry} material={materials.Red} />
          <mesh geometry={nodes.Cube012_1.geometry} material={materials.Grey} />
        </group>
        <group position={[-48.28, 8.34, 34.75]} scale={0.77}>
          <mesh geometry={nodes.Cube012.geometry} material={materials.Red} />
          <mesh geometry={nodes.Cube012_1.geometry} material={materials.Grey} />
        </group>
        <group position={[-38.55, 8.12, 36.38]} rotation={[0, -1.56, 0]} scale={0.77}>
          <mesh geometry={nodes.Cube012.geometry} material={materials.Red} />
          <mesh geometry={nodes.Cube012_1.geometry} material={materials.Grey} />
        </group>
        <group position={[-38.49, 5.43, 42.01]} rotation={[0, -1.56, 0]} scale={0.77}>
          <mesh geometry={nodes.Cube012.geometry} material={materials.Red} />
          <mesh geometry={nodes.Cube012_1.geometry} material={materials.Grey} />
        </group>
        <group position={[-48.28, 5.43, 34.8]} scale={0.77}>
          <mesh geometry={nodes.Cube012.geometry} material={materials.Red} />
          <mesh geometry={nodes.Cube012_1.geometry} material={materials.Grey} />
        </group>
        <group position={[-42.59, 5.43, 34.86]} scale={0.77}>
          <mesh geometry={nodes.Cube012.geometry} material={materials.Red} />
          <mesh geometry={nodes.Cube012_1.geometry} material={materials.Grey} />
        </group>
        <group position={[-38.55, 5.43, 36.38]} rotation={[0, -1.56, 0]} scale={0.77}>
          <mesh geometry={nodes.Cube012.geometry} material={materials.Red} />
          <mesh geometry={nodes.Cube012_1.geometry} material={materials.Grey} />
        </group>
        <group position={[-38.49, 8.07, 42.01]} rotation={[0, -1.56, 0]} scale={0.77}>
          <mesh geometry={nodes.Cube012.geometry} material={materials.Red} />
          <mesh geometry={nodes.Cube012_1.geometry} material={materials.Grey} />
        </group>
        <mesh
          onPointerOver={(e) => (handleHover('DTNTF', e), e.stopPropagation())}
          onPointerOut={(e) => (clearHover(e), e.stopPropagation())}
          geometry={nodes.DTNTF_BAKE.geometry}
          material={materials.TNTF_BAKE}
          position={[9.8, 7.84, 54.66]}
          scale={0.49}
          onClick={(e) => (toggleZoom('DTNTF'), e.stopPropagation())}
        />
        <group
          onPointerOver={(e) => (handleHover('TUGU TEKNIK', e), e.stopPropagation())}
          onPointerOut={(e) => (clearHover(e), e.stopPropagation())}
          position={[61.33, 7.82, 22.06]}
          scale={0.56}
          onClick={(e) => (toggleZoom('TUGU TEKNIK'), e.stopPropagation())}
        >
          <mesh geometry={nodes.Mesh_2011.geometry} material={materials['default material.006']} />
          <mesh geometry={nodes.Mesh_2011_1.geometry} material={materials['0132_LightGray.004']} />
          <mesh geometry={nodes.Mesh_2011_2.geometry} material={materials['default material.006']} />
          <mesh geometry={nodes.Mesh_2011_3.geometry} material={materials['default material']} />
          <mesh geometry={nodes.Mesh_2011_4.geometry} material={materials['Color M09']} />
          <mesh geometry={nodes.Mesh_2011_5.geometry} material={materials['Color M06']} />
          <mesh geometry={nodes.Mesh_2011_6.geometry} material={materials['Field Square Tile']} />
          <mesh geometry={nodes.Mesh_2011_7.geometry} material={materials['Color M07']} />
          <mesh geometry={nodes.Mesh_2011_8.geometry} material={materials['Color M09.001']} />
          <mesh geometry={nodes.Mesh_2011_9.geometry} material={materials['Color M06.002']} />
          <mesh geometry={nodes.Mesh_2011_10.geometry} material={materials['Field Square Tile.001']} />
          <mesh geometry={nodes.Mesh_2011_11.geometry} material={materials['Color M07.002']} />
          <mesh geometry={nodes.Mesh_2011_12.geometry} material={materials['default material.006']} />
        </group>
        <mesh
          onPointerOver={(e) => (handleHover('DTAP', e), e.stopPropagation())}
          onPointerOut={(e) => (clearHover(e), e.stopPropagation())}
          geometry={nodes.DTAP_BAKE.geometry}
          material={materials.DTAP_BAKE}
          position={[-84.25, 7.79, -62.23]}
          rotation={[0, 0.04, 0]}
          scale={0.49}
          onClick={(e) => (toggleZoom('DTAP'), e.stopPropagation())}
        />
        <mesh
          onPointerOver={(e) => (handleHover('DTMI', e), e.stopPropagation())}
          onPointerOut={(e) => (clearHover(e), e.stopPropagation())}
          geometry={nodes.DTMI_BAKE.geometry}
          material={materials.DTMI_BAKE}
          position={[-101.63, 7.76, 54.57]}
          scale={0.49}
          onClick={(e) => (toggleZoom('DTMI'), e.stopPropagation())}
        />
        <mesh
          onPointerOver={(e) => (handleHover('DTSL', e), e.stopPropagation())}
          onPointerOut={(e) => (clearHover(e), e.stopPropagation())}
          geometry={nodes.DTSL_BAKE.geometry}
          material={materials.DTSL_BAKE}
          position={[41.34, 11.07, -52.67]}
          scale={0.49}
          onClick={(e) => (toggleZoom('DTSL'), e.stopPropagation())}
        />
        <mesh
          onPointerOver={(e) => (handleHover('ERIC', e), e.stopPropagation())}
          onPointerOut={(e) => (clearHover(e), e.stopPropagation())}
          geometry={nodes.ERIC_BAKE.geometry}
          material={materials.ERIC_BAKE}
          position={[108.55, 9.99, 10.4]}
          rotation={[0, 0.07, 0]}
          scale={0.35}
          onClick={(e) => (toggleZoom('ERIC'), e.stopPropagation())}
        />
        <mesh
          onPointerOver={(e) => (handleHover('DTGD', e), e.stopPropagation())}
          onPointerOut={(e) => (clearHover(e), e.stopPropagation())}
          geometry={nodes.DTGD_BAKE.geometry}
          material={materials.GEODESI_BAKE}
          position={[-36.33, 8.96, -76.66]}
          scale={0.49}
          onClick={(e) => (toggleZoom('DTGD'), e.stopPropagation())}
        />
        <mesh
          onPointerOver={(e) => (handleHover('DTGL', e), e.stopPropagation())}
          onPointerOut={(e) => (clearHover(e), e.stopPropagation())}
          geometry={nodes.DTGL_BAKE.geometry}
          material={materials.GEOLOGI_BAKE}
          position={[26.34, 8.98, 36.02]}
          scale={0.49}
          onClick={(e) => (toggleZoom('DTGL'), e.stopPropagation())}
        />
        <mesh
          onPointerOver={(e) => (handleHover('MASJID FT', e), e.stopPropagation())}
          onPointerOut={(e) => (clearHover(e), e.stopPropagation())}
          geometry={nodes.MUSTEK_BAKE.geometry}
          material={materials.MUSTEK_BAKE}
          position={[-58.2, 8.58, -33.63]}
          scale={0.49}
          onClick={(e) => (toggleZoom('MASJID FT'), e.stopPropagation())}
        />
        <mesh
          onPointerOver={(e) => (handleHover('PERPUSTAKAAN', e), e.stopPropagation())}
          onPointerOut={(e) => (clearHover(e), e.stopPropagation())}
          geometry={nodes.PUSTEK_BAKE.geometry}
          material={materials.PUSTEK_BAKE}
          position={[-18.1, 9.93, 41.7]}
          scale={0.49}
          onClick={(e) => (toggleZoom('PERPUSTAKAAN'), e.stopPropagation())}
        />
        <group position={[111.54, 6.39, 92.86]} rotation={[0, 0.15, 0]} scale={0.41}>
          <mesh geometry={nodes.Mesh_45001.geometry} material={materials['default material.061']} />
          <mesh geometry={nodes.Mesh_45001_1.geometry} material={materials['Color M00.007']} />
          <mesh geometry={nodes.Mesh_45001_2.geometry} material={materials['Translucent Glass Gray.023']} />
          <mesh geometry={nodes.Mesh_45001_3.geometry} material={materials['Material.045']} />
        </group>
      </group>
    </>
  )
}

useGLTF.preload('object/map-min.glb', '/draco/')

function SpriteHover(props: SpriteHoverProps) {
  const spriteRef = useRef<THREE.Group>(null)
  useFrame(() => {
    if (props.object && spriteRef.current) {
      spriteRef.current.position.x = props.object.position[0]
      spriteRef.current.position.z = props.object.position[2]
      spriteRef.current.position.y = 20
    }
  })

  return (
    <group ref={spriteRef} visible={false}>
      {/* <Html
        sprite
        transform
        position={[0, 0.2, 0]}
        style={{
          height: '200px',
          backgroundColor: 'white',
          width: '7px',
          position: 'absolute',
          zIndex: '-10',
        }}></Html> */}
      <Html
        sprite
        transform
        position={[0, 0.2, 0]}
        style={{
          background: 'white',
          fontSize: '128px',
          textAlign: 'center',
          padding: '10px 60px',
          display: props.object ? 'block' : 'none',
          zIndex: 10,
          border: 'black solid 4px',
        }}
      >
        {props.object ? props.object.name.replace(/\_/g, ' ') : null}
      </Html>
    </group>
  )
}
