import React from 'react'
import clsx from 'clsx'
import Image from 'next/image'

export default function Logo() {
  return (
    <div className={clsx(' absolute left-6 top-6 z-20 flex  flex-row items-center justify-center')}>
      <div className={clsx('relative mr-2 h-12 w-12 ')}>
        <Image
          src='/img/logo/logo-teknik-filled-white.svg'
          alt='logo-teknik-outline'
          width={100}
          height={100}
          className={clsx('h-full w-full')}
        />
      </div>
      <h1 className={clsx(' text-xl font-bold text-white')}>FT UGM</h1>
    </div>
  )
}
