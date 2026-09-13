import { describe, expect, it } from 'vitest'

import { richTextToHtml } from './richText'
import type { RichTextField } from '@prismicio/client'

/** Helper: rich text satu paragraf dengan span label pada seluruh teks. */
function labeledParagraph(text: string, label: string): RichTextField {
  return [
    {
      type: 'paragraph',
      text,
      spans: [{ type: 'label', start: 0, end: text.length, data: { label } }],
    },
  ]
}

describe('richTextToHtml', () => {
  it('mengembalikan string kosong untuk field kosong', () => {
    expect(richTextToHtml(null)).toBe('')
    expect(richTextToHtml(undefined)).toBe('')
    expect(richTextToHtml([])).toBe('')
  })

  it('merender paragraf biasa', () => {
    const field: RichTextField = [{ type: 'paragraph', text: 'Halo dunia', spans: [] }]
    expect(richTextToHtml(field)).toContain('<p>Halo dunia</p>')
  })

  it('merender label blue-dot sebagai lingkaran biru', () => {
    const html = richTextToHtml(labeledParagraph('titik', 'blue-dot'))
    expect(html).toContain('bg-blue-600')
  })

  it('merender label camera sebagai ikon kamera', () => {
    const html = richTextToHtml(labeledParagraph('foto', 'camera'))
    expect(html).toContain('img.icons8.com')
  })

  it('TIDAK menginterpolasi label arbitrer ke atribut class (stored XSS)', () => {
    const hostile = '"><script>alert(1)</script>'
    const html = richTextToHtml(labeledParagraph('teks', hostile))
    // Label jahat tidak boleh muncul mentah di output.
    expect(html).not.toContain('<script>')
    expect(html).not.toContain('"><span')
    // Teks dalam tetap dirender.
    expect(html).toContain('teks')
  })

  it('label tak dikenal jatuh ke serializer default yang ter-escape', () => {
    const html = richTextToHtml(labeledParagraph('catatan', 'kustom'))
    expect(html).toContain('catatan')
    expect(html).not.toContain('class=kustom')
  })

  it('menyaring embed oEmbed mentah (serializer default menyuntik html apa adanya)', () => {
    const field = [
      {
        type: 'embed',
        oembed: {
          html: '<p>aman</p><script>alert(1)</script><iframe src="https://evil.example"></iframe>',
          embed_url: 'https://evil.example',
          type: 'rich',
        },
      },
    ] as unknown as RichTextField
    const html = richTextToHtml(field)
    expect(html).not.toContain('<script')
    expect(html).not.toContain('<iframe')
    expect(html).toContain('aman')
  })

  it('membuang href javascript: pada hyperlink (sisa tetap dirender)', () => {
    const field: RichTextField = [
      {
        type: 'paragraph',
        text: 'klik',
        spans: [{ type: 'hyperlink', start: 0, end: 4, data: { link_type: 'Web', url: 'javascript:alert(1)' } }],
      },
    ]
    const html = richTextToHtml(field)
    expect(html).not.toContain('javascript:')
    expect(html).toContain('klik')
  })

  it('mempertahankan markup yang diizinkan lewat sanitasi', () => {
    const field: RichTextField = [
      {
        type: 'paragraph',
        text: 'tautan',
        spans: [{ type: 'hyperlink', start: 0, end: 6, data: { link_type: 'Web', url: 'https://ft.ugm.ac.id' } }],
      },
    ]
    const html = richTextToHtml(field)
    expect(html).toContain('href="https://ft.ugm.ac.id"')
    expect(html).toContain('tautan')
  })
})
