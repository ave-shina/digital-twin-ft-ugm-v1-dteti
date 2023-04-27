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
  const [content, setContent] = useState('')
  const [showTooltip, setShowTooltip] = useState(false)
  const [zoom, setZoom] = useState(false)

  const [freeControl, setFreeControl] = useState(false)

  useEffect(() => {
    if (progress === 100) {
      setLoading(false)
      setMode('storyBoard')
    }
  }, [progress])

  return (
    <>
      {loading && <Loading></Loading>}

      <div className='relative h-full w-full bg-black'>
        <Scene
          shadows
          colorManagement
          shadowMap
          mode={mode}
          setContent={setContent}
          zoom={zoom}
          setZoom={setZoom}
          showTooltip={showTooltip}
          freeControl={freeControl}
          className='pointer-events-none h-screen'
          eventSource={props.ref}
          eventPrefix='client'
        />
        {/*  */}
        {/*  */}

        {mode === 'storyBoard' && <StoryBoard setMode={setMode} />}
        {mode === 'tutorial' && <Tutorial setFreeControl={setFreeControl} setMode={setMode} />}

        <Layout setZoom={setZoom} setContent={setContent} content={content}></Layout>

        {/*  */}
        {/*  */}

        {content == '' && (
          <>
            {' '}
            <Logo></Logo>
            <TopRight></TopRight>
            <BottomRight setContent={setContent}></BottomRight>
            <Main setShowTooltip={setShowTooltip} showTooltip={showTooltip} setContent={setContent}></Main>
            <BottomLeft showTooltip={showTooltip} setShowTooltip={setShowTooltip} setMode={setMode}></BottomLeft>
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
