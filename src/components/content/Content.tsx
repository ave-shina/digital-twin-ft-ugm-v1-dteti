import React, { useState, useEffect } from 'react'
import Navbar from './Navbar'
import clsx from 'clsx'
import dynamic from 'next/dynamic'

const Tour = dynamic(() => import('./Tour'), {
  ssr: false,
})
import Faq from './Faq'
import About from './About'
const Landmark = dynamic(() => import('./Landmark'), {
  ssr: false,
})

import { useAppSelector } from 'redux/hooks'

export default function Content() {
  const navigation = useAppSelector((state) => state.navigation)

  return (
    <>
      {navigation.content !== '' && navigation.content !== 'landmark' && (
        <div className={clsx('absolute h-full  w-full scrollbar', navigation.showTooltip ? 'z-[99999999]' : '')}>
          <div className={clsx('  min-h-full w-full  ', navigation.theme === 'dark' ? 'bg-[#121212]' : 'bg-white')}>
            <Navbar></Navbar>
            <div className={clsx('flex w-full flex-col items-start justify-center pt-24 md:pt-32')}>
              {navigation.content === 'tour' && <Tour></Tour>}
              {navigation.content === 'faq' && <Faq></Faq>}
              {navigation.content === 'about' && <About></About>}
            </div>
          </div>
        </div>
      )}

      {navigation.content !== '' && navigation.content === 'landmark' && (
        <div className={clsx('absolute z-10 h-full w-full ')}>
          <div className={clsx('relative flex min-h-full w-full flex-col items-start justify-center  ')}>
            {navigation.content === 'landmark' && <Landmark></Landmark>}
          </div>
        </div>
      )}
    </>
  )
}
