import { getContentBundle } from '../src/lib/prismic/client'

async function main() {
  const bundle = await getContentBundle()
  const entries = {
    title: bundle.settings.seo.title,
    landmarks: bundle.landmarks,
    tour: bundle.tour,
    faq: bundle.faq,
    about: bundle.about,
    settings: bundle.settings,
  } as Record<string, unknown>
  for (const [key, value] of Object.entries(entries)) {
    console.log(key.padEnd(12), (JSON.stringify(value).length / 1024).toFixed(1), 'kB')
  }
  console.log('---')
  console.log('total'.padEnd(12), (JSON.stringify(entries).length / 1024).toFixed(1), 'kB')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})