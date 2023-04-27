import React, { useState } from 'react'
import clsx from 'clsx'
import { MapInteractionCSS } from 'react-map-interaction'
import ImageHotspots from 'react-image-hotspots'

function Map(props) {
  const { setCurrentScene, setOpenPanorama, mapInformation, mapImage, mapName } = props

  //   console.log(openPanorama)

  const map = []

  for (let i = 0; i < mapInformation.length; i++) {
    map.push({
      x: mapInformation[i].mapCoordinate[0],
      y: mapInformation[i].mapCoordinate[1],
      content: (
        <div
          title={mapInformation[i].name}
          onClick={(area) => {
            setCurrentScene(mapInformation[i].name)
            setOpenPanorama(true)
          }}
          className=' !h-2 !w-2 cursor-pointer rounded-full border-none bg-blue-700 p-1 text-blue-500 hover:bg-blue-500 md:!h-4 md:!w-4'></div>
      ),
    })
  }
  const [value, setValue] = useState({ scale: 1.2, translation: { x: 0, y: 0 } })

  return (
    <div className={clsx('flex h-full w-full  bg-slate-200')}>
      <div className={clsx(' relative flex  w-full flex-col items-center justify-center')}>
        <div className={clsx('flex h-[600px] w-full items-center justify-center overflow-hidden')}>
          <div className=' absolute right-4 top-4 z-10 overflow-hidden rounded-md bg-black px-2 py-1 text-base text-white'>
            {mapName}
          </div>
          <MapInteractionCSS
            value={value}
            onChange={(value) => {
              setValue(value)
            }}>
            <div className=' h-full w-full'>
              <ImageHotspots
                alt='Sample image'
                hideFullscreenControl={false}
                hideZoomControls={false}
                hotspots={map.length > 0 && map}
                src={map.length > 0 && mapImage}
                className='hidden'
              />
            </div>
          </MapInteractionCSS>
        </div>
      </div>
    </div>
  )
}

export default Map
