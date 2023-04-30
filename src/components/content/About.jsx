import React from 'react'
import clsx from 'clsx'
import { useSelector } from 'react-redux'

export default function About() {
  const navigation = useSelector((state) => state.navigation)

  return (
    <div className={clsx('flex min-h-[calc(100vh-96px)]  w-full flex-col px-8 sm:px-[10%]')}>
      <h1
        className={clsx(
          ' mb-2 pb-8 font-medium leading-none text-black',
          'text-6xl sm:text-8xl',
          navigation.theme === 'dark' ? ' text-white' : ' text-black',
        )}>
        Jelajah Teknik.
      </h1>
      <div className={clsx('mb-8 flex h-full w-full flex-col  justify-center ')}>
        <p className={clsx(' mb-8 text-base leading-8 ', navigation.theme === 'dark' ? ' text-white' : ' text-black')}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Urna porttitor rhoncus dolor purus. Auctor augue mauris augue neque gravida. Sed cras ornare
          arcu dui vivamus arcu felis bibendum ut. Ipsum a arcu cursus vitae congue mauris rhoncus. Enim diam vulputate
          ut pharetra. Eros donec ac odio tempor orci dapibus ultrices. Feugiat vivamus at augue eget arcu. Adipiscing
          elit ut aliquam purus sit amet luctus venenatis lectus. Risus quis varius quam quisque id diam vel quam.
        </p>

        <div className={clsx('contributor flex flex-col')}>
          <div className={clsx('mb-4 flex flex-col')}>
            <h6 className={clsx('font-medium ', navigation.theme === 'dark' ? ' text-white' : ' text-black')}>
              Kontributor
            </h6>
            <p className={clsx(navigation.theme === 'dark' ? ' text-white' : ' text-black')}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
            </p>
          </div>
          <div className={clsx('flex flex-col', navigation.theme === 'dark' ? ' text-white' : ' text-black')}>
            <h6 className={clsx('font-medium ', navigation.theme === 'dark' ? ' text-white' : ' text-black')}>
              Kontributor
            </h6>
            <p className={clsx(navigation.theme === 'dark' ? ' text-white' : ' text-black')}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
