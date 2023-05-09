import { useEffect, useState, useRef } from 'react'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { setFirstTutorial } from 'redux/navigation'

import Layout from '@/components/content/Layout'
import Loading from '@/components/Loading'
import StoryBoard from '@/components/StoryBoard'
import Tutorial from '@/components/Tutorial'
const Scene = dynamic(() => import('../components/canvas/Scene'), { ssr: true })

import Logo from '@/components/navigation/Logo'
import Main from '@/components/navigation/Main'
import BottomLeft from '@/components/navigation/BottomLeft'
import BottomRight from '@/components/navigation/BottomRight'
import TopRight from '@/components/navigation/TopRight'

export default function Page(props) {
  const dispatch = useDispatch()
  const navigation = useSelector((state) => state.navigation)

  const [introduction, setIntroduction] = useState('storyBoard')
  const [freeControl, setFreeControl] = useState(false)

  const myRef = useRef()
  const router = useRouter()

  const [musicStart, setMusicStart] = useState(false)
  const [openForm, setOpenForm] = useState(false)

  // Mulai Jelajah
  const startVmap = () => {
    setMusicStart(true)
    setOpenForm(true)
    {
      navigation.firstTutorial
        ? (setIntroduction(''), setFreeControl(true), setFreeControl(true))
        : (setIntroduction('tutorial'), dispatch(setFirstTutorial(true)), setFreeControl(true))
    }
    if (navigation.music) {
      myRef.current.volume = 0.1
      myRef.current.play()
      myRef.current.loop = true
    }
  }

  // Untuk menyalakan dan mematikan musik
  useEffect(() => {
    if (!navigation.music && musicStart) {
      myRef.current.pause()
    } else if (navigation.music && musicStart) {
      myRef.current.play()
      myRef.current.volume = 0.1
      myRef.current.loop = true
    }
  }, [navigation.music])

  // Untuk mematikan musik ketika berpindah tab
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
    <>
      {/* Loading */}
      <Loading></Loading>
      {/* Komponen Audio */}
      <audio ref={myRef} preload='none'>
        <source
          src='https://drive.google.com/uc?authuser=0&id=1nm8IgNlq-mi1jS9W6Pg9UtE1obAaXAGD&export=download'
          type='audio/mpeg'
        />
      </audio>
      {/* Konten Utama */}
      <div className='absolute h-full w-full bg-black'>
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
        {introduction === 'tutorial' && <Tutorial setIntroduction={setIntroduction} />}

        {/* Komponen Fitur */}
        {router.query.content && <Layout></Layout>}

        {/*  */}
        {/*  */}

        {/* Komponen Navigasi */}
        {navigation.content == '' && (
          <>
            {' '}
            <Logo></Logo>
            <TopRight></TopRight>
            <BottomRight setOpenForm={setOpenForm} openForm={openForm}></BottomRight>
            <Main></Main>
            <BottomLeft setIntroduction={setIntroduction}></BottomLeft>
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
