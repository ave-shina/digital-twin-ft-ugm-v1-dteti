import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { useProgress } from '@react-three/drei'

export default function Loading() {
  const { progress } = useProgress()

  return (
    <div className=' relative flex h-screen w-screen flex-col items-center justify-center bg-white'>
      <div className='flex  flex-col items-center justify-center'>
        <div className=' relative mb-2 h-36 w-36 overflow-hidden '>
          <div className=' relative h-full   bg-slate-200 '>
            <div className='absolute z-10 h-full w-full'>
              <div className='relative h-full w-full '>
                <Image
                  src='/img/logo/logo-teknik.svg'
                  alt='logo-teknik'
                  width={100}
                  height={100}
                  className='h-full w-full'
                />
              </div>
            </div>
            <div
              className='absolute left-[10%] bottom-1 w-4/5  bg-blue-800'
              style={{ height: `${progress - 6}%` }}></div>
          </div>
        </div>

        <div className=' flex flex-col items-center justify-center'>
          <h1 className='text-4xl font-bold text-black'>FAKULTAS TEKNIK</h1>
          <h1 className='mb-2 text-black'>UNIVERSITAS GADJAH MADA</h1>
          <p className='h-full  text-black'>{`${progress.toString().slice(0, 3)}`} %</p>
        </div>
      </div>
    </div>
  )
}
