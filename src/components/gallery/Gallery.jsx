import React, { useState, useEffect } from 'react'

import Image from 'next/image'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'

import clsx from 'clsx'

export default function Gallery(props) {
  const { galleryDetail } = props

  // Logika untuk membuka LightBox
  const [isOpen, setIsOpen] = useState({ open: false })
  const [photoIndex, setPhotoIndex] = useState({ key: 1 })
  const images = []

  // Mengambil data URL Image
  for (let i = 0; i < galleryDetail.length; i++) {
    images.push(`${galleryDetail[i]?.galleryImage.data.attributes.url}`)
  }

  useEffect(() => {
    setTimeout(() => setPhotoIndex({ key: photoIndex.key }))
  }, [isOpen])

  const galleryList = (
    <div
      className={clsx(
        'lightbox leading-companies grid h-full w-full grid-cols-2 items-center ',
        galleryDetail.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2',
      )}>
      {galleryDetail?.map((item, index) => (
        <div
          className={clsx(
            'relative  flex h-80  w-full cursor-pointer items-center justify-center overflow-hidden rounded-md border border-solid  border-black',
          )}
          key={index}
          onClick={() => (setPhotoIndex({ key: index }), setIsOpen({ open: true }))}>
          <Image
            src={`${item?.galleryImage.data.attributes.url}`}
            className='h-full w-full hover:scale-110'
            alt={item.name}
            placeholder='blur'
            blurDataURL={'true'}
            height={400}
            width={402}
            style={{ objectFit: 'cover' }}
          />
        </div>
      ))}
    </div>
  )

  return (
    <div className='flex w-screen flex-col items-center justify-center'>
      {/* List Gallery */}
      {galleryList}
      {/* Light Box */}
      {isOpen.open && (
        <Lightbox
          mainSrc={`${images[photoIndex.key]}`}
          nextSrc={`${images[(photoIndex.key + 1) % images.length]}`}
          prevSrc={`${images[(photoIndex.key + images.length - 1) % images.length]}`}
          onCloseRequest={() => setIsOpen({ open: false })}
          onMovePrevRequest={() => setPhotoIndex({ key: (photoIndex.key + images.length - 1) % images.length })}
          onMoveNextRequest={() => setPhotoIndex({ key: (photoIndex.key + 1) % images.length })}
        />
      )}
    </div>
  )
}
