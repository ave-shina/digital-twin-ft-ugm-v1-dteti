import { useEffect, useState } from 'react'

interface AccordionState {
  /** Index item yang sedang aktif (atau -1 jika tidak ada). */
  current: number
  /** Apakah panel untuk item aktif sedang terbuka. */
  isOpen: boolean
  /** Setter untuk memilih item (toggle jika sama, buka jika beda). */
  select: (index: number) => void
  /** Reset state accordion. */
  reset: () => void
}

/**
 * Hook untuk logika accordion yang sebelumnya diduplikasi di
 * Faq.tsx, Tour.tsx, dan Landmark.tsx.
 *
 * Pola: klik item baru -> buka. Klik item yang sama -> toggle.
 */
export function useAccordion(initialIndex = -1): AccordionState {
  const [current, setCurrent] = useState(initialIndex)
  const [prev, setPrev] = useState(initialIndex)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (current !== prev) {
      setPrev(current)
      setIsOpen(true)
    } else {
      setIsOpen((open) => !open)
    }
  }, [current, prev])

  const select = (index: number) => {
    setCurrent(index)
  }

  const reset = () => {
    setCurrent(initialIndex)
    setPrev(initialIndex)
    setIsOpen(false)
  }

  return { current, isOpen, select, reset }
}
