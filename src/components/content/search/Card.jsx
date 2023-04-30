import React from 'react'
import Image from 'next/image'

import clsx from 'clsx'

export default function Card({ ...props }) {
  const { image, name, description } = props
  return (
    <div className={clsx('mb-4 w-full !cursor-pointer  ')}>
      <div
        className={clsx(
          'flex  w-full flex-col items-center overflow-hidden rounded-md border border-solid  border-black bg-white shadow-md ',
        )}>
        <Image
          className='h-full w-full'
          src={image}
          alt='contain'
          placeholder='blur'
          blurDataURL={'true'}
          height={200}
          width={192}
          objectFit='contain'
        />

        <div className={clsx('flex w-full flex-col items-start justify-between px-6 py-4 leading-normal')}>
          <h5 className={clsx('mb-2 text-lg font-bold tracking-tight text-gray-600 ')}>{name}</h5>
          <div className={clsx('pointer-events-none line-clamp-4 w-full')}>
            <p className={clsx('mb-3 w-full text-sm font-normal text-gray-700 dark:text-gray-400')}>
              <div dangerouslySetInnerHTML={{ __html: description }} />
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
