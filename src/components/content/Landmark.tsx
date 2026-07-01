import React, { useState, useEffect, useRef } from 'react'
// Dynamic import untuk Komponen Map dan panorama - butuh window (Konva/Pannellum).
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('../Map/Map'), { ssr: false })
const Panorama = dynamic(() => import('../panorama/Panorama'), { ssr: false })

import clsx from 'clsx'

import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

SwiperCore.use([Navigation, Pagination])

import { Landmarks } from '../data/Landmarks'
import Gallery from '../gallery/Gallery'
import Navbar from './Navbar'

import { useAppSelector, useAppDispatch } from 'redux/hooks'
import { setMapLandmarkMessage } from 'redux/navigation'

import Image from 'next/image'
import type { SceneInformation } from '../../types/components'
import { sanitizeHtml } from '@/utils/sanitize'

export default function Landmark() {
  const navigation = useAppSelector((state) => state.navigation)

  const [prevEl, setPrevEl] = useState<HTMLElement | null>(null)
  const [nextEl, setNextEl] = useState<HTMLElement | null>(null)

  // Mencari data landmark berdasarkan lokasi sesuai dengan objectName
  const data = Landmarks.data.find((item) => item.attributes.objectName === navigation.location)

  // Informasi mengenai Map
  const mapDetail = data?.attributes?.mapDetail ?? []
  // Informasi mengenai galeri
  const galleryDetail = data?.attributes?.galleryDetail ?? []

  //  Menentukan Map mana yang dibuka, berhubungan dengan swiper
  const [currentMap, setCurrentMap] = useState(0)
  // Digunakan untuk menentukan lokasi panorama yang dibuka
  const [openPanorama, setOpenPanorama] = useState(false)
  const [currentScene, setCurrentScene] = useState<string | number | undefined>(
    data?.attributes?.mapDetail[currentMap]?.MapInformation[0]?.name,
  )

  // Mengambil data Map yang tampil
  const mapInformation = data?.attributes?.mapDetail[currentMap]?.MapInformation
    ? data?.attributes?.mapDetail[currentMap]?.MapInformation
    : []

  // Mengambil data Panorama yang tampil
  const sceneInformation: SceneInformation[] = []
  for (let i = 0; i < mapInformation.length; i++) {
    sceneInformation.push({
      sceneName: mapInformation[i]?.name,
      scenePanoImg:
        mapInformation[i]?.mapImage?.data?.attributes !== null && mapInformation[i]?.mapImage?.data?.attributes !== undefined
          ? mapInformation[i].mapImage.data.attributes
          : null,
      hotSpotsArr: mapInformation[i].panoramaCoordinate,
    })
  }

  // Menentukan lokasi panorama awal
  useEffect(() => {
    setCurrentScene(mapInformation[0] ? mapInformation[0].name : 0)
  }, [currentMap])

  // konten apa saja yang terdapat pada fitur landmark
  const section = [
    {
      title: `Tentang ${data?.attributes?.name ?? ''}`,
      id: 'description',
      show: data?.attributes?.isDescription ?? false,
    },
    {
      title: `Jelajah `,
      id: 'map',
      show: data?.attributes?.isMap ?? false,
    },
    {
      title: `Gallery`,
      id: 'gallery',
      show: data?.attributes?.isGallery ?? false,
    },
  ]

  // Fungsi dropdown
  const [title, setTitle] = useState<{ state: number }>({ state: 1 })
  const [prevTitle, setPrevTitle] = useState<{ state: number }>({ state: 1 })
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

  const dispatch = useAppDispatch()
  const Message = () => (
    <p className='mb-4 text-base leading-6 text-white'>
      <div className=' flex w-full flex-row justify-between'>
        {' '}
        <span> Catatan:</span>
        <button
          onClick={() => {
            dispatch(setMapLandmarkMessage(false))
          }}
          className={clsx(
            'group  flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-solid border-black bg-white sm:right-6 sm:top-6 sm:h-6 sm:w-6 ',
            ' stroke-black',
          )}>
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
      <p>
        Anda dapat memulai penjelajahan dengan menekan titik berbentuk lingkaran pada denah tersebut. lingkaran biru{' '}
        <span className='mx-1 inline-block h-2 w-2 rounded-full bg-blue-600'></span>
        akan menampilkan panorama lingkungan di sekitar titik tersebut . Selanjutnya, pada tampilan panorama akan
        ditampilkan dengan adanya simbol berbentuk kamera{' '}
        <span className=' relative -bottom-1 inline-block h-4 w-4'>
          <Image
            src='https://img.icons8.com/material/4ac144/256/camera.png'
            alt='logo-teknik-outline'
            width={100}
            height={100}
            className={clsx('h-full w-full')}
          />
        </span>
        .Simbol ini akan membantu Anda menavigasi dan berpindah lokasi di dalam panorama.
      </p>
    </p>
  )

  // Konten utama
  function Content(content: string) {
    switch (content) {
      case 'description':
        return <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(data?.attributes?.description) }} />
      case 'map':
        return (
          <>
            <Swiper
              loop={true}
              allowTouchMove={false}
              pagination={true}
              navigation={{ prevEl, nextEl }}
              className={clsx(
                'mySwiper z-20 flex w-full rounded-md border border-solid  bg-gray-300',
                navigation.theme === 'dark' ? ' border-white' : ' !border-black',
              )}>
              {navigation.content === 'landmark' && (
                <div
                  onClick={() => {
                    !navigation.mapLandmarkMessage && dispatch(setMapLandmarkMessage(true))
                  }}
                  className={clsx(
                    !navigation.mapLandmarkMessage ? ' left-4 !cursor-pointer' : 'inset-x-4',
                    'absolute bottom-4 z-[99999999] overflow-hidden rounded-md bg-black px-2 py-1 text-base text-white',
                  )}>
                  {!navigation.mapLandmarkMessage ? (
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
              <div
                className={clsx(
                  'absolute left-4 top-1/2 z-[10] m-auto flex -translate-x-1/2 -translate-y-1/2 cursor-pointer sm:left-8 ',
                  navigation.theme === 'dark' ? ' text-white' : ' text-black',
                )}
                onClick={() => {
                  setCurrentMap((currentMap + mapDetail.length - 1) % mapDetail.length)
                }}
                ref={(node) => {
                  setPrevEl(node)
                }}>
                <svg width='15' height='24' viewBox='0 0 15 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M12 0L14.8 2.8L5.59999 12L14.8 21.2L12 24L-1.14441e-05 12L12 0Z'
                    className={clsx(navigation.theme === 'dark' ? '  fill-white stroke-black' : '  fill-black')}
                  />
                </svg>
              </div>
              <div
                className={clsx(
                  'absolute right-4 top-1/2  z-20 m-auto flex -translate-x-1/2 -translate-y-1/2 cursor-pointer text-black sm:right-8',
                )}
                ref={(node) => setNextEl(node)}
                onClick={() => {
                  setCurrentMap((currentMap + 1) % mapDetail.length)
                }}>
                <svg width='15' height='24' viewBox='0 0 15 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    d='M3.00001 24L0.200012 21.2L9.40001 12L0.200012 2.8L3.00001 0L15 12L3.00001 24Z'
                    className={clsx(navigation.theme === 'dark' ? '  fill-white stroke-black' : '  fill-black')}
                  />
                </svg>
              </div>
              {mapDetail.map((item, index) => {
                return (
                  <SwiperSlide key={index}>
                    <Map
                      open={open}
                      currentIndex={title}
                      mapImage={item.mapImage.data.attributes}
                      mapName={item.name}
                      mapInformation={item.MapInformation}
                      openPanorama={openPanorama}
                      setOpenPanorama={setOpenPanorama}
                      setCurrentScene={setCurrentScene}
                      Message={Message}></Map>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </>
        )
      case 'gallery':
        return <Gallery galleryDetail={galleryDetail ?? []}></Gallery>
      default:
        return <></>
    }
  }

  const scrollRef = useRef<HTMLDivElement>(null)

  const executeScroll = () => scrollRef.current?.scrollIntoView()

  return (
    <>
      {/* Komponen Modal Panorama */}
      {sceneInformation.length > 0 && (
        <Panorama
          sceneInformation={sceneInformation}
          openPanorama={openPanorama}
          setOpenPanorama={setOpenPanorama}
          currentScene={currentScene ?? 0}
          setCurrentScene={setCurrentScene}></Panorama>
      )}
      <div
        className={clsx(
          'absolute flex min-h-full w-full scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-600  ',
        )}>
        <div className='absolute bottom-0 h-1/2 w-full bg-gradient-to-t from-black to-transparent  opacity-60'></div>
        <div
          className={clsx(
            'absolute bottom-4 mb-4 flex w-full items-center px-4 sm:px-6  ',
            'flex-col sm:mb-6 sm:flex-row',
          )}>
          <div className='mb-4 flex !h-full w-full flex-col flex-wrap  md:mb-0 md:flex-row'>
            <h1 ref={scrollRef} className={clsx('h-full font-medium leading-none text-white', 'text-5xl sm:text-9xl')}>
              {data?.attributes?.objectName ?? ""}
            </h1>
            {data?.attributes?.subName !== null && data?.attributes?.subName !== undefined && (
              <>
                <div className={clsx('mx-4 h-32 border-solid border-white', 'hidden md:flex md:border')}></div>
                <p
                  className={clsx(
                    'mt-2 flex items-center font-medium text-white',
                    'w-full  text-2xl sm:text-4xl md:w-1/2',
                  )}>
                  {data?.attributes?.subName}
                </p>
              </>
            )}
          </div>

          <div
            onClick={() => {
              executeScroll()
            }}
            className='group  flex h-full w-full items-center justify-center text-center text-white sm:w-[20%] sm:justify-end '>
            <button className='mr-2 no-underline group-hover:underline'>Scroll Down</button>
            <button className='flex h-6 w-6 items-center justify-center rounded-full border sm:h-10 sm:w-10'>
              <svg
                width='12'
                height='8'
                viewBox='0 0 12 8'
                className='bounce'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'>
                <path d='M1.41 0.580002L6 5.17L10.59 0.580002L12 2L6 8L0 2L1.41 0.580002Z' fill='white' />
              </svg>
            </button>
          </div>
        </div>

        <div ref={scrollRef} className='absolute bottom-64'></div>
        <div className={clsx('absolute top-0 w-full')}>
          <Navbar />
        </div>
      </div>
      <div
        className={clsx(
          'absolute top-[100%] flex min-h-full w-full  flex-col    py-8',
          'px-6 sm:px-[10%]',
          navigation.theme === 'dark' ? ' bg-[#121212]' : '  bg-white',
        )}>
        <div className={clsx('mb-8 flex h-full w-full flex-col  justify-center ')}>
          {section.map((item, index) => {
            // console.log('test', item.show === true)
            return (
              <>
                {item.show === true && (
                  <div
                    className={clsx(' mb-4 flex w-full flex-col  border-b border-solid border-gray-400 py-4 ')}
                    key={index}>
                    <button
                      type='button'
                      aria-expanded={index === title.state && open}
                      className={clsx('mb-2 flex w-full cursor-pointer flex-row items-center justify-between text-left')}
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
                            xmlns='http://www.w3.org/2000/svg'>
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
                        'answer flex h-full w-full flex-col py-2',
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
