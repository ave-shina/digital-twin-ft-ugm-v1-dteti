import React from 'react'
import Image from 'next/image'

export default function Navbar() {
  return (
    <div className='flex w-full  flex-row items-center justify-between p-6'>
      <div className=' left-6 top-6 flex  flex-row items-center justify-center'>
        <div className='relative mr-2 h-12 w-12 '>
          <Image
            src='/img/logo/logo-teknik-filled-black.svg'
            alt='logo-teknik-outline'
            width={100}
            height={100}
            className='h-full w-full'
          />
        </div>
        <h1 className=' text-xl font-bold text-black'>FT UGM</h1>
      </div>
      <button className='group absolute right-6 top-6 !z-30 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-solid border-black bg-transparent text-black sm:h-14 sm:w-14 '>
        <svg width='22' height='22' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M21 21L1 1M21 1L1 21'
            className=' stroke-black group-hover:stroke-2'
            stroke-linecap='round'
            stroke-linejoin='round'
          />
        </svg>
      </button>
    </div>
  )
}
