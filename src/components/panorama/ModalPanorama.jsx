import React, { useEffect, useState, useRef } from 'react'

const { Pannellum } = require('@georgedrpg/pannellum-react-next')
import '@georgedrpg/pannellum-react-next/es/css/video-js.css'
import '@georgedrpg/pannellum-react-next/es/css/pannellum.css'
import '@georgedrpg/pannellum-react-next/es/css/style-textInfo.css'

import clsx from 'clsx'

import { useSelector } from 'react-redux'

export default function ModalPanorama(props) {
  const { currentScene, setCurrentScene, setOpenPanorama, openPanorama, sceneInformation, title } = props

  // Current Scene = Lokasi panorama
  // Scene Information = semua informasi Panorama yang terdapat pada satu lantai di satu landmark

  // Diguunakan untuk meangetahui letak mouse di panorama
  const [yaw, setYaw] = useState(0)
  const [pitch, setPitch] = useState(0)
  const panImage = useRef(null)

  // Membuat Tombol untuk navigasi antar lokasi
  const hotspotIcon = (hotSpotDiv) => {
    const image = document.createElement('img')
    image.classList.add('image')
    image.setAttribute('width', '30')
    image.setAttribute('height', '30')
    image.setAttribute('src', 'https://img.icons8.com/material/4ac144/256/camera.png')
    hotSpotDiv.appendChild(image)
  }

  // Mendapatkan data di setiap lantai di setiap landmark berdasarkan nama setiap panorama
  const [sceneObject, setSceneObject] = useState(false)
  useEffect(() => {
    setSceneObject(sceneInformation.find((item) => item.sceneName === currentScene))
  }, [currentScene, title])

  const navigation = useSelector((state) => state.navigation)

  return (
    <div
      id='defaultModal'
      tabindex='-1'
      aria-hidden='true'
      className={clsx(
        'fixed top-0   !h-full !w-screen  items-center justify-center ',
        openPanorama ? 'z-[99999999] !w-screen ' : 'z-[-99999999] opacity-0',
      )}>
      <div
        onClick={() => {
          setOpenPanorama(false)
        }}
        className={clsx(
          'absolute top-0  flex !h-full !w-screen  items-center justify-center bg-[#121212]  bg-opacity-80',
        )}></div>
      <div
        className={clsx(
          ' absolute left-1/2 top-1/2 z-50 h-[95%] w-full max-w-[95%] -translate-x-1/2 -translate-y-1/2 sm:left-1/2 sm:h-[90%] sm:max-w-[85%]',
        )}>
        {/* <!-- Modal content --> */}
        <div
          className={clsx(
            'relative  h-full rounded-lg border-2 shadow ',
            navigation.theme === 'dark' ? ' border-white  bg-gray-950' : 'border-black  bg-white ',
          )}>
          {/* <!-- Modal body --> */}
          <div className={clsx('relative flex h-full w-full items-center justify-center p-2 sm:p-4')}>
            {/* Menampilkan Lokasi Kursor */}
            {/* <p
              className={clsx(
                'absolute  bottom-3.5 left-1/2 z-50 -translate-x-1/2  px-4 py-2 ',
                navigation.theme === 'dark' ? 'bg-[#121212]   text-white' : 'bg-white text-black',
              )}>
              pitch: {pitch}, yaw: {yaw}, transition:{' '}
            </p> */}
            <p
              className={clsx(
                'absolute top-3.5 z-10 px-4 py-2 text-xl',
                navigation.theme === 'dark' ? 'bg-[#121212]   text-white' : 'bg-white text-black',
              )}>
              {currentScene}
            </p>
            <button
              onClick={() => {
                setOpenPanorama(false)
              }}
              className={clsx(
                'group  absolute right-4 top-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-solid border-black bg-white sm:right-6 sm:top-6 sm:h-10 sm:w-10 ',
                ' stroke-black',
              )}>
              <svg width='22' height='22' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M21 21L1 1M21 1L1 21'
                  className={clsx('  group-hover:stroke-2', ' stroke-black')}
                  stroke-linecap='round'
                  stroke-linejoin='round'
                />
              </svg>
            </button>
            <div className={clsx('flex h-full w-full flex-col items-center justify-center')}>
              {sceneObject && (
                <Pannellum
                  hfov={130}
                  ref={panImage}
                  width='100%'
                  height='100%'
                  pitch={10}
                  yaw={180}
                  image={
                    sceneObject && sceneObject?.scenePanoImg.url?.replace(/\/upload\//, '/upload/w_4000,f_auto,q_auto/')
                  }
                  autoLoad
                  showZoomCtrl={false}
                  onMouseup={(event) => {
                    setPitch(panImage.current.getViewer().mouseEventToCoords(event)[0])
                    setYaw(panImage.current.getViewer().mouseEventToCoords(event)[1])
                  }}>
                  {sceneObject?.hotSpotsArr?.map((hotSpot, index) => {
                    // console.log(hotSpot)
                    return (
                      <Pannellum.Hotspot
                        type='custom'
                        key={index}
                        pitch={hotSpot.pitch}
                        yaw={hotSpot.yaw}
                        tooltip={hotspotIcon}
                        handleClick={(evt, name) => {
                          setCurrentScene(hotSpot.transition)
                        }}
                        name='image info'
                      />
                    )
                  })}
                </Pannellum>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
