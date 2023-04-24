import React from 'react'
import Image from 'next/image'

export default function Logo() {
  return (
    <div className=' absolute left-6 top-6 flex  flex-row items-center justify-center'>
      <div className='relative mr-2 h-12 w-12 '>
        <Image
          src='/img/logo/logo-teknik-filled-white.svg'
          alt='logo-teknik-outline'
          width={100}
          height={100}
          className='h-full w-full'
        />
      </div>
      <h1 className=' text-xl font-bold'>FT UGM</h1>
    </div>
  )
}
