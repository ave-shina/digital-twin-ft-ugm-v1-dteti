import React, { useState, useEffect } from 'react'
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

export default function Location(props) {
  const [openPanorama, setOpenPanorama] = useState(false)
  const navigation = useSelector((state) => state.navigation)

  const [prevEl, setPrevEl] = useState(null)
  const [nextEl, setNextEl] = useState(null)

  const data = Landmarks.data.find((item) => item.attributes.objectName === navigation.location)

  const mapDetail = data?.attributes?.mapDetail
  const galleryDetail = data?.attributes?.galleryDetail
  const panoramaDetail = data?.attributes?.panoramaDetail

  const [currentMap, setCurrentMap] = useState(0)
  const [currentScene, setCurrentScene] = useState(data?.attributes?.mapDetail[currentMap].MapInformation[0].name)

  const sceneInformation = []

  const mapInformation = data?.attributes?.mapDetail[currentMap].MapInformation
  for (let i = 0; i < mapInformation.length; i++) {
    sceneInformation.push({
      sceneName: mapInformation[i]?.name,
      scenePanoImg: mapInformation[i].mapImage.data.attributes.formats.large?.url,
      hotSpotsArr: mapInformation[i].panoramaCoordinate,
    })
  }

  // console.log(sceneInformation)

  useEffect(() => {
    setCurrentScene(mapInformation[0].name)
  }, [currentMap])

  // console.log('test', sceneInformation)

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

  function Content(content) {
    switch (content) {
      case 'description':
        return <div dangerouslySetInnerHTML={{ __html: data.attributes.description }} />
      case 'gallery':
        return <Gallery galleryDetail={galleryDetail}></Gallery>
      case 'panorama':
        return (
          <>
            {panoramaDetail.map((item, index) => {
              // console.log('test', item.show === true)
              return (
                <Panorama panoramaImage={`${item?.panoramaImage?.data.attributes.formats.large.url}`} key={index} />
              )
            })}
          </>
        )
      default:
        return <></>
    }
  }

  const [title, setQuestion] = useState({ state: 0 })
  const [prevTitle, setPrevQuestion] = useState({ state: 0 })
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (title.state !== prevTitle.state) {
      setPrevQuestion(title)
      setOpen(true)
    } else if (title.state === prevTitle.state) {
      setOpen(!open)
    }
  }, [title])

  return (
    <>
      {sceneInformation.length > 0 && (
        <ModalPanorama
          sceneInformation={sceneInformation}
          openPanorama={openPanorama}
          setOpenPanorama={setOpenPanorama}
          currentScene={currentScene}
          setCurrentScene={setCurrentScene}></ModalPanorama>
      )}
      <div className={clsx('relative flex h-screen w-full ')}>
        <div className={clsx('absolute bottom-4 left-8 mb-8 flex ', 'flex-col sm:flex-row')}>
          <h1 className={clsx('  font-medium leading-none text-white', 'text-6xl sm:text-9xl')}>
            {data.attributes.name}
          </h1>
          {data.attributes.subName != '' && (
            <>
              <div className={clsx('mx-4 border-white', 'border-none sm:border sm:border-solid')}></div>
              <p
                className={clsx(
                  ' mt-2 flex items-center font-medium text-white',
                  'w-full  text-2xl sm:w-1/2 sm:text-4xl',
                )}>
                {data.attributes.subName}
              </p>
            </>
          )}
        </div>
        <div className={clsx('absolute top-0 w-full')}>
          <Navbar theme='light'></Navbar>
        </div>
      </div>
      <div
        className={clsx(
          'flex min-h-screen w-full  flex-col    py-8',
          'px-8 sm:px-[10%]',
          navigation.theme === 'dark' ? ' bg-black' : '  bg-white',
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
                        setQuestion({ state: index })
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

                    {item.id === 'map' && (
                      <div
                        className={clsx(
                          'solid relative  flex w-full rounded-md   bg-gray-400',
                          index === title.state && open
                            ? 'mb-4 h-[500px] border border-solid border-black'
                            : ' h-[0px] ',
                        )}>
                        <Swiper
                          loop={true}
                          allowTouchMove={false}
                          pagination={true}
                          navigation={{ prevEl, nextEl }}
                          className={clsx(
                            'mySwiper z-20 flex  w-full items-center justify-center rounded-md  bg-white ',
                          )}>
                          {mapDetail.map((item, index) => {
                            return (
                              <SwiperSlide key={index}>
                                <Map
                                  currentKey={index}
                                  mapImage={`${item.mapImage.data.attributes.formats.large.url}`}
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
                            'absolute left-8 top-1/2 z-20 m-auto -translate-x-1/2 -translate-y-1/2 cursor-pointer ',
                            navigation.theme === 'dark' ? ' text-white' : ' text-black',
                            index === title.state && open ? 'flex' : 'hidden ',
                          )}
                          onClick={() => {
                            setCurrentMap((currentMap + mapDetail.length - 1) % mapDetail.length)
                          }}
                          ref={(node) => {
                            setPrevEl(node)
                          }}>
                          <svg
                            width='15'
                            height='24'
                            viewBox='0 0 15 24'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'>
                            <path
                              d='M12 0L14.8 2.8L5.59999 12L14.8 21.2L12 24L-1.14441e-05 12L12 0Z'
                              className={clsx(
                                navigation.theme === 'dark' ? '  fill-white stroke-black' : '  fill-black',
                              )}
                            />
                          </svg>
                        </div>
                        <div
                          className={clsx(
                            'absolute right-8 top-1/2 z-20 m-auto -translate-x-1/2 -translate-y-1/2 cursor-pointer text-black',
                            index === title.state && open ? 'flex' : 'hidden ',
                          )}
                          ref={(node) => setNextEl(node)}
                          onClick={() => {
                            setCurrentMap((currentMap + 1) % mapDetail.length)
                          }}>
                          <svg
                            width='15'
                            height='24'
                            viewBox='0 0 15 24'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'>
                            <path
                              d='M3.00001 24L0.200012 21.2L9.40001 12L0.200012 2.8L3.00001 0L15 12L3.00001 24Z'
                              className={clsx(
                                navigation.theme === 'dark' ? '  fill-white stroke-black' : '  fill-black',
                              )}
                            />
                          </svg>
                        </div>
                      </div>
                    )}
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
