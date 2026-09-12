import React, { useEffect, useRef, useState } from 'react'

import Content from '@/components/content/Content'
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { setContent, setLocation, setMusic } from 'redux/navigation'
import clsx from 'clsx'
import Image from 'next/image'

import { getContentBundle } from '@/lib/prismic/client'
import type { PageProps } from '../types/components'

export default function ContentLayout(props: PageProps) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [isMounted, setIsMounted] = useState(false)

  // Ensure component is mounted before using router.query
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Iniasi Redux sesuai dengan router — pakai setter (BUKAN toggle) agar efek
  // idempotent: router bisa memicu efek lebih dari sekali selama query resolve
  // (location undefined -> terisi), dan toggle kedua akan mengosongkan state
  // sehingga /landmark?location=x merender halaman kosong.
  useEffect(() => {
    if (!isMounted) return
    dispatch(setContent(typeof router.query.content === 'string' ? router.query.content : ''))
    dispatch(setLocation(typeof router.query.location === 'string' ? router.query.location : ''))
  }, [router, isMounted, dispatch])

  useEffect(() => {
    dispatch(setMusic(false))
  }, [])

  // Mencari Data yang dibutuhkan — lowercase agar URL yang diketik manual tetap cocok.
  const navigation = useAppSelector((state) => state.navigation)
  const landmarks = props.landmarks
  const data = landmarks?.data.find((item) => item.attributes.objectName.toLowerCase() === navigation.location.toLowerCase())

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
      {navigation.content !== undefined && props.tour && props.faq && props.about && landmarks && (
        <Content landmarks={landmarks} tour={props.tour} faq={props.faq} about={props.about} />
      )}
    </div>
  )
}

// Keempat halaman konten dibangun saat build dengan konten dari Prismic.
export async function getStaticPaths() {
  return {
    paths: [{ params: { content: 'landmark' } }, { params: { content: 'tour' } }, { params: { content: 'faq' } }, { params: { content: 'about' } }],
    fallback: false,
  }
}

export async function getStaticProps() {
  const bundle = await getContentBundle()
  return {
    props: {
      title: bundle.settings.seo.title,
      landmarks: bundle.landmarks,
      tour: bundle.tour,
      faq: bundle.faq,
      about: bundle.about,
      settings: bundle.settings,
    },
  }
}
