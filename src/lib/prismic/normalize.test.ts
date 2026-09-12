import { describe, expect, it } from 'vitest'

import { emptyImage, normalizeImage } from './normalize'

describe('normalizeImage', () => {
  it('mengembalikan bentuk kosong untuk field tanpa url', () => {
    expect(normalizeImage({})).toEqual(emptyImage())
    expect(normalizeImage({ url: null })).toEqual(emptyImage())
  })

  it('memetakan url/alt/dimensi Prismic ke bentuk data lama', () => {
    const img = normalizeImage({
      url: 'https://images.prismic.io/repo/gedung.jpg?auto=compress&w=1000',
      alt: 'Gedung Teknik',
      dimensions: { width: 2000, height: 1000 },
    })
    const attrs = img.data.attributes
    // Query string tidak ikut menjadi nama file.
    expect(attrs.name).toBe('gedung.jpg')
    expect(attrs.alternativeText).toBe('Gedung Teknik')
    expect(attrs.ext).toBe('.jpg')
    expect(attrs.mime).toBe('image/jpeg')
    expect(attrs.width).toBe(2000)
    expect(attrs.height).toBe(1000)
    expect(attrs.url).toContain('gedung.jpg')
  })

  it('formats.large diskalakan maks lebar 1000px tanpa upscale', () => {
    const big = normalizeImage({
      url: 'https://images.prismic.io/repo/peta.png',
      dimensions: { width: 4000, height: 2000 },
    })
    expect(big.data.attributes.formats.large?.width).toBe(1000)
    expect(big.data.attributes.formats.large?.height).toBe(500)

    // Gambar kecil tidak di-upscale.
    const small = normalizeImage({
      url: 'https://images.prismic.io/repo/kecil.png',
      dimensions: { width: 500, height: 250 },
    })
    expect(small.data.attributes.formats.large?.width).toBe(500)
    expect(small.data.attributes.formats.large?.height).toBe(250)
  })

  it('men-decode nama file ter-encode', () => {
    const img = normalizeImage({
      url: 'https://images.prismic.io/repo/nama%20berkas.png',
    })
    expect(img.data.attributes.name).toBe('nama berkas.png')
  })
})
