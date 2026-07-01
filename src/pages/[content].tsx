import React, { useEffect, useRef, useState } from 'react'

import Content from '@/components/content/Content'
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { toggleContent, toggleLocation, setMusic } from 'redux/navigation'
import clsx from 'clsx'
import { Landmarks } from '../components/data/Landmarks'
import Image from 'next/image'

export default function ContentLayout() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [isMounted, setIsMounted] = useState(false)

  // Ensure component is mounted before using router.query
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Iniasi Redux sesuai dengan router
  useEffect(() => {
    if (isMounted && router.query.content !== undefined) {
      if (typeof router.query.content === 'string') {
        dispatch(toggleContent(router.query.content))
      }
    }
    if (isMounted && router.query.location !== undefined) {
      if (typeof router.query.location === 'string') {
        dispatch(toggleLocation(router.query.location))
      }
    }
  }, [router, isMounted, dispatch])

  useEffect(() => {
    dispatch(setMusic(false))
  }, [])

  // Mencari Data yang dibutuhkan
  const navigation = useAppSelector((state) => state.navigation)
  const data = Landmarks.data.find((item) => item.attributes.objectName === navigation.location)

  // Image ketika akses bukan dari main route - guard dengan optional chaining penuh.
  const thumbnail = data?.attributes?.thumbnail?.data?.attributes

  // Komponen musik
  const myRef = useRef<HTMLAudioElement>(null)
  useEffect(() => {
    if (typeof window === 'undefined' || !myRef.current) return

    if (!navigation.music) {
      myRef.current.pause()
    } else if (navigation.music) {
      myRef.current.volume = 0.1
      myRef.current.loop = true
      const playPromise = myRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Auto-play was prevented or failed
          console.log('Audio play failed:', error)
        })
      }
    }
  }, [navigation.music])

  // Mematikan musik saat berganti tab
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleVisibilityChange = () => {
      if (document.hidden) {
        myRef.current?.pause()
      } else {
        if (navigation.music && myRef.current) {
          const playPromise = myRef.current.play()
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              // Auto-play was prevented or failed
              console.log('Audio play failed:', error)
            })
          }
        }
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [navigation.music])

  // console.log(navigation.content)

  return (
    <div className='absolute h-full w-full bg-[#121212]'>
      {/* Komponen Musik */}
      <audio ref={myRef} preload='auto'>
        <source src='/audio.mp3' type='audio/mpeg' />
      </audio>
      <div className={clsx('absolute h-full w-full')}>
        {/* Komponen Latar belakang */}
        {thumbnail && navigation.content === 'landmark' && (
          <div className='relative h-full w-full'>
            <Image
              src={`${thumbnail.url}`}
              className='h-full w-full'
              alt={thumbnail.name}
              placeholder='blur'
              blurDataURL={thumbnail.url}
              height={720}
              width={192}
              style={{ objectFit: 'cover' }}
              unoptimized
            />
          </div>
        )}
      </div>
      {/* Komponen Fitur */}
      {navigation.content !== undefined && <Content />}
    </div>
  )
}
