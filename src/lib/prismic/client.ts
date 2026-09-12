/**
 * Sumber konten aplikasi: Prismic. Semua fetch dilakukan saat build
 * (getStaticProps) — satu bundle, di-memo per proses build.
 *
 * Bila Prismic tidak dapat dihubungi, build GAGAL dengan pesan jelas —
 * tidak ada fallback konten lokal lagi (data lokal sudah dihapus).
 */
import * as prismic from '@prismicio/client'

import type {
  ContentBundle,
  FaqDocument,
  LandmarkDocument,
  PanoramaSceneDocument,
  AboutDocument,
  SiteSettingsDocument,
  TourDocument,
} from '@/types/prismic'
import { normalizeAbout, normalizeFaq, normalizeLandmarks, normalizeSettings, normalizeTour } from './normalize'

const REPO = process.env.PRISMIC_REPOSITORY_NAME
const TOKEN = process.env.PRISMIC_ACCESS_TOKEN
const LANG = process.env.PRISMIC_LANG || 'id'

/** Client Prismic untuk getStaticProps; null bila env belum diisi. */
export function getPrismicClient(): prismic.Client | null {
  if (!REPO) return null
  return prismic.createClient(REPO, {
    accessToken: TOKEN || undefined,
    fetchOptions: TOKEN ? { headers: { Authorization: `Bearer ${TOKEN}` } } : undefined,
  })
}

let bundlePromise: Promise<ContentBundle> | null = null

/** Ambil seluruh konten (sekali per proses build; hasil di-memo). */
export function getContentBundle(): Promise<ContentBundle> {
  if (!bundlePromise) {
    bundlePromise = fetchBundle().catch((error) => {
      bundlePromise = null // coba lagi pada proses berikutnya
      throw error
    })
  }
  return bundlePromise
}

async function fetchBundle(): Promise<ContentBundle> {
  if (!REPO) {
    throw new Error(
      'PRISMIC_REPOSITORY_NAME belum diisi di .env.local — konten situs diambil dari Prismic, tidak ada fallback lokal.',
    )
  }

  const client = getPrismicClient()
  if (!client) throw new Error('PRISMIC_REPOSITORY_NAME belum diisi')

  const [landmarks, scenes, tour, faq, about, settings] = await Promise.all([
    client.getAllByType<LandmarkDocument>('landmark', { lang: LANG }),
    client.getAllByType<PanoramaSceneDocument>('panorama_scene', { lang: LANG }),
    client.getSingle<TourDocument>('tour', { lang: LANG }),
    client.getSingle<FaqDocument>('faq', { lang: LANG }),
    client.getSingle<AboutDocument>('about', { lang: LANG }),
    client.getSingle<SiteSettingsDocument>('site_settings', { lang: LANG }),
  ])

  if (landmarks.length === 0) {
    throw new Error('tidak ada dokumen landmark di Prismic — pastikan konten sudah diterbitkan')
  }

  return {
    landmarks: normalizeLandmarks(landmarks, scenes),
    tour: normalizeTour(tour, scenes),
    faq: normalizeFaq(faq),
    about: normalizeAbout(about),
    settings: normalizeSettings(settings),
  }
}
