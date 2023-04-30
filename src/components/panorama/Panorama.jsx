import React from 'react'
const { Pannellum } = require('@georgedrpg/pannellum-react-next')
import '@georgedrpg/pannellum-react-next/es/css/video-js.css'
import '@georgedrpg/pannellum-react-next/es/css/pannellum.css'
import '@georgedrpg/pannellum-react-next/es/css/style-textInfo.css'

export default function Panorama(props) {
  const { panoramaImage } = props

  return (
    <div className='PanoramaView h-full w-full overflow-hidden rounded-lg border-2 border-solid border-black'>
      <Pannellum pitch={10} yaw={180} hfov={110} width='100%' height='500px' image={panoramaImage}></Pannellum>
    </div>
  )
}
