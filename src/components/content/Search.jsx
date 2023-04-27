import React, { useState } from 'react'
import clsx from 'clsx'
import Card from './search/Card'
import { Landmarks } from '../data/Landamarks'

export default function Search() {
  const [focus, setFocus] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const locations = []

  for (let i = 0; i < Landmarks.data.length; i++) {
    locations.push({
      name: Landmarks.data[i].attributes.name,
      description: Landmarks.data[i].attributes.description,
      image: `${Landmarks?.data[i].attributes.thumbnail.data?.attributes.formats.thumbnail.url}`,
    })
  }

  // console.log(locations)

  const filteredLocation = locations.filter((location) => {
    return location.name.toLowerCase().indexOf(searchValue?.toLowerCase()) !== -1
  })

  return (
    <div className={clsx('flex min-h-[calc(100vh-96px)] w-full flex-col  bg-white px-8 md:px-[10%]')}>
      <h1 className={clsx(' pb-8  font-medium leading-none text-black', 'text-6xl sm:text-8xl')}>Cari Lokasi.</h1>
      <div className={clsx('flex flex-col items-center justify-center ')}>
        <p className={clsx(' text-base leading-8 text-black')}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Urna porttitor rhoncus dolor purus. Auctor augue mauris augue neque gravida. Sed cras ornare
          arcu dui vivamus arcu felis bibendum ut. Ipsum a arcu cursus vitae congue mauris rhoncus. Enim diam vulputate
          ut pharetra. Eros donec ac odio tempor orci dapibus ultrices. Feugiat vivamus at augue eget arcu. Adipiscing
          elit ut aliquam purus sit amet luctus venenatis lectus. Risus quis varius quam quisque id diam vel quam.
        </p>
        <form className={clsx('my-8 flex h-14 w-full')}>
          <div className={clsx('relative h-full w-full')}>
            <div className={clsx('pointer-events-none absolute inset-y-0 flex  h-full items-center pl-3')}>
              <svg
                aria-hidden='true'
                className='h-5 w-5 text-gray-500 '
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'></path>
              </svg>
            </div>
            <input
              onFocus={() => {
                setFocus(true)
              }}
              onChange={(e) => setSearchValue(e.target.value)}
              value={searchValue}
              type='search'
              className={clsx(
                'block h-full w-full  rounded-lg border border-black bg-gray-50 p-3 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 ',
              )}
              placeholder={'Cari Lokasi'}
              required
            />
          </div>
        </form>
        <div className={clsx('grid w-full grid-cols-1 gap-2', 'sm:grid-cols-2 sm:gap-6', 'md:grid-cols-3 md:gap-8')}>
          {filteredLocation.map((item, index) => {
            return <Card key={index} name={item.name} description={item.description} image={item.image}></Card>
          })}
        </div>
      </div>
    </div>
  )
}
