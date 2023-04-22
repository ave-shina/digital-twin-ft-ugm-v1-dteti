import React from 'react'
import Image from 'next/image'
import Zoom from 'react-reveal/Zoom'
import Fade from 'react-reveal/Fade'

export default function StoryBoard(props) {
  return (
    <div className='absolute top-0 z-20 flex h-full w-full flex-col items-center justify-center'>
      <Zoom delay={1250} duration={2000}>
        <div className='relative h-64 w-full '>
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
            props.setStoryBoard(false)
            props.setTutorial(true)
          }}
          className='mt-8 rounded border border-black bg-white px-8 py-2 text-black  hover:bg-slate-300 hover:text-black'>
          Mulai
        </button>
      </Fade>
    </div>
  )
}
