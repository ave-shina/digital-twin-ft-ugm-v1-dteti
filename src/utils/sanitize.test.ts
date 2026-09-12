// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'

import { sanitizeHtml } from './sanitize'

describe('sanitizeHtml', () => {
  it('mengembalikan string kosong untuk input kosong', () => {
    expect(sanitizeHtml(null)).toBe('')
    expect(sanitizeHtml(undefined)).toBe('')
    expect(sanitizeHtml('')).toBe('')
  })

  it('membuang <script> dan event handler', () => {
    const out = sanitizeHtml('<p onclick="steal()">Hai</p><script>alert(1)</script>')
    expect(out).not.toContain('<script')
    expect(out).not.toContain('onclick')
    expect(out).toContain('Hai')
  })

  it('mempertahankan tag dan atribut yang diizinkan', () => {
    const out = sanitizeHtml('<p><a href="https://ft.ugm.ac.id" target="_blank">FT UGM</a></p>')
    expect(out).toContain('<a href="https://ft.ugm.ac.id"')
    expect(out).toContain('FT UGM')
  })

  it('membuang atribut data-* dan atribut asing', () => {
    const out = sanitizeHtml('<p data-x="1" weird="2">isi</p>')
    expect(out).not.toContain('data-x')
    expect(out).not.toContain('weird')
  })
})
