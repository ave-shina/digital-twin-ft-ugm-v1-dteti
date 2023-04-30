import React from 'react'
import clsx from 'clsx'

export default function BottomLeft(props) {
  const { setIntroduction } = props
  return (
    <div className='group absolute bottom-6 left-6 z-20 flex flex-row'>
      <button
        onClick={() => {
          setIntroduction('tutorial')
        }}
        className={clsx(' group mr-4 flex h-14 cursor-pointer  items-center justify-center rounded-full  ')}>
        <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            d='M15.684 11.1L14.604 12.204C13.74 13.068 13.2 13.8 13.2 15.6H10.8V15C10.8 13.668 11.34 12.468 12.204 11.604L13.692 10.092C14.136 9.66 14.4 9.06 14.4 8.4C14.4 7.76348 14.1471 7.15303 13.6971 6.70294C13.247 6.25286 12.6365 6 12 6C11.3635 6 10.753 6.25286 10.3029 6.70294C9.85286 7.15303 9.6 7.76348 9.6 8.4H7.2C7.2 7.12696 7.70571 5.90606 8.60589 5.00589C9.50606 4.10571 10.727 3.6 12 3.6C13.273 3.6 14.4939 4.10571 15.3941 5.00589C16.2943 5.90606 16.8 7.12696 16.8 8.4C16.7983 9.41189 16.3972 10.3822 15.684 11.1ZM13.2 20.4H10.8V18H13.2M12 0C10.4241 0 8.86371 0.310389 7.4078 0.913446C5.95189 1.5165 4.62902 2.40042 3.51472 3.51472C1.26428 5.76516 0 8.8174 0 12C0 15.1826 1.26428 18.2348 3.51472 20.4853C4.62902 21.5996 5.95189 22.4835 7.4078 23.0866C8.86371 23.6896 10.4241 24 12 24C15.1826 24 18.2348 22.7357 20.4853 20.4853C22.7357 18.2348 24 15.1826 24 12C24 5.364 18.6 0 12 0Z'
            className={clsx(' fill-white group-hover:fill-black')}
          />
        </svg>
      </button>
    </div>
  )
}
