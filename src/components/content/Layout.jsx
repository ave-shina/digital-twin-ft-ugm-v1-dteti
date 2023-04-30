import React, { useState, useEffect } from 'react'
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

import { useSelector } from 'react-redux'

export default function Layout(props) {
  const navigation = useSelector((state) => state.navigation)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(document.documentElement.scrollTop)
    }

    // just trigger this so that the initial state
    // is updated as soon as the component is mounted
    // related: https://stackoverflow.com/a/63408216
    handleScroll()

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {navigation.content != '' && navigation.content !== 'location' && (
        <div className={clsx('absolute h-auto  w-full', navigation.showTooltip ? 'z-[99999999]' : '')}>
          <div className={clsx('  min-h-screen w-full ', navigation.theme === 'dark' ? 'bg-black' : 'bg-white')}>
            <Navbar></Navbar>
            <div className={clsx('flex w-full flex-col items-start justify-center  py-32')}>
              {navigation.content === 'search' && <Search></Search>}
              {navigation.content === 'tour' && <Tour></Tour>}
              {navigation.content === 'faq' && <Faq></Faq>}
              {navigation.content === 'about' && <About></About>}
            </div>
          </div>
        </div>
      )}

      {navigation.content != '' && navigation.content === 'location' && (
        <div className={clsx('absolute z-10 h-auto w-full ')}>
          <div className={clsx('flex w-full flex-col items-start justify-center  ')}>
            {navigation.content === 'location' && <Location></Location>}
          </div>
        </div>
      )}
    </>
  )
}
