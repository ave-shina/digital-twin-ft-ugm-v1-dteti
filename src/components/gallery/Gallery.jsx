import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Lightbox from 'react-image-lightbox'
import clsx from 'clsx'
import 'react-image-lightbox/style.css'

export default function Gallery(props) {
  const { galleryDetail } = props

  const [isOpen, setIsOpen] = useState({ open: false })
  const [photoIndex, setPhotoIndex] = useState({ key: 1 })

  const images = []

  for (let i = 0; i < galleryDetail.length; i++) {
    images.push(`${galleryDetail[i]?.galleryImage.data.attributes.formats.large.url}`)
  }

  useEffect(() => {
    setTimeout(() => setPhotoIndex({ key: photoIndex.key }))
  }, [isOpen])

  const galleryList = (
    <div
      className={clsx(
        'lightbox leading-companies grid h-auto w-full grid-cols-2 items-center sm:space-x-3',
        'space-y-4 sm:space-y-2',
        galleryDetail.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2',
      )}>
      {galleryDetail?.map((item, index) => (
        <div
          className={clsx(
            ' relative my-2 flex w-auto cursor-pointer items-center justify-center overflow-hidden rounded-md border border-solid  border-black',
          )}
          key={index}
          onClick={() => (setPhotoIndex({ key: index }), setIsOpen({ open: true }))}>
          <Image
            src={`${item?.galleryImage.data.attributes.formats.thumbnail.url}`}
            className='h-full w-full'
            alt={item.name}
            placeholder='blur'
            blurDataURL={'true'}
            height={100}
            width={192}
          />
        </div>
      ))}
    </div>
  )

  return (
    <div className='flex w-screen flex-col items-center justify-center'>
      {galleryList}
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
