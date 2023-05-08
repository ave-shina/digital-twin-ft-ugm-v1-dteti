import React, { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
import { MapInteractionCSS } from 'react-map-interaction'
import { useSelector } from 'react-redux'
const { Stage, Layer, Image, Circle } = require('react-konva')

function Map(props) {
  const { setCurrentScene, setOpenPanorama, mapInformation, mapImage, mapName, open, currentIndex } = props

  const map = []

  for (let i = 0; i < mapInformation.length; i++) {
    map.push({
      x: mapInformation[i].mapCoordinate[0],
      y: mapInformation[i].mapCoordinate[1],
      name: mapInformation[i].name,
      isCrooked: mapInformation[i].isCrooked,
    })
  }

  const navigation = useSelector((state) => state.navigation)

  const [image, setImage] = useState(null)

  useEffect(() => {
    const img = new window.Image()
    img.src = mapImage.url
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      setImage(img)
    }
  }, [])

  const handleMouseEnter = (e) => {
    // Set the cursor style to a pointer when the mouse is over the circle
    const container = e.target.getStage().container()
    container.style.cursor = 'pointer'
  }

  const handleMouseLeave = (e) => {
    // Reset the cursor style when the mouse leaves the circle
    const container = e.target.getStage().container()
    container.style.cursor = 'default'
  }

  const mapContainer = useRef(null)
  const mapRef = useRef(null)
  const [value, setValue] = useState(null)

  useEffect(() => {
    if (mapContainer.current) {
      const containerWidth = mapContainer.current.offsetWidth
      const mapWidth = mapRef.current.offsetWidth
      setValue({ scale: 1, translation: { x: (containerWidth - mapWidth) / 2, y: 0 } })
    }
  }, [open, currentIndex])

  return (
    <div
      className={clsx(
        'flex h-full w-full  bg-slate-200',
        navigation.theme === 'dark' ? ' bg-slate-700' : ' bg-slate-200',
      )}>
      <div className={clsx(' relative flex  w-full flex-col items-center justify-center')}>
        <div ref={mapContainer} className={clsx('flex h-[600px] w-full items-center justify-center overflow-hidden')}>
          <div
            className={clsx(
              ' absolute right-4 top-4 z-10 overflow-hidden rounded-md bg-black px-2 py-1 text-base text-white',
            )}>
            {mapName}
          </div>
          <MapInteractionCSS
            value={value}
            onChange={(value) => {
              setValue(value)
            }}>
            <div ref={mapRef} className={clsx('image-hotspot h-full w-full')}>
              <Stage width={mapImage.width} height={mapImage.width}>
                <Layer>
                  {image && <Image image={image} x={0} y={0} scaleX={1} scaleY={1} />}
                  {map.map((data, index) => (
                    <Circle
                      key={index}
                      x={data.x}
                      y={data.y}
                      radius={5}
                      fill={data.isCrooked == false || data.isCrooked == null ? 'blue' : 'red'}
                      cursor='pointer'
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      onClick={(area) => {
                        setCurrentScene(data.name)
                        setOpenPanorama(true)
                      }}
                      onTap={(area) => {
                        setCurrentScene(data.name)
                        setOpenPanorama(true)
                      }}
                    />
                  ))}
                </Layer>
              </Stage>
            </div>
          </MapInteractionCSS>
        </div>
      </div>
    </div>
  )
}

export default Map
