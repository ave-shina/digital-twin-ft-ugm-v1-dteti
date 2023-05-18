import clsx from 'clsx'
import { useDispatch } from 'react-redux'
import React, { useState, useEffect } from 'react'
import { toggleContent, setShowTooltip } from 'redux/navigation'
import { useRouter } from 'next/router'
import Fade from 'react-reveal/Fade'

export default function BottomRight(props) {
  const dispatch = useDispatch()
  const router = useRouter()
  const { openForm, setOpenForm } = props

  return (
    <div className={clsx('absolute bottom-6 right-6 z-20 flex flex-col ')}>
      <div className='relative'>
        {' '}
        {openForm && (
          <>
            {' '}
            <Fade left duration={1000}>
              <div
                className={clsx(
                  'absolute -right-1 top-1.5 -z-10 flex w-52 items-center justify-center border border-black bg-white px-4 py-2 !pr-8',
                )}>
                <button
                  onClick={() => {
                    setOpenForm(false)
                  }}
                  className={clsx(
                    'group mr-2 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border border-solid border-black bg-transparent text-black sm:h-5 sm:w-5 ',
                  )}>
                  <svg width='10' height='10' viewBox='0 0 22 22' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M21 21L1 1M21 1L1 21'
                      className={clsx('  group-hover:stroke stroke-black')}
                      stroke-linecap='round'
                      stroke-linejoin='round'
                    />
                  </svg>
                </button>{' '}
                <p className='mb-[2px]'> Isi survei di sini -&gt;</p>
              </div>
            </Fade>{' '}
          </>
        )}
        <a target='_blank' href='https://www.google.com/' rel='noopener noreferrer'>
          <button className={clsx(' group flex h-14 cursor-pointer  items-center justify-center rounded-full  ')}>
            <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <circle cx='12' cy='12' r='12' className={clsx(' fill-white group-hover:fill-black')} />
              <path
                d='M14.5 6H16C16.2652 6 16.5196 6.10536 16.7071 6.29289C16.8946 6.48043 17 6.73478 17 7V17C17 17.2652 16.8946 17.5196 16.7071 17.7071C16.5196 17.8946 16.2652 18 16 18H8C7.73478 18 7.48043 17.8946 7.29289 17.7071C7.10536 17.5196 7 17.2652 7 17V7C7 6.73478 7.10536 6.48043 7.29289 6.29289C7.48043 6.10536 7.73478 6 8 6H9.5M14.5 6C14.5 5.44772 14.0523 5 13.5 5H10.5C9.94772 5 9.5 5.44772 9.5 6M14.5 6V6.5C14.5 7.05228 14.0523 7.5 13.5 7.5H10.5C9.94772 7.5 9.5 7.05228 9.5 6.5V6M9.5 10H14.5M9.5 12.5H14.5M9.5 15H14.5'
                className={clsx(' stroke-black group-hover:fill-white')}
                stroke-linecap='round'
                stroke-linejoin='round'
              />
            </svg>
          </button>
        </a>
      </div>

      <button
        onClick={() => {
          dispatch(toggleContent('about'))
          router.push(
            {
              pathname: '/',
              query: { content: 'about' },
            },
            `/about`,
            { shallow: true },
          )
        }}
        className={clsx('about-us group flex h-14 cursor-pointer  items-center justify-center rounded-full  ')}>
        <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M12 18C12.34 18 12.6252 17.8848 12.8556 17.6544C13.086 17.424 13.2008 17.1392 13.2 16.8V11.97C13.2 11.63 13.0848 11.35 12.8544 11.13C12.624 10.91 12.3392 10.8 12 10.8C11.66 10.8 11.3748 10.9152 11.1444 11.1456C10.914 11.376 10.7992 11.6608 10.8 12V16.83C10.8 17.17 10.9152 17.45 11.1456 17.67C11.376 17.89 11.6608 18 12 18ZM12 8.4C12.34 8.4 12.6252 8.2848 12.8556 8.0544C13.086 7.824 13.2008 7.5392 13.2 7.2C13.2 6.86 13.0848 6.5748 12.8544 6.3444C12.624 6.114 12.3392 5.9992 12 6C11.66 6 11.3748 6.1152 11.1444 6.3456C10.914 6.576 10.7992 6.8608 10.8 7.2C10.8 7.54 10.9152 7.8252 11.1456 8.0556C11.376 8.286 11.6608 8.4008 12 8.4ZM12 24C10.34 24 8.78 23.6848 7.32 23.0544C5.86 22.424 4.59 21.5692 3.51 20.49C2.43 19.41 1.5752 18.14 0.9456 16.68C0.316 15.22 0.0008 13.66 0 12C0 10.34 0.3152 8.78 0.9456 7.32C1.576 5.86 2.4308 4.59 3.51 3.51C4.59 2.43 5.86 1.5752 7.32 0.9456C8.78 0.316 10.34 0.0008 12 0C13.66 0 15.22 0.3152 16.68 0.9456C18.14 1.576 19.41 2.4308 20.49 3.51C21.57 4.59 22.4252 5.86 23.0556 7.32C23.686 8.78 24.0008 10.34 24 12C24 13.66 23.6848 15.22 23.0544 16.68C22.424 18.14 21.5692 19.41 20.49 20.49C19.41 21.57 18.14 22.4252 16.68 23.0556C15.22 23.686 13.66 24.0008 12 24Z'
            className={clsx(' fill-white group-hover:fill-black')}
          />
        </svg>
      </button>
    </div>
  )
}
