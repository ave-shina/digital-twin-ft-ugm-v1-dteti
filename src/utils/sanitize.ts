import DOMPurify from 'dompurify'

/**
 * Allowlist sanitasi HTML — SATU SUMBER untuk dua lapis sanitasi:
 *  1. Build-time (utama): src/lib/prismic/richText.ts (DOMPurify + jsdom) —
 *     HTML dari Prismic dibersihkan sebelum dibekukan ke props halaman statis.
 *  2. Client (pertahanan kedua): sanitizeHtml di bawah, saat string HTML
 *     dirender ulang di browser.
 * Didefinisikan di sini agar kedua lapis tidak mungkin berbeda konfigurasi.
 */
export const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'a',
    'b',
    'i',
    'em',
    'strong',
    'p',
    'br',
    'ul',
    'ol',
    'li',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'span',
    'div',
    'img',
    'hr',
    'blockquote',
    'code',
    'pre',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
    'sup',
    'sub',
    'u',
    's',
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'style'],
  ALLOW_DATA_ATTR: false,
}

/**
 * Sanitasi HTML string untuk mencegah XSS saat menggunakan dangerouslySetInnerHTML.
 * Mengizinkan tag umum dan link, namun strips script/event handler.
 *
 * CATATAN: di server fungsi ini no-op (DOMPurify butuh DOM browser). Semua HTML
 * dari Prismic sudah disanitasi saat build di src/lib/prismic/richText.ts —
 * string yang sampai ke sini (via props) dijamin bersih.
 */
export function sanitizeHtml(dirty: string | undefined | null): string {
  if (!dirty) return ''
  if (typeof window === 'undefined') return dirty
  return DOMPurify.sanitize(dirty, SANITIZE_CONFIG)
}
