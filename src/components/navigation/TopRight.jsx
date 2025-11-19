import { useCallback } from 'react'
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme, toggleMusic } from 'redux/navigation'

import ThemeIcon from './icons/ThemeIcon'
import MusicIcon from './icons/MusicIcon'

const buttonBaseClasses =
  'group relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-solid border-white bg-transparent text-white hover:bg-white sm:h-12 sm:w-12'

export default function TopRight() {
  const dispatch = useDispatch()
  const navigation = useSelector((state) => state.navigation)

  const handleThemeToggle = useCallback(() => {
    dispatch(toggleTheme())
  }, [dispatch])

  const handleMusicToggle = useCallback(() => {
    dispatch(toggleMusic())
  }, [dispatch])

  const isDark = navigation.theme === 'dark'

  return (
    <div className='absolute right-6 top-6 z-20 flex flex-row items-center justify-center'>
      <button
        title={isDark ? 'Mode Terang' : 'Mode Gelap'}
        onClick={handleThemeToggle}
        className={clsx('night-mode top-right-1 mr-4', buttonBaseClasses)}>
        <ThemeIcon isDark={isDark} />
      </button>
      <button
        title={navigation.music ? 'Matikan Musik' : 'Nyalakan Musik'}
        onClick={handleMusicToggle}
        className={clsx('tour-music top-right-2', buttonBaseClasses)}>
        <MusicIcon isOn={navigation.music} />
      </button>
    </div>
  )
}
