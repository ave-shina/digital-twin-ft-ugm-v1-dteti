import React, { useMemo, useCallback, useRef } from 'react'
import { Pannellum } from '@georgedrpg/pannellum-react-next'
import '@georgedrpg/pannellum-react-next/es/css/video-js.css'
import '@georgedrpg/pannellum-react-next/es/css/pannellum.css'
import '@georgedrpg/pannellum-react-next/es/css/style-textInfo.css'

import clsx from 'clsx'

import { useSelector } from 'react-redux'

export default function Panorama(props) {
  const { currentScene, setCurrentScene, setOpenPanorama, openPanorama, sceneInformation } = props

  // Current Scene = Lokasi panorama
  // Scene Information = semua informasi Panorama yang terdapat pada satu lantai di satu landmark

  const panImage = useRef(null)

  // Membuat Tombol untuk navigasi antar lokasi
  const hotspotIcon = useCallback((hotSpotDiv) => {
    const image = document.createElement('img')
    image.classList.add('image')
    image.setAttribute('width', '30')
    image.setAttribute('height', '30')
    image.setAttribute('src', 'https://img.icons8.com/material/4ac144/256/camera.png')
    hotSpotDiv.appendChild(image)
  }, [])

  // Mendapatkan data di setiap lantai di setiap landmark berdasarkan nama setiap panorama
  const sceneObject = useMemo(
    () => sceneInformation.find((item) => item.sceneName === currentScene),
    [sceneInformation, currentScene],
  )

  const navigation = useSelector((state) => state.navigation)

  // Memoize event handlers
  const handleClosePanorama = useCallback(() => {
    setOpenPanorama(false)
  }, [setOpenPanorama])

  // Memoize image URL transformation
  const imageUrl = useMemo(() => {
    return sceneObject?.scenePanoImg?.url?.replace(/\/upload\//, '/upload/w_4000,f_auto,q_auto/')
  }, [sceneObject?.scenePanoImg?.url])

  // Memoize hotspots with their click handlers
  const hotspotsWithHandlers = useMemo(() => {
    if (!sceneObject?.hotSpotsArr) return []
    return sceneObject.hotSpotsArr.map((hotSpot) => ({
      ...hotSpot,
      handleClick: (evt, name) => {
        setCurrentScene(hotSpot.transition)
      },
    }))
  }, [sceneObject?.hotSpotsArr, setCurrentScene])

  // Memoize theme classes
  const themeClasses = useMemo(
    () => ({
      modal: navigation.theme === 'dark' ? 'border-white bg-gray-950' : 'border-black bg-white',
      text: navigation.theme === 'dark' ? 'bg-[#121212] text-white' : 'bg-white text-black',
    }),
    [navigation.theme],
  )

  return (
    <div
      id='defaultModal'
      tabIndex='-1'
      aria-hidden='true'
      className={clsx(
        'fixed top-0 !h-full !w-screen items-center justify-center',
        openPanorama ? 'z-[99999999] !w-screen' : 'z-[-99999999] opacity-0',
      )}>
      <div
        onClick={handleClosePanorama}
        className='absolute top-0 flex !h-full !w-screen items-center justify-center bg-[#121212] bg-opacity-80'
      />
      <div className='absolute left-1/2 top-1/2 z-50 h-[95%] w-full max-w-[95%] -translate-x-1/2 -translate-y-1/2 sm:left-1/2 sm:h-[90%] sm:max-w-[85%]'>
        <div className={clsx('relative h-full rounded-lg border-2 shadow', themeClasses.modal)}>
          <div className='relative flex h-full w-full items-center justify-center p-2 sm:p-4'>
            <p className={clsx('absolute top-3.5 z-10 px-4 py-2 text-xl', themeClasses.text)}>{currentScene}</p>
            <button
              onClick={handleClosePanorama}
              className='group absolute right-4 top-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-solid border-black bg-white sm:right-6 sm:top-6 sm:h-10 sm:w-10 stroke-black'>
              <svg width='22' height='22' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M21 21L1 1M21 1L1 21'
                  className='group-hover:stroke-2 stroke-black'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>
            <div className='flex h-full w-full flex-col items-center justify-center'>
              {sceneObject && imageUrl && (
                <Pannellum
                  hfov={130}
                  ref={panImage}
                  width='100%'
                  height='100%'
                  pitch={10}
                  yaw={180}
                  image={imageUrl}
                  autoLoad
                  showZoomCtrl={false}>
                  {hotspotsWithHandlers.map((hotSpot, index) => (
                    <Pannellum.Hotspot
                      type='custom'
                      key={`${hotSpot.pitch}-${hotSpot.yaw}-${index}`}
                      pitch={hotSpot.pitch}
                      yaw={hotSpot.yaw}
                      tooltip={hotspotIcon}
                      handleClick={hotSpot.handleClick}
                      name='image info'
                    />
                  ))}
                </Pannellum>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
