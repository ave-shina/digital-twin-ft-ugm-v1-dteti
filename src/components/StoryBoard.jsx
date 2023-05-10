import React from 'react'

import Image from 'next/image'
import Zoom from 'react-reveal/Zoom'
import Fade from 'react-reveal/Fade'

export default function StoryBoard(props) {
  // mengecek apakah aplikasi sudah dimulai
  const { startVmap } = props

  return (
    <div className='absolute z-[9999999999]  h-full w-screen'>
      <div className='relative h-full w-screen'>
        <div className='animate-myfirst animate-bg-blur absolute z-10 flex h-full w-full flex-col items-center justify-center bg-[#121212]  bg-opacity-40'></div>
        <div className='absolute top-0 z-20 flex h-full w-full flex-col items-center justify-center'>
          <Zoom delay={1250} duration={2000}>
            <div className='relative h-1/3 w-full px-12 '>
              <Image
                src='/img/logo/virtual-tour-ft-ugm.svg'
                alt='logo-teknik'
                width={100}
                height={100}
                className='h-full w-full'
              />
            </div>
          </Zoom>
          <Fade delay={1500} duration={2000}>
            <button
              onClick={() => {
                startVmap()
              }}
              className='mt-8 rounded border border-black bg-white px-8 py-2 text-black  hover:bg-slate-300 hover:text-black'>
              Mulai
            </button>
          </Fade>
        </div>
      </div>
    </div>
  )
}
