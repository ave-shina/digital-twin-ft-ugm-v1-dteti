import React, { useState, useEffect } from 'react'

import { faqData } from '../data/Faq'

import clsx from 'clsx'

import { useAppSelector } from 'redux/hooks'
import { sanitizeHtml } from '@/utils/sanitize'

export default function Faq() {
  const [question, setQuestion] = useState<{ state: number }>({ state: 0 })
  const [prevQuestion, setPrevQuestion] = useState<{ state: number }>({ state: 0 })
  const [open, setOpen] = useState(false)

  const navigation = useAppSelector((state) => state.navigation)

  useEffect(() => {
    if (question.state !== prevQuestion.state) {
      setPrevQuestion(question)
      setOpen(true)
    } else if (question.state === prevQuestion.state) {
      setOpen(!open)
    }
  }, [question])

  return (
    <div className={clsx('min-h-[calc(100vh-96px)] w-full px-6  pb-8 pt-4 sm:px-[10%]')}>
      <h1
        className={clsx(
          ' ml-[-4px] pb-8  font-medium leading-none text-black',
          'text-4xl sm:text-6xl',
          navigation.theme === 'dark' ? ' text-white' : ' text-black',
        )}>
        Frequently Asked Questions
      </h1>
      <div className={clsx('flex w-full flex-col items-center justify-center')}></div>
      {faqData.data.attributes.FaqDetail.map((item, index) => {
        // console.log(index, question, open)
        return (
          <div className={clsx(' mb-4 flex w-full flex-col border-b border-solid border-gray-400 py-4')} key={index}>
            <button
              type='button'
              aria-expanded={index === question.state && open}
              className={clsx('mb-2 flex w-full cursor-pointer flex-row items-center justify-between text-left')}
              onClick={() => {
                setQuestion({ state: index })
              }}>
              <div
                className={clsx(
                  'question text-lg font-semibold ',
                  navigation.theme === 'dark' ? ' text-white' : ' text-black',
                )}>
                {item.question}
              </div>
              <div className={clsx('logo')}>
                {index === question.state && open ? (
                  <svg width='16' height='10' viewBox='0 0 16 10' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      className={clsx(navigation.theme === 'dark' ? '  stroke-white' : '  stroke-black')}
                      d='M15 8.5L8 1.5L1 8.5'
                      stroke='black'
                      strokeWidth={2}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                ) : (
                  <svg width='16' height='10' viewBox='0 0 16 10' fill='none' xmlns='http://www.w3.org/2000/svg'>
                    <path
                      d='M15 1.5L8 8.5L1 1.5'
                      className={clsx(navigation.theme === 'dark' ? '  stroke-white' : '  stroke-black')}
                      strokeWidth={2}
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                )}
              </div>
            </button>

            <div className={clsx('answer w-full py-2', index === question.state && open ? 'flex' : 'hidden')}>
              <div
                className={clsx(navigation.theme === 'dark' ? ' text-white' : ' text-black')}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(item.answer) }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
