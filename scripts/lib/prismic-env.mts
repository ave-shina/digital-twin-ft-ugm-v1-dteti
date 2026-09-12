/**
 * Helper bersama untuk script Prismic: env + client + pencarian dokumen
 * (termasuk yang masih berupa draft di Migration Release).
 */
import path from 'node:path'

import * as prismic from '@prismicio/client'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true })

export const REPO = process.env.PRISMIC_REPOSITORY_NAME
export const TOKEN = process.env.PRISMIC_ACCESS_TOKEN
export const LANG = process.env.PRISMIC_LANG || 'id'

export function requirePrismicEnv() {
  if (!REPO || !TOKEN) {
    console.error('PRISMIC_REPOSITORY_NAME dan PRISMIC_ACCESS_TOKEN wajib diisi di .env.local')
    process.exit(1)
  }
}

export function createWriteClient(): prismic.WriteClient {
  requirePrismicEnv()
  return prismic.createWriteClient(REPO!, { writeToken: TOKEN! })
}

export function createReadClient(): prismic.Client {
  requirePrismicEnv()
  return prismic.createClient(REPO!)
}

/** Cari dokumen yang sudah ada: master ref dulu, lalu ref migration release. */
export async function fetchExisting(
  client: prismic.Client,
  type: string,
  uid?: string,
  lang = LANG,
): Promise<prismic.PrismicDocument | undefined> {
  try {
    if (uid) return await client.getByUID(type, uid, { lang })
    return await client.getSingle(type, { lang })
  } catch {
    try {
      const repo = await client.getRepository()
      const releaseRef = repo.refs.find((ref) => !ref.isMasterRef)
      if (!releaseRef) return undefined
      if (uid) return await client.getByUID(type, uid, { ref: releaseRef.ref, lang })
      return await client.getSingle(type, { ref: releaseRef.ref, lang })
    } catch {
      return undefined
    }
  }
}
