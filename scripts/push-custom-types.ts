/**
 * Push semua customtypes/*.json ke Prismic via Custom Types API.
 *
 * Pemakaian:
 *   node --env-file=.env.local scripts/push-custom-types.ts   (via tsx)
 *   npx tsx scripts/push-custom-types.ts
 *
 * Env yang dibutuhkan:
 *   PRISMIC_REPOSITORY_NAME  - nama repo (bagian sebelum .prismic.io)
 *   PRISMIC_ACCESS_TOKEN     - permanent token dengan akses write
 */
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true })

const CUSTOMTYPES_DIR = path.join(process.cwd(), 'customtypes')
const BASE_URL = 'https://customtypes.prismic.io'

const repo = process.env.PRISMIC_REPOSITORY_NAME
const token = process.env.PRISMIC_ACCESS_TOKEN

if (!repo || !token) {
  console.error('PRISMIC_REPOSITORY_NAME dan PRISMIC_ACCESS_TOKEN wajib diisi di .env.local')
  process.exit(1)
}

const headers = {
  repository: repo,
  Authorization: `Bearer ${token}`,
  'Content-Type': 'application/json',
}

async function listExisting(): Promise<Set<string>> {
  const res = await fetch(`${BASE_URL}/customtypes`, { headers })
  if (!res.ok) throw new Error(`GET /customtypes gagal: ${res.status} ${await res.text()}`)
  const types = (await res.json()) as Array<{ id: string }>
  return new Set(types.map((t) => t.id))
}

async function save(type: Record<string, unknown>, exists: boolean) {
  const endpoint = exists ? '/customtypes/update' : '/customtypes/insert'
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(type),
  })
  if (!res.ok) throw new Error(`${endpoint} ${type.id} gagal: ${res.status} ${await res.text()}`)
  return endpoint
}

async function main() {
  const files = (await readdir(CUSTOMTYPES_DIR)).filter((f) => f.endsWith('.json')).sort()
  const existing = await listExisting()
  console.log(`Repo: ${repo}. Custom types di dashboard: ${[...existing].join(', ') || '(kosong)'}`)

  for (const file of files) {
    const raw = await readFile(path.join(CUSTOMTYPES_DIR, file), 'utf8')
    const type = JSON.parse(raw)
    const action = await save(type, existing.has(type.id))
    console.log(`✓ ${type.id} (${file}) -> ${action === '/customtypes/update' ? 'update' : 'insert'}`)
  }
  console.log(`Selesai. ${files.length} custom types tersimpan di Prismic.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
