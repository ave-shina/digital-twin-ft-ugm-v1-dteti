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

export default function Location(props) {
  const { setContent, setZoom } = props
  const [openPanorama, setOpenPanorama] = useState(false)

  const [prevEl, setPrevEl] = useState(null)
  const [nextEl, setNextEl] = useState(null)

  const data = Landmarks.data.find((item) => item.attributes.uid === 'dteti')

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
      <div className='relative flex h-screen w-full '>
        <div className='absolute bottom-4 left-8 mb-8 flex flex-row'>
          <h1 className={clsx('  font-medium leading-none text-white', 'text-6xl sm:text-9xl')}>
            {data.attributes.name}.
          </h1>
          <div className='mx-4 border border-solid border-white'></div>
          <p className=' mt-2 flex w-1/2 items-center text-4xl font-medium text-white'>{data.attributes.subName}</p>
        </div>
        <div className='absolute top-0 w-full'>
          <Navbar theme='light' setZoom={setZoom} setContent={setContent}></Navbar>
        </div>
      </div>
      <div className={clsx('flex min-h-screen w-full  flex-col bg-white px-[10%]  py-8')}>
        <div className={clsx('mb-8 flex h-full w-full flex-col  justify-center ')}>
          {section.map((item, index) => {
            // console.log('test', item.show === true)
            return (
              <>
                {item.show === true && (
                  <div className={clsx(' mb-2 flex w-full flex-col  py-4')} key={index}>
                    <div className={clsx('mb-2 flex flex-row items-center justify-between')}>
                      <div className={clsx('question text-2xl font-semibold ')}>{item.title}</div>
                    </div>

                    <div className={clsx('answer h-full w-full py-2', 'flex')}>{Content(item.id)}</div>

                    {item.id === 'map' && (
                      <div
                        className={clsx(
                          'solid relative mb-4 flex h-[500px] w-full rounded-md border border-solid border-black bg-gray-400',
                        )}>
                        <Swiper
                          loop={true}
                          allowTouchMove={false}
                          pagination={true}
                          navigation={{ prevEl, nextEl }}
                          className='mySwiper z-20 flex  w-full items-center justify-center rounded-md  bg-white '>
                          {mapDetail.map((item, index) => {
                            return (
                              <SwiperSlide key={index}>
                                <Map
                                  currentKey={index}
                                  currentMap={currentMap}
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
                          className='absolute left-8 top-1/2 z-20 m-auto -translate-x-1/2 -translate-y-1/2 cursor-pointer text-black'
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
                            <path d='M12 0L14.8 2.8L5.59999 12L14.8 21.2L12 24L-1.14441e-05 12L12 0Z' fill='black' />
                          </svg>
                        </div>
                        <div
                          className='absolute right-8 top-1/2 z-20 m-auto -translate-x-1/2 -translate-y-1/2 cursor-pointer text-black'
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
                              fill='black'
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
