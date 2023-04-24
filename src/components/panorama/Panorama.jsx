import React from 'react'
const { Pannellum } = require('@georgedrpg/pannellum-react-next')

import '@georgedrpg/pannellum-react-next/es/css/video-js.css'
import '@georgedrpg/pannellum-react-next/es/css/pannellum.css'
import '@georgedrpg/pannellum-react-next/es/css/style-textInfo.css'

import scenesArray from './ScenesArray'

export default function Panorama(props) {
  const { currentScene, setCurrentScene } = props
  const [yaw, setYaw] = React.useState(0)
  const [pitch, setPitch] = React.useState(0)
  const panImage = React.useRef(null)

  const hotspotIcon = (hotSpotDiv) => {
    const image = document.createElement('img')
    image.classList.add('image')
    image.setAttribute('width', '30')
    image.setAttribute('height', '30')
    image.setAttribute('src', 'https://img.icons8.com/material/4ac144/256/camera.png')
    hotSpotDiv.appendChild(image)
  }

  return (
    <div
      id='defaultModal'
      tabindex='-1'
      aria-hidden='true'
      className='fixed top-0 z-40 flex !h-screen !w-screen  items-center justify-center   '>
      <div className='absolute top-0 z-40 flex !h-screen !w-screen  items-center justify-center   bg-black  bg-opacity-40'></div>
      <div className='z-60 absolute z-50 h-[80%] w-full max-w-4xl'>
        {/* <!-- Modal content --> */}
        <div className='relative  h-full rounded-lg border-black bg-white shadow '>
          <div className='flex items-start justify-between rounded-t border-b  '>
            <h3 className='text-xl font-semibold text-gray-900 '>{/* Terms of Service */}</h3>
            <button
              type='button'
              className='ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 '
              data-modal-hide='defaultModal'>
              <svg
                aria-hidden='true'
                className='h-5 w-5'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  fill-rule='evenodd'
                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                  clip-rule='evenodd'></path>
              </svg>
              <span className='sr-only'>Close modal</span>
            </button>
          </div>
          {/* <!-- Modal body --> */}
          <div className='flex h-full items-center justify-center space-y-6 p-6'>
            <div className='flex w-full flex-col items-center justify-center'>
              <div>
                pitch: {pitch}, yaw: {yaw}, transition:{' '}
              </div>
              <Pannellum
                ref={panImage}
                width='100%'
                height='400px'
                image={scenesArray[currentScene].scenePanoImg + '?resize=800%2C600'}
                pitch={10}
                yaw={180}
                hfov={110}
                autoLoad
                showZoomCtrl={false}
                onMouseup={(event) => {
                  setPitch(panImage.current.getViewer().mouseEventToCoords(event)[0])
                  setYaw(panImage.current.getViewer().mouseEventToCoords(event)[1])
                }}>
                {scenesArray[currentScene].hotSpotsArr.map((hotSpot, index) => {
                  return (
                    <Pannellum.Hotspot
                      type='custom'
                      key={index}
                      pitch={hotSpot.pitch}
                      yaw={hotSpot.yaw}
                      tooltip={hotspotIcon}
                      handleClick={(evt, name) => setCurrentScene(hotSpot.transition)}
                      name='image info'
                    />
                  )
                })}
              </Pannellum>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
