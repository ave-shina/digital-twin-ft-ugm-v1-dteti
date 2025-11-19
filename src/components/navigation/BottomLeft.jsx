import React from 'react'
import clsx from 'clsx'
import { FaPlayCircle } from 'react-icons/fa'

export default function BottomLeft(props) {
  const { setTutorial } = props
  return (
    <div className='group absolute bottom-6 left-6 z-20 flex flex-row'>
      <button
        onClick={() => {
          setTutorial(true)
        }}
        className={clsx('tutorial group mr-4 flex h-14 cursor-pointer  items-center justify-center rounded-full  ')}>
        <FaPlayCircle className={clsx('h-6 w-6 text-white group-hover:text-black')} />
      </button>
    </div>
  )
}
