import React from 'react'
import Map from '../panorama/Map'
import Panorama from '../panorama/Panorama'
import clsx from 'clsx'

export default function Tour() {
  const [currentScene, setCurrentScene] = React.useState(0)

  return (
    <>
      {' '}
      <Panorama currentScene={currentScene} setCurrentScene={setCurrentScene}></Panorama>
      <div className='flex flex-col  justify-center px-[10%]'>
        <h1 className={clsx(' pb-8  font-medium leading-none text-black', 'text-6xl sm:text-8xl')}>Jelajah Teknik.</h1>
        <div className={clsx('flex h-full w-full flex-col items-center justify-center ')}>
          <p className={clsx(' text-base leading-8 text-black')}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Urna porttitor rhoncus dolor purus. Auctor augue mauris augue neque gravida. Sed cras
            ornare arcu dui vivamus arcu felis bibendum ut. Ipsum a arcu cursus vitae congue mauris rhoncus. Enim diam
            vulputate ut pharetra. Eros donec ac odio tempor orci dapibus ultrices. Feugiat vivamus at augue eget arcu.
            Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Risus quis varius quam quisque id diam
            vel quam.
          </p>
          <Map setCurrentScene={setCurrentScene}></Map>
        </div>
      </div>
    </>
  )
}
