import React, { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'

// Komponen Peta untuk menggeser dan berinterkasi dengan peta
import { MapInteractionCSS } from 'react-map-interaction'
const { Stage, Layer, Image, Circle } = require('react-konva')

import { useSelector, useDispatch } from 'react-redux'
import { toggleLocation, toggleContent, setMapTourMessage, setMapLandmarkMessage } from 'redux/navigation'

import { useRouter } from 'next/router'
import { Landmarks } from '../data/Landamarks'

function Map(props, children) {
  const router = useRouter()
  const { setCurrentScene, setOpenPanorama, mapInformation, mapImage, mapName, open, currentIndex, Message } = props
  // set Current Scen digunakan untuk merubah Tampilan Panorama
  // Map Information = Semua titik lokasi dalam satu map
  // Map Image = Gambar Peta

  // Deklarasi Lokasi titik panorama
  const map = []

  // const [landmarksData, setLandmarksData] = useState(null)
  // useEffect(() => {
  //   async function fetchLandmarksData() {
  //     const response = await fetch('http://localhost:1337/api/landmarks?populate=deep')
  //     const data = await response.json()
  //     setLandmarksData(data)
  //   }
  //   fetchLandmarksData()
  // }, [])
  // Deklarasi lokasi titik panorama ketika di halaman tour
  const mapTour = []
  for (let i = 0; i < Landmarks.data.length; i++) {
    mapTour.push({
      name: Landmarks.data[i].attributes.objectName,
      position: Landmarks.data[i].attributes.mapCoordinate,
      isRoute: false,
    })
  }

  const navigation = useSelector((state) => state.navigation)
  for (let i = 0; i < mapInformation.length; i++) {
    map.push({
      x: mapInformation[i].mapCoordinate[0],
      y: mapInformation[i].mapCoordinate[1],
      name: mapInformation[i].name,
      isCrooked: mapInformation[i].isCrooked,
      isRoute: true,
    })
  }

  // Memuat Image Peta
  const [image, setImage] = useState(null)
  useEffect(() => {
    const img = new window.Image()
    img.src = mapImage.url.replace(/\/upload\//, '/upload/w_1000,f_auto,q_auto/')
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      setImage(img)
    }
  }, [])

  // Digunakan untuk menengahkan peta ketika di load
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

  // Efek ketika hover titik di peta
  const [circleName, setcircleName] = useState(mapInformation[0]?.name ? mapInformation[0].name : '')
  const handleMouseEnter = (e, name) => {
    const container = e.target.getStage().container()
    container.style.cursor = 'pointer'
    setcircleName(name)
  }
  const handleMouseLeave = (e, name) => {
    const container = e.target.getStage().container()
    container.style.cursor = 'default'
    setcircleName(name)
  }

  // Logika untuk membuka panorama atau membuka lokasi landmark
  const dispatch = useDispatch()
  function handleClick(isRoute, name) {
    if (isRoute) {
      setCurrentScene(name)
      setOpenPanorama(true)
    } else {
      dispatch(toggleContent(''))
      dispatch(toggleContent('landmark'))
      dispatch(toggleLocation(name))
      window.scrollTo(0, 0)
      router.push(
        {
          pathname: '/',
          query: { content: 'landmark', location: name },
        },
        `/landmark?location=${name}`,
        { shallow: true },
      )
    }
  }

  return (
    <div
      className={clsx(
        'flex h-full w-full  bg-slate-200',
        navigation.theme === 'dark' ? ' bg-slate-700' : ' bg-slate-200',
      )}>
      <div className={clsx(' relative flex  w-full flex-col items-center justify-center')}>
        <div ref={mapContainer} className={clsx('flex h-[550px] w-full items-center justify-center overflow-hidden')}>
          <div className='absolute left-4 top-4 z-10 overflow-hidden rounded-md bg-black px-2 py-1 text-base text-white'>
            {' '}
            {circleName}
          </div>
          <div
            className={clsx(
              'absolute right-4 top-4  z-10 overflow-hidden rounded-md bg-black px-2 py-1 text-base text-white',
            )}>
            {mapName}
          </div>

          {navigation.content == 'tour' && (
            <div
              onClick={() => {
                !navigation.mapTourMessage && dispatch(setMapTourMessage(true))
              }}
              className={clsx(
                !navigation.mapTourMessage ? ' left-4 cursor-pointer' : 'inset-x-4',
                'absolute  bottom-4  z-10 overflow-hidden rounded-md bg-black px-2 py-1 text-base text-white',
              )}>
              {!navigation.mapTourMessage ? (
                <button className='my-1 flex cursor-pointer items-center justify-center'>
                  <svg width='18' height='18' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M15.684 11.1L14.604 12.204C13.74 13.068 13.2 13.8 13.2 15.6H10.8V15C10.8 13.668 11.34 12.468 12.204 11.604L13.692 10.092C14.136 9.66 14.4 9.06 14.4 8.4C14.4 7.76348 14.1471 7.15303 13.6971 6.70294C13.247 6.25286 12.6365 6 12 6C11.3635 6 10.753 6.25286 10.3029 6.70294C9.85286 7.15303 9.6 7.76348 9.6 8.4H7.2C7.2 7.12696 7.70571 5.90606 8.60589 5.00589C9.50606 4.10571 10.727 3.6 12 3.6C13.273 3.6 14.4939 4.10571 15.3941 5.00589C16.2943 5.90606 16.8 7.12696 16.8 8.4C16.7983 9.41189 16.3972 10.3822 15.684 11.1ZM13.2 20.4H10.8V18H13.2M12 0C10.4241 0 8.86371 0.310389 7.4078 0.913446C5.95189 1.5165 4.62902 2.40042 3.51472 3.51472C1.26428 5.76516 0 8.8174 0 12C0 15.1826 1.26428 18.2348 3.51472 20.4853C4.62902 21.5996 5.95189 22.4835 7.4078 23.0866C8.86371 23.6896 10.4241 24 12 24C15.1826 24 18.2348 22.7357 20.4853 20.4853C22.7357 18.2348 24 15.1826 24 12C24 5.364 18.6 0 12 0Z'
                      className={clsx(' fill-white group-hover:fill-black')}
                    />
                  </svg>
                </button>
              ) : (
                <Message></Message>
              )}
            </div>
          )}

          <MapInteractionCSS
            value={value}
            onChange={(value) => {
              setValue(value)
            }}>
            <div ref={mapRef} className={clsx('image-hotspot h-full w-full')}>
              <Stage width={mapImage.formats.large.width} height={mapImage.formats.large.height}>
                <Layer>
                  {image && <Image image={image} x={0} y={0} scaleX={1} scaleY={1} />}

                  {router.query.content == 'tour' &&
                    mapTour.map((data, index) => (
                      <Circle
                        key={index}
                        x={data.position[0]}
                        y={data.position[1]}
                        radius={9}
                        fill={'red'}
                        cursor='pointer'
                        onMouseEnter={(e) => {
                          handleMouseEnter(e, data.name)
                        }}
                        onMouseLeave={(e) => {
                          handleMouseLeave(e, data.name)
                        }}
                        onClick={(e) => {
                          handleClick(data.isRoute, data.name)
                          handleMouseEnter(e, data.name)
                        }}
                        onTap={(e) => {
                          handleClick(data.isRoute, data.name)
                          handleMouseEnter(e, data.name)
                        }}
                      />
                    ))}

                  {map.map((data, index) => (
                    <Circle
                      key={index}
                      x={data.x}
                      y={data.y}
                      radius={6}
                      fill={'blue'}
                      cursor='pointer'
                      onMouseEnter={(e) => {
                        handleMouseEnter(e, data.name)
                      }}
                      onMouseLeave={(e) => {
                        handleMouseLeave(e, data.name)
                      }}
                      onClick={(e) => {
                        handleClick(data.isRoute, data.name)
                        handleMouseEnter(e, data.name)
                      }}
                      onTap={(e) => {
                        handleClick(data.isRoute, data.name)
                        handleMouseEnter(e, data.name)
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
