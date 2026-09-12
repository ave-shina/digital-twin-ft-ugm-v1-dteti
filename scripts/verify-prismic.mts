/**
 * Verifikasi paritas: bandingkan konten di Prismic vs data lokal.
 * Memeriksa struktur (jumlah lantai/scene/hotspot/gallery) DAN nilai
 * (teks, angka koordinat, hotspot tuple, nama file gambar).
 *
 * Pemakaian:
 *   npx tsx scripts/verify-prismic.ts
 *
 * Exit code 0 = paritas penuh; 1 = ada selisih (lihat laporan).
 */
import * as prismic from '@prismicio/client'
import { asText } from '@prismicio/client'

import { LANG, createReadClient, fetchExisting } from './lib/prismic-env.mts'
import { normText as normTextShared } from './lib/normalize-text.mts'
import { getSourceBundle } from './lib/source'

const EPS = 1e-9

const errors: string[] = []
const warnings: string[] = []
const ok = (message: string) => console.log(`✓ ${message}`)
const err = (message: string) => {
  errors.push(message)
  console.error(`✗ ${message}`)
}
const warn = (message: string) => {
  warnings.push(message)
  console.warn(`⚠ ${message}`)
}

function rtText(field: unknown): string {
  if (!Array.isArray(field)) return ''
  return normTextShared(asText(field as any) ?? '')
}

function num(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function compareNumber(label: string, source: unknown, prismicValue: unknown) {
  const sourceValue = num(source)
  const target = num(prismicValue)
  if (sourceValue === null && target === null) return
  if (sourceValue === null || target === null) {
    err(`${label}: sumber=${sourceValue} prismic=${target}`)
    return
  }
  if (Math.abs(sourceValue - target) > EPS) err(`${label}: sumber=${sourceValue} prismic=${target}`)
}

function compareText(label: string, source: unknown, prismicValue: unknown) {
  const sourceValue = typeof source === 'string' ? source : source == null ? '' : String(source)
  const target = typeof prismicValue === 'string' ? prismicValue : prismicValue == null ? '' : String(prismicValue)
  if (sourceValue !== target) err(`${label}: "${sourceValue}" != "${target}"`)
}

function compareRichText(label: string, sourceHtml: unknown, prismicField: unknown) {
  if (typeof sourceHtml !== 'string' || !sourceHtml) {
    if (rtText(prismicField)) err(`${label}: sumber kosong tapi Prismic berisi teks`)
    return
  }
  const sourceText = normTextShared(sourceHtml)
  const targetText = rtText(prismicField)
  if (sourceText !== targetText) {
    // styling/entitas boleh beda; isi paragraf harus sama
    err(`${label}: isi rich text berbeda.\n    sumber : ${sourceText.slice(0, 120)}...\n    prismic: ${targetText.slice(0, 120)}...`)
  }
}

function imageFilename(url: unknown): string | null {
  if (typeof url !== 'string' || !url) return null
  try {
    return decodeURIComponent(url.split('?')[0].split('/').pop() || '')
  } catch {
    return null
  }
}

function compareImage(label: string, source: { filename: string } | null, prismicField: any) {
  const sourceName = source?.filename ?? null
  const targetName = imageFilename(prismicField?.url)
  if (!sourceName && !targetName) return
  if (!sourceName || !targetName) {
    err(`${label}: sumber=${sourceName} prismic=${targetName}`)
    return
  }
  if (!targetName.includes(sourceName)) err(`${label}: file "${sourceName}" tidak ditemukan di "${targetName}"`)
}

async function getAllByTypeSmart(client: prismic.Client, type: string): Promise<prismic.PrismicDocument[]> {
  const published = await client.getAllByType(type, { lang: LANG })
  if (published.length > 0) return published
  // kemungkinan masih berupa draft di Migration Release
  const repo = await client.getRepository()
  const releaseRef = repo.refs.find((ref) => !ref.isMasterRef)
  if (releaseRef) return client.getAllByType(type, { ref: releaseRef.ref, lang: LANG })
  return published
}

async function main() {
  const source = getSourceBundle()
  const client = createReadClient()

  console.log(`Mengambil konten dari repo "${process.env.PRISMIC_REPOSITORY_NAME}"...`)
  const landmarkDocs = await getAllByTypeSmart(client, 'landmark')
  const sceneDocs = await getAllByTypeSmart(client, 'panorama_scene')
  console.log(`Prismic: ${landmarkDocs.length} landmark, ${sceneDocs.length} scene`)

  if (landmarkDocs.length !== source.landmarks.length)
    err(`jumlah landmark: sumber=${source.landmarks.length} prismic=${landmarkDocs.length}`)
  if (sceneDocs.length !== source.scenes.length)
    err(`jumlah scene: sumber=${source.scenes.length} prismic=${sceneDocs.length}`)

  const landmarkIdByUid = new Map(landmarkDocs.map((doc) => [doc.uid, doc.id]))

  /* ------------------------------- landmark ------------------------------- */
  for (const expected of source.landmarks) {
    const doc = landmarkDocs.find((candidate) => candidate.uid === expected.uid)
    if (!doc) {
      err(`[landmark] ${expected.uid} tidak ditemukan`)
      continue
    }
    const data: any = doc.data
    compareText(`[landmark ${expected.uid}] name`, expected.data.name, data.name)
    compareText(`[landmark ${expected.uid}] object_name`, expected.data.object_name, data.object_name)
    compareText(`[landmark ${expected.uid}] sub_name`, expected.data.sub_name, data.sub_name)
    for (const key of ['is_description', 'is_map', 'is_gallery']) {
      if (Boolean(expected.data[key]) !== Boolean(data[key]))
        err(`[landmark ${expected.uid}] ${key}: ${expected.data[key]} != ${data[key]}`)
    }
    for (const key of [
      'zoom_target_x', 'zoom_target_y', 'zoom_target_z',
      'zoom_camera_x', 'zoom_camera_y', 'zoom_camera_z',
      'tooltip_location_x', 'tooltip_location_y', 'tooltip_location_z',
      'map_pin_x', 'map_pin_y', 'map_pin_radius',
    ]) {
      compareNumber(`[landmark ${expected.uid}] ${key}`, expected.data[key], data[key])
    }
    compareImage(`[landmark ${expected.uid}] thumbnail`, (expected.data.thumbnail as any)?.__image ?? null, data.thumbnail)
    compareRichText(`[landmark ${expected.uid}] description`, (expected.data.description as any)?.__richtext, data.description)

    const expectedFloors = expected.data.map_detail as any[]
    const actualFloors = data.map_detail ?? []
    if (expectedFloors.length !== actualFloors.length)
      err(`[landmark ${expected.uid}] lantai: ${expectedFloors.length} != ${actualFloors.length}`)
    expectedFloors.forEach((floor, index) => {
      const actual = actualFloors[index]
      if (!actual) return
      compareText(`[landmark ${expected.uid}] lantai[${index}].floor_name`, floor.floor_name, actual.floor_name)
      compareImage(`[landmark ${expected.uid}] lantai[${index}].floor_plan`, (floor.floor_plan as any)?.__image ?? null, actual.floor_plan)
    })

    const expectedGallery = expected.data.gallery_detail as any[]
    const actualGallery = data.gallery_detail ?? []
    if (expectedGallery.length !== actualGallery.length)
      err(`[landmark ${expected.uid}] galeri: ${expectedGallery.length} != ${actualGallery.length}`)
    expectedGallery.forEach((entry, index) => {
      const actual = actualGallery[index]
      if (!actual) return
      compareText(`[landmark ${expected.uid}] galeri[${index}].name`, entry.name, actual.name)
      compareImage(`[landmark ${expected.uid}] galeri[${index}].gallery_image`, (entry.gallery_image as any)?.__image ?? null, actual.gallery_image)
      compareRichText(`[landmark ${expected.uid}] galeri[${index}].description`, (entry.description as any)?.__richtext, actual.description)
    })
  }
  ok(`landmark: ${source.landmarks.length} diperiksa`)

  /* --------------------------------- scene --------------------------------- */
  for (const expected of source.scenes) {
    const doc = sceneDocs.find((candidate) => candidate.uid === expected.uid)
    if (!doc) {
      err(`[scene] ${expected.uid} tidak ditemukan`)
      continue
    }
    const data: any = doc.data
    const d: any = expected.data
    compareText(`[scene ${expected.uid}] scene_name`, d.scene_name, data.scene_name)
    compareText(`[scene ${expected.uid}] floor_name`, d.floor_name, data.floor_name)
    compareNumber(`[scene ${expected.uid}] floor_order`, d.floor_order, data.floor_order)
    compareNumber(`[scene ${expected.uid}] scene_order`, d.scene_order, data.scene_order)
    if (Boolean(d.is_tour) !== Boolean(data.is_tour)) err(`[scene ${expected.uid}] is_tour berbeda`)

    // content relationship landmark — tanpa fetchLinks API hanya mengembalikan
    // {link_type, id} tanpa uid, jadi pencocokan memakai id dokumen landmark.
    const expectedLandmarkUid = d.landmark?.uid ?? null
    const expectedId = expectedLandmarkUid ? landmarkIdByUid.get(expectedLandmarkUid) : undefined
    const actualId = data.landmark?.id ?? data.landmark?.data?.id
    const actualLinkUid = data.landmark?.uid ?? data.landmark?.data?.uid ?? null
    if (expectedLandmarkUid && !actualId) err(`[scene ${expected.uid}] link landmark hilang`)
    if (expectedLandmarkUid && actualId && expectedId && expectedId !== actualId)
      err(`[scene ${expected.uid}] link landmark menunjuk dokumen lain (${actualLinkUid || actualId})`)
    if (!expectedLandmarkUid && actualId) err(`[scene ${expected.uid}] tidak seharusnya punya link landmark`)

    compareImage(`[scene ${expected.uid}] panorama`, (d.panorama as any)?.__image ?? null, data.panorama)
    compareNumber(`[scene ${expected.uid}] map_x`, d.map_x, data.map_x)
    compareNumber(`[scene ${expected.uid}] map_y`, d.map_y, data.map_y)
    compareNumber(`[scene ${expected.uid}] map_radius`, d.map_radius, data.map_radius)

    const expectedHotspots = d.hotspots as any[]
    const actualHotspots = data.hotspots ?? []
    if (expectedHotspots.length !== actualHotspots.length)
      err(`[scene ${expected.uid}] hotspot: ${expectedHotspots.length} != ${actualHotspots.length}`)
    expectedHotspots.forEach((hotspot, index) => {
      const actual = actualHotspots[index]
      if (!actual) return
      compareNumber(`[scene ${expected.uid}] hotspot[${index}].pitch`, hotspot.pitch, actual.pitch)
      compareNumber(`[scene ${expected.uid}] hotspot[${index}].yaw`, hotspot.yaw, actual.yaw)
      compareText(`[scene ${expected.uid}] hotspot[${index}].transition`, hotspot.transition, actual.transition)
    })
  }
  ok(`scene: ${source.scenes.length} diperiksa`)

  /* ------------------------------- singleton ------------------------------- */
  const [tour, faq, about, settings] = source.singletons

  const tourDoc = await fetchExisting(client, 'tour')
  if (!tourDoc) err('singleton tour tidak ditemukan')
  else {
    const data: any = tourDoc.data
    compareText('[tour] heading', tour.data.heading, data.heading)
    compareText('[tour] map_name', tour.data.map_name, data.map_name)
    compareRichText('[tour] description', (tour.data.description as any)?.__richtext, data.description)
    compareImage('[tour] floor_plan', (tour.data.floor_plan as any)?.__image ?? null, data.floor_plan)
    const expectedGallery = tour.data.gallery_detail as any[]
    if ((data.gallery_detail ?? []).length !== expectedGallery.length)
      err(`[tour] galeri: ${expectedGallery.length} != ${(data.gallery_detail ?? []).length}`)
  }

  const faqDoc = await fetchExisting(client, 'faq')
  if (!faqDoc) err('singleton faq tidak ditemukan')
  else {
    const data: any = faqDoc.data
    compareRichText('[faq] description', (faq.data.description as any)?.__richtext, data.description)
    const expectedFaq = faq.data.faq_detail as any[]
    const actualFaq = data.faq_detail ?? []
    if (expectedFaq.length !== actualFaq.length) err(`[faq] item: ${expectedFaq.length} != ${actualFaq.length}`)
    expectedFaq.forEach((entry, index) => {
      const actual = actualFaq[index]
      if (!actual) return
      compareText(`[faq] item[${index}].question`, entry.question, actual.question)
      compareRichText(`[faq] item[${index}].answer`, (entry.answer as any)?.__richtext, actual.answer)
    })
  }

  const aboutDoc = await fetchExisting(client, 'about')
  if (!aboutDoc) err('singleton about tidak ditemukan')
  else {
    const data: any = aboutDoc.data
    compareText('[about] heading', about.data.heading, data.heading)
    const expectedContributors = about.data.contributors as any[]
    const actualContributors = data.contributors ?? []
    if (expectedContributors.length !== actualContributors.length)
      err(`[about] kontributor: ${expectedContributors.length} != ${actualContributors.length}`)
    expectedContributors.forEach((entry, index) => {
      const actual = actualContributors[index]
      if (!actual) return
      compareText(`[about] kontributor[${index}].name`, entry.name, actual.name)
      compareText(`[about] kontributor[${index}].role`, entry.role, actual.role)
      const expectedUrl = (entry.linkedin as any)?.url
      const actualUrl = actual.linkedin?.url
      if (expectedUrl !== actualUrl) err(`[about] kontributor[${index}].linkedin: ${expectedUrl} != ${actualUrl}`)
    })
    const expectedCredits = about.data.credits as any[]
    const actualCredits = data.credits ?? []
    if (expectedCredits.length !== actualCredits.length)
      err(`[about] kredit: ${expectedCredits.length} != ${actualCredits.length}`)
  }

  const settingsDoc = await fetchExisting(client, 'site_settings')
  if (!settingsDoc) err('singleton site_settings tidak ditemukan')
  else {
    const data: any = settingsDoc.data
    for (const key of ['seo_title', 'seo_description', 'seo_keywords', 'seo_author', 'seo_url', 'loading_title', 'loading_subtitle']) {
      compareText(`[settings] ${key}`, settings.data[key], data[key])
    }
    compareImage('[settings] seo_og_image', (settings.data.seo_og_image as any)?.__image ?? null, data.seo_og_image)
    if (!rtText(data.tour_catatan)) err('[settings] tour_catatan kosong')
    if (!rtText(data.landmark_catatan)) err('[settings] landmark_catatan kosong')
    const expectedSteps = settings.data.tutorial_steps as any[]
    const actualSteps = data.tutorial_steps ?? []
    if (expectedSteps.length !== actualSteps.length)
      err(`[settings] tutorial_steps: ${expectedSteps.length} != ${actualSteps.length}`)
    expectedSteps.forEach((step, index) => {
      const actual = actualSteps[index]
      if (!actual) return
      compareText(`[settings] step[${index}].title`, step.title, actual.title)
      compareText(`[settings] step[${index}].target`, step.target, actual.target)
      compareText(`[settings] step[${index}].diagram`, step.diagram, actual.diagram)
    })
  }

  /* -------------------------------- ringkasan ------------------------------- */
  console.log('\n=== Ringkasan ===')
  console.log(`Errors: ${errors.length}, Warnings: ${warnings.length}`)
  if (errors.length > 0) {
    console.error('\nVERIFIKASI GAGAL — periksa daftar ✗ di atas.')
    process.exit(1)
  }
  console.log('VERIFIKASI LOLOS — konten Prismic identik dengan data lokal.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
