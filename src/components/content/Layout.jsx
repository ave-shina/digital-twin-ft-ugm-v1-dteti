import React, { useState } from 'react'
import Navbar from './Navbar'
import clsx from 'clsx'
import dynamic from 'next/dynamic'

import Search from './Search'
const Tour = dynamic(() => import('./Tour'), {
  ssr: false,
})
import Faq from './Faq'
import About from './About'
const Location = dynamic(() => import('./Location'), {
  ssr: false,
})

export default function Layout(props) {
  const { content, setContent, setZoom } = props
  return (
    <>
      <div className='absolute z-20 h-auto  w-full'>
        {content != '' && content !== 'location' && (
          <div className={clsx('  min-h-screen w-full bg-white')}>
            <Navbar setZoom={setZoom} setContent={setContent}></Navbar>
            <div className={clsx('flex w-full flex-col items-start justify-center  ')}>
              {content === 'search' && <Search></Search>}
              {content === 'tour' && <Tour></Tour>}
              {content === 'faq' && <Faq></Faq>}
              {content === 'about' && <About></About>}
            </div>
          </div>
        )}

        {content != '' && content === 'location' && (
          <div className={clsx('  min-h-screen w-full ')}>
            <div className={clsx('flex w-full flex-col items-start justify-center  ')}>
              {content === 'location' && <Location setZoom={setZoom} setContent={setContent}></Location>}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
