import React from 'react'
import clsx from 'clsx'
import { useDispatch, useSelector } from 'react-redux'
import { toggleContent, setShowTooltip } from 'redux/navigation'
import { useRouter } from 'next/router'

export default function Main(props) {
  const navigation = useSelector((state) => state.navigation)
  const dispatch = useDispatch()

  const router = useRouter()
  return (
    <div
      className={clsx(
        'absolute bottom-6 left-1/2 z-20 flex h-14 w-[250px] -translate-x-1/2 flex-row items-center justify-between rounded-full border border-solid border-white px-6 sm:h-14 sm:w-[400px]',
      )}>
      <button
        onClick={() => {
          dispatch(setShowTooltip(!navigation.showTooltip))
        }}
        className={clsx(
          ' group flex h-10 w-10 cursor-pointer items-center  justify-center  rounded-full hover:bg-white sm:h-12 sm:w-12  ',
        )}>
        {navigation.showTooltip ? (
          <svg width='32' height='20' viewBox='0 0 22 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M11 5C10.2044 5 9.44129 5.31607 8.87868 5.87868C8.31607 6.44129 8 7.20435 8 8C8 8.79565 8.31607 9.55871 8.87868 10.1213C9.44129 10.6839 10.2044 11 11 11C11.7956 11 12.5587 10.6839 13.1213 10.1213C13.6839 9.55871 14 8.79565 14 8C14 7.20435 13.6839 6.44129 13.1213 5.87868C12.5587 5.31607 11.7956 5 11 5ZM11 13C9.67392 13 8.40215 12.4732 7.46447 11.5355C6.52678 10.5979 6 9.32608 6 8C6 6.67392 6.52678 5.40215 7.46447 4.46447C8.40215 3.52678 9.67392 3 11 3C12.3261 3 13.5979 3.52678 14.5355 4.46447C15.4732 5.40215 16 6.67392 16 8C16 9.32608 15.4732 10.5979 14.5355 11.5355C13.5979 12.4732 12.3261 13 11 13ZM11 0.5C6 0.5 1.73 3.61 0 8C1.73 12.39 6 15.5 11 15.5C16 15.5 20.27 12.39 22 8C20.27 3.61 16 0.5 11 0.5Z'
              className={clsx(' fill-white group-hover:fill-black')}
            />
          </svg>
        ) : (
          <svg width='32' height='24' viewBox='0 0 22 19' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M10.83 6L14 9.16V9C14 8.20435 13.6839 7.44129 13.1213 6.87868C12.5587 6.31607 11.7956 6 11 6H10.83ZM6.53 6.8L8.08 8.35C8.03 8.56 8 8.77 8 9C8 9.79565 8.31607 10.5587 8.87868 11.1213C9.44129 11.6839 10.2044 12 11 12C11.22 12 11.44 11.97 11.65 11.92L13.2 13.47C12.53 13.8 11.79 14 11 14C9.67392 14 8.40215 13.4732 7.46447 12.5355C6.52678 11.5979 6 10.3261 6 9C6 8.21 6.2 7.47 6.53 6.8ZM1 1.27L3.28 3.55L3.73 4C2.08 5.3 0.78 7 0 9C1.73 13.39 6 16.5 11 16.5C12.55 16.5 14.03 16.2 15.38 15.66L15.81 16.08L18.73 19L20 17.73L2.27 0M11 4C12.3261 4 13.5979 4.52678 14.5355 5.46447C15.4732 6.40215 16 7.67392 16 9C16 9.64 15.87 10.26 15.64 10.82L18.57 13.75C20.07 12.5 21.27 10.86 22 9C20.27 4.61 16 1.5 11 1.5C9.6 1.5 8.26 1.75 7 2.2L9.17 4.35C9.74 4.13 10.35 4 11 4Z'
              className={clsx(' fill-white group-hover:fill-black')}
            />
          </svg>
        )}
      </button>
      <button
        onClick={() => {
          dispatch(toggleContent('tour'))
          router.push(
            {
              pathname: '/',
              query: { content: 'tour' },
            },
            `/tour`,
            { shallow: true },
          )
        }}
        className={clsx(
          ' group flex h-10 w-10 cursor-pointer items-center  justify-center  rounded-full hover:bg-white sm:h-12 sm:w-12 ',
        )}>
        <svg width='35' height='24' viewBox='0 0 35 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M0.350403 0.956478V23.0431C0.350743 23.7392 0.991643 24.202 1.55434 23.9121C1.55434 23.9121 2.72904 23.2986 5.3297 22.6511C7.93036 22.0035 11.9053 21.3487 17.3504 21.3487C22.7955 21.3487 26.7704 22.0035 29.3711 22.6511C31.9721 23.2986 33.1465 23.9121 33.1465 23.9121C33.7092 24.2017 34.3501 23.7396 34.3504 23.0431V0.956478C34.3501 0.271841 33.7292 -0.190195 33.1689 0.0767757C33.1689 0.0767757 27.8153 2.65086 17.3504 2.65086C6.88554 2.65086 1.5319 0.0767757 1.5319 0.0767757C0.957983 -0.153859 0.364343 0.441279 0.350403 0.956478ZM2.0504 2.29669C4.223 3.07197 9.40902 4.56326 17.3504 4.56326C25.2918 4.56326 30.4778 3.07197 32.6504 2.29669V19.2887C29.9382 19.3759 27.1492 19.0745 24.1531 17.7244L17.9607 9.93594L12.7318 14.8715L10.2077 12.9782L5.2464 18.9005C4.22062 19.4168 3.23258 20.0609 2.0504 20.0495V2.29669ZM25.864 7.21001C25.2637 7.21906 24.6906 7.49366 24.2689 7.97439C23.8471 8.45512 23.6106 9.10333 23.6105 9.77874C23.6104 10.2884 23.7451 10.7867 23.9973 11.21C24.2496 11.6334 24.6082 11.9628 25.0273 12.1563C25.4465 12.3499 25.9074 12.3988 26.3513 12.2969C26.7952 12.195 27.2022 11.9468 27.5205 11.584C27.8387 11.2212 28.0538 10.7601 28.1385 10.2594C28.2232 9.75867 28.1735 9.24093 27.9959 8.77202C27.8183 8.30312 27.5207 7.90422 27.141 7.62608C26.7614 7.34794 26.3171 7.20311 25.864 7.21001Z'
            className={clsx(' fill-white group-hover:fill-black')}
          />
        </svg>
      </button>
      <button
        onClick={() => {
          dispatch(toggleContent('faq'))
          router.push(
            {
              pathname: '/',
              query: { content: 'faq' },
            },
            `/faq`,
            { shallow: true },
          )
        }}
        className={clsx(
          ' group flex h-10 w-10 cursor-pointer items-center  justify-center  rounded-full hover:bg-white sm:h-12 sm:w-12 ',
        )}>
        <svg width='27' height='26' viewBox='0 0 27 26' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M5.72783 16.4878L-3.05176e-05 20.9268V1.26829C-3.05176e-05 0.931921 0.135428 0.609325 0.376546 0.371474C0.617665 0.133623 0.944691 0 1.28568 0H20.5714C20.9124 0 21.2394 0.133623 21.4805 0.371474C21.7217 0.609325 21.8571 0.931921 21.8571 1.26829V16.4878H5.72783ZM4.83811 13.9512H19.2857V2.53659H2.5714V15.7078L4.83811 13.9512ZM8.99997 19.0244H22.1618L24.4285 20.781V7.60976H25.7143C26.0552 7.60976 26.3823 7.74338 26.6234 7.98123C26.8645 8.21908 27 8.54168 27 8.87805V26L21.2734 21.561H10.2857C9.94469 21.561 9.61766 21.4274 9.37655 21.1895C9.13543 20.9517 8.99997 20.6291 8.99997 20.2927V19.0244Z'
            className={clsx(' fill-white group-hover:fill-black')}
          />
        </svg>
      </button>
    </div>
  )
}
