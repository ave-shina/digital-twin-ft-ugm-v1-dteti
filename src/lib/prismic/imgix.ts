/**
 * Tambah parameter imgix pada URL gambar Prismic (images.prismic.io).
 * Menggantikan transformasi URL Cloudinary (`/upload/w_1000,...`).
 * URL non-Prismic dikembalikan apa adanya agar aman dipakai campur.
 */
export function withImgixParams(
  url: string,
  params: Record<string, string | number>,
): string {
  if (!url) return url
  try {
    const parsed = new URL(url)
    if (!parsed.hostname.endsWith('.images.prismic.io') && parsed.hostname !== 'images.prismic.io') {
      return url
    }
    for (const [key, value] of Object.entries(params)) {
      parsed.searchParams.set(key, String(value))
    }
    return parsed.toString()
  } catch {
    return url
  }
}
