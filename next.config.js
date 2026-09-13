const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// Route kustom didahulukan dari default next-pwa (registerRoute dievaluasi
// berurutan). Tanpa ini: GLB jatuh ke route same-origin "others" NetworkFirst
// (kedaluwarsa 1 hari, bisa ter-evict), dan gambar Prismic — yang selalu
// punya query string (?auto=format&w=…) — tidak pernah match route gambar
// default (anchored $) sehingga hanya bertahan 1 jam di cache cross-origin.
const defaultPwaCache = require('next-pwa/cache')

const runtimeCaching = [
  {
    // Model 3D: besar dan hampir tidak pernah berubah.
    urlPattern: /\.glb$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'gltf-models',
      rangeRequests: true,
      expiration: { maxEntries: 4, maxAgeSeconds: 30 * 24 * 60 * 60, purgeOnQuotaError: true },
      cacheableResponse: { statuses: [0, 200] },
    },
  },
  {
    // Gambar panorama/peta/galeri dari CDN Prismic.
    urlPattern: /^https:\/\/images\.prismic\.io\/.*/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'prismic-images',
      expiration: { maxEntries: 120, maxAgeSeconds: 30 * 24 * 60 * 60 },
      cacheableResponse: { statuses: [0, 200] },
    },
  },
  {
    // Prakiraan cuaca BMKG diperbarui berkala — jangan disimpan terlalu lama.
    urlPattern: /^https:\/\/api\.bmkg\.go\.id\/.*/i,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'bmkg-weather',
      networkTimeoutSeconds: 5,
      expiration: { maxEntries: 8, maxAgeSeconds: 6 * 60 * 60 },
      cacheableResponse: { statuses: [0, 200] },
    },
  },
  ...defaultPwaCache,
]

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  // GLB (±9 MB) TIDAK di-precache — install SW tidak boleh mengunduh model;
  // ia di-cache runtime oleh route gltf-models di atas. audio.mp3 (1,6 MB)
  // dan robots/sitemap juga dikeluarkan (audio punya route CacheFirst
  // bawaan; robots/sitemap harus selalu fresh di mata crawler).
  publicExcludes: ['!noprecache/**/*', '!object/**/*', '!audio.mp3', '!robots.txt', '!sitemap.xml'],
  // Pulihkan default Workbox yang tertimpa next-pwa: tanpa ini /?content=…
  // dianggap URL berbeda dari / pada pencocokan precache & runtime.
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  runtimeCaching,
})

const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    // Catatan: header hanya berlaku saat disajikan lewat server Next/Vercel —
    // pada `EXPORT=true next build` (next export) headers() tidak diaplikasikan.
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // 'wasm-unsafe-eval': decoder Draco (/draco/, self-hosted) adalah WASM —
      // tanpa ini pemuatan model 3D ditolak CSP. 'unsafe-eval' hanya saat dev
      // (evaluasi modul webpack + HMR di `next dev` memakai eval); build
      // produksi tidak pernah eval.
      // va.vercel-scripts.com: skrip debug @vercel/analytics saat dev
      // (di produksi analytics dimuat same-origin /_vercel/insights/).
      `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://va.vercel-scripts.com${
        process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''
      }`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://images.prismic.io https://img.icons8.com https://res.cloudinary.com",
      "font-src 'self' data:",
      // blob: wajib — GLTFLoader (Chromium/Firefox≥98) memuat tekstur embed
      // GLB via fetch() ke blob: URL; tanpa ini semua tekstur putih.
      // api.bmkg.go.id: widget cuaca (Weather.tsx).
      "connect-src 'self' blob: https://*.prismic.io https://api.bmkg.go.id",
      "media-src 'self'",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join('; '),
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
]

// Mode export statis: `EXPORT=true next build` menulis situs HTML lengkap ke
// folder out/ (output: 'export', stabil sejak Next 13.3).
const isExport = process.env.EXPORT === 'true'

// Cache-Control untuk aset statis public/ (aset _next/static ber-hash sudah
// immutable secara default di host). Salinan JSON dari header ini ada di
// vercel.json — ubah keduanya bersamaan.
const immutableCache = [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
const longCache = [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=2592000' }]
const swHeaders = [
  { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
  { key: 'Service-Worker-Allowed', value: '/' },
]

const nextConfig = {
  experimental: {},
  // Lint wajib lolos saat build (sebelumnya dimatikan karena parser lama
  // tidak kompatibel TypeScript 5.x — sudah tidak relevan, lint kini bersih).
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    // next export tidak mendukung Image Optimization API; gambar Prismic sudah
    // teroptimasi di CDN via parameter imgix.
    unoptimized: isExport,
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'img.icons8.com' },
      { protocol: 'https', hostname: 'images.prismic.io' },
    ],
  },
  reactStrictMode: true,
  // headers() TIDAK kompatibel dengan output: 'export' — pada mode export,
  // pasang header keamanan di level host (mis. file _headers Netlify /
  // Cloudflare Pages yang di-generate dari array securityHeaders yang sama).
  ...(isExport
    ? {}
    : {
        async headers() {
          return [
            {
              source: '/(.*)',
              headers: securityHeaders,
            },
            { source: '/_next/static/:path*', headers: immutableCache },
            { source: '/draco/:path*', headers: immutableCache },
            { source: '/object/:path*', headers: longCache },
            { source: '/audio.mp3', headers: longCache },
            { source: '/img/:path*', headers: longCache },
            { source: '/icons/:path*', headers: longCache },
            { source: '/sw.js', headers: swHeaders },
          ]
        },
      }),
  // Export statis: build langsung menulis situs HTML ke out/.
  ...(isExport ? { output: 'export' } : {}),
}

// i18n sengaja tidak dikonfigurasi: satu-satunya locale konten adalah 'id'
// (PRISMIC_LANG). Konfigurasi locales en/jp sebelumnya tidak pernah dipakai
// dan hanya menambah redirect /en pada URL.

const KEYS_TO_OMIT = ['webpackDevMiddleware', 'configOrigin', 'target', 'analyticsId', 'webpack5', 'amp', 'assetPrefix']

module.exports = (_phase, { defaultConfig }) => {
  const plugins = [[withPWA], [withBundleAnalyzer, {}]]

  const wConfig = plugins.reduce((acc, [plugin, config]) => plugin({ ...acc, ...config }), {
    ...defaultConfig,
    ...nextConfig,
  })

  const finalConfig = {}
  Object.keys(wConfig).forEach((key) => {
    if (!KEYS_TO_OMIT.includes(key)) {
      finalConfig[key] = wConfig[key]
    }
  })

  return finalConfig
}
