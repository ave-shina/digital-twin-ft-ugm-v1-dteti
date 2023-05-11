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
    images.push(galleryDetail[i])
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
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            height={400}
            width={402}
            style={{ objectFit: 'cover' }}
          />
        </div>
      ))}
    </div>
  )

  return (
    <div className='relative flex w-screen flex-col items-center justify-center'>
      {/* List Gallery */}
      {galleryList}
      {/* Light Box */}
      {isOpen.open && (
        <>
          <Lightbox
            mainSrc={`${images[photoIndex.key].galleryImage.data.attributes.url}`}
            nextSrc={`${images[(photoIndex.key + 1) % images.length].galleryImage.data.attributes.url}`}
            prevSrc={`${images[(photoIndex.key + images.length - 1) % images.length].galleryImage.data.attributes.url}`}
            onCloseRequest={() => setIsOpen({ open: false })}
            onMovePrevRequest={() => setPhotoIndex({ key: (photoIndex.key + images.length - 1) % images.length })}
            onMoveNextRequest={() => setPhotoIndex({ key: (photoIndex.key + 1) % images.length })}
            imageCaption={
              <div
                className=' absolute bottom-0 left-1/2 !z-[999999999] -translate-x-1/2 bg-white text-black'
                dangerouslySetInnerHTML={{ __html: images[photoIndex.key].description }}
              />
            }
          />
        </>
      )}
    </div>
  )
}
