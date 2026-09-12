/**
 * Migrasi seluruh konten lokal -> Prismic (Migration API v7).
 *
 * Pemakaian:
 *   npx tsx scripts/migrate-to-prismic.ts --dry-run          # validasi lokal saja
 *   npx tsx scripts/migrate-to-prismic.ts                    # buat semua dokumen (draft)
 *   npx tsx scripts/migrate-to-prismic.ts --mode upsert      # idempotent: update yang sudah ada
 *   npx tsx scripts/migrate-to-prismic.ts --publish          # sekaligus publish migration release
 *
 * Env (.env.local): PRISMIC_REPOSITORY_NAME, PRISMIC_ACCESS_TOKEN, PRISMIC_LANG
 */
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'

import * as prismic from '@prismicio/client'
import { htmlAsRichText } from '@prismicio/migrate'

import { LANG, createWriteClient, fetchExisting } from './lib/prismic-env.mts'
import { FlatDocument, FlatImage, getSourceBundle, getSourceStats } from './lib/source'

const JOURNAL = path.join(process.cwd(), 'scripts', 'migration-journal.jsonl')

const args = process.argv.slice(2)
const argv = new Set(args)
const DRY_RUN = argv.has('--dry-run')
const MODE = args.includes('--mode=upsert') || args[args.indexOf('--mode') + 1] === 'upsert' ? 'upsert' : 'create'
const UPSERT_FLAG = MODE === 'upsert'
const PUBLISH = argv.has('--publish')

/* ------------------------------- jurnal audit ------------------------------ */

function journal(entry: Record<string, unknown>) {
  fs.appendFileSync(JOURNAL, JSON.stringify({ at: new Date().toISOString(), ...entry }) + '\n')
}

/* --------------------------------- client --------------------------------- */

// write client dibuat lazy: --dry-run tidak butuh kredensial
let writeClient: prismic.WriteClient
const migration = prismic.createMigration()

/* ------------------------------ asset registry ----------------------------- */

const assetCache = new Map<string, prismic.PrismicMigrationAsset>()

function registerAssetFromDescriptor(descriptor: FlatImage): prismic.PrismicMigrationAsset {
  const cached = assetCache.get(descriptor.key)
  if (cached) return cached
  const ref = migration.createAsset(descriptor.url, descriptor.filename, {
    alt: descriptor.alt,
    tags: descriptor.tags,
  })
  assetCache.set(descriptor.key, ref)
  journal({ kind: 'asset', key: descriptor.key, filename: descriptor.filename })
  return ref
}

function registerAssetFromBuffer(buffer: Buffer, descriptor: FlatImage): prismic.PrismicMigrationAsset {
  const cached = assetCache.get(descriptor.key)
  if (cached) return cached
  const ref = migration.createAsset(buffer, descriptor.filename, { alt: descriptor.alt, tags: descriptor.tags })
  assetCache.set(descriptor.key, ref)
  journal({ kind: 'asset', key: descriptor.key, filename: descriptor.filename, source: 'local' })
  return ref
}

function registerInlineImage(url: string): prismic.PrismicMigrationAsset {
  const key = url.replace(/\/v\d+\//, '/')
  const cached = assetCache.get(key)
  if (cached) return cached
  const filename = decodeURIComponent(key.split('/').pop() || 'inline-image')
  const ref = migration.createAsset(url, filename, { alt: 'ilustrasi', tags: ['inline'] })
  assetCache.set(key, ref)
  journal({ kind: 'asset', key, filename: filename, source: 'richtext' })
  return ref
}

/* -------------------------- hydrate marker -> fields ----------------------- */

function convertRichText(html: string): prismic.RichTextField {
  const { result, warnings } = htmlAsRichText(html, {
    serializer: {
      img: ({ node }) => {
        const src = String((node.properties as any)?.src ?? '')
        if (!src) return undefined
        return { type: 'image', id: registerInlineImage(src) }
      },
    },
  })
  for (const warning of warnings) console.warn(`  ⚠ richtext: ${warning}`)
  return result
}

function hydrate(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(hydrate)
  if (value === null || value === undefined) return null
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>
    if (record.__image && record.__buffer) {
      return registerAssetFromBuffer(record.__buffer as Buffer, record.__image as FlatImage)
    }
    if (record.__image) return registerAssetFromDescriptor(record.__image as FlatImage)
    if (record.__ref === 'landmark') return landmarkRefs.get(record.uid as string)
    if (typeof record.__richtext === 'string') return convertRichText(record.__richtext)
    if (record.__rt) return record.__rt
    const out: Record<string, unknown> = {}
    for (const [key, child] of Object.entries(record)) out[key] = hydrate(child)
    return out
  }
  return value
}

/* ------------------------------- registrasi -------------------------------- */

const landmarkRefs = new Map<string, prismic.PrismicMigrationDocument>()

async function registerDocument(doc: FlatDocument): Promise<prismic.PrismicMigrationDocument> {
  const data = hydrate(doc.data) as Record<string, unknown>

  let existing: prismic.PrismicDocument | undefined
  if (UPSERT_FLAG) {
    existing = await fetchExisting(writeClient, doc.type, doc.uid)
  }

  let ref: prismic.PrismicMigrationDocument
  if (existing) {
    ref = migration.updateDocument({ ...existing, data }, doc.title)
    journal({ kind: 'doc', action: 'update', type: doc.type, uid: doc.uid ?? null })
  } else {
    ref = migration.createDocument(
      {
        type: doc.type,
        uid: doc.uid,
        lang: LANG,
        data,
      },
      doc.title,
    )
    journal({ kind: 'doc', action: 'create', type: doc.type, uid: doc.uid ?? null })
  }
  // Scene butuh ref landmark utk content relationship — daftarkan di KEDUA jalur
  // (update path pun punya document.id dari dokumen existing, jadi tetap valid).
  if (doc.type === 'landmark' && doc.uid) landmarkRefs.set(doc.uid, ref)
  return ref
}

/* ---------------------------------- main ----------------------------------- */

async function main() {
  const stats = getSourceStats()
  console.log('=== Statistik sumber (lokal) ===')
  console.log(JSON.stringify(stats, null, 2))

  if (stats.danglingTransitions.length > 0) {
    console.warn(`⚠ ${stats.danglingTransitions.length} hotspot transition tidak menemukan tujuan:`)
    for (const dangling of stats.danglingTransitions) console.warn(`   - ${dangling}`)
  }

  if (DRY_RUN) {
    console.log('\n--dry-run: tidak ada yang dikirim ke Prismic.')
    process.exit(stats.danglingTransitions.length > 2 ? 1 : 0)
  }

  writeClient = createWriteClient()

  const source = getSourceBundle()
  const ordered: FlatDocument[] = [
    // landmark dulu: scene butuh ref-nya untuk content relationship
    ...source.landmarks,
    ...source.scenes,
    ...source.singletons,
  ]
  console.log(`\nTotal dokumen: ${ordered.length}, asset unik: ${assetCache.size} (registrasi berjalan)`)

  for (const doc of ordered) {
    await registerDocument(doc)
    const label = doc.uid ?? doc.type
    console.log(`+ terdaftar: [${doc.type}] ${label} — ${doc.title}`)
  }

  console.log(`\nMengirim ke Prismic (${assetCache.size} asset, ${ordered.length} dokumen)...`)
  // Kesalahan jaringan sesekali (ETIMEDOUT) saat upload puluhan asset — ulangi
  // hingga 3x. Mode upsert membuat pengiriman ulang aman untuk dokumen.
  const sendMigration = async (): Promise<void> => {
    await writeClient.migrate(migration, {
      reporter: (event) => {
        switch (event.type) {
          case 'assets:creating':
            if (event.data.current % 25 === 0 || event.data.remaining === 0)
              console.log(`asset ${event.data.current}/${event.data.total}`)
            break
          case 'documents:creating':
            if (event.data.current % 10 === 0 || event.data.remaining === 0)
              console.log(`dokumen ${event.data.current}/${event.data.total}`)
            break
          case 'documents:updating':
            // Jurnal per dokumen: bila patch gagal, dokumen terakhir di jurnal adalah biang keladinya.
            journal({
              kind: 'update',
              i: event.data.current,
              total: event.data.total,
              title: event.data.document.title,
            })
            if (event.data.current % 25 === 0 || event.data.remaining === 0)
              console.log(`patch data ${event.data.current}/${event.data.total}`)
            break
          case 'end':
            console.log(`✓ selesai: ${event.data.migrated.documents} dokumen, ${event.data.migrated.assets} asset`)
            break
        }
      },
    })
  }
  for (let attempt = 1; ; attempt++) {
    try {
      await sendMigration()
      break
    } catch (error) {
      const prismicPayload = (error as { response?: unknown })?.response
      journal({
        kind: 'run',
        status: 'retry',
        attempt,
        message: String((error as Error)?.message ?? error),
        url: (error as { url?: string })?.url,
        payload: prismicPayload,
      })
      console.error('payload error:', JSON.stringify(prismicPayload, null, 2))
      // Error validasi API (400 dsb.) sifatnya deterministik — ulangi tidak akan
      // berubah, dan tiap pengulangan meng-upload ulang seluruh asset. Ulangi
      // hanya untuk gangguan jaringan.
      if (error instanceof prismic.InvalidDataError || error instanceof prismic.ForbiddenError || error instanceof prismic.NotFoundError) throw error
      if (attempt >= 3) throw error
      console.warn(`⚠ pengiriman gagal (percobaan ${attempt}/3), mengulang: ${String((error as Error)?.message ?? error)}`)
      await new Promise((resolve) => setTimeout(resolve, 30_000 * attempt))
    }
  }
  journal({ kind: 'run', status: 'migrated', documents: ordered.length, assets: assetCache.size })

  if (PUBLISH) {
    console.log('Mempublikasikan migration release...')
    const result = await writeClient.publishMigrationRelease()
    journal({ kind: 'run', status: 'published' })
    console.log(`✓ terbit: ${result.totalItems} dokumen`)
  } else {
    console.log('\nⓘ Dokumen masih berupa draft di Migration Release.')
    console.log('  Publish manual via dashboard (dengan tombol Publish pada release),')
    console.log('  atau jalankan ulang script dengan flag --publish.')
  }
}

main().catch((error) => {
  console.error(error)
  journal({ kind: 'run', status: 'error', message: String(error?.message ?? error) })
  process.exit(1)
})
