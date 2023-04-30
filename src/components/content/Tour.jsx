import React, { useState, useEffect } from 'react'
import Map from '../panorama/Map'
import ModalPanorama from '../panorama/ModalPanorama'
import clsx from 'clsx'
import { TourData } from '../data/Tour'
import { useSelector } from 'react-redux'

export default function Tour() {
  const [currentScene, setCurrentScene] = useState(0)
  const [openPanorama, setOpenPanorama] = useState(false)
  const [currentMap, setCurrentMap] = useState(0)

  const navigation = useSelector((state) => state.navigation)

  const data = TourData.data
  const mapInformation = data?.attributes?.panoramaData[0].MapInformation
  const sceneInformation = []
  for (let i = 0; i < mapInformation.length; i++) {
    sceneInformation.push({
      sceneName: mapInformation[i]?.name,
      scenePanoImg: `${mapInformation[i].mapImage.data.attributes.formats.large?.url}`,
      hotSpotsArr: mapInformation[i].panoramaCoordinate,
    })
  }

  useEffect(() => {
    setCurrentScene(mapInformation[0].name)
  }, [currentMap])

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

      <div
        className={clsx(
          'flex min-h-[calc(100vh-96px)]  w-full flex-col px-[10%]',
          navigation.theme === 'dark' ? ' bg-black' : 'bg-white',
        )}>
        <h1
          className={clsx(
            ' pb-8  font-medium leading-none text-black',
            'text-6xl sm:text-8xl',
            navigation.theme === 'dark' ? '  text-white' : ' text-black',
          )}>
          Jelajah Teknik.
        </h1>
        <div className={clsx('mb-8 flex h-full w-full flex-col  justify-center ')}>
          <p
            className={clsx(
              ' mb-8 text-base leading-8 text-black',
              navigation.theme === 'dark' ? '  text-white' : ' text-black',
            )}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Urna porttitor rhoncus dolor purus. Auctor augue mauris augue neque gravida. Sed cras
            ornare arcu dui vivamus arcu felis bibendum ut. Ipsum a arcu cursus vitae congue mauris rhoncus. Enim diam
            vulputate ut pharetra. Eros donec ac odio tempor orci dapibus ultrices. Feugiat vivamus at augue eget arcu.
            Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Risus quis varius quam quisque id diam
            vel quam.
          </p>
          <div
            className={clsx(
              'solid mb-4 flex w-full rounded-md border border-solid  bg-gray-300',
              navigation.theme === 'dark' ? ' border-white' : ' border-black',
            )}>
            <Map
              sceneInformation={sceneInformation}
              mapInformation={mapInformation}
              openPanorama={openPanorama}
              mapName={data.attributes.panoramaData[0].name}
              setOpenPanorama={setOpenPanorama}
              mapImage={`${data.attributes.panoramaData[0].mapImage.data.attributes.formats.large.url}`}
              setCurrentScene={setCurrentScene}
            />
          </div>
          <p
            className={clsx(
              ' mb-4 text-base leading-8 text-black',
              navigation.theme === 'dark' ? ' text-white' : ' text-black',
            )}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Urna porttitor rhoncus dolor purus.
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
      </div>
    </>
  )
}
