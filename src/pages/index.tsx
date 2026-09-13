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
import PageSeo from '@/components/dom/PageSeo'

import Tutorial from '@/components/Tutorial/Tutorial'
import type { PageProps } from '../types/components'
import { getContentPageProps } from '@/lib/pageProps'

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
        // eslint-disable-next-line no-console
        console.warn('Audio play failed:', error)
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

  // Konten dari Prismic — wajib ada; bila kosong (build tanpa Prismic) komponen
  // tetap merender struktur, hanya tanpa data.
  const landmarks = props.landmarks ?? {
    data: [],
    meta: { pagination: { page: 1, pageSize: 25, pageCount: 1, total: 0 } },
  }
  const tour = props.tour
  const faq = props.faq
  const about = props.about

  return (
    <>
      {/* Beranda memakai judul/deskripsi situs dari Prismic (tanpa judul khusus). */}
      <PageSeo />
      <Loading />
      {/* preload='none': audio 1,6 MB tidak diunduh sebelum user memulai musik */}
      <audio ref={audioRef} preload='none'>
        <source src='/audio.mp3' type='audio/mpeg' />
      </audio>
      <div className='absolute h-full w-full bg-[#121212]'>
        {/* Canvas adalah target event (default R3F). Props lama
            eventSource={props.ref} tidak pernah terkirim (getStaticProps tidak
            bisa mengirim ref) — colorManagement/shadowMap bukan prop Canvas
            R3F v8 dan bocor sebagai atribut DOM tak dikenal. */}
        <Scene shadows introduction={introduction} freeControl={freeControl} landmarksData={landmarks} />

        {introduction === 'storyBoard' && <StoryBoard startVmap={startVmap} />}
        <Tutorial setTutorial={setTutorial} tutorial={tutorial} setIntroduction={setIntroduction} />

        {hasContent && tour && faq && about && <Content landmarks={landmarks} tour={tour} faq={faq} about={about} />}

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

export const getStaticProps = getContentPageProps
