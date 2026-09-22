# SinergiMP Maps

Sebuah aplikasi peta interaktif untuk taman bermain / area publik, dibangun dengan **Next.js 16**, **Mapbox GL JS**, dan **shadcn/ui**.

## Fitur Utama

- **Peta Interaktif (Mapbox GL JS):**
  - Menggunakan custom style Mapbox.
  - Implementasi *Semantic Zoom*: menyembunyikan nama titik lokasi pada level zoom rendah untuk mengurangi *clutter*, dan menampilkannya kembali saat di-zoom.
- **Lokasi & Kategori (POIs):**
  - Wahana (Rides)
  - Kuliner (Food & Beverage)
  - Fasilitas Publik (Facilities)
  - Pintu Masuk (Gates)
- **UI/UX Modern (shadcn/ui & Tailwind CSS v4):**
  - Desain responsif: Panel detail muncul dari bawah di mobile, dan dari samping di desktop.
  - *Dark Mode* & *Light Mode* terintegrasi penuh.
- **Internasionalisasi (i18n):**
  - Mendukung dua bahasa (Bahasa Indonesia & English).
  - Dikelola tanpa middleware (BFF pattern).

## Arsitektur

Proyek ini dibangun menggunakan pendekatan arsitektur **Feature-Sliced Design (FSD)** yang dimodifikasi, dan **Custom Hooks** untuk pengelolaan logika state peta yang kompleks.

### Struktur Direktori

```text
src/
├── app/
│   ├── [lang]/           # Halaman utama dengan dukungan i18n
│   ├── api/              # API Routes (BFF Layer)
│   └── globals.css       # Tailwind v4 configuration & CSS Variables
├── components/           # Komponen UI global (shadcn/ui, dll)
├── features/             # Fitur-fitur spesifik
│   └── map/              # Fitur Peta Utama
│       ├── components/   # Komponen UI (MapView, MapHeader, MapDetailPanel)
│       ├── hooks/        # Logika Peta (useMapInstance, usePoiMarkers, dll)
│       └── lib/          # Utilities Peta (marker-factory)
├── hooks/                # Hooks global (useMediaQuery, dll)
├── lib/                  # Library konfigurasi umum (i18n, dll)
├── store/                # Zustand State Management (map.store.ts)
└── types/                # Definisi TypeScript global
```

### Konsep Inti Map (Phase 2 Refactor)

Fitur peta (di dalam `src/features/map`) dipisahkan logikanya menggunakan custom hooks:

1. **`useMapInstance`**: Mengelola inisialisasi Mapbox GL JS dan referensi map container.
2. **`useMapOverlay`**: Menambahkan *custom image overlay* (peta ilustrasi/denah manual) di atas peta Mapbox menggunakan format GeoJSON raster.
3. **`usePoiMarkers`**: Membuat, merender, dan mengelola event klik untuk marker Point of Interest (Wahana, Kuliner, Fasilitas).
4. **`useRegionMarkers`**: Mengelola marker Wilayah/Zona besar.
5. **`useSemanticZoom`**: Mengelola logika visibilitas komponen peta berdasarkan level zoom saat ini (menyembunyikan label saat zoom out).

Komponen **`MapView`** berfungsi sebagai *orchestrator* yang merakit semua hooks ini menjadi satu kesatuan.

## Menjalankan Proyek (Development)

Pastikan Anda memiliki *environment variables* yang tepat. 

```env
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...
```

Instal dependensi dan jalankan server:

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat hasilnya.

## Teknologi

- **Framework:** Next.js 16 (Turbopack)
- **Map Engine:** Mapbox GL JS
- **Styling:** Tailwind CSS v4 & shadcn/ui
- **State Management:** Zustand
- **Icons:** Lucide React
- **Validation:** Zod (v4)
- **Testing:** Vitest & Playwright
