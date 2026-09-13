const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  // GLB (47 MB total) TIDAK di-precache: setiap deploy ulang mengunduh ulang
  // seluruhnya saat install SW, dan fetch model bisa gagal/tertunda kapan saja
  // user membuka halaman. Model cukup di-cache saat runtime (NetworkFirst).
  publicExcludes: ['!noprecache/**/*', '!object/**/*'],
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
          ]
        },
      }),
  // Export statis: build langsung menulis situs HTML ke out/.
  ...(isExport ? { output: 'export' } : {}),
  webpack(config, { isServer }) {
    // audio support
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      exclude: config.exclude,
      use: [
        {
          loader: require.resolve('url-loader'),
          options: {
            limit: config.inlineImageLimit,
            fallback: require.resolve('file-loader'),
            publicPath: `${config.assetPrefix}/_next/static/images/`,
            outputPath: `${isServer ? '../' : ''}static/images/`,
            name: '[name]-[hash].[ext]',
            esModule: config.esModule || false,
          },
        },
      ],
    })

    // shader support
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    })

    return config
  },
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
