import React from 'react'
import clsx from 'clsx'
import Image from 'next/image'

export default function Navbar(props) {
  const { setContent, theme, setZoom } = props
  return (
    <div className={clsx('flex w-full  flex-row items-center justify-between p-6')}>
      <div className={clsx(' left-6 top-6 flex  flex-row items-center justify-center')}>
        <div className={clsx('relative mr-2 h-12 w-12 ')}>
          <Image
            src={theme === 'light' ? '/img/logo/logo-teknik-filled.svg' : '/img/logo/logo-teknik-filled-black.svg'}
            alt='logo-t{eknik-outline'
            width={100}
            height={100}
            className={clsx('h-full w-full')}
          />
        </div>
        <h1 className={clsx(' text-xl font-bold ', theme === 'light' ? ' text-white' : 'text-black')}>FT UGM</h1>
      </div>
      <button
        onClick={() => {
          setContent('')
          setZoom(false)
        }}
        className={clsx(
          'group absolute right-6 top-6 !z-30 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-solid  bg-transparent text-black sm:h-14 sm:w-14 ',
          theme === 'light' ? 'border-white' : 'border-black',
        )}>
        <svg width='22' height='22' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M21 21L1 1M21 1L1 21'
            className={clsx('  group-hover:stroke-2', theme === 'light' ? 'stroke-white' : 'stroke-black')}
            stroke-linecap='round'
            stroke-linejoin='round'
          />
        </svg>
      </button>
    </div>
  )
}
