/**
 * Perbaikan sekali pakai: isi content relationship `landmark` di semua scene
 * panorama. Run migrate upsert ke-9 mengosongkan field ini (ref landmark tak
 * terdaftar saat jalur update), dan pengulangan migrate() selalu tertahan
 * throttle setelah upload asset ulang — padahal PUT langsung berjalan normal.
 *
 * Strategi: PATCH via PUT /documents/{id} berisi data existing utuh dengan
 * hanya field `landmark` yang diganti. Idempotent: scene yang sudah menunjuk
 * landmark benar dilewati.
 *
 * Pemakaian:
 *   tsx scripts/fix-landmark-links.mts            # laporan saja (dry)
 *   tsx scripts/fix-landmark-links.mts --write    # benar-benar mengirim
 */
import 'dotenv/config'
import path from 'node:path'

import dotenv from 'dotenv'

import { normText } from './lib/normalize-text.mts'
import { LANG, createReadClient } from './lib/prismic-env.mts'
import { getSourceBundle } from './lib/source'

const WRITE = process.argv.includes('--write')

dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true })
const REPO = process.env.PRISMIC_REPOSITORY_NAME!
const TOKEN = process.env.PRISMIC_ACCESS_TOKEN!

const source = getSourceBundle()
const client = createReadClient()

const landmarkDocs = await client.getAllByType('landmark', { lang: LANG })
const landmarkIdByUid = new Map(landmarkDocs.map((d) => [d.uid, d.id]))
const sceneDocs = await client.getAllByType('panorama_scene', { lang: LANG })
console.log(`landmark: ${landmarkDocs.length}, scene: ${sceneDocs.length}`)

const expectedByUid = new Map(source.scenes.map((s) => [s.uid, (s.data as any).landmark?.uid ?? null]))

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

let fixed = 0
let pending = 0
let skipped = 0
let missing = 0
for (const doc of sceneDocs) {
  const expectedUid = expectedByUid.get(doc.uid!) ?? null
  const expectedId = expectedUid ? landmarkIdByUid.get(expectedUid) : undefined
  const currentId = (doc.data as any).landmark?.id ?? null

  if (!expectedUid && !currentId) {
    skipped++
    continue
  }
  if (expectedUid && currentId === expectedId) {
    skipped++
    continue
  }
  if (!expectedId) {
    // sumber tidak punya landmark tapi field terisi — kosongkan
    console.log(`⚠ [scene ${doc.uid}] sumber tanpa landmark, field berisi ${currentId} — dikosongkan`)
    missing++
  }

  const data = { ...(doc.data as Record<string, unknown>), landmark: expectedId ? { link_type: 'Document', id: expectedId } : {} }
  console.log(`${WRITE ? '→' : '·'} [scene ${doc.uid}] landmark: ${currentId ?? '∅'} ${expectedUid ? `→ ${expectedUid} (${expectedId})` : '→ ∅'}`)
  pending++
  if (!WRITE) continue

  const res = await fetch(`https://migration.prismic.io/documents/${doc.id}`, {
    method: 'PUT',
    headers: { repository: REPO, authorization: `Bearer ${TOKEN}`, 'content-type': 'application/json' },
    body: JSON.stringify({ title: doc.data.scene_name, uid: doc.uid, data }),
    signal: AbortSignal.timeout(60_000),
  })
  if (!res.ok) {
    console.error(`✗ gagal [scene ${doc.uid}]: ${res.status} ${(await res.text()).slice(0, 200)}`)
    process.exit(1)
  }
  fixed++
  await sleep(1_200)
}

console.log(
  `\n${WRITE ? `✓ ${fixed} scene diperbaiki` : `dry: ${pending} scene akan diperbaiki`}, ${skipped} sudah benar`,
)
if (missing > 0) console.log(`⚠ ${missing} scene dikosongkan landmark-nya (sumber memang tanpa landmark)`)
