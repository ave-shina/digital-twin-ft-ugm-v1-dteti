import React, { useState, useEffect, useMemo } from 'react'
// Komponen Map dan panorama - dynamic import dengan ssr:false karena
// menggunakan Konva & Pannellum yang butuh window/document.
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('../Map/Map'), { ssr: false })
const Panorama = dynamic(() => import('../panorama/Panorama'), { ssr: false })

import clsx from 'clsx'

import { useAppSelector, useAppDispatch } from 'redux/hooks'
import { setMapTourMessage } from 'redux/navigation'

import Gallery from '../gallery/Gallery'

import type { SceneInformation, TourContentProps } from '../../types/components'
import { sanitizeHtml } from '@/utils/sanitize'
import { useSettings } from '@/context/SettingsContext'

export default function Tour({ tour, landmarksData }: TourContentProps) {
  // Digunakan untuk menentukan lokasi panorama yang dibuka
  const [currentScene, setCurrentScene] = useState<string | number | undefined>(0)
  const [openPanorama, setOpenPanorama] = useState(false)

  const navigation = useAppSelector((state) => state.navigation)
  const settings = useSettings()

  // Mengambil data - guard dengan optional chaining untuk hindari throw saat data belum siap.
  // Di-memo agar identitas stabil sebagai dependency efek (tidak berubah tiap render).
  const mapInformation = useMemo(
    () => tour.data?.attributes?.panoramaData?.[0]?.MapInformation ?? [],
    [tour],
  )
  const sceneInformation: SceneInformation[] = []
  for (let i = 0; i < mapInformation.length; i++) {
    sceneInformation.push({
      sceneName: mapInformation[i]?.name,
      scenePanoImg: mapInformation[i].mapImage.data.attributes,
      hotSpotsArr: mapInformation[i].panoramaCoordinate,
    })
  }

  const galleryDetail = tour.data?.attributes?.galleryDetail

  // Menentukan lokasi panorama awal
  useEffect(() => {
    if (mapInformation[0]?.name) {
      setCurrentScene(mapInformation[0].name)
    }
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
    {
      title: `Gallery`,
      id: 'gallery',
      show: true,
    },
  ]

  // Fungsi dropdown
  const [title, setTitle] = useState<{ state: number }>({ state: 1 })
  const [prevTitle, setPrevTitle] = useState<{ state: number }>({ state: 1 })
  const [open, setOpen] = useState(false)

  // Logika untuk menampilkan dan menyembunyikan dropdown.
  // open/prevTitle sengaja BUKAN dependency: setelah setPrevTitle efek akan
  // re-fire dan toggle ganda — deps lengkap justru merusak perilaku.
  useEffect(() => {
    if (title.state !== prevTitle.state) {
      setPrevTitle(title)
      setOpen(true)
    } else if (title.state === prevTitle.state) {
      setOpen(!open)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title])

  const dispatch = useAppDispatch()
  // Isi catatan dari Prismic (site_settings.catatan.tour) — titik merah/biru
  // dan ikon kamera berupa span label dari rich text.
  const Message = () => (
    <div className='mb-4 text-base leading-6 text-white'>
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
          )}
        >
          <svg width='12' height='12' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M21 21L1 1M21 1L1 21'
              className={clsx('  group-hover:stroke-2', ' stroke-black')}
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
      </div>

      <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(settings.catatan.tour) }} />
    </div>
  )
  // Konten utama
  function Content(content: string) {
    switch (content) {
      case 'description':
        return <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(tour.data.attributes.description) }} />
      case 'map':
        return (
          <div className='flex w-full flex-col'>
            <div
              className={clsx(
                'mb-4 flex w-full rounded-md border border-solid  bg-gray-300',
                navigation.theme === 'dark' ? ' border-white' : ' !border-black',
              )}
            >
              <Map
                open={open}
                currentIndex={title}
                mapInformation={mapInformation}
                openPanorama={openPanorama}
                mapName={tour.data.attributes.panoramaData[0].name}
                setOpenPanorama={setOpenPanorama}
                mapImage={tour.data.attributes.panoramaData[0].mapImage.data.attributes}
                setCurrentScene={setCurrentScene}
                Message={Message}
                landmarksData={landmarksData}
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
              )}
            >
              Mulai Jelajah
            </button>
          </div>
        )
      case 'gallery':
        return <Gallery galleryDetail={galleryDetail}></Gallery>
      default:
        return <></>
    }
  }

  return (
    <>
      {/* Komponen Modal Panorama */}
      {sceneInformation.length > 0 && (
        <Panorama
          sceneInformation={sceneInformation}
          openPanorama={openPanorama}
          setOpenPanorama={setOpenPanorama}
          currentScene={currentScene ?? 0}
          setCurrentScene={setCurrentScene}
        ></Panorama>
      )}

      <div
        className={clsx(
          'flex min-h-[calc(100vh-96px)]  w-full flex-col px-6 pb-8 pt-4 sm:px-[10%]',
          navigation.theme === 'dark' ? ' bg-[#121212]' : 'bg-white',
        )}
      >
        <h1
          className={clsx(
            '-m-2 pb-8  font-medium leading-none text-black',
            'text-5xl sm:text-6xl',
            navigation.theme === 'dark' ? '  text-white' : ' text-black',
          )}
        >
          {tour.data?.attributes?.name ?? 'Jelajah Teknik'}
        </h1>
        <div className={clsx('mb-8 flex h-full w-full flex-col  justify-center ')}>
          {section.map((item, index) => {
            // console.log('test', item.show === true)
            return (
              <>
                {item.show === true && (
                  <div
                    className={clsx(' mb-4 flex w-full flex-col  border-b border-solid border-gray-400 py-4 ')}
                    key={index}
                  >
                    <button
                      type='button'
                      aria-expanded={index === title.state && open}
                      className={clsx(
                        'mb-2 flex w-full cursor-pointer flex-row items-center justify-between text-left',
                      )}
                      onClick={() => {
                        setTitle({ state: index })
                      }}
                    >
                      <div
                        className={clsx(
                          'title text-2xl font-semibold ',
                          navigation.theme === 'dark' ? ' text-white' : ' text-black',
                        )}
                      >
                        {item.title}
                      </div>
                      <div className={clsx('logo')}>
                        {index === title.state && open ? (
                          <svg
                            width='16'
                            height='10'
                            viewBox='0 0 16 10'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              className={clsx(navigation.theme === 'dark' ? '  stroke-white' : '  stroke-black')}
                              d='M15 8.5L8 1.5L1 8.5'
                              stroke='black'
                              strokeWidth={2}
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                        ) : (
                          <svg
                            width='16'
                            height='10'
                            viewBox='0 0 16 10'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M15 1.5L8 8.5L1 1.5'
                              className={clsx(navigation.theme === 'dark' ? '  stroke-white' : '  stroke-black')}
                              strokeWidth={2}
                              strokeLinecap='round'
                              strokeLinejoin='round'
                            />
                          </svg>
                        )}
                      </div>
                    </button>

                    <div
                      className={clsx(
                        'answer h-full w-full py-2',
                        index === title.state && open ? 'flex' : 'hidden',
                        navigation.theme === 'dark' ? ' text-white' : ' text-black',
                      )}
                    >
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
