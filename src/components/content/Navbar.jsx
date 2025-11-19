import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { toggleLocation, toggleContent, toggleMusic, toggleTheme } from 'redux/navigation'
import { useRouter } from 'next/router'

export default function Navbar() {
  const navigation = useSelector((state) => state.navigation)
  const dispatch = useDispatch()
  const router = useRouter()

  const [scrollY, setScrollY] = useState(0)
  const [isNavbarVisible, setIsNavbarVisible] = useState(true)
  const [screenHeight, setScreenHeight] = useState(0)
  const prevScrollPosRef = useRef(0)

  // Memoize computed values
  const isTransparentMode = useMemo(
    () => scrollY < screenHeight && navigation.content === 'landmark',
    [scrollY, screenHeight, navigation.content],
  )

  const isDarkTheme = navigation.theme === 'dark'
  const shouldUseWhite = isTransparentMode || isDarkTheme

  // Optimize scroll handler with useCallback
  const handleScroll = useCallback(() => {
    const currentScrollPos = window.scrollY
    setScrollY(currentScrollPos)
    setIsNavbarVisible(prevScrollPosRef.current > currentScrollPos || currentScrollPos === 0)
    prevScrollPosRef.current = currentScrollPos
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateScreenHeight = () => {
      setScreenHeight(window.innerHeight - 400)
    }

    updateScreenHeight()
    window.addEventListener('resize', updateScreenHeight, { passive: true })

    return () => window.removeEventListener('resize', updateScreenHeight)
  }, [])

  // Helper functions for className generation
  const getButtonClasses = useCallback(() => {
    return clsx(
      'group flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-solid bg-transparent sm:h-12 sm:w-12',
      shouldUseWhite ? 'border-white hover:bg-white' : 'border-black hover:bg-[#121212]',
    )
  }, [shouldUseWhite])

  const getIconClasses = useCallback(
    (type = 'fill') => {
      return clsx(
        shouldUseWhite
          ? type === 'fill'
            ? 'fill-white group-hover:fill-black'
            : 'stroke-white group-hover:stroke-black'
          : type === 'fill'
          ? 'fill-black group-hover:fill-white'
          : 'stroke-black group-hover:stroke-white',
      )
    },
    [shouldUseWhite],
  )

  const getNavbarClasses = useCallback(() => {
    return clsx(
      'fixed z-[99999998] flex w-full flex-row items-center justify-between p-6 navbar-opacity',
      !isNavbarVisible && !isTransparentMode && '!hidden',
      isTransparentMode
        ? 'bg-transparent'
        : isDarkTheme
        ? 'border-b border-solid border-gray-900 bg-[#121212] shadow-md'
        : 'bg-white shadow-md',
    )
  }, [isNavbarVisible, isTransparentMode, isDarkTheme])

  const getTextClasses = useCallback(() => {
    return clsx('text-lg font-bold', shouldUseWhite ? 'text-white' : 'text-black')
  }, [shouldUseWhite])

  const getLogoPath = useMemo(() => {
    return shouldUseWhite ? '/img/logo/logo-teknik-filled-white.svg' : '/img/logo/logo-teknik-filled-black.svg'
  }, [shouldUseWhite])

  // Event handlers
  const handleThemeToggle = useCallback(() => {
    dispatch(toggleTheme())
  }, [dispatch])

  const handleMusicToggle = useCallback(() => {
    dispatch(toggleMusic())
  }, [dispatch])

  const handleClose = useCallback(() => {
    dispatch(toggleContent(''))
    dispatch(toggleLocation(''))
    router.push('/')
  }, [dispatch, router])

  return (
    <div className={getNavbarClasses()}>
      <div className='left-6 top-6 flex flex-row items-center justify-center'>
        <div className='relative mr-2 h-10 w-10'>
          <Image src={getLogoPath} alt='logo-teknik-outline' width={100} height={100} className='h-full w-full' />
        </div>
        <h1 className={getTextClasses()}>FT UGM</h1>
      </div>

      <div className='flex flex-row space-x-2'>
        <button onClick={handleThemeToggle} className={getButtonClasses()}>
          {isDarkTheme ? (
            <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M23.7888 14.5886C23.6963 14.4963 23.5804 14.4308 23.4535 14.3993C23.3266 14.3678 23.1935 14.3714 23.0685 14.4098C21.1959 14.9758 19.2047 15.0231 17.3072 14.5467C15.4098 14.0702 13.6772 13.0879 12.294 11.7044C10.9108 10.3208 9.92898 8.58795 9.45304 6.69038C8.97711 4.79282 9.02495 2.80167 9.59146 0.929148C9.62931 0.804278 9.63252 0.671473 9.60076 0.544919C9.569 0.418365 9.50345 0.302816 9.41113 0.210615C9.3188 0.118415 9.20317 0.0530252 9.07657 0.0214321C8.94997 -0.010161 8.81717 -0.00677089 8.69235 0.0312401C6.20936 0.793011 4.02973 2.3182 2.46339 4.38994C0.68781 6.74765 -0.176356 9.6674 0.029969 12.6117C0.236294 15.556 1.49922 18.3267 3.58627 20.4137C5.67333 22.5008 8.44402 23.7637 11.3883 23.97C14.3327 24.1764 17.2524 23.3122 19.6101 21.5366C21.6819 19.9703 23.2071 17.7907 23.9689 15.3077C24.0068 15.1828 24.0101 15.0499 23.9784 14.9232C23.9467 14.7966 23.8812 14.6809 23.7888 14.5886ZM18.747 20.3854C16.6665 21.9458 14.093 22.7033 11.4989 22.519C8.90484 22.3346 6.46431 21.2207 4.62539 19.3818C2.78647 17.5429 1.67258 15.1024 1.48822 12.5083C1.30387 9.91425 2.06142 7.34073 3.62179 5.26023C4.7332 3.78663 6.20024 2.61904 7.88567 1.86667C7.53083 3.81568 7.65392 5.82168 8.24439 7.71269C8.83486 9.6037 9.87509 11.3233 11.2759 12.7241C12.6767 14.1249 14.3964 15.1652 16.2874 15.7556C18.1784 16.3461 20.1844 16.4692 22.1334 16.1144C21.3831 17.802 20.2167 19.2716 18.7434 20.3854H18.747Z'
                className={getIconClasses('fill')}
              />
            </svg>
          ) : (
            <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M11.2941 1.64706V0.705882C11.2941 0.518671 11.3685 0.339127 11.5009 0.206748C11.6332 0.0743694 11.8128 0 12 0C12.1872 0 12.3668 0.0743694 12.4991 0.206748C12.6315 0.339127 12.7059 0.518671 12.7059 0.705882V1.64706C12.7059 1.83427 12.6315 2.01381 12.4991 2.14619C12.3668 2.27857 12.1872 2.35294 12 2.35294C11.8128 2.35294 11.6332 2.27857 11.5009 2.14619C11.3685 2.01381 11.2941 1.83427 11.2941 1.64706ZM19.2941 12C19.2941 13.4426 18.8663 14.8529 18.0648 16.0524C17.2633 17.2519 16.1242 18.1868 14.7913 18.7389C13.4585 19.291 11.9919 19.4354 10.577 19.154C9.16207 18.8725 7.86238 18.1778 6.84228 17.1577C5.82218 16.1376 5.12748 14.8379 4.84604 13.423C4.56459 12.0081 4.70904 10.5415 5.26111 9.20866C5.81319 7.87584 6.74809 6.73665 7.94761 5.93516C9.14712 5.13367 10.5574 4.70588 12 4.70588C13.9339 4.70806 15.7879 5.47725 17.1553 6.84469C18.5228 8.21213 19.2919 10.0661 19.2941 12ZM17.8824 12C17.8824 10.8366 17.5374 9.69929 16.891 8.73194C16.2446 7.76459 15.3259 7.01064 14.2511 6.56541C13.1762 6.12019 11.9935 6.0037 10.8524 6.23068C9.71134 6.45765 8.66321 7.01789 7.84055 7.84055C7.01789 8.66321 6.45765 9.71134 6.23068 10.8524C6.0037 11.9935 6.12019 13.1762 6.56541 14.2511C7.01064 15.3259 7.76459 16.2446 8.73194 16.891C9.69929 17.5374 10.8366 17.8824 12 17.8824C13.5595 17.8805 15.0546 17.2601 16.1574 16.1574C17.2601 15.0546 17.8805 13.5595 17.8824 12ZM3.97176 4.96941C4.03639 5.03876 4.11432 5.09439 4.20091 5.13297C4.28749 5.17155 4.38096 5.1923 4.47574 5.19397C4.57052 5.19564 4.66467 5.17821 4.75256 5.1427C4.84046 5.1072 4.9203 5.05436 4.98733 4.98733C5.05436 4.9203 5.1072 4.84046 5.1427 4.75256C5.17821 4.66467 5.19564 4.57052 5.19397 4.47574C5.1923 4.38096 5.17155 4.28749 5.13297 4.20091C5.09439 4.11432 5.03876 4.03639 4.96941 3.97176L4.02824 3.03059C3.89442 2.9059 3.71744 2.83802 3.53457 2.84125C3.3517 2.84447 3.17722 2.91856 3.04789 3.04789C2.91856 3.17722 2.84447 3.3517 2.84125 3.53457C2.83802 3.71744 2.9059 3.89442 3.03059 4.02824L3.97176 4.96941ZM3.97176 19.0306L3.03059 19.9718C2.96124 20.0364 2.90561 20.1143 2.86703 20.2009C2.82845 20.2875 2.8077 20.381 2.80603 20.4757C2.80436 20.5705 2.82179 20.6647 2.8573 20.7526C2.8928 20.8405 2.94564 20.9203 3.01267 20.9873C3.0797 21.0544 3.15954 21.1072 3.24744 21.1427C3.33533 21.1782 3.42948 21.1956 3.52426 21.194C3.61904 21.1923 3.71251 21.1716 3.79909 21.133C3.88568 21.0944 3.96361 21.0388 4.02824 20.9694L4.96941 20.0282C5.03876 19.9636 5.09439 19.8857 5.13297 19.7991C5.17155 19.7125 5.1923 19.619 5.19397 19.5243C5.19564 19.4295 5.17821 19.3353 5.1427 19.2474C5.1072 19.1595 5.05436 19.0797 4.98733 19.0127C4.9203 18.9456 4.84046 18.8928 4.75256 18.8573C4.66467 18.8218 4.57052 18.8044 4.47574 18.806C4.38096 18.8077 4.28749 18.8284 4.20091 18.867C4.11432 18.9056 4.03639 18.9612 3.97176 19.0306ZM19.9718 3.03059L19.0306 3.97176C18.9612 4.03639 18.9056 4.11432 18.867 4.20091C18.8284 4.28749 18.8077 4.38096 18.806 4.47574C18.8044 4.57052 18.8218 4.66467 18.8573 4.75256C18.8928 4.84046 18.9456 4.9203 19.0127 4.98733C19.0797 5.05436 19.1595 5.1072 19.2474 5.1427C19.3353 5.17821 19.4295 5.19564 19.5243 5.19397C19.619 5.1923 19.7125 5.17155 19.7991 5.13297C19.8857 5.09439 19.9636 5.03876 20.0282 4.96941L20.9694 4.02824C21.0941 3.89442 21.162 3.71744 21.1588 3.53457C21.1555 3.3517 21.0814 3.17722 20.9521 3.04789C20.8228 2.91856 20.6483 2.84447 20.4654 2.84125C20.2826 2.83802 20.1056 2.9059 19.9718 3.03059ZM20.0282 19.0306C19.8944 18.9059 19.7174 18.838 19.5346 18.8412C19.3517 18.8445 19.1772 18.9186 19.0479 19.0479C18.9186 19.1772 18.8445 19.3517 18.8412 19.5346C18.838 19.7174 18.9059 19.8944 19.0306 20.0282L19.9718 20.9694C20.1056 21.0941 20.2826 21.162 20.4654 21.1588C20.6483 21.1555 20.8228 21.0814 20.9521 20.9521C21.0814 20.8228 21.1555 20.6483 21.1588 20.4654C21.162 20.2826 21.0941 20.1056 20.9694 19.9718L20.0282 19.0306ZM1.64706 11.2941H0.705882C0.518671 11.2941 0.339127 11.3685 0.206748 11.5009C0.0743694 11.6332 0 11.8128 0 12C0 12.1872 0.0743694 12.3668 0.206748 12.4991C0.339127 12.6315 0.518671 12.7059 0.705882 12.7059H1.64706C1.83427 12.7059 2.01381 12.6315 2.14619 12.4991C2.27857 12.3668 2.35294 12.1872 2.35294 12C2.35294 11.8128 2.27857 11.6332 2.14619 11.5009C2.01381 11.3685 1.83427 11.2941 1.64706 11.2941ZM12 21.6471C11.8128 21.6471 11.6332 21.7214 11.5009 21.8538C11.3685 21.9862 11.2941 22.1657 11.2941 22.3529V23.2941C11.2941 23.4813 11.3685 23.6609 11.5009 23.7933C11.6332 23.9256 11.8128 24 12 24C12.1872 24 12.3668 23.9256 12.4991 23.7933C12.6315 23.6609 12.7059 23.4813 12.7059 23.2941V22.3529C12.7059 22.1657 12.6315 21.9862 12.4991 21.8538C12.3668 21.7214 12.1872 21.6471 12 21.6471ZM23.2941 11.2941H22.3529C22.1657 11.2941 21.9862 11.3685 21.8538 11.5009C21.7214 11.6332 21.6471 11.8128 21.6471 12C21.6471 12.1872 21.7214 12.3668 21.8538 12.4991C21.9862 12.6315 22.1657 12.7059 22.3529 12.7059H23.2941C23.4813 12.7059 23.6609 12.6315 23.7933 12.4991C23.9256 12.3668 24 12.1872 24 12C24 11.8128 23.9256 11.6332 23.7933 11.5009C23.6609 11.3685 23.4813 11.2941 23.2941 11.2941Z'
                className={getIconClasses('fill')}
              />
            </svg>
          )}
        </button>
        <button onClick={handleMusicToggle} className={clsx(getButtonClasses(), 'mr-4')}>
          {navigation.music ? (
            <svg width='27' height='20' viewBox='0 0 27 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M1 12.3595V8.14051C1 7.53795 1.23936 6.96008 1.66543 6.53401C2.09151 6.10794 2.66938 5.86857 3.27194 5.86857H6.56624C6.78835 5.86852 7.00557 5.80335 7.19103 5.68114L14.0068 1.18725C14.1781 1.07447 14.3767 1.01015 14.5815 1.00111C14.7864 0.992063 14.9898 1.03864 15.1704 1.13588C15.3509 1.23313 15.5017 1.37743 15.6069 1.55347C15.712 1.72951 15.7675 1.93073 15.7676 2.13578V18.3642C15.7675 18.5693 15.712 18.7705 15.6069 18.9465C15.5017 19.1226 15.3509 19.2669 15.1704 19.3641C14.9898 19.4614 14.7864 19.5079 14.5815 19.4989C14.3767 19.4899 14.1781 19.4255 14.0068 19.3128L7.19103 14.8189C7.00557 14.6966 6.78835 14.6315 6.56624 14.6314H3.27194C2.66938 14.6314 2.09151 14.3921 1.66543 13.966C1.23936 13.5399 1 12.962 1 12.3595Z'
                className={getIconClasses('stroke')}
              />
              <path
                d='M19.7434 5.13813C19.7434 5.13813 21.4474 6.84208 21.4474 9.682C21.4474 12.5219 19.7434 14.2259 19.7434 14.2259M23.1513 1.73022C23.1513 1.73022 25.9912 4.57014 25.9912 9.682C25.9912 14.7939 23.1513 17.6338 23.1513 17.6338'
                className={getIconClasses('stroke')}
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          ) : (
            <svg width='22' height='20' viewBox='0 0 22 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M17 11L19 9M19 9L21 7M19 9L17 7M19 9L21 11'
                className={getIconClasses('stroke')}
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M1 10.857V7.14301C1 6.61258 1.21071 6.10387 1.58579 5.7288C1.96086 5.35373 2.46957 5.14301 3 5.14301H5.9C6.09552 5.14296 6.28674 5.0856 6.45 4.97801L12.45 1.02201C12.6008 0.922734 12.7756 0.866111 12.9559 0.858151C13.1362 0.85019 13.3154 0.891189 13.4743 0.976798C13.6332 1.06241 13.766 1.18943 13.8585 1.3444C13.9511 1.49937 14 1.67651 14 1.85701V16.143C14 16.3235 13.9511 16.5007 13.8585 16.6556C13.766 16.8106 13.6332 16.9376 13.4743 17.0232C13.3154 17.1088 13.1362 17.1498 12.9559 17.1419C12.7756 17.1339 12.6008 17.0773 12.45 16.978L6.45 13.022C6.28674 12.9144 6.09552 12.8571 5.9 12.857H3C2.46957 12.857 1.96086 12.6463 1.58579 12.2712C1.21071 11.8962 1 11.3874 1 10.857Z'
                className={getIconClasses('stroke')}
              />
            </svg>
          )}
        </button>
        <button onClick={handleClose} className={getButtonClasses()}>
          <svg width='22' height='22' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M21 21L1 1M21 1L1 21'
              className={clsx('group-hover:stroke-2', getIconClasses('stroke'))}
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
