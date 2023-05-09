import { useEffect, useState, useRef } from 'react'
import Loading from '@/components/Loading'
import dynamic from 'next/dynamic'
import StoryBoard from '@/components/StoryBoard'
import Tutorial from '@/components/Tutorial'

import Logo from '@/components/navigation/Logo'
import Main from '@/components/navigation/Main'
import BottomLeft from '@/components/navigation/BottomLeft'
import BottomRight from '@/components/navigation/BottomRight'
import TopRight from '@/components/navigation/TopRight'

import Layout from '@/components/content/Layout'

import { useRouter } from 'next/router'

const Scene = dynamic(() => import('../components/canvas/Scene'), { ssr: true })
import { useSelector, useDispatch } from 'react-redux'
import { setFirstTutorial } from 'redux/navigation'

export default function Page(props) {
  const dispatch = useDispatch()
  const navigation = useSelector((state) => state.navigation)

  const [introduction, setIntroduction] = useState('storyBoard')

  const [freeControl, setFreeControl] = useState(false)

  const myRef = useRef()

  const router = useRouter()

  const [musicStart, setMusicStart] = useState(false)

  const [openForm, setOpenForm] = useState(false)

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

  useEffect(() => {
    if (!navigation.music && musicStart) {
      myRef.current.pause()
    } else if (navigation.music && musicStart) {
      myRef.current.play()
      myRef.current.volume = 0.1
      myRef.current.loop = true
    }
  }, [navigation.music])

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
      <Loading></Loading>
      <audio ref={myRef} preload='none'>
        <source
          src='https://drive.google.com/uc?authuser=0&id=1nm8IgNlq-mi1jS9W6Pg9UtE1obAaXAGD&export=download'
          type='audio/mpeg'
        />
      </audio>

      <div className='absolute h-full w-full bg-black'>
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

        {introduction === 'storyBoard' && <StoryBoard startVmap={startVmap} />}
        {introduction === 'tutorial' && <Tutorial setIntroduction={setIntroduction} />}

        {router.query.content && <Layout></Layout>}

        {/*  */}
        {/*  */}

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
