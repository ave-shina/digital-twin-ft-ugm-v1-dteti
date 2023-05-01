import { useEffect, useState, useRef } from 'react'
import Loading from '@/components/Loading'
import { useProgress } from '@react-three/drei'
import dynamic from 'next/dynamic'
import StoryBoard from '@/components/StoryBoard'
import Tutorial from '@/components/Tutorial'

import Logo from '@/components/navigation/Logo'
import Main from '@/components/navigation/Main'
import BottomLeft from '@/components/navigation/BottomLeft'
import BottomRight from '@/components/navigation/BottomRight'
import TopRight from '@/components/navigation/TopRight'

import Layout from '@/components/content/Layout'

const Scene = dynamic(() => import('../components/canvas/Scene'), { ssr: true })
import { useSelector, useDispatch } from 'react-redux'
import ReactAudioPlayer from 'react-audio-player'

export default function Page(props) {
  const dispatch = useDispatch()
  const navigation = useSelector((state) => state.navigation)

  const { progress } = useProgress()

  const [loading, setLoading] = useState(true)
  const [introduction, setIntroduction] = useState('')

  const [content, setContent] = useState('')

  const [freeControl, setFreeControl] = useState(false)

  useEffect(() => {
    if (progress === 100) {
      setLoading(false)
      setIntroduction('storyBoard')
    }
  }, [progress])

  const myRef = useRef()

  const [musicStart, setMusicStart] = useState(false)
  const startVmap = () => {
    setMusicStart(true)
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

  return (
    <>
      {loading && <Loading></Loading>}

      <audio ref={myRef} preload='none'>
        <source
          src='https://drive.google.com/uc?authuser=0&id=1nm8IgNlq-mi1jS9W6Pg9UtE1obAaXAGD&export=download'
          type='audio/mpeg'
        />
      </audio>

      <div className='relative min-h-screen w-full bg-black'>
        <Scene
          shadows
          colorManagement
          shadowMap
          introduction={introduction}
          setContent={setContent}
          freeControl={freeControl}
          className='pointer-events-none h-screen'
          eventSource={props.ref}
          eventPrefix='client'
        />
        {/*  */}
        {/*  */}

        {introduction === 'storyBoard' && (
          <StoryBoard startVmap={startVmap} setMusicStart={setMusicStart} setIntroduction={setIntroduction} />
        )}
        {introduction === 'tutorial' && <Tutorial setFreeControl={setFreeControl} setIntroduction={setIntroduction} />}

        <Layout setContent={setContent} content={content}></Layout>

        {/*  */}
        {/*  */}

        {navigation.content == '' && (
          <>
            {' '}
            <Logo></Logo>
            <TopRight></TopRight>
            <BottomRight></BottomRight>
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
  return { props: { title: 'Virtual Tour Map FT UGM' } }
}
