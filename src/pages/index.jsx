import { useEffect, useState } from 'react'
import Loading from '@/components/Loading'
import { useProgress } from '@react-three/drei'
import dynamic from 'next/dynamic'
import StoryBoard from '@/components/StoryBoard'
import Tutorial from '@/components/Tutorial'
import Navigation from '@/components/Navigation'

const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: true })

export default function Page(props) {
  const { progress } = useProgress()

  const [loading, setLoading] = useState(true)
  const [intro, setIntro] = useState(false)
  const [storyBoard, setStoryBoard] = useState(false)
  const [tutorial, setTutorial] = useState(false)
  const [freeControl, setFreeControl] = useState(false)

  useEffect(() => {
    if (progress === 100) {
      setLoading(false)
      setIntro(true)
      setStoryBoard(true)
    }
  }, [progress])

  return (
    <>
      {loading ? <Loading></Loading> : ''}
      {/* <Loading></Loading> */}
      <div className='relative h-screen'>
        <Scene
          shadows
          colorManagement
          shadowMap
          storyBoard={storyBoard}
          freeControl={freeControl}
          className='pointer-events-none h-screen'
          eventSource={props.ref}
          eventPrefix='client'
        />
        {/*  */}
        {/*  */}
        {intro && (
          <div className='absolute z-10  h-full w-full'>
            <div className='relative h-full w-full'>
              <div className='animate-myfirst animate-bg-blur absolute z-10 flex h-full w-full flex-col items-center justify-center bg-black  bg-opacity-40'></div>
              {storyBoard && (
                <StoryBoard setTutorial={setTutorial} setStoryBoard={setStoryBoard} storyBoard={storyBoard} />
              )}
              {tutorial && <Tutorial setIntro={setIntro} setTutorial={setTutorial} storyBoard={storyBoard} />}
            </div>
          </div>
        )}
        {/*  */}
        {/*  */}
        <Navigation></Navigation>

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
