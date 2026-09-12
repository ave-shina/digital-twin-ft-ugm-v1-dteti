import { useCallback } from 'react'
import { useAppDispatch } from 'redux/hooks'
import { toggleContent } from 'redux/navigation'
import { useRouter } from 'next/router'
import { FaGift } from 'react-icons/fa'
import type { BottomRightProps } from '../../types/components'

export default function BottomRight(_props: BottomRightProps) {
  const dispatch = useAppDispatch()
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
    <div className='absolute bottom-10 right-5 z-20 flex flex-col md:bottom-9 md:right-10'>
      <button
        onClick={handleAboutClick}
        className='about-us group flex  cursor-pointer items-center justify-center rounded-full'
      >
        <FaGift className='h-7 w-7 fill-white group-hover:fill-black md:h-8 md:w-8' />
      </button>
    </div>
  )
}
