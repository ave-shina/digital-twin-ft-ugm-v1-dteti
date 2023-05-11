import React, { useState, useEffect, useRef } from 'react'
import Map from '../panorama/Map'
import ModalPanorama from '../panorama/ModalPanorama'
import Panorama from '../panorama/Panorama'
import clsx from 'clsx'

import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, { Navigation, Pagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

SwiperCore.use([Navigation, Pagination])

import { Landmarks } from '../data/Landamarks'
import Gallery from '../gallery/Gallery'
import Navbar from './Navbar'

import { useSelector } from 'react-redux'

export default function Landmark(props) {
  const navigation = useSelector((state) => state.navigation)

  const [prevEl, setPrevEl] = useState(null)
  const [nextEl, setNextEl] = useState(null)

  // Mencari data landmark berdasarkan lokasi sesuai dengan objectName
  const data = Landmarks.data.find((item) => item.attributes.objectName === navigation.location)

  // Informasi mengenai Map
  const mapDetail = data?.attributes?.mapDetail
  // Informasi mengenai Panorama
  const panoramaDetail = data?.attributes?.panoramaDetail
  // Informasi mengenai galeri
  const galleryDetail = data?.attributes?.galleryDetail

  //  Menentukan Map mana yang dibuka, berhubungan dengan swiper
  const [currentMap, setCurrentMap] = useState(0)
  // Digunakan untuk menentukan lokasi panorama yang dibuka
  const [openPanorama, setOpenPanorama] = useState(false)
  const [currentScene, setCurrentScene] = useState(data?.attributes?.mapDetail[currentMap]?.MapInformation[0]?.name)

  // Mengambil data Map yang tampil
  const mapInformation = data?.attributes?.mapDetail[currentMap]?.MapInformation
    ? data?.attributes?.mapDetail[currentMap]?.MapInformation
    : []

  // Mengambil data Panorama yang tampil
  const sceneInformation = []
  for (let i = 0; i < mapInformation.length; i++) {
    sceneInformation.push({
      sceneName: mapInformation[i]?.name,
      scenePanoImg:
        mapInformation[i]?.mapImage?.data?.attributes != null ? mapInformation[i].mapImage.data.attributes : '',
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
      title: `Tentang ${data.attributes.name}`,
      id: 'description',
      show: data.attributes.isDescription,
    },
    {
      title: `Jelajah `,
      id: 'map',
      show: data.attributes.isMap,
    },
    {
      title: `Gallery`,
      id: 'gallery',
      show: data.attributes.isGallery,
    },
    {
      title: `Panorama`,
      id: 'panorama',
      show: data.attributes.isPanorama,
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
      setOpen(open)
    }
  }, [title])

  // Konten utama
  function Content(content) {
    switch (content) {
      case 'description':
        return <div dangerouslySetInnerHTML={{ __html: data.attributes.description }} />
      case 'map':
        return (
          <>
            <Swiper
              loop={true}
              allowTouchMove={false}
              pagination={true}
              navigation={{ prevEl, nextEl }}
              className={clsx('mySwiper z-20 flex  w-full items-center justify-center rounded-md  bg-white ')}>
              {mapDetail.map((item, index) => {
                return (
                  <SwiperSlide key={index}>
                    <Map
                      open={open}
                      currentIndex={title}
                      currentKey={index}
                      mapImage={item.mapImage.data.attributes}
                      mapName={item.name}
                      mapInformation={item.MapInformation}
                      openPanorama={openPanorama}
                      setOpenPanorama={setOpenPanorama}
                      setCurrentScene={setCurrentScene}></Map>
                  </SwiperSlide>
                )
              })}
            </Swiper>

            <div
              className={clsx(
                'absolute left-[12%] top-1/2 z-20 m-auto flex -translate-x-1/2 -translate-y-1/2 cursor-pointer ',
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
                'absolute right-[12%]  top-1/2 z-20 m-auto flex -translate-x-1/2 -translate-y-1/2 cursor-pointer text-black',
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
          </>
        )
      case 'gallery':
        return <Gallery galleryDetail={galleryDetail}></Gallery>
      case 'panorama':
        return (
          <>
            {panoramaDetail.map((item, index) => {
              // console.log('test', item.show === true)
              return <Panorama panoramaImage={`${item?.panoramaImage?.data.attributes.url}`} key={index} />
            })}
          </>
        )
      default:
        return <></>
    }
  }

  const scrollRef = useRef(null)

  const executeScroll = () => scrollRef.current.scrollIntoView()

  return (
    <>
      {/* Komponen Modal Panorama */}
      {sceneInformation.length > 0 && (
        <ModalPanorama
          title={title}
          sceneInformation={sceneInformation}
          openPanorama={openPanorama}
          setOpenPanorama={setOpenPanorama}
          currentScene={currentScene}
          setCurrentScene={setCurrentScene}></ModalPanorama>
      )}
      <div
        className={clsx(
          'absolute flex min-h-full w-full scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-600  ',
        )}>
        <div
          className={clsx(
            'absolute bottom-4 mb-4 flex w-full items-center px-4 sm:px-6  ',
            'flex-col sm:mb-6 sm:flex-row',
          )}>
          <div className='mb-4 flex !h-full w-full flex-col flex-wrap  md:mb-0 md:flex-row'>
            <h1 ref={scrollRef} className={clsx('h-full  font-medium leading-none text-white', 'text-6xl sm:text-9xl')}>
              {data.attributes.objectName}
            </h1>
            {data.attributes.subName != null && (
              <>
                <div className={clsx('mx-4 h-32 border-solid border-white', 'hidden md:flex md:border')}></div>
                <p
                  className={clsx(
                    'mt-2 flex items-center font-medium text-white',
                    'w-full  text-2xl sm:text-4xl md:w-1/2',
                  )}>
                  {data.attributes.subName}
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
          <Navbar theme='light'></Navbar>
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
