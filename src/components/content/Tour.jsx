import React, { useState, useEffect } from 'react'
// Komponen Map dan panorama
import Map from '../panorama/Map'
import ModalPanorama from '../panorama/ModalPanorama'

import clsx from 'clsx'
// Data utama untuk fitur Tour
import { TourData } from '../data/Tour'

import { useSelector } from 'react-redux'

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
                'solid mb-4 flex w-full rounded-md border border-solid  bg-gray-300',
                navigation.theme === 'dark' ? ' border-white' : ' border-black',
              )}>
              <Map
                open={open}
                currentIndex={title}
                mapInformation={mapInformation}
                openPanorama={openPanorama}
                mapName={TourData.data.attributes.panoramaData[0].name}
                setOpenPanorama={setOpenPanorama}
                mapImage={TourData.data.attributes.panoramaData[0].mapImage.data.attributes.formats.large}
                setCurrentScene={setCurrentScene}
              />
            </div>
            <p
              className={clsx(
                ' mb-4 text-base leading-8 text-black',
                navigation.theme === 'dark' ? ' text-white' : ' text-black',
              )}>
              Anda dapat Mulai jelajah Fakultas Teknik dengan menekan titik berbentuk lingkaran di atas atau dengan
              menekan tombol dibawah ini
            </p>
            <button
              onClick={() => {
                setOpenPanorama(true)
                setCurrentScene(mapInformation[0].name)
              }}
              className={clsx(
                'w-full cursor-pointer border border-solid py-2',

                navigation.theme === 'dark'
                  ? ' border-black  bg-white text-black  hover:border-white hover:bg-black hover:text-white'
                  : ' border-white bg-black text-white hover:border-black  hover:bg-white hover:text-black',
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
          'flex min-h-[calc(100vh-96px)]  w-full flex-col px-[10%] pb-8 pt-4',
          navigation.theme === 'dark' ? ' bg-black' : 'bg-white',
        )}>
        <h1
          className={clsx(
            '-m-2 pb-8  font-medium leading-none text-black',
            'text-6xl sm:text-8xl',
            navigation.theme === 'dark' ? '  text-white' : ' text-black',
          )}>
          Fakultas Teknik
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
