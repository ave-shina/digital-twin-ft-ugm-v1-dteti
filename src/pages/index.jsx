import { useEffect, useState, useRef } from 'react'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
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

import Tutorial from '@/components/Tutorial/Tutorial'

export default function Page(props) {
  const dispatch = useDispatch()
  const navigation = useSelector((state) => state.navigation)

  const [introduction, setIntroduction] = useState('storyBoard')
  const [freeControl, setFreeControl] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const myRef = useRef()
  const router = useRouter()

  const [musicStart, setMusicStart] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const [tutorial, setTutorial] = useState(false)

  // Ensure component is mounted before using router.query
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Mulai Jelajah
  const startVmap = () => {
    setMusicStart(true)
    setOpenForm(true)

    {
      navigation.firstTutorial
        ? (setIntroduction(''), setFreeControl(true))
        : (setIntroduction(''), setTutorial(true), dispatch(setFirstTutorial(true), setFreeControl(true)))
    }

    if (navigation.music && myRef.current) {
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
  }

  // Untuk menyalakan dan mematikan musik
  useEffect(() => {
    if (typeof window === 'undefined' || !myRef.current) return

    if (!navigation.music && musicStart) {
      myRef.current.pause()
    } else if (navigation.music && musicStart) {
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
  }, [navigation.music, musicStart])

  // Untuk mematikan musik ketika berpindah tab
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
    <>
      {/* Loading */}
      <Loading></Loading>
      {/* Komponen Audio */}
      <audio ref={myRef} preload='auto'>
        <source src='/audio.mp3' type='audio/mpeg' />
      </audio>
      {/* Konten Utama */}
      <div className='absolute h-full w-full bg-[#121212]'>
        {/* Letak Komponen Three Js */}
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
        {/*  */}
        {/*  */}

        {/* Komponen Introduction */}
        {introduction === 'storyBoard' && <StoryBoard startVmap={startVmap} />}
        {/* Komponen Tutotrial */}
        <Tutorial setTutorial={setTutorial} tutorial={tutorial} setIntroduction={setIntroduction} />

        {/* Komponen Fitur */}
        {isMounted && router.query.content && <Content />}

        {/* Komponen Navigasi */}
        {navigation.content == '' && (
          <>
            {' '}
            <Logo></Logo>
            <TopRight></TopRight>
            <BottomRight setOpenForm={setOpenForm} openForm={openForm}></BottomRight>
            <Main></Main>
            <BottomLeft setTutorial={setTutorial}></BottomLeft>
          </>
        )}
        {/*  */}
        {/*  */}
      </div>
    </>
  )
}

// Canvas components go here
// It will receive same props as the Page component (from getStaticProps, etc.)
// Page.canvas = (props) => <Logo scale={0.5} route='/blob' position-y={-1} />

export async function getStaticProps() {
  return { props: { title: 'Virtual Tour FT UGM' } }
}
