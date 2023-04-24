import React, { useState } from 'react'
import Navbar from './Navbar'
import clsx from 'clsx'

import Search from './Search'

import dynamic from 'next/dynamic'
const Tour = dynamic(() => import('./Tour'), {
  ssr: false,
})

export default function Layout() {
  const [mode, setMode] = useState('tour')

  function Mode() {
    switch (mode) {
      case 'search':
        return <Search></Search>
      case 'tour':
        return <Tour></Tour>
      case 'tutorial':
        return <></>
      case 'faq':
        return <></>
      case 'about':
        return <></>
      default:
        return <></>
    }
  }
  return (
    <div className=' w-full overflow-visible bg-white'>
      <Navbar></Navbar>
      <div className={clsx('flex w-full flex-col items-start justify-center  ')}>
        <Mode></Mode>
      </div>
    </div>
  )
}
