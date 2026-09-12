import React from 'react'
import clsx from 'clsx'
import { useAppSelector } from 'redux/hooks'

import type { AboutSectionProps } from '../../types/components'
import { sanitizeHtml } from '@/utils/sanitize'

export default function About({ about }: AboutSectionProps) {
  const navigation = useAppSelector((state) => state.navigation)

  return (
    <div className={clsx('flex min-h-[calc(100vh-96px)]  w-full flex-col px-6  pb-8 pt-4 sm:px-[10%]')}>
      <h1
        className={clsx(
          ' mb-2 pb-8 font-medium leading-none text-black',
          'text-4xl sm:text-8xl',
          navigation.theme === 'dark' ? ' text-white' : ' text-black',
        )}
      >
        {about.heading}
      </h1>
      <div className={clsx('mb-8 flex h-full w-full flex-col  justify-center ')}>
        <div
          className={clsx(
            ' mb-8 flex flex-col space-y-4 text-base leading-8',
            navigation.theme === 'dark' ? ' text-white' : ' text-black',
          )}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(about.welcomeHtml) }}
        />

        <div className={clsx('contributor flex flex-col')}>
          <div className={clsx('mb-4 flex flex-col')}>
            <h6 className={clsx('mb-2 font-medium ', navigation.theme === 'dark' ? ' text-white' : ' text-black')}>
              {about.contributorsLabel}
            </h6>
            <div
              className={clsx(
                'mb-4 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0',
                navigation.theme === 'dark' ? ' text-white' : ' text-black',
              )}
            >
              {about.contributors.map((contributor, index) => (
                <div className=' flex flex-row' key={index}>
                  <a href={contributor.linkedinUrl} target='_blank'>
                    {contributor.name}
                  </a>
                  <p className='ml-2'>({contributor.role}),</p>
                </div>
              ))}
            </div>
          </div>
          <div className={clsx('flex flex-row space-x-8', navigation.theme === 'dark' ? ' text-white' : ' text-black')}>
            {about.credits.map((credit, index) => (
              <div className='flex flex-col' key={index}>
                <h6 className={clsx('font-medium ', navigation.theme === 'dark' ? ' text-white' : ' text-black')}>
                  {credit.label}
                </h6>
                <div className=' flex flex-row'>
                  <p className='mr-2'>{credit.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
