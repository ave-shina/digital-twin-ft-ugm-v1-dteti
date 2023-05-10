import React from 'react'
import clsx from 'clsx'

export default function Tooltip({ message, children, position, ...props }) {
  return (
    <div class='group relative flex'>
      {children}
      <span
        className={clsx(
          'absolute  scale-0 whitespace-nowrap rounded bg-gray-800 p-2 text-base text-white transition-all group-hover:scale-100',
          `${position}`,
        )}>
        {message}
      </span>
    </div>
  )
}
