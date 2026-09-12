/**
 * Render rich text Prismic menjadi string HTML untuk dipakai
 * `dangerouslySetInnerHTML` (bentuk lama komponen memakai string HTML).
 *
 * Label span khusus untuk blok Catatan peta:
 *  - `blue-dot` / `red-dot` -> lingkaran warna
 *  - `camera`               -> ikon kamera (icons8, sama seperti sebelumnya)
 */
import { asHTML, type RichTextField } from '@prismicio/client'
import type { HTMLRichTextFunctionSerializer } from '@prismicio/client'

const CAMERA_ICON_URL = 'https://img.icons8.com/material/4ac144/256/camera.png'

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
    if (label) {
      return `<span class="${label}">${children}</span>`
    }
  }
  // selain itu pakai serializer default (children berupa string)
  return undefined
}

/** Rich text -> HTML string (fallback ke serializer default untuk blok lain). */
export function richTextToHtml(field: RichTextField | null | undefined): string {
  if (!field || !Array.isArray(field) || field.length === 0) return ''
  return asHTML(field, { serializer: catatanLabelSerializer }) ?? ''
}
