import DOMPurify from 'dompurify'

/**
 * Sanitasi HTML string untuk mencegah XSS saat menggunakan dangerouslySetInnerHTML.
 * Mengizinkan tag umum dan link, namun strips script/event handler.
 */
export function sanitizeHtml(dirty: string | undefined | null): string {
  if (!dirty) return ''
  if (typeof window === 'undefined') return dirty
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'a', 'b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div', 'img',
      'hr', 'blockquote', 'code', 'pre', 'table', 'thead', 'tbody',
      'tr', 'th', 'td', 'sup', 'sub', 'u', 's',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'style'],
    ALLOW_DATA_ATTR: false,
  })
}
