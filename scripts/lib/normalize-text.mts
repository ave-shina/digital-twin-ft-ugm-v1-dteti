/**
 * Normalisasi teks untuk perbandingan rich text antara HTML sumber dan
 * field rich text Prismic (via asText). Styling diabaikan; perbedaan spasi
 * di sekitar batas tag/tanda baca juga diabaikan karena tidak berarti.
 */
export function normText(value: string): string {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    // tag blok = pemisah konten (jadi spasi); tag inline (a/em/strong…) = bagian
    // dari teks yang sama (dibuang tanpa spasi, sama seperti render HTML/asText).
    .replace(/<(\/?)(p|h[1-6]|li|ul|ol|blockquote|div|table|tr|pre)\b[^>]*>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,;:!?)\]}])/g, '$1')
    .replace(/([([{])\s+/g, '$1')
    .trim()
}
