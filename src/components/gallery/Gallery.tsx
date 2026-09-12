import React, { useState } from 'react'

import Image from 'next/image'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'

import clsx from 'clsx'
import type { GalleryProps } from '../../types/components'
import { sanitizeHtml } from '@/utils/sanitize'

export default function Gallery(props: GalleryProps) {
  const { galleryDetail } = props

  // State primitif (bukan object wrapper) - lebih idiomatis.
  const [isOpen, setIsOpen] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)

  // Salin array dengan spread (bukan loop imperatif).
  const images = galleryDetail

  const galleryList = (
    <div
      className={clsx(
        'lightbox leading-companies grid h-full w-full grid-cols-2 items-center ',
        galleryDetail.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2',
      )}>
      {galleryDetail?.map((item, index) => (
        <button
          type='button'
          aria-label={`Buka gambar ${item.name}`}
          className={clsx(
            'relative  flex h-80  w-full cursor-pointer items-center justify-center overflow-hidden rounded-md border border-solid  border-black',
          )}
          key={index}
          onClick={() => {
            setPhotoIndex(index)
            setIsOpen(true)
          }}>
          <Image
            src={`${item?.galleryImage.data.attributes.url}`}
            className='h-full w-full hover:scale-110'
            alt={item.name}
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            height={400}
            width={402}
            style={{ objectFit: 'cover' }}
          />
        </button>
      ))}
    </div>
  )

  return (
    <div className='relative flex w-full flex-col items-center justify-center'>
      {/* List Gallery */}
      {galleryList}
      {/* Light Box */}
      {isOpen && (
        <Lightbox
          mainSrc={`${images[photoIndex].galleryImage.data.attributes.url}`}
          nextSrc={`${images[(photoIndex + 1) % images.length].galleryImage.data.attributes.url}`}
          prevSrc={`${images[(photoIndex + images.length - 1) % images.length].galleryImage.data.attributes.url}`}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() => setPhotoIndex((photoIndex + images.length - 1) % images.length)}
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
          imageCaption={
            <div
              className=' absolute bottom-0 left-1/2 !z-[999999999] -translate-x-1/2 bg-white text-black'
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(images[photoIndex].description) }}
            />
          }
        />
      )}
    </div>
  )
}
