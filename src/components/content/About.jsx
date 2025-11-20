import React from 'react'
import clsx from 'clsx'
import { useSelector } from 'react-redux'

export default function About() {
  const navigation = useSelector((state) => state.navigation)

  return (
    <div className={clsx('flex min-h-[calc(100vh-96px)]  w-full flex-col px-6  pb-8 pt-4 sm:px-[10%]')}>
      <h1
        className={clsx(
          ' mb-2 pb-8 font-medium leading-none text-black',
          'text-4xl sm:text-8xl',
          navigation.theme === 'dark' ? ' text-white' : ' text-black',
        )}>
        Virtual Tour FT UGM
      </h1>
      <div className={clsx('mb-8 flex h-full w-full flex-col  justify-center ')}>
        <div
          className={clsx(
            ' mb-8 flex flex-col space-y-4 text-base leading-8',
            navigation.theme === 'dark' ? ' text-white' : ' text-black',
          )}>
          <p>
            Selamat datang di Virtual Tour Fakultas Teknik Universitas Gadjah Mada (FT UGM)! bersama, kami kembangkan
            pengalaman tur virtual yang akan membawa Anda menjelajahi Fakultas Teknik Universitas Gadjah Mada. Dalam
            perjalanan virtual ini, Anda akan diajak mengenal lebih dekat berbagai gedung akademik dan lingkungan kampus
            yang mendukung proses pembelajaran dan penelitian di FT UGM. Selain itu, Anda juga akan merasakan suasana
            kehidupan kampus yang penuh dengan semangat inovasi, kolaborasi, dan keberagaman.
          </p>

          <p>
            {' '}
            Selamat menikmati Virtual Tour FT UGM, semoga pengalaman ini memberikan wawasan dan inspirasi yang
            bermanfat. Selamat menjelajah!
          </p>
        </div>

        <div className={clsx('contributor flex flex-col')}>
          <div className={clsx('mb-4 flex flex-col')}>
            <h6 className={clsx('font-medium ', navigation.theme === 'dark' ? ' text-white' : ' text-black')}>
              Kontributor
            </h6>
            <div
              className={clsx(
                'mb-4 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0',
                navigation.theme === 'dark' ? ' text-white' : ' text-black',
              )}>
              <div className=' flex flex-row'>
                <a href='https://www.linkedin.com/in/ave-syah-shina/' target='_blank'>
                  Ave Syah Shina
                </a>
                <p className='ml-2'>(Web Developer),</p>
              </div>

              <div className=' flex flex-row'>
                <a href='https://www.linkedin.com/in/muhammad-apriliano-bagaskara-b30069240/' target='_blank'>
                  Aldo Apriliano
                </a>
                <p className='ml-2'>(3D Area Mapping),</p>
              </div>

              <div className=' flex flex-row'>
                <a href='https://www.linkedin.com/in/nabila-amalia-578313224/' target='_blank'>
                  Nabila Amalia
                </a>
                <p className='ml-2'>(3D Designer),</p>
              </div>
              <div className=' flex flex-row'>
                <a href='https://www.linkedin.com/' target='_blank'>
                  Mahdur Alvian
                </a>
                <p className='ml-2'>(3D Designer),</p>
              </div>
            </div>
          </div>
          <div className={clsx('flex flex-row space-x-8', navigation.theme === 'dark' ? ' text-white' : ' text-black')}>
            <div className='flex flex-col'>
              <h6 className={clsx('font-medium ', navigation.theme === 'dark' ? ' text-white' : ' text-black')}>
                Aset 3D
              </h6>
              <div className=' flex flex-row'>
                <p className='mr-2'>Quaternius</p>
              </div>
            </div>

            <div className='flex flex-col'>
              <h6 className={clsx('font-medium ', navigation.theme === 'dark' ? ' text-white' : ' text-black')}>
                Musik
              </h6>
              <div className=' flex flex-row'>
                <p className='mr-2'>A Town With An Ocean View - Kiki&apos;s Delivery Service (Piano)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
