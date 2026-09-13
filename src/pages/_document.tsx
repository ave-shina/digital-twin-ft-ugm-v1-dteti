import { Html, Head, Main, NextScript } from 'next/document'

/** Dokumen dasar — `lang="id"` karena seluruh konten berbahasa Indonesia
 * (tanpa file ini Next.js memakai `lang="en"` bawaan). */
export default function Document() {
  return (
    <Html lang='id'>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
