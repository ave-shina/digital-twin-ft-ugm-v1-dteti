import React, { useMemo } from 'react'
import * as THREE from 'three'
import type { GrassProps } from '../../types/components'

export default function Grass({
  position = [0, 2, 0],
  scale = [600, 600, 1],
  rotation = [-Math.PI / 2, 0, 0],
}: GrassProps) {
  // Create grass texture and displacement map
  const { grassTexture, displacementMap } = useMemo(() => {
    // Road configuration
    const roadWidth = 25 // Road width in pixels
    const centerX = 256
    const centerY = 256

    // Create grass texture
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    // Base grass color with subtle variation
    const baseGradient = ctx.createLinearGradient(0, 0, 512, 512)
    baseGradient.addColorStop(0, '#9CA982')
    baseGradient.addColorStop(0.3, '#9CA982')
    baseGradient.addColorStop(0.6, '#9CA982')
    baseGradient.addColorStop(1, '#9CA982')
    ctx.fillStyle = baseGradient
    ctx.fillRect(0, 0, 512, 512)

    // Add organic grass clumps and patches
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * 512
      const y = Math.random() * 512
      const size = Math.random() * 30 + 10
      const alpha = Math.random() * 0.3 + 0.1

      const clumpGradient = ctx.createRadialGradient(x, y, 0, x, y, size)
      clumpGradient.addColorStop(0, `rgba(147, 184, 100, ${alpha})`)
      clumpGradient.addColorStop(1, `rgba(133, 168, 84, 0)`)
      ctx.fillStyle = clumpGradient
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }

    // Add individual grass blades with more natural appearance
    ctx.strokeStyle = '#9CA982'
    ctx.lineWidth = 1
    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * 512
      const y = Math.random() * 512
      const angle = Math.random() * Math.PI * 2
      const length = Math.random() * 12 + 3
      const width = Math.random() * 0.5 + 0.5

      ctx.lineWidth = width
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + Math.cos(angle) * length, y + Math.sin(angle) * length)
      ctx.stroke()
    }

    // Add darker grass patches for depth
    ctx.fillStyle = '#658040'
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * 512
      const y = Math.random() * 512
      const radius = Math.random() * 8 + 2
      const alpha = Math.random() * 0.4 + 0.2

      ctx.globalAlpha = alpha
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1

    // Add lighter highlights for texture
    ctx.fillStyle = '#9CA982'
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * 512
      const y = Math.random() * 512
      const radius = Math.random() * 2 + 0.5
      const alpha = Math.random() * 0.3 + 0.1

      ctx.globalAlpha = alpha
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1

    // Add road paths
    // Draw horizontal road (main path)
    ctx.fillStyle = '#2a2a2a' // Dark asphalt base
    ctx.fillRect(0, centerY - roadWidth / 2, 512, roadWidth)

    // Draw vertical road (crossing path)
    ctx.fillRect(centerX - roadWidth / 2, 0, roadWidth, 512)

    // Add road texture variation (lighter/darker patches for realism)
    ctx.fillStyle = '#333333'
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 512
      const y = centerY + (Math.random() - 0.5) * roadWidth
      const size = Math.random() * 15 + 5
      const alpha = Math.random() * 0.3 + 0.1

      ctx.globalAlpha = alpha
      ctx.fillRect(x - size / 2, y - size / 2, size, size)
    }

    for (let i = 0; i < 50; i++) {
      const x = centerX + (Math.random() - 0.5) * roadWidth
      const y = Math.random() * 512
      const size = Math.random() * 15 + 5
      const alpha = Math.random() * 0.3 + 0.1

      ctx.globalAlpha = alpha
      ctx.fillRect(x - size / 2, y - size / 2, size, size)
    }
    ctx.globalAlpha = 1

    // Add road markings (center lines)
    ctx.strokeStyle = '#ffff00' // Yellow center line
    ctx.lineWidth = 2
    ctx.setLineDash([20, 15]) // Dashed line pattern

    // Horizontal road center line
    ctx.beginPath()
    ctx.moveTo(0, centerY)
    ctx.lineTo(512, centerY)
    ctx.stroke()

    // Vertical road center line
    ctx.beginPath()
    ctx.moveTo(centerX, 0)
    ctx.lineTo(centerX, 512)
    ctx.stroke()

    ctx.setLineDash([]) // Reset line dash

    // Add road edge lines (white)
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 1.5

    // Horizontal road edges
    ctx.beginPath()
    ctx.moveTo(0, centerY - roadWidth / 2)
    ctx.lineTo(512, centerY - roadWidth / 2)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(0, centerY + roadWidth / 2)
    ctx.lineTo(512, centerY + roadWidth / 2)
    ctx.stroke()

    // Vertical road edges
    ctx.beginPath()
    ctx.moveTo(centerX - roadWidth / 2, 0)
    ctx.lineTo(centerX - roadWidth / 2, 512)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(centerX + roadWidth / 2, 0)
    ctx.lineTo(centerX + roadWidth / 2, 512)
    ctx.stroke()

    const grassTex = new THREE.CanvasTexture(canvas)
    grassTex.wrapS = THREE.RepeatWrapping
    grassTex.wrapT = THREE.RepeatWrapping
    grassTex.repeat.set(20, 20)

    // Create displacement map for contour
    const dispCanvas = document.createElement('canvas')
    dispCanvas.width = 512
    dispCanvas.height = 512
    const dispCtx = dispCanvas.getContext('2d') as CanvasRenderingContext2D

    // Create noise-like pattern for displacement
    const imageData = dispCtx.createImageData(512, 512)
    const data = imageData.data

    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % 512
      const y = Math.floor(i / 4 / 512)

      // Check if pixel is on the road (flatter surface)
      const isOnHorizontalRoad = Math.abs(y - centerY) < roadWidth / 2
      const isOnVerticalRoad = Math.abs(x - centerX) < roadWidth / 2
      const isOnRoad = isOnHorizontalRoad || isOnVerticalRoad

      if (isOnRoad) {
        // Road should be flatter (lower displacement value)
        const roadNoise = Math.random() * 0.1 // Minimal variation for road
        const value = Math.floor((roadNoise + 0.4) * 255) // Lower base value for flat road
        data[i] = value // R
        data[i + 1] = value // G
        data[i + 2] = value // B
        data[i + 3] = 255 // A
      } else {
        // Create Perlin-like noise pattern for grass
        const noise =
          Math.sin(x * 0.1) * Math.cos(y * 0.1) * Math.sin(x * 0.05 + y * 0.05) * Math.cos(x * 0.02 + y * 0.02)
        const value = Math.floor((noise + 1) * 0.5 * 255)

        data[i] = value // R
        data[i + 1] = value // G
        data[i + 2] = value // B
        data[i + 3] = 255 // A
      }
    }

    dispCtx.putImageData(imageData, 0, 0)

    const dispMap = new THREE.CanvasTexture(dispCanvas)
    dispMap.wrapS = THREE.RepeatWrapping
    dispMap.wrapT = THREE.RepeatWrapping
    dispMap.repeat.set(20, 20)

    return { grassTexture: grassTex, displacementMap: dispMap }
  }, [])

  return (
    <mesh rotation={rotation} position={position} scale={scale}>
      <planeGeometry args={[1, 1, 64, 64]} />
      <meshStandardMaterial
        map={grassTexture}
        displacementMap={displacementMap}
        displacementScale={0.5}
        color='#7a9a4a'
        transparent
        opacity={1}
        roughness={0.9}
        metalness={0.0}
      />
    </mesh>
  )
}
