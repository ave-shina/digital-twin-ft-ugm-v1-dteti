/**
 * Pre-flight paritas normalizer: bangun dokumen Prismic sintetis dari
 * scripts/lib/source.ts (marker -> bentuk field Prismic), jalankan
 * normalizer aplikasi, lalu bandingkan hasilnya dengan data lokal.
 * Dieksekusi SEBELUM migrasi supaya bug struktur ketahuan lebih cepat.
 */
import { htmlAsRichText } from '@prismicio/migrate'

import { Landmarks as localLandmarks } from '../src/components/data/Landmarks'
import { TourData as localTour } from '../src/components/data/Tour'
import { faqData as localFaq } from '../src/components/data/Faq'
import { getSourceBundle, type FlatImage } from './lib/source'
import { normalizeLandmarks, normalizeTour, normalizeFaq } from '../src/lib/prismic/normalize'

/* ------------------------- marker -> field Prismic ------------------------- */

function toPrismicField(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(toPrismicField)
  if (value === null || value === undefined) return null
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>
    if (record.__image) {
      const img = record.__image as FlatImage
      return { url: img.url, alt: img.alt ?? null, dimensions: { width: img.width, height: img.height } }
    }
    if (typeof record.__richtext === 'string') {
      return htmlAsRichText(record.__richtext).result
    }
    if (record.__ref === 'landmark') {
      return { link_type: 'Document', type: 'landmark', uid: record.uid }
    }
    const out: Record<string, unknown> = {}
    for (const [key, child] of Object.entries(record)) out[key] = toPrismicField(child)
    return out
  }
  return value
}

/* -------------------------------- perbandingan ------------------------------ */

const strip = (html: string) =>
  html
    .replace(/&nbsp;/g, ' ')
    .replace(/&shy;/gi, '')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/\u00AD/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n')
    .trim()

const errors: string[] = []
const fail = (message: string) => {
  errors.push(message)
  if (errors.length <= 20) console.error(`✗ ${message}`)
}

/** Tampilkan konteks di sekitar perbedaan pertama agar selisih mudah dibaca. */
function diffContext(a: string, b: string): string {
  let i = 0
  while (i < Math.min(a.length, b.length) && a[i] === b[i]) i++
  const from = Math.max(0, i - 40)
  return `\n    lokal @${i}: ...${a.slice(from, i + 60).replace(/\n/g, '\\n')}...\n    hasil @${i}: ...${b.slice(from, i + 60).replace(/\n/g, '\\n')}...`
}

function cmp(label: string, a: unknown, b: unknown) {
  if (a !== b) {
    const sa = String(a)
    const sb = String(b)
    if (sa.length + sb.length > 160) {
      fail(`${label}:${diffContext(sa, sb)}`)
    } else {
      fail(`${label}: lokal="${sa}" hasil="${sb}"`)
    }
  }
}

function cmpVector(label: string, a: number[], b: number[]) {
  if (a.length !== b.length) {
    fail(`${label}: panjang ${a.length} != ${b.length}`)
    return
  }
  for (let i = 0; i < a.length; i++) {
    if (Math.abs((a[i] ?? 0) - (b[i] ?? 0)) > 1e-9) {
      fail(`${label}[${i}]: ${a[i]} != ${b[i]}`)
      return
    }
  }
}

const condense = (text: string) => text.replace(/\s+/g, '')

function main() {
  const source = getSourceBundle()

  const landmarkDocs = source.landmarks.map((doc) => ({
    id: doc.uid!,
    uid: doc.uid,
    type: 'landmark',
    data: toPrismicField(doc.data),
  }))
  const sceneDocs = source.scenes.map((doc) => ({
    id: doc.uid!,
    uid: doc.uid,
    type: 'panorama_scene',
    data: toPrismicField(doc.data),
  }))

  const landmarksResult = normalizeLandmarks(landmarkDocs as never, sceneDocs as never)
  const tourResult = normalizeTour({ id: 'tour', uid: null, type: 'tour', data: toPrismicField(source.singletons[0].data) } as never, sceneDocs as never)
  const faqResult = normalizeFaq({ id: 'faq', uid: null, type: 'faq', data: toPrismicField(source.singletons[1].data) } as never)

  /* ------------------------------- landmark -------------------------------- */
  cmp('jumlah landmark', localLandmarks.data.length, landmarksResult.data.length)

  for (const local of localLandmarks.data) {
    const attrs = local.attributes
    const result = landmarksResult.data.find((item) => item.attributes.objectName === attrs.objectName)
    if (!result) {
      fail(`landmark ${attrs.objectName} tidak ditemukan`)
      continue
    }
    const r = result.attributes
    const tag = `[landmark ${attrs.objectName}]`
    cmp(`${tag} name`, attrs.name, r.name)
    cmp(`${tag} subName`, attrs.subName ?? null, r.subName ?? null)
    cmp(`${tag} isDescription`, attrs.isDescription, r.isDescription)
    cmp(`${tag} isMap`, attrs.isMap, r.isMap)
    cmp(`${tag} isGallery`, attrs.isGallery, r.isGallery)
    cmp(`${tag} location`, attrs.location ?? null, r.location ?? null)
    cmp(`${tag} description text`, condense(strip(attrs.description)), condense(strip(r.description)))
    cmpVector(`${tag} zoomTarget`, attrs.zoomTarget, r.zoomTarget)
    cmpVector(`${tag} zoomCamera`, attrs.zoomCamera, r.zoomCamera)
    cmpVector(`${tag} tooltipLocation`, attrs.tooltipLocation, r.tooltipLocation)
    cmpVector(`${tag} mapCoordinate`, attrs.mapCoordinate, r.mapCoordinate)
    cmp(`${tag} thumbnail url`, attrs.thumbnail.data.attributes.url, r.thumbnail.data.attributes.url)
    cmp(`${tag} thumbnail w`, attrs.thumbnail.data.attributes.width, r.thumbnail.data.attributes.width)

    cmp(`${tag} jumlah lantai`, attrs.mapDetail.length, r.mapDetail.length)
    attrs.mapDetail.forEach((localFloor, floorIndex) => {
      const floor = r.mapDetail[floorIndex]
      if (!floor) return
      cmp(`${tag} lantai[${floorIndex}] name`, localFloor.name, floor.name)
      cmp(`${tag} lantai[${floorIndex}] desc`, strip(localFloor.description), strip(floor.description))
      cmp(`${tag} lantai[${floorIndex}] mapImage`, localFloor.mapImage.data.attributes.url, floor.mapImage.data.attributes.url)
      cmp(`${tag} lantai[${floorIndex}] jumlah scene`, localFloor.MapInformation.length, floor.MapInformation.length)

      localFloor.MapInformation.forEach((localScene, sceneIndex) => {
        const scene = floor.MapInformation[sceneIndex]
        if (!scene) return
        const stag = `${tag} lantai[${floorIndex}] scene[${sceneIndex}] ${localScene.name}`
        // scene lokal dengan nama null dirender sama seperti nama kosong
        cmp(`${stag} nama`, localScene.name ?? "", scene.name)
        // mapCoordinate null di data lokal jatuh ke (0,0) default Konva = [0,0,0]
        const localCoord = localScene.mapCoordinate?.length ? localScene.mapCoordinate : [0, 0, 0]
        cmpVector(`${stag} mapCoordinate`, localCoord, scene.mapCoordinate)
        // sebagian scene lokal memang tanpa denah - normalizer mengisi dari lantai
        const localSceneUrl = localScene.mapImage?.data?.attributes?.url
        if (localSceneUrl) {
          cmp(`${stag} mapImage`, localSceneUrl, scene.mapImage.data.attributes.url)
        }
        cmp(
          `${stag} jumlah hotspot`,
          localScene.panoramaCoordinate.length,
          scene.panoramaCoordinate.length,
        )
        localScene.panoramaCoordinate.forEach((hs, hsIndex) => {
          const lhs = scene.panoramaCoordinate[hsIndex]
          if (!lhs) return
          cmp(`${stag} hotspot[${hsIndex}].transition`, hs.transition, lhs.transition)
          if (Math.abs(hs.pitch - lhs.pitch) > 1e-9) fail(`${stag} hotspot[${hsIndex}].pitch: ${hs.pitch} != ${lhs.pitch}`)
          if (Math.abs(hs.yaw - lhs.yaw) > 1e-9) fail(`${stag} hotspot[${hsIndex}].yaw: ${hs.yaw} != ${lhs.yaw}`)
        })
      })
    })

    cmp(`${tag} jumlah galeri`, attrs.galleryDetail.length, r.galleryDetail.length)
    attrs.galleryDetail.forEach((localEntry, galleryIndex) => {
      const entry = r.galleryDetail[galleryIndex]
      if (!entry) return
      cmp(`${tag} galeri[${galleryIndex}] name`, localEntry.name ?? "", entry.name)
      cmp(`${tag} galeri[${galleryIndex}] img`, localEntry.galleryImage.data.attributes.url, entry.galleryImage.data.attributes.url)
      cmp(`${tag} galeri[${galleryIndex}] desc`, condense(strip(localEntry.description)), condense(strip(entry.description)))
    })
  }

  /* --------------------------------- tour ---------------------------------- */
  const localTourInfo = localTour.data.attributes.panoramaData[0].MapInformation
  const resultTourInfo = tourResult.data.attributes.panoramaData[0].MapInformation
  cmp('jumlah scene tour', localTourInfo.length, resultTourInfo.length)
  cmp('tour map_name', localTour.data.attributes.panoramaData[0].name, tourResult.data.attributes.panoramaData[0].name)
  cmp('tour mapImage', localTour.data.attributes.panoramaData[0].mapImage.data.attributes.url, tourResult.data.attributes.panoramaData[0].mapImage.data.attributes.url)
  localTourInfo.forEach((localScene, index) => {
    const scene = resultTourInfo[index]
    if (!scene) return
    cmp(`[tour scene ${index}] nama`, localScene.name, scene.name)
    cmpVector(`[tour scene ${index}] mapCoordinate`, localScene.mapCoordinate, scene.mapCoordinate)
    cmp(`[tour scene ${index}] jumlah hotspot`, localScene.panoramaCoordinate.length, scene.panoramaCoordinate.length)
  })
  cmp('jumlah galeri tour', localTour.data.attributes.galleryDetail.length, tourResult.data.attributes.galleryDetail.length)

  /* ---------------------------------- faq ---------------------------------- */
  const localFaqItems = localFaq.data.attributes.FaqDetail
  const resultFaqItems = faqResult.data.attributes.FaqDetail
  cmp('jumlah faq', localFaqItems.length, resultFaqItems.length)
  localFaqItems.forEach((localItem, index) => {
    const item = resultFaqItems[index]
    if (!item) return
    cmp(`[faq ${index}] question`, localItem.question, item.question)
    cmp(`[faq ${index}] answer`, condense(strip(localItem.answer)), condense(strip(item.answer)))
  })

  /* -------------------------------- ringkasan ------------------------------- */
  console.log(`\nLandmark: ${landmarksResult.data.length}, scene tour: ${resultTourInfo.length}, faq: ${resultFaqItems.length}`)
  if (errors.length > 0) {
    console.error(`\nPARITAS GAGAL: ${errors.length} selisih`)
    process.exit(1)
  }
  console.log('PARITAS LOLOS — normalizer menghasilkan struktur identik dengan data lokal.')
}

main()
