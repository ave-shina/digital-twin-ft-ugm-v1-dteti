/**
 * Pengaturan cadangan (sebelumnya hardcode di komponen). Dipakai saat props
 * halaman belum membawa settings dari Prismic (mis. render sisi klien awal) —
 * konten yang sesungguhnya diambil dari Prismic saat build.
 */
import type { SiteSettings } from '@/types/prismic'

const CAMERA_SPAN =
  '<span class="relative -bottom-1 inline-block h-4 w-4"><img src="https://img.icons8.com/material/4ac144/256/camera.png" alt="ikon kamera" class="h-full w-full" /></span>'
const BLUE_DOT = '<span class="mx-1 inline-block h-2 w-2 rounded-full bg-blue-600"></span>'
const RED_DOT = '<span class="mx-1 inline-block h-2 w-2 rounded-full bg-red-500"></span>'

export const DEFAULT_SETTINGS: { settings: SiteSettings } = {
  settings: {
    seo: {
      title: 'Virtual Tour FT UGM',
      description:
        'Selamat datang di Virtual Tour Fakultas Teknik Universitas Gadjah Mada (FT UGM)!, Dalam perjalanan virtual ini, Anda akan diajak mengenal lebih dekat berbagai gedung akademik dan lingkungan kampus yang mendukung proses pembelajaran dan penelitian di FT UGM.',
      keywords:
        'Virtual Tour, Fakultask Teknik, Universitas Gadjah Mada, Indonesia, UGM, FT, DTETI, DTSL, DTMI, DTK, DTNTF, DTGL, DTGD, DTAP',
      author: 'Author',
      url: 'https://www.virtual-tour-ft-ugm.com',
      ogImage: '/icons/share.png',
    },
    loading: {
      title: 'FAKULTAS TEKNIK',
      subtitle: 'UNIVERSITAS GADJAH MADA',
    },
    catatan: {
      tour: `<p>Anda dapat memulai penjelajahan Fakultas Teknik dengan menekan titik berbentuk lingkaran pada denah tersebut. Lingkaran merah ${RED_DOT} akan mengarahkan ke halaman detail bangunan tersebut, sementara lingkaran biru ${BLUE_DOT} akan menampilkan panorama lingkungan di sekitar titik tersebut. Anda juga bisa memulai penjelajahan dengan menekan tombol di bawah ini. Selanjutnya, pada tampilan panorama akan ditampilkan dengan adanya simbol berbentuk kamera ${CAMERA_SPAN}. Simbol ini akan membantu Anda menavigasi dan berpindah lokasi di dalam panorama.Mari kita jelajahi bersama!</p>`,
      landmark: `<p>Anda dapat memulai penjelajahan dengan menekan titik berbentuk lingkaran pada denah tersebut. lingkaran biru ${BLUE_DOT} akan menampilkan panorama lingkungan di sekitar titik tersebut . Selanjutnya, pada tampilan panorama akan ditampilkan dengan adanya simbol berbentuk kamera ${CAMERA_SPAN}.Simbol ini akan membantu Anda menavigasi dan berpindah lokasi di dalam panorama.</p>`,
    },
    tutorialSteps: [
      {
        title: 'Tutorial',
        bodyHtml:
          '<p>Selamat Datang di Virtual Tour FT UGM, Gunakanlah komputer untuk pengalaman pengguna yang lebih baik.</p>',
        target: 'body',
        diagram: 'none',
      },
      {
        title: 'Bangunan',
        bodyHtml:
          '<p>Tombol ini digunakan untuk melihat nama bangunan yang terdapat di FT UGM. Anda bisa menekan objek bangunan untuk melihat informasi yang lebih rinci</p>',
        target: '.show-tooltip',
        diagram: 'none',
      },
      {
        title: 'Jelajah Teknik',
        bodyHtml:
          '<p>Tombol ini digunakan untuk menampilkan halaman Jelajah Teknik yang akan membantu Anda dalam menjelajahi panorama teknik dengan lebih baik.</p>',
        target: '.jelajah-teknik',
        diagram: 'none',
      },
      {
        title: 'Frequently Asked Questions',
        bodyHtml: '<p>Tombol ini digunakan untuk menampilkan halaman FaQ.</p>',
        target: '.faq',
        diagram: 'none',
      },
      {
        title: 'Tema',
        bodyHtml: '<p>Tombol ini digunakan merubah tema halaman menjadi gelap atau terang.</p>',
        target: '.night-mode',
        diagram: 'none',
      },
      {
        title: 'Musik latar belakang',
        bodyHtml:
          '<p>Tombol ini digunakan untuk memutar atau menjeda musik latar belakang Virtual Tour FT UGM.</p>',
        target: '.tour-music',
        diagram: 'none',
      },
      {
        title: 'Tentang Kami',
        bodyHtml:
          '<p>Tombol ini digunakan untuk menampilkan halaman Tentang Virtual Tour FT UGM.</p>',
        target: '.about-us',
        diagram: 'none',
      },
      {
        title: 'Penggunaan Desktop',
        bodyHtml: '',
        target: 'body',
        diagram: 'desktop',
      },
      {
        title: 'Penggunaan Mobile',
        bodyHtml: '',
        target: 'body',
        diagram: 'mobile',
      },
      {
        title: 'Navigasi pada Model 3 Dimensi',
        bodyHtml:
          '<p>Silahkan klik pada bangunan yang ingin Anda lihat untuk mendapatkan informasi detail lebih lengkap.</p>',
        target: 'body',
        diagram: 'navigate',
      },
      {
        title: 'Tutorial',
        bodyHtml: '<p>Tombol ini digunakan untuk menampilkan tutorial Kembali.</p>',
        target: '.tutorial',
        diagram: 'none',
      },
    ],
  },
}
