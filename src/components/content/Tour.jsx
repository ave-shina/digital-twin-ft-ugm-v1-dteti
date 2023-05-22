import React, { useState, useEffect } from 'react'
// Komponen Map dan panorama
import Map from '../panorama/Map'
import ModalPanorama from '../panorama/ModalPanorama'

import clsx from 'clsx'
// Data utama untuk fitur Tour
import { TourData } from '../data/Tour'

import { useSelector, useDispatch } from 'react-redux'
import { setMapTourMessage } from 'redux/navigation'

import Image from 'next/image'

export default function Tour() {
  // Digunakan untuk menentukan lokasi panorama yang dibuka
  const [currentScene, setCurrentScene] = useState(0)
  const [openPanorama, setOpenPanorama] = useState(false)

  const navigation = useSelector((state) => state.navigation)

  // Mengambil data
  const mapInformation = TourData.data?.attributes?.panoramaData[0].MapInformation
  const sceneInformation = []
  for (let i = 0; i < mapInformation.length; i++) {
    sceneInformation.push({
      sceneName: mapInformation[i]?.name,
      scenePanoImg: mapInformation[i].mapImage.data.attributes,
      hotSpotsArr: mapInformation[i].panoramaCoordinate,
    })
  }

  // Menentukan lokasi panorama awal
  useEffect(() => {
    setCurrentScene(mapInformation[0].name)
  }, [mapInformation])

  // konten apa saja yang terdapat pada fitur tour
  const section = [
    {
      title: `Tentang Fakultas Teknik`,
      id: 'description',
      show: true,
    },
    {
      title: `Jelajah `,
      id: 'map',
      show: true,
    },
  ]

  // Fungsi dropdown
  const [title, setTitle] = useState({ state: 1 })
  const [prevTitle, setPrevTitle] = useState({ state: 1 })
  const [open, setOpen] = useState(false)

  // Logika untuk menampilkan dan menyembunyikan dropdown
  useEffect(() => {
    if (title.state !== prevTitle.state) {
      setPrevTitle(title)
      setOpen(true)
    } else if (title.state === prevTitle.state) {
      setOpen(!open)
    }
  }, [title])

  const dispatch = useDispatch()
  const Message = () => (
    <p className={clsx('white mb-4 text-base leading-6 text-white')}>
      <div className=' flex w-full flex-row justify-between'>
        {' '}
        <span> Catatan:</span>
        <button
          onClick={() => {
            dispatch(setMapTourMessage(false))
          }}
          className={clsx(
            'group  flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-solid border-black bg-white sm:right-6 sm:top-6 sm:h-6 sm:w-6 ',
            ' stroke-black',
          )}>
          <svg width='12' height='12' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M21 21L1 1M21 1L1 21'
              className={clsx('  group-hover:stroke-2', ' stroke-black')}
              stroke-linecap='round'
              stroke-linejoin='round'
            />
          </svg>
        </button>
      </div>

      <p>
        Anda dapat memulai penjelajahan Fakultas Teknik dengan menekan titik berbentuk lingkaran pada denah tersebut.
        Lingkaran merah <span className='mx-1 inline-block h-2 w-2 rounded-full bg-red-500'></span> akan mengarahkan ke
        halaman detail bangunan tersebut, sementara lingkaran biru{' '}
        <span className='mx-1 inline-block h-2 w-2 rounded-full bg-blue-600'></span> akan menampilkan panorama
        lingkungan di sekitar titik tersebut. Anda juga bisa memulai penjelajahan dengan menekan tombol di bawah ini.
        Selanjutnya, pada tampilan panorama akan ditampilkan dengan adanya simbol berbentuk kamera{' '}
        <span className=' relative -bottom-1 inline-block h-4 w-4'>
          <Image
            src='https://img.icons8.com/material/4ac144/256/camera.png'
            alt='logo-teknik-outline'
            width={100}
            height={100}
            className={clsx('h-full w-full')}
          />
        </span>
        . Simbol ini akan membantu Anda menavigasi dan berpindah lokasi di dalam panorama.Mari kita jelajahi bersama!
      </p>
    </p>
  )
  // Konten utama
  function Content(content) {
    switch (content) {
      case 'description':
        return <div dangerouslySetInnerHTML={{ __html: TourData.data.attributes.description }} />
      case 'map':
        return (
          <div className='flex w-full flex-col'>
            <div
              className={clsx(
                'mb-4 flex w-full rounded-md border border-solid  bg-gray-300',
                navigation.theme === 'dark' ? ' border-white' : ' !border-black',
              )}>
              <Map
                open={open}
                currentIndex={title}
                mapInformation={mapInformation}
                openPanorama={openPanorama}
                mapName={TourData.data.attributes.panoramaData[0].name}
                setOpenPanorama={setOpenPanorama}
                mapImage={TourData.data.attributes.panoramaData[0].mapImage.data.attributes}
                setCurrentScene={setCurrentScene}
                Message={Message}
              />
            </div>

            <button
              onClick={() => {
                setOpenPanorama(true)
                setCurrentScene(mapInformation[0].name)
              }}
              className={clsx(
                'w-full cursor-pointer border border-solid py-2',

                navigation.theme === 'dark'
                  ? ' border-black  bg-white text-black  hover:border-white hover:bg-[#121212] hover:text-white'
                  : ' border-white bg-[#121212] text-white hover:border-black  hover:bg-white hover:text-black',
              )}>
              Mulai Jelajah
            </button>
          </div>
        )
      default:
        return <></>
    }
  }

  return (
    <>
      {/* Komponen Modal Panorama */}
      {sceneInformation.length > 0 && (
        <ModalPanorama
          sceneInformation={sceneInformation}
          openPanorama={openPanorama}
          setOpenPanorama={setOpenPanorama}
          currentScene={currentScene}
          setCurrentScene={setCurrentScene}></ModalPanorama>
      )}

      <div
        className={clsx(
          'flex min-h-[calc(100vh-96px)]  w-full flex-col px-6 pb-8 pt-4 sm:px-[10%]',
          navigation.theme === 'dark' ? ' bg-[#121212]' : 'bg-white',
        )}>
        <h1
          className={clsx(
            '-m-2 pb-8  font-medium leading-none text-black',
            'text-6xl sm:text-8xl',
            navigation.theme === 'dark' ? '  text-white' : ' text-black',
          )}>
          Jelajah Teknik
        </h1>
        <div className={clsx('mb-8 flex h-full w-full flex-col  justify-center ')}>
          {section.map((item, index) => {
            // console.log('test', item.show === true)
            return (
              <>
                {item.show === true && (
                  <div
                    className={clsx(' mb-4 flex w-full flex-col  border-b border-solid border-gray-400 py-4 ')}
                    key={index}>
                    <div
                      className={clsx('mb-2 flex cursor-pointer flex-row items-center justify-between')}
                      onClick={() => {
                        setTitle({ state: index })
                      }}>
                      <div
                        className={clsx(
                          'title text-2xl font-semibold ',
                          navigation.theme === 'dark' ? ' text-white' : ' text-black',
                        )}>
                        {item.title}
                      </div>
                      <div className={clsx('logo')}>
                        {index === title.state && open ? (
                          <svg
                            width='16'
                            height='10'
                            viewBox='0 0 16 10'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'>
                            <path
                              className={clsx(navigation.theme === 'dark' ? '  stroke-white' : '  stroke-black')}
                              d='M15 8.5L8 1.5L1 8.5'
                              stroke='black'
                              stroke-width='2'
                              stroke-linecap='round'
                              stroke-linejoin='round'
                            />
                          </svg>
                        ) : (
                          <svg
                            width='16'
                            height='10'
                            viewBox='0 0 16 10'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'>
                            <path
                              d='M15 1.5L8 8.5L1 1.5'
                              className={clsx(navigation.theme === 'dark' ? '  stroke-white' : '  stroke-black')}
                              stroke-width='2'
                              stroke-linecap='round'
                              stroke-linejoin='round'
                            />
                          </svg>
                        )}
                      </div>
                    </div>

                    <div
                      className={clsx(
                        'answer h-full w-full py-2',
                        index === title.state && open ? 'flex' : 'hidden',
                        navigation.theme === 'dark' ? ' text-white' : ' text-black',
                      )}>
                      {Content(item.id)}
                    </div>
                  </div>
                )}
              </>
            )
          })}
        </div>
      </div>
    </>
  )
}
