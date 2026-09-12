/**
 * Hapus asset duplikat di Media Library Prismic.
 *
 * Pengiriman ulang migration (retries) meng-upload ulang seluruh set asset —
 * tiap salinan punya URL sendiri (`<uuid>_<filename>`), dan dokumen memegang
 * URL salinan yang aktif saat PUT terakhir. Jadi yang dipertahankan BUKAN
 * salinan terbaru, melainkan salinan yang DIRUJUK dokumen terbit (uuid di URL
 * field gambar). Salinan tanpa peminjam dihapus.
 *
 * Pemakaian:
 *   tsx scripts/cleanup-duplicate-assets.mts            # laporan saja (dry)
 *   tsx scripts/cleanup-duplicate-assets.mts --delete   # benar-benar menghapus
 */
import 'dotenv/config'
import path from 'node:path'

import dotenv from 'dotenv'

import { REPO, TOKEN, createReadClient } from './lib/prismic-env.mts'

const DRY = !process.argv.includes('--delete')

dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true })

type Asset = {
  id: string
  filename: string
  size: number
  width: number
  height: number
  created_at: number
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Asset API agresif membatasi laju — ulangi 429 dengan jeda makin lama. */
async function assetFetch(url: string, init?: RequestInit): Promise<Response> {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, init)
    if (res.status !== 429 || attempt >= 8) return res
    const wait = attempt * 15_000
    console.log(`429 rate limit — menunggu ${wait / 1000} detik...`)
    await sleep(wait)
  }
}

/* ------------------- 1. kumpulkan uuid asset yang dirujuk ------------------- */

const client = createReadClient()
const referenced = new Set<string>()

function walk(value: unknown) {
  if (typeof value === 'string') {
    if (value.startsWith('https://images.prismic.io/')) {
      const base = value.split('?')[0].split('/').pop() ?? ''
      const uuid = base.split('_')[0]
      if (uuid) referenced.add(uuid)
    }
    return
  }
  if (Array.isArray(value)) {
    value.forEach(walk)
    return
  }
  if (value && typeof value === 'object') {
    Object.values(value).forEach(walk)
  }
}

for (const type of ['landmark', 'panorama_scene', 'tour', 'faq', 'about', 'site_settings']) {
  const docs = await client.getAllByType(type, { lang: process.env.PRISMIC_LANG || 'id' })
  docs.forEach((doc) => walk(doc.data))
  console.log(`type ${type}: ${docs.length} dokumen dipindai`)
}
console.log(`uuid asset dirujuk dokumen: ${referenced.size}`)

/* ----------------------------- 2. daftar asset ------------------------------ */

const all: Asset[] = []
for (let offset = 0; ; offset += 100) {
  const res = await assetFetch(`https://asset-api.prismic.io/assets?limit=100&offset=${offset}`, { headers: { repository: REPO!, authorization: `Bearer ${TOKEN}` } })
  if (!res.ok) throw new Error(`GET /assets ${res.status}: ${await res.text()}`)
  const j = (await res.json()) as { total: number; items: Asset[] }
  all.push(...j.items)
  if (all.length >= j.total || j.items.length === 0) break
  await sleep(500)
}
console.log(`total asset di Media Library: ${all.length}`)

/* -------------------- 3. kelompokkan & pilih yang dihapus ------------------- */

const groups = new Map<string, Asset[]>()
for (const a of all) {
  const key = `${a.filename}|${a.size}|${a.width}x${a.height}`
  groups.set(key, [...(groups.get(key) ?? []), a])
}

let freedBytes = 0
const victims: Asset[] = []
let unreferencedUnique = 0
for (const [key, copies] of groups) {
  if (copies.length < 2) continue
  const keepers = copies.filter((a) => referenced.has(a.id))
  const keep = keepers.length > 0 ? keepers : [[...copies].sort((a, b) => b.created_at - a.created_at)[0]]
  for (const a of copies) {
    if (!keep.includes(a)) {
      victims.push(a)
      freedBytes += a.size ?? 0
    }
  }
  if (keepers.length === 0) unreferencedUnique++
}
if (unreferencedUnique > 0) console.log(`⚠ ${unreferencedUnique} grup tanpa peminjam — salinan terbaru dipertahankan`)

console.log(`\nakan dihapus: ${victims.length} asset (${(freedBytes / 1024 / 1024).toFixed(1)} MB), tersisa ${all.length - victims.length}`)
if (DRY) {
  console.log('dry-run: tidak ada yang dihapus. Jalankan dengan --delete untuk menghapus.')
  process.exit(0)
}

let deleted = 0
for (const a of victims) {
  const res = await assetFetch(`https://asset-api.prismic.io/assets/${a.id}`, { method: 'DELETE', headers: { repository: REPO!, authorization: `Bearer ${TOKEN}` } })
  if (res.ok || res.status === 404) {
    deleted++
  } else {
    console.error(`gagal hapus ${a.id} (${a.filename}): ${res.status} ${await res.text()}`)
  }
  if (deleted % 50 === 0) console.log(`dihapus ${deleted}/${victims.length}`)
  await sleep(300)
}
console.log(`✓ selesai: ${deleted} duplikat dihapus, tersisa ${all.length - deleted}`)
