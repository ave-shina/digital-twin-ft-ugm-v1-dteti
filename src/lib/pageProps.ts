/**
 * Helper getStaticProps bersama untuk halaman yang memakai konten Prismic
 * (src/pages/index.tsx dan src/pages/[content].tsx) — sebelumnya duplikat
 * persis di kedua halaman.
 */
import { getContentBundle } from '@/lib/prismic/client'

export async function getContentPageProps() {
  const bundle = await getContentBundle()
  return {
    props: {
      title: bundle.settings.seo.title,
      landmarks: bundle.landmarks,
      tour: bundle.tour,
      faq: bundle.faq,
      about: bundle.about,
      settings: bundle.settings,
    },
  }
}
