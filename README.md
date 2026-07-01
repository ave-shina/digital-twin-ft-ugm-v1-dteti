# Virtual Tour FT UGM

Platform web interaktif untuk menjelajah Fakultas Teknik Universitas Gadjah Mada (FT UGM) secara virtual. Pengguna dapat mengeksplorasi **model 3D kampus**, **denah bangunan**, dan **panorama 360 derajat** baik dari perangkat desktop maupun mobile.

> Penelitian ini menggunakan metode **fotogrametri** dari foto udara drone, diproses dengan Agisoft Metashape, dioptimalkan di Blender, dan dikompresi dengan Draco untuk menghasilkan model 3D yang ringan dan akurat. Hasil usability testing mencatat skor kepuasan **84,6%**.

---

## Daftar Isi

1. [Fitur Utama](#fitur-utama)
2. [Tech Stack](#tech-stack)
3. [Arsitektur Sistem](#arsitektur-sistem)
4. [Prasyarat](#prasyarat)
5. [Instalasi](#instalasi)
6. [Konfigurasi Environment](#konfigurasi-environment)
7. [Struktur Folder](#struktur-folder)
8. [Struktur Data Manual](#struktur-data-manual)
9. [Pipeline Integrasi 3D](#pipeline-integrasi-3d)
10. [Menjalankan Project](#menjalankan-project)
11. [Build & Deploy](#build--deploy)
12. [Testing](#testing)
13. [Lisensi](#lisensi)

---

## Fitur Utama

| Fitur | Deskripsi | Library |
|---|---|---|
| **Model 3D Kampus** | Eksplorasi lingkungan FT UGM dalam 3D realtime dengan orbit control, zoom, dan tooltip nama gedung | React Three Fiber, Three.js, Drei |
| **Denah Interaktif** | Peta denah tiap bangunan/lantai dengan titik lokasi yang dapat diklik untuk membuka panorama atau detail | react-map-interaction, React Konva |
| **Panorama 360** | Foto panorama 360 derajat di dalam area kampus dan bangunan, lengkap dengan hotspot navigasi antar-scene | Pannellum React |
| **Galeri Foto** | Galeri foto tiap lokasi dengan lightbox viewer | react-image-lightbox |
| **FAQ & About** | Halaman informasi Frequently Asked Questions dan tentang FT UGM | Komponen native |
| **Theme Toggle** | Beralih antara mode terang dan gelap | Tailwind CSS, Redux Toolkit |
| **Background Music** | Musik latar yang otomatis pause saat tab tidak aktif | HTML5 Audio API |
| **Responsif** | Tampilan optimal di desktop, tablet, dan mobile | Tailwind CSS |
| **PWA** | Dapat diinstall sebagai Progressive Web App | next-pwa |

---

## Tech Stack

### Frontend
- **[Next.js 13](https://nextjs.org/)** (Pages Router) — React framework
- **[React 18](https://react.dev/)** — UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** — Type safety
- **[Tailwind CSS 3](https://tailwindcss.com/)** — Utility-first CSS
- **[Redux Toolkit](https://redux-toolkit.js.org/)** — State management

### 3D & Visualisasi
- **[Three.js](https://threejs.org/)** — WebGL 3D library
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber)** — React renderer untuk Three.js
- **[Drei](https://github.com/pmndrs/drei)** — Helper components untuk R3F
- **[React Konva](https://konvajs.org/)** — Canvas 2D untuk titik lokasi di denah
- **[Pannellum](https://pannellum.org/)** — Viewer panorama 360

### Data & Asset
- **Static TypeScript Modules** — Seluruh data konten (landmark, tour, FAQ) didefinisikan manual sebagai file `.ts` di `src/components/data/` (tidak menggunakan backend/CMS)
- **Cloudinary** — CDN untuk gambar panorama & denah (URL di-hardcode di file data)

### Tooling 3D (Pipeline Production)
- **Drone (DJI)** — Pengambilan foto udara
- **[Agisoft Metashape](https://www.agisoft.com/)** — Processing fotogrametri
- **[Blender](https://www.blender.org/)** — Editing, UV unwrap, baking textures
- **[Draco](https://github.com/google/draco)** — Kompresi mesh GLTF

---

## Arsitektur Sistem

Arsitektur project ini **client-side only** — tidak ada backend server, database, atau CMS yang dipakai di runtime. Seluruh data konten di-bundle ke JavaScript saat build time.

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                         │
│                                                                  │
│   ┌─────────────────────┐   ┌───────────────────────────────┐   │
│   │   Next.js (React)   │   │       React Three Fiber        │   │
│   │  Pages Router + TS  │   │         (WebGL Canvas)         │   │
│   ├─────────────────────┤   ├───────────────────────────────┤   │
│   │  • Routing (pages/) │   │  • Model 3D (.glb)            │   │
│   │  • SSR / SSG        │   │  • OrbitControls              │   │
│   │  • PWA (next-pwa)   │   │  • Lighting & Shadows         │   │
│   │  • Tailwind CSS     │   │  • Html tooltip (drei)        │   │
│   └──────────┬──────────┘   └───────────────┬───────────────┘   │
│              │                               │                   │
│   ┌──────────▼──────────────────────────────▼───────────────┐   │
│   │                   Redux Toolkit (Store)                  │   │
│   │  theme • location • content • music • tooltip • weather  │   │
│   │           (persisted ke localStorage via middleware)     │   │
│   └─────────────────────────────┬───────────────────────────┘   │
│                                 │                                 │
│   ┌─────────────────────────────▼───────────────────────────┐   │
│   │           Static Data Modules (bundled at build)         │   │
│   │   src/components/data/                                    │   │
│   │   ├── Landmarks.ts   (1.2 MB - daftar gedung & detail)   │   │
│   │   ├── Tour.ts        (262 KB - data tour & panorama)     │   │
│   │   └── Faq.ts         (3 KB - daftar FAQ)                 │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   Komponen pendukung: Map (Konva) • Panorama (Pannellum)         │
└─────────────────────────────────┬────────────────────────────────┘
                                  │  HTTP (gambar saja)
                  ┌───────────────▼───────────────┐
                  │          Cloudinary CDN         │
                  │  • Panorama images (equirect)  │
                  │  • Denah & thumbnail           │
                  │  • Dynamic optimization (f_auto)│
                  └───────────────────────────────┘
```

### Aliran Data Singkat

1. **User** mengakses halaman → Next.js me-render React + Canvas R3F
2. **Model GLB** (`public/object/map-min.glb`) di-load via `useGLTF` dari Drei
3. **Data konten** (landmark, tour, FAQ) di-import dari static TS modules — tidak ada fetch ke server
4. **Cloudinary** hanya dipakai untuk meng-host gambar panorama & denah (di-fetch on-demand)
5. **Redux** menyimpan state aktif (lokasi yang dipilih, theme, music, dll)
6. Saat user klik titik di denah → dispatch action → Scene mengubah kamera 3D

> Catatan: Tidak ada backend, tidak ada database, tidak ada CMS. Aplikasi bisa di-deploy sebagai static site murni.

---

## Prasyarat

Pastikan sistem Anda memiliki:

| Tools | Versi Minimum | Catatan |
|---|---|---|
| **Node.js** | `>= 18.17.0` | Disarankan LTS terbaru |
| **npm / yarn** | npm 9+ atau yarn 1.22+ | Project menggunakan lockfile yarn |
| **Git** | `>= 2.30` | Untuk cloning repository |
| **Browser modern** | Chrome / Firefox / Edge / Safari terbaru | Wajib support WebGL 2.0 |
| **GPU** | Hardware accelerated | Disarankan untuk performa 3D optimal |

Untuk pengembangan asset 3D (opsional, hanya tim kreatif):
- **Agisoft Metashape** (versi 1.8+) — processing fotogrametri
- **Blender** (versi 3.6+) — editing & baking model
- **Google Draco** — kompresi mesh

---

## Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/USERNAME/virtual-tour-ft-ugm.git
cd virtual-tour-ft-ugm
```

### 2. Install Dependencies

Menggunakan **npm** (recommended jika tidak punya yarn):

```bash
npm install --legacy-peer-deps
```

atau dengan **yarn**:

```bash
yarn install
```

> Catatan: flag `--legacy-peer-deps` diperlukan karena salah satu dependency (`@georgedrpg/pannellum-react-next`) masih mendeklarasikan peer `react@16.x`.

### 3. Siapkan Asset 3D

Pastikan dua file GLB berikut ada di `public/object/`:

```
public/object/
├── map-min.glb      # Model 3D utama kampus (~8.8 MB)
└── baked-min.glb    # Model dengan texture baked (~35.9 MB, opsional)
```

Jika belum ada, lihat bagian [Pipeline Integrasi 3D](#pipeline-integrasi-3d) untuk cara generate dari foto udara.

### 4. Siapkan Audio (Opsional)

Letakkan file `audio.mp3` di folder `public/` jika ingin fitur background music aktif.

### 5. Jalankan Development Server

```bash
npm run dev
```

Buka **[http://localhost:3000](http://localhost:3000)** di browser.

---

## Konfigurasi Environment

Salin file environment contoh:

```bash
cp .env.example .env.local
```

Edit `.env.local` sesuai kebutuhan:

| Variable | Deskripsi | Default |
|---|---|---|
| `EXPORT` | Set `'true'` untuk build statis export (tanpa server) | kosong |
| `ANALYZE` | Set `'true'` untuk analyze bundle size saat build | kosong |
| `NODE_ENV` | Environment: `development` atau `production` | `development` |

> Karena project tidak memakai backend, tidak ada env variable untuk API key/URL server.

---

## Struktur Folder

```
virtual-tour-ft-ugm/
├── public/
│   ├── object/
│   │   ├── map-min.glb          # Model 3D kampus (Draco compressed)
│   │   └── baked-min.glb        # Variasi model dengan baked textures
│   ├── img/                     # Logo, icon, static images
│   ├── audio.mp3                # Background music
│   └── manifest.json            # PWA manifest
│
├── redux/                       # Redux Toolkit store
│   ├── store.ts                 # configureStore + localStorage middleware
│   ├── navigation.ts            # Slice utama (theme, location, content, dll)
│   └── hooks.ts                 # useAppDispatch & useAppSelector (typed)
│
├── src/
│   ├── components/
│   │   ├── canvas/              # Komponen WebGL (Three.js)
│   │   │   ├── Scene.tsx        # <Canvas> wrapper + camera + lights
│   │   │   ├── Model.tsx        # Load GLB & render meshes + tooltip
│   │   │   ├── Control.tsx      # OrbitControls + camera animation
│   │   │   └── Grass.tsx        # Custom geometry (grass displacement)
│   │   │
│   │   ├── content/             # Halaman konten dinamis
│   │   │   ├── Content.tsx      # Router konten (Tour/Faq/About/Landmark)
│   │   │   ├── Tour.tsx         # Halaman Tour (Map + Panorama + Gallery)
│   │   │   ├── Landmark.tsx     # Halaman detail landmark
│   │   │   ├── Faq.tsx          # Halaman FAQ accordion
│   │   │   ├── About.tsx        # Halaman About
│   │   │   └── Navbar.tsx       # Navigasi atas (theme/music/close)
│   │   │
│   │   ├── Map/
│   │   │   └── Map.tsx          # Peta denah (MapInteraction + Konva Stage)
│   │   │
│   │   ├── panorama/
│   │   │   └── Panorama.tsx     # Viewer panorama 360 (Pannellum)
│   │   │
│   │   ├── gallery/
│   │   │   └── Gallery.tsx      # Grid foto + Lightbox
│   │   │
│   │   ├── navigation/          # Navigasi UI (bottom bar, icons)
│   │   ├── Tutorial/            # Onboarding joyride
│   │   ├── dom/                 # Layout DOM wrapper
│   │   ├── data/                # <<< DATA KONTEN MANUAL (lihat section berikutnya)
│   │   │   ├── Landmarks.ts
│   │   │   ├── Tour.ts
│   │   │   └── Faq.ts
│   │   ├── StoryBoard.tsx       # Landing overlay ("Mulai")
│   │   ├── Background.tsx       # Background gradient/canvas
│   │   ├── Loading.tsx          # Loading screen (useProgress drei)
│   │   └── ErrorBoundary.tsx    # React error boundary
│   │
│   ├── hooks/
│   │   ├── useBackgroundAudio.ts # Audio management hook
│   │   └── useAccordion.ts      # Accordion state hook
│   │
│   ├── utils/
│   │   └── sanitize.ts          # HTML sanitizer (DOMPurify)
│   │
│   ├── types/                   # TypeScript types
│   │   ├── data.ts              # Tipe data (Landmark, Map, Image, dll)
│   │   ├── components.ts        # Props komponen
│   │   ├── redux.ts             # State Redux
│   │   └── modules.d.ts         # Ambient module declarations
│   │
│   ├── pages/                   # Next.js Pages Router
│   │   ├── _app.tsx             # App wrapper (Redux Provider, ErrorBoundary)
│   │   ├── index.tsx            # Halaman utama (Canvas + StoryBoard)
│   │   ├── [content].tsx        # Dynamic route konten
│   │   ├── 404.tsx              # Halaman not found
│   │   └── 500.tsx              # Halaman error
│   │
│   ├── styles/
│   │   └── index.css            # Global CSS + Tailwind directives
│   │
│   └── config.tsx               # Next SEO config
│
├── next.config.js               # Next.js config (PWA, i18n, webpack, headers)
├── tsconfig.json                # TypeScript config (strict mode)
├── tailwind.config.js           # Tailwind setup
├── .eslintrc                    # ESLint rules (eqeqeq, no-var, dll)
└── package.json
```

---

## Struktur Data Manual

Project ini **tidak menggunakan backend, database, atau CMS**. Seluruh data konten didefinisikan manual sebagai TypeScript modules di `src/components/data/`. Data di-import langsung oleh komponen React dan di-bundle ke JavaScript saat build.

### File Data

| File | Ukuran | Isi |
|---|---|---|
| `Landmarks.ts` | ~1.2 MB | Daftar semua gedung/lokasi di FT UGM beserta deskripsi, denah, panorama, galeri |
| `Tour.ts` | ~262 KB | Data mode "Jelajah" — peta utama kampus, daftar panorama, galeri |
| `Faq.ts` | ~3 KB | Daftar pertanyaan & jawaban FAQ |

### Format Data

Setiap file mengekspor object dengan struktur yang konsisten. Contoh `Faq.ts`:

```typescript
// src/components/data/Faq.ts
import type { FaqDataShape } from "../../types/data"

const data = {
  data: {
    id: 1,
    attributes: {
      name: 'Faq',
      subName: null,
      description: '<p>Fitur FAQ pada website FT UGM...</p>',
      FaqDetail: [
        {
          question: 'Apa itu Virtual Tour FT UGM?',
          answer: '<p>Virtual Tour FT UGM adalah platform...</p>',
        },
        // ... item FAQ lainnya
      ],
    },
  },
}

export const faqData = data as FaqDataShape
```

### Struktur `Landmarks.ts` (Ringkas)

```typescript
const data = {
  data: [
    {
      attributes: {
        objectName: 'Gedung FT UGM',         // ID unik untuk routing
        name: 'Gedung Fakultas Teknik',       // Nama display
        subName: 'Kampus UGM Yogyakarta',
        description: '<p>Deskripsi lengkap...</p>',
        isDescription: true,                  // Tampilkan section description?
        isMap: true,                          // Tampilkan section denah?
        isGallery: true,                      // Tampilkan section galeri?
        thumbnail: { data: { attributes: { url, name, ... } } },
        tooltipLocation: [x, y, z],           // Posisi tooltip di scene 3D
        mapCoordinate: [x, y],                // Posisi pin di denah Tour
        mapDetail: [                          // Daftar denah per lantai
          {
            name: 'Lantai 1',
            mapImage: { data: { attributes: { url, formats, ... } } },
            MapInformation: [                 // Daftar titik di denah
              {
                name: 'Ruang Dosen',
                mapCoordinate: [x, y],
                mapImage: { ... },            // Gambar panorama
                panoramaCoordinate: [         // Hotspot di dalam panorama
                  { pitch, yaw, transition: 'sceneName' },
                ],
              },
            ],
          },
        ],
        galleryDetail: [                      // Daftar foto galeri
          { name, description, galleryImage: { data: { attributes: { url } } } },
        ],
      },
    },
    // ... landmark lainnya
  ],
}

export const Landmarks = data as unknown as LandmarksData
```

### Cara Konsumsi di Komponen

```tsx
import { Landmarks } from '../data/Landmarks'
import { TourData } from '../data/Tour'
import { faqData } from '../data/Faq'

function Landmark() {
  const navigation = useAppSelector((state) => state.navigation)
  const data = Landmarks.data.find(
    (item) => item.attributes.objectName === navigation.location
  )
  // Render komponen...
}
```

### Cara Update / Tambah Data

Untuk menambahkan landmark atau FAQ baru, edit langsung file TypeScript yang bersangkutan:

1. Buka `src/components/data/Landmarks.ts` (atau `Tour.ts` / `Faq.ts`).
2. Tambahkan entry baru ke array `data` dengan struktur yang sama.
3. Pastikan URL gambar valid dan dapat diakses (Cloudinary atau path lokal di `public/`).
4. Pastikan `objectName` unik karena dipakai sebagai identifier routing.
5. Jalankan `npm run typecheck` untuk verifikasi struktur data sesuai tipe di `src/types/data.ts`.

> Tips: Gunakan editor dengan TypeScript support (VS Code) agar mendapat autocomplete dan validasi tipe realtime saat editing data.

### Pertimbangan & Catatan

- **Bundle size**: file `Landmarks.ts` (~1.2 MB) dan `Tour.ts` (~262 KB) tergolong besar karena berisi seluruh data konten. Hal ini membuat initial bundle JavaScript membesar.
- **Performance**: pertimbangkan untuk refactor di masa depan dengan memecah data per-landmark menjadi file terpisah dan di-import dinamis menggunakan `next/dynamic`.
- **Alternatif**: jika ingin beralih ke backend di masa depan, struktur data yang shaped mirip response REST API (lihat field `data` → `attributes`) sudah mendukung migrasi ke Strapi/Contentful/dll dengan perubahan minimal.

---

## Pipeline Integrasi 3D

Proses pembuatan model 3D dari dunia nyata hingga tampil di web mengikuti pipeline fotogrametri berikut:

```
[Drone Survey]      [Agisoft Metashape]     [Blender]           [Draco]            [Web (R3F)]
     |                      |                   |                  |                    |
 Foto udara        Reconstruct mesh        Editing,            Compress            useGLTF()
 UAV (DJI)         Point cloud → Mesh      UV unwrap,          .glb ->             render mesh
 multi-angle       Texture generation      Bake texture        ~10x smaller        + tooltip
                   Export .obj/.fbx        Export .gltf                             interaktif
```

### Langkah Detail

#### 1. Akuisisi Data (Drone)

- Gunakan drone (mis. DJI Mavic/Phantom) untuk memotret area FT UGM dari berbagai ketinggian dan sudut.
- Pastikan overlap antar foto **minimal 70% (front & side overlap)** untuk akurasi fotogrametri.
- Waktu pengambilan: pagi/sore hari untuk pencahayaan rata dan bayangan minimal.

#### 2. Processing Fotogrametri (Agisoft Metashape)

```text
Workflow di Metashape:
1. Import Photos        -> Load semua foto UAV
2. Align Photos         -> Generate sparse point cloud (high accuracy)
3. Build Dense Cloud    -> Generate dense point cloud
4. Build Mesh           -> Reconstruct 3D mesh (arbitrary surface)
5. Build Texture        -> Generate UV texture mosaic
6. Export Model         -> Save sebagai .obj / .fbx dengan texture
```

Output: File mesh mentah berukuran besar (sering kali ratusan MB).

#### 3. Editing & Baking (Blender)

Import mesh hasil Metashape ke Blender untuk dioptimasi:

- **Decimate** mesh untuk mengurangi polycount (target: < 500K triangles).
- **Cleanup**: hapus geometry yang tidak terlihat (interior, bottom faces).
- **UV Unwrap** ulang jika perlu, atau gunakan UV bake dari Metashape.
- **Texture Baking**: bake material & lighting ke single texture atlas (PNG/JPEG).
- **Material Setup**: assign material dengan texture hasil bake ke mesh.
- **Export** sebagai `.gltf` (lebih ringan dari `.obj`).

Tutorial recommended: [Blender GLTF export](https://docs.blender.org/manual/en/latest/files/import_export.html)

#### 4. Kompresi Draco

Gunakan `gltf-pipeline` atau `gltfpack` untuk mengompresi dengan Draco:

```bash
# Opsi A: gltf-pipeline (Draco compression)
npx gltf-pipeline -i model.gltf -o map-min.glb -d

# Opsi B: gltfpack (Meshopt + Draco)
gltfpack -i model.gltf -o map-min.glb -cc -tc
```

Hasil kompresi:

| Sebelum | Sesudah | Rasio |
|---|---|---|
| ~80 MB (mesh mentah) | ~8.8 MB (`map-min.glb`) | ~90% lebih kecil |

#### 5. Integrasi ke Web (React Three Fiber)

Letakkan file `.glb` di `public/object/`. Lalu gunakan `useGLTF` di komponen:

```tsx
// src/components/canvas/Model.tsx
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const gltf = useGLTF('object/map-min.glb') as unknown as {
  nodes: { [key: string]: THREE.Mesh }
  materials: { [key: string]: THREE.Material }
}

const { nodes, materials } = gltf

return (
  <group>
    <mesh
      geometry={nodes.ENV_BUILDING_BAKE.geometry}
      material={materials.ENV_BUILDING_BAKE}
      position={[40.09, 7.51, 2.39]}
      scale={2.35}
    />
    {/* mesh lainnya... */}
  </group>
)
```

Pastikan `Scene.tsx` membungkus dalam `<Canvas>`:

```tsx
<Canvas shadows camera={{ fov: 30, position: [0, 15, 25] }}>
  <ambientLight intensity={0.75} />
  <Model />
</Canvas>
```

#### 6. Optimasi Runtime

- Gunakan `dynamic(() => import('./Scene'), { ssr: false })` untuk mencegah SSR WebGL.
- Panggil `useGLTF.preload('object/map-min.glb')` untuk preloading.
- Pasang `<PerformanceMonitor>` dari drei untuk adaptive DPR (device pixel ratio).
- Gunakan `frameloop='demand'` agar Three.js tidak render terus-menerus ketika idle.

### Catatan untuk Tim Kreatif

- **Texture size**: maksimal 2048x2048 per atlas (lebih besar = lambat di mobile).
- **Polygon budget**: target < 500K triangles total scene.
- **Format**: `.glb` lebih efisien dari `.gltf` (binary, single file).
- **Test di device low-end**: gunakan Lighthouse untuk audit performance.

---

## Menjalankan Project

### Scripts yang Tersedia

| Command | Fungsi |
|---|---|
| `npm run dev` | Jalankan development server (hot reload) |
| `npm run build` | Build untuk production |
| `npm run start` | Jalankan production server (setelah build) |
| `npm run lint` | Jalankan ESLint + Prettier check |
| `npm run eslint` | Auto-fix lint issues di `src/` |
| `npm run analyze` | Build dengan bundle analyzer (`@next/bundle-analyzer`) |
| `npm run export` | Build static HTML (untuk hosting statis) |
| `npm run typecheck` | Cek TypeScript types tanpa emit |

### Contoh Workflow Development

```bash
# 1. Buat branch baru
git checkout -b feature/nama-fitur

# 2. Jalankan dev server
npm run dev

# 3. Di terminal lain, jalankan typecheck watch
npm run typecheck

# 4. Sebelum commit, pastikan clean
npm run lint
npm run typecheck

# 5. Commit & push
git add .
git commit -m "feat: tambah fitur baru"
git push origin feature/nama-fitur
```

---

## Build & Deploy

### Build Production

```bash
npm run build
npm run start
```

### Static Export (untuk CDN / GitHub Pages / Netlify)

Karena project tidak memakai backend, ia dapat di-export menjadi static site murni:

```bash
EXPORT=true npm run build
# Output ada di folder `out/`
```

Deploy folder `out/` ke hosting statis manapun (GitHub Pages, Netlify, Cloudflare Pages, dll).

### Deploy ke Vercel (Recommended)

1. Push repository ke GitHub.
2. Buka [vercel.com](https://vercel.com) → Import Project.
3. Pilih repository, Vercel akan auto-detect Next.js.
4. Click **Deploy** — tidak perlu set env variable apa pun.

> Karena project paksa `dynamic({ ssr: false })` untuk Canvas dan data di-bundle statis, Vercel akan handle dengan baik tanpa konfigurasi tambahan.

### Pertimbangan Performa Produksi

- Pastikan asset GLB di-host dengan **gzip/brotli** compression.
- Set **Cache-Control** header panjang untuk file statis di `public/object/`.
- Gunakan CDN (Cloudflare/Vercel Edge) untuk distribusi global.
- Pertimbangkan memecah `baked-min.glb` (35 MB) menjadi beberapa chunk per-area jika load time masih lambat.

---

## Testing

Project telah lulus dua jenis testing:

### 1. Blackbox Testing

Semua fitur utama terverifikasi beroperasi sesuai spesifikasi:

- [x] Model 3D load & dapat di-orbit
- [x] Tooltip nama gedung muncul saat hover
- [x] Klik landmark → kamera zoom ke lokasi
- [x] Peta denah interaktif (zoom, pan, klik titik)
- [x] Panorama 360 berfungsi dengan hotspot navigasi
- [x] Gallery foto & lightbox
- [x] FAQ accordion expand/collapse
- [x] Theme toggle (light/dark)
- [x] Background music play/pause
- [x] Responsif di mobile (tested: Android & iOS)

### 2. Usability Testing

- **Skor kepuasan pengguna: 84,6%**
- Grade: B (Baik)

### Cara Reproduce Testing

Untuk blackbox testing manual, ikuti checklist di atas dengan `npm run build && npm run start` di environment production.

---

## Kontribusi

Kontribusi sangat diterima! Untuk perubahan besar, silakan buka issue terlebih dahulu untuk diskusi.

### Cara Kontribusi

1. Fork repository ini.
2. Buat branch fitur: `git checkout -b feature/nama-fitur`.
3. Commit perubahan mengikuti [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat:     fitur baru
   fix:      bug fix
   docs:     perubahan dokumentasi
   style:    formatting, tidak ubah kode
   refactor: refactoring tanpa ubah perilaku
   test:     tambah/ubah test
   chore:    build, deps, dll
   ```
4. Push branch: `git push origin feature/nama-fitur`.
5. Buka Pull Request dengan deskripsi jelas.

### Code Style

- Gunakan TypeScript strict mode (sudah dikonfigurasi di `tsconfig.json`).
- Aktifkan ESLint rule `eqeqeq` (sudah dikonfigurasi di `.eslintrc`).
- Format dengan Prettier (config default).
- Hindari `any` type, gunakan tipe eksplisit dari `src/types/`.

---

## Lisensi

[MIT License](LICENSE) © Virtual Tour FT UGM Team

---

## Acknowledgements

Penelitian dan pengembangan project ini didukung oleh:

- **Fakultas Teknik UGM** — Subjek penelitian dan sumber data
- **Tim Fotogrametri** — Akuisisi data drone
- **Open Source Community** — Untuk library-library yang dipakai (React, Three.js, Next.js, dll)

### Referensi Pipeline 3D

- [Agisoft Metashape User Manual](https://www.agisoft.com/pdf/metashape-pro_1_8_en.pdf)
- [Blender Documentation](https://docs.blender.org/)
- [Google Draco](https://github.com/google/draco)
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [GLTF Format Specification](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html)

---

**Maintenance & Contact**: Untuk pertanyaan teknis atau kolaborasi penelitian, silakan buka issue di GitHub repository ini.
