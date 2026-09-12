import { useEffect, useRef, useCallback } from 'react'

interface UseBackgroundAudioOptions {
  /** Apakah musik sedang aktif (dari Redux state). */
  music: boolean
  /** Apakah user sudah memulai sesi (mis. klik "Mulai"). */
  musicStart?: boolean
  /** Volume audio (0-1). */
  volume?: number
}

/**
 * Hook untuk mengelola audio latar dengan aman:
 * - Play/pause berdasarkan state `music`
 * - Auto-pause saat tab tidak visible (visibilitychange)
 * - Handle autoplay block oleh browser
 *
 * Menggantikan logic audio yang sebelumnya diduplikasi di
 * src/pages/index.tsx dan src/pages/[content].tsx.
 */
export function useBackgroundAudio({ music, musicStart = true, volume = 0.1 }: UseBackgroundAudioOptions) {
  const audioRef = useRef<HTMLAudioElement>(null)

  const playAudio = useCallback(() => {
    if (!audioRef.current) return

    audioRef.current.volume = volume
    audioRef.current.loop = true
    const playPromise = audioRef.current.play()
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        // Auto-play dicegah browser atau gagal - log saja, jangan crash.
        console.log('Audio play failed:', error)
      })
    }
  }, [volume])

  // Play / pause ketika state `music` berubah.
  useEffect(() => {
    if (typeof window === 'undefined' || !audioRef.current) return
    if (!musicStart) return

    if (music) {
      playAudio()
    } else {
      audioRef.current.pause()
    }
  }, [music, musicStart, playAudio])

  // Pause saat tab tidak visible, resume ketika kembali.
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleVisibilityChange = () => {
      if (!audioRef.current) return

      if (document.hidden) {
        audioRef.current.pause()
      } else if (music && musicStart) {
        playAudio()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [music, musicStart, playAudio])

  return audioRef
}
