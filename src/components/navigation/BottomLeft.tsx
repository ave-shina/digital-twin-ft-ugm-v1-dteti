import React from 'react'
import clsx from 'clsx'
import { FaPlayCircle } from 'react-icons/fa'
import type { BottomLeftProps } from '../../types/components'

export default function BottomLeft(props: BottomLeftProps) {
  const { setTutorial } = props
  return (
    <div className='group absolute bottom-10 left-5 z-20 flex flex-row md:bottom-9 md:left-10'>
      <button
        onClick={() => {
          setTutorial(true)
        }}
        className={clsx('tutorial group  flex  cursor-pointer  items-center justify-center rounded-full  ')}
      >
        <FaPlayCircle className={clsx('h-7 w-7 text-white group-hover:text-black md:h-8 md:w-8')} />
      </button>
    </div>
  )
}
