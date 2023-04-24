import { useEffect, useState } from 'react'
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

const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: true })

export default function Page(props) {
  const { progress } = useProgress()

  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState('')
  const [freeControl, setFreeControl] = useState(false)

  useEffect(() => {
    if (progress === 100) {
      setLoading(false)
      setMode('storyBoard')
    }
  }, [progress])

  function Mode() {
    switch (mode) {
      case 'storyBoard':
        return <StoryBoard setMode={setMode} />
      case 'tutorial':
        return <Tutorial setFreeControl={setFreeControl} setMode={setMode} />
      default:
        return <></>
    }
  }

  return (
    <>
      {/* {loading ? <Loading></Loading> : ''} */}
      {/* <Loading></Loading> */}
      <div className='relative h-full w-full bg-black'>
        {/* <Scene
          shadows
          colorManagement
          shadowMap
          freeControl={freeControl}
          className='pointer-events-none h-screen'
          eventSource={props.ref}
          eventPrefix='client'
        /> */}
        {/*  */}
        {/*  */}

        {/* <div className='absolute z-10  h-screen w-screen'>
          <Mode />
        </div> */}

        <div className='absolute z-10 h-auto  w-full'>
          <Layout></Layout>
        </div>

        {/*  */}
        {/*  */}

        {/* <Logo></Logo>
        <TopRight></TopRight>
        <BottomRight></BottomRight>
        <Main></Main>
        <BottomLeft></BottomLeft> */}

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
