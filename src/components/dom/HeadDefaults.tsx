import Head from 'next/head'

/**
 * Tag dokumen global (bukan SEO): charset, viewport, tema, favicon, manifest.
 * Tag SEO (judul, deskripsi, canonical, OG) ada di PageSeo per halaman agar
 * tidak pernah ganda.
 */
export default function HeadDefaults() {
  return (
    <Head>
      <meta charSet='utf-8' />
      <meta name='viewport' content='width=device-width, minimum-scale=1, initial-scale=1.0' />
      <meta name='theme-color' content='#000' />

      <link rel='shortcut icon' href='/icons/favicon.ico' />
      <link rel='icon' type='image/png' sizes='32x32' href='/icons/favicon-32x32.png' />
      <link rel='icon' type='image/png' sizes='16x16' href='/icons/favicon-16x16.png' />
      {/* Ikon asli 180x180 (favicon-32x32 sebelumnya dipakai untuk sizes=180x180). */}
      <link rel='apple-touch-icon' sizes='180x180' href='/icons/apple-touch-icon.png' />
      <link rel='manifest' href='/manifest.json' />
    </Head>
  )
}
