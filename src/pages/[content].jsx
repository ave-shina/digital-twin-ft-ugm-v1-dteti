import React, { useEffect, useRef } from 'react'

import Layout from '@/components/content/Layout'

import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import { toggleContent, toggleLocation } from 'redux/navigation'
import clsx from 'clsx'
import { Landmarks } from '../components/data/Landamarks'
import Image from 'next/image'

export default function Content() {
  const router = useRouter()
  const dispatch = useDispatch()

  // Iniasi Redux sesuai dengan router
  useEffect(() => {
    if (router.query.content != undefined) {
      dispatch(toggleContent(router.query.content))
    }
    if (router.query.location != undefined) {
      dispatch(toggleLocation(router.query.location))
    }
  }, [router])

  // Mencari Data yang dibutuhkan
  const navigation = useSelector((state) => state.navigation)
  const data = Landmarks.data.find((item) => item.attributes.objectName === navigation.location)

  // Image ketika akses bukan dari main route
  const thumbnail = data?.attributes.thumbnail.data.attributes

  // Komponen musik
  const myRef = useRef()
  useEffect(() => {
    if (!navigation.music) {
      myRef.current.pause()
    } else if (navigation.music) {
      myRef.current.play()
      myRef.current.volume = 0.1
      myRef.current.loop = true
    }
  }, [navigation.music])

  // Mematikan musik saat berganti tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        myRef.current.pause()
      } else {
        if (navigation.music) {
          myRef.current.play()
        }
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [navigation.music])

  return (
    <div className='absolute h-full w-full bg-black'>
      {/* Komponen Musik */}
      <audio ref={myRef} preload='none'>
        <source
          src='https://drive.google.com/uc?authuser=0&id=1nm8IgNlq-mi1jS9W6Pg9UtE1obAaXAGD&export=download'
          type='audio/mpeg'
        />
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
              blurDataURL={'true'}
              height={720}
              width={192}
              style={{ objectFit: 'cover' }}
              unoptimized
            />
          </div>
        )}
      </div>
      {/* Komponen Fitur */}
      {navigation.content != undefined && <Layout></Layout>}
    </div>
  )
}
