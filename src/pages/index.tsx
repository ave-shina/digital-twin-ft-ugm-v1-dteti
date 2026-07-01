import { useEffect, useState, useRef, useCallback } from 'react'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useAppSelector, useAppDispatch } from 'redux/hooks'
import { setFirstTutorial } from 'redux/navigation'

import Content from '@/components/content/Content'
import Loading from '@/components/Loading'
import StoryBoard from '@/components/StoryBoard'
const Scene = dynamic(() => import('../components/canvas/Scene'), { ssr: false })

import Logo from '@/components/navigation/Logo'
import Main from '@/components/navigation/Main'
import BottomLeft from '@/components/navigation/BottomLeft'
import BottomRight from '@/components/navigation/BottomRight'
import TopRight from '@/components/navigation/TopRight'
import Weather from '@/components/navigation/Weather'

import Tutorial from '@/components/Tutorial/Tutorial'
import type { PageProps } from '../types/components'

export default function Page(props: PageProps) {
  const dispatch = useAppDispatch()
  const navigation = useAppSelector((state) => state.navigation)
  const router = useRouter()

  const [introduction, setIntroduction] = useState('storyBoard')
  const [freeControl, setFreeControl] = useState(false)
  const [musicStart, setMusicStart] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const [tutorial, setTutorial] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)

  // Helper function to play audio with error handling
  const playAudio = useCallback(() => {
    if (!audioRef.current) return

    audioRef.current.volume = 0.1
    audioRef.current.loop = true
    const playPromise = audioRef.current.play()
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.log('Audio play failed:', error)
      })
    }
  }, [])

  // Mulai Jelajah
  const startVmap = useCallback(() => {
    setMusicStart(true)
    setOpenForm(true)
    setIntroduction('')
    setFreeControl(true)

    if (!navigation.firstTutorial) {
      setTutorial(true)
      dispatch(setFirstTutorial(true))
    }

    if (navigation.music) {
      playAudio()
    }
  }, [navigation.firstTutorial, navigation.music, dispatch, playAudio])

  // Handle music toggle
  useEffect(() => {
    if (typeof window === 'undefined' || !audioRef.current || !musicStart) return

    if (navigation.music) {
      playAudio()
    } else {
      audioRef.current.pause()
    }
  }, [navigation.music, musicStart, playAudio])

  // Handle visibility change (pause/resume music when tab changes)
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleVisibilityChange = () => {
      if (!audioRef.current) return

      if (document.hidden) {
        audioRef.current.pause()
      } else if (navigation.music && musicStart) {
        playAudio()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [navigation.music, musicStart, playAudio])

  const hasContent = router.isReady && router.query.content
  const showNavigation = navigation.content === ''

  return (
    <>
      <Loading />
      <audio ref={audioRef} preload='auto'>
        <source src='/audio.mp3' type='audio/mpeg' />
      </audio>
      <div className='absolute h-full w-full bg-[#121212]'>
        <Scene
          shadows
          colorManagement
          shadowMap
          introduction={introduction}
          freeControl={freeControl}
          className='pointer-events-none'
          eventSource={props.ref}
          eventPrefix='client'
        />

        {introduction === 'storyBoard' && <StoryBoard startVmap={startVmap} />}
        <Tutorial setTutorial={setTutorial} tutorial={tutorial} setIntroduction={setIntroduction} />

        {hasContent && <Content />}

        {showNavigation && (
          <>
            <Logo />
            <TopRight />
            <BottomRight setOpenForm={setOpenForm} openForm={openForm} />
            <Main />
            <BottomLeft setTutorial={setTutorial} />
            <Weather />
          </>
        )}
      </div>
    </>
  )
}

export async function getStaticProps() {
  return { props: { title: 'Virtual Tour FT UGM' } }
}
