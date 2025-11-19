import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleContent, setShowTooltip, setShowWeather } from 'redux/navigation'
import { useRouter } from 'next/router'
import { FaTag, FaCloudSun, FaSun } from 'react-icons/fa'
import { HiOutlineTag } from 'react-icons/hi'

import TourIcon from './icons/TourIcon'
import FaqIcon from './icons/FaqIcon'

const buttonBaseClasses =
  'group flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-white sm:h-12 sm:w-12'
const iconClasses = 'h-6 w-6 text-white group-hover:text-black'

export default function Main() {
  const navigation = useSelector((state) => state.navigation)
  const dispatch = useDispatch()
  const router = useRouter()

  const handleTooltipToggle = useCallback(() => {
    dispatch(setShowTooltip(!navigation.showTooltip))
  }, [dispatch, navigation.showTooltip])

  const handleTourClick = useCallback(() => {
    dispatch(toggleContent('tour'))
    router.push(
      {
        pathname: '/',
        query: { content: 'tour' },
      },
      '/tour',
      { shallow: true },
    )
  }, [dispatch, router])

  const handleFaqClick = useCallback(() => {
    dispatch(toggleContent('faq'))
    router.push(
      {
        pathname: '/',
        query: { content: 'faq' },
      },
      '/faq',
      { shallow: true },
    )
  }, [dispatch, router])

  const handleWeatherToggle = useCallback(() => {
    dispatch(setShowWeather(!navigation.showWeather))
  }, [dispatch, navigation.showWeather])

  return (
    <div className='absolute bottom-6 left-1/2 z-20 flex h-14 w-[300px] -translate-x-1/2 flex-row items-center justify-between rounded-full border border-solid border-white px-6 sm:h-14 sm:w-[450px]'>
      <button
        title={navigation.showTooltip ? 'Sembunyikan Nama Gedung' : 'Lihat Nama Gedung'}
        onClick={handleTooltipToggle}
        className={`show-tooltip ${buttonBaseClasses}`}>
        {navigation.showTooltip ? <FaTag className={iconClasses} /> : <HiOutlineTag className={iconClasses} />}
      </button>
      <button
        title='Jelajah Fakultas Teknik'
        onClick={handleTourClick}
        className={`jelajah-teknik ${buttonBaseClasses}`}>
        <TourIcon />
      </button>
      <button title='Frequently Asked Questions' onClick={handleFaqClick} className={`faq ${buttonBaseClasses}`}>
        <FaqIcon />
      </button>
      <button
        title={navigation.showWeather ? 'Sembunyikan Cuaca' : 'Tampilkan Cuaca'}
        onClick={handleWeatherToggle}
        className={`show-weather ${buttonBaseClasses}`}>
        {navigation.showWeather ? <FaCloudSun className={iconClasses} /> : <FaSun className={iconClasses} />}
      </button>
    </div>
  )
}
