import Head from 'next/head'

import { useSettings } from '@/context/SettingsContext'

interface PageSeoProps {
  /** Judul halaman — dirender `<judul> | <judul situs>`; kosong = judul situs. */
  title?: string
  /** Deskripsi halaman; kosong = deskripsi situs dari Prismic. */
  description?: string
  /** Path halaman (mis. '/faq') untuk canonical & og:url; kosong untuk beranda. */
  path?: string
}

/**
 * Meta SEO per halaman — satu-satunya sumber tag SEO di <head> (HeadDefaults
 * di _app hanya memuat tag dokumen: charset, viewport, favicon) sehingga tidak
 * ada judul/deskripsi/OG ganda. Nilai diambil dari Prismic (site_settings.seo).
 */
export default function PageSeo({ title, description, path = '' }: PageSeoProps) {
  const settings = useSettings()
  const { title: siteTitle, description: siteDescription, keywords, author, url, ogImage } = settings.seo

  const base = url.replace(/\/$/, '')
  const pageTitle = title ? `${title} | ${siteTitle}` : siteTitle
  const pageDescription = description || siteDescription
  const canonical = `${base}${path}`
  // OG image harus URL absolut; bila relatif, dianggap di bawah base URL situs.
  const ogImageUrl = /^https?:\/\//.test(ogImage) ? ogImage : `${base}${ogImage}`

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name='description' content={pageDescription} />
      <meta name='keywords' content={keywords} />
      <meta name='author' content={author} />
      <meta name='robots' content='index,follow' />
      <link rel='canonical' href={canonical} />

      {/*
      Facebook Open Graph meta tags
        documentation: https://developers.facebook.com/docs/sharing/opengraph */}
      <meta property='og:type' content='website' />
      <meta property='og:site_name' content={siteTitle} />
      <meta property='og:locale' content='id_ID' />
      <meta property='og:url' content={canonical} />
      <meta property='og:title' content={pageTitle} />
      <meta property='og:description' content={pageDescription} />
      <meta property='og:image' content={ogImageUrl} />

      {/*
      Twitter card besar (memakai og:image)
        documentation: https://developer.x.com/en/docs/twitter-for-websites/cards */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={pageTitle} />
      <meta name='twitter:description' content={pageDescription} />
      <meta name='twitter:image' content={ogImageUrl} />
    </Head>
  )
}
