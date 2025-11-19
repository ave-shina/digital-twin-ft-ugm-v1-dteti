import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { toggleContent } from 'redux/navigation'
import { useRouter } from 'next/router'

import InfoIcon from './icons/InfoIcon'

export default function BottomRight() {
  const dispatch = useDispatch()
  const router = useRouter()

  const handleAboutClick = useCallback(() => {
    dispatch(toggleContent('about'))
    router.push(
      {
        pathname: '/',
        query: { content: 'about' },
      },
      '/about',
      { shallow: true },
    )
  }, [dispatch, router])

  return (
    <div className='absolute bottom-6 right-6 z-20 flex flex-col'>
      <button
        onClick={handleAboutClick}
        className='about-us group flex h-14 cursor-pointer items-center justify-center rounded-full'>
        <InfoIcon />
      </button>
    </div>
  )
}
