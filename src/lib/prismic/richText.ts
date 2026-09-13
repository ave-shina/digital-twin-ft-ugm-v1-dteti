/**
 * Render rich text Prismic menjadi string HTML untuk dipakai
 * `dangerouslySetInnerHTML` (bentuk lama komponen memakai string HTML).
 *
 * Label span khusus untuk blok Catatan peta:
 *  - `blue-dot` / `red-dot` -> lingkaran warna
 *  - `camera`               -> ikon kamera (icons8, sama seperti sebelumnya)
 *
 * HASILNYA SELALU DISANITASI. Modul ini hanya berjalan saat build
 * (getStaticProps/SSG) — HTML yang dibekukan ke props halaman statis wajib
 * bersih, karena sanitasi client (`sanitizeHtml`) tidak pernah berjalan di
 * server/SSG. Titik rawan: serializer embed bawaan @prismicio/client
 * menyuntik `oembed.html` mentah — DOMPurify adalah lapisan terakhir sebelum
 * HTML dibekukan (embed/script/iframe di luar allowlist akan dibuang).
 */
import { asHTML, type RichTextField } from '@prismicio/client'
import type { HTMLRichTextFunctionSerializer } from '@prismicio/client'
import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

import { SANITIZE_CONFIG } from '@/utils/sanitize'

const CAMERA_ICON_URL = 'https://img.icons8.com/material/4ac144/256/camera.png'

/**
 * DOMPurify butuh DOM — di Node (build/vitest) kita pakai window jsdom.
 * Impor jsdom di modul ini AMAN: hanya normalize.ts (server-only) yang
 * mengimpornya, jadi jsdom tidak pernah masuk bundle browser.
 */
type PurifyWindow = NonNullable<Parameters<typeof DOMPurify>[0]>
const purify = DOMPurify(new JSDOM('').window as unknown as PurifyWindow)

/**
 * Label yang dikenal dan diizinkan pada blok Catatan peta. Label di luar
 * daftar ini jatuh ke serializer default — interpolasi string arbitrer dari
 * CMS ke atribut class membuka celah stored XSS oleh editor.
 */
const ALLOWED_LABELS = new Set(['blue-dot', 'red-dot', 'camera'])

const catatanLabelSerializer: HTMLRichTextFunctionSerializer = (type, node, _text, children) => {
  if (type === 'label') {
    const label = (node as unknown as { data?: { label?: string } }).data?.label
    if (label === 'blue-dot') {
      return '<span class="mx-1 inline-block h-2 w-2 rounded-full bg-blue-600"></span>'
    }
    if (label === 'red-dot') {
      return '<span class="mx-1 inline-block h-2 w-2 rounded-full bg-red-500"></span>'
    }
    if (label === 'camera') {
      return `<span class="relative -bottom-1 inline-block h-4 w-4"><img src="${CAMERA_ICON_URL}" alt="ikon kamera" class="h-full w-full" /></span>`
    }
    if (label && ALLOWED_LABELS.has(label)) {
      return `<span class="${label}">${children}</span>`
    }
  }
  // selain itu pakai serializer default (children berupa string)
  return undefined
}

/** Rich text -> HTML string TERsanitasi (fallback serializer default untuk blok lain). */
export function richTextToHtml(field: RichTextField | null | undefined): string {
  if (!field || !Array.isArray(field) || field.length === 0) return ''
  return purify.sanitize(asHTML(field, { serializer: catatanLabelSerializer }) ?? '', SANITIZE_CONFIG)
}
