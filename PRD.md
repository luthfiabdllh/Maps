# Product Requirement Document (PRD): Interactive Area Map Web App

## 1. Ringkasan Eksekutif & Sasaran Produk

Aplikasi Peta Interaktif Kawasan adalah web app responsif (mobile-first) yang menampilkan peta ilustrasi 2.5D/kartun menggunakan Mapbox GL JS. Produk ini bertujuan mempermudah navigasi pengunjung di dalam area kawasan wisata, menemukan fasilitas/wahana, mengecek informasi operasional, dan melihat posisi diri secara real-time via GPS.

### Sasaran Utama (Goals)

- **User Experience**: Navigasi intuitif tanpa lag dengan transisi *smooth* pada perangkat seluler.
- **Discoverability**: Pengunjung dapat menemukan fasilitas penting (toilet, mushola, medis, resto) dalam waktu kurang dari 5 detik.
- **Akurasi Posisi**: Memproyeksikan posisi GPS pengunjung ke atas kanvas ilustrasi 2.5D secara proporsional.

---

## 2. User Persona & Use Cases

| Persona | Kebutuhan Utama | Fitur Kunci |
| --- | --- | --- |
| **Keluarga / Pengunjung Rekreasi** | Mencari wahana ramah anak dan restoran terdekat | Filter kategori, foto wahana, batas tinggi badan |
| **Pengunjung Mendesak** | Menemukan toilet, ruang laktasi, atau pos P3K secepatnya | Tombol *Quick Access* fasilitas umum |
| **Pengunjung Baru** | Mengetahui arah dan posisi saat ini di kawasan luas | Fitur "Lokasi Saya" (Live GPS locator) |

---

## 3. Cakupan Fitur (Functional Requirements)

### 3.1. Kanvas Peta & Navigasi (Core Map)

- **Image Overlay Engine**: Menampilkan aset peta WebP di atas koordinat geografis yang telah ditentukan.
- **Gesture Control**: Mendukung *pan*, *pinch-to-zoom*, dan *double-tap to zoom*.
- **Camera Boundary**: Mengunci batas geser (*maxBounds*) dan batas perbesaran (*minZoom* & *maxZoom*) agar kanvas kosong tidak terlihat.
- **Locked Perspective**: Menonaktifkan rotasi bebas (*dragRotate: false*) dan kemiringan (*pitch: 0*) untuk menjaga keterbacaan ilustrasi 2.5D.

### 3.2. Penanda Interaktif (POI Markers & Clusters)

- **Custom HTML Markers**: Ikon vektor SVG tajam dengan warna berbeda per kategori.
- **Marker Clustering (Opsional/Zoom-Dependent)**: Menggabungkan pin yang berdekatan saat peta di-zoom out agar tidak menumpuk, atau menyembunyikan fasilitas sekunder (misal: tempat sampah) di level zoom rendah.
- **Click Behavior**: Saat pin diklik, kamera melakukan pergerakan halus (`map.flyTo()`) ke titik tengah pin dan memunculkan panel informasi.

### 3.3. Filter Kategori (Category Filtering)

- Tombol filter horizontal (chips) di bagian atas layar:
  - `Semua`
  - `Wahana & Atraksi`
  - `Kuliner / Resto`
  - `Fasilitas Umum` (Toilet, Mushola, P3K, ATM, Loker)
  - `Pintu Masuk & Parkir`
- Perubahan status filter langsung memperbarui visibilitas marker tanpa memuat ulang halaman (*instant re-render*).

### 3.4. Pencarian & Autocomplete (Search Bar)

- Input teks untuk mencari nama wahana, fasilitas, atau kata kunci (misal: "bakso", "roller coaster").
- Menampilkan *dropdown* saran instan saat pengguna mengetik minimal 2 karakter.
- Memilih hasil pencarian langsung mengarahkan kamera peta ke titik tersebut dan membuka panel detail.

### 3.5. Panel Detail (Bottom Sheet / Sidebar)

- **Mobile**: *Bottom sheet* yang dapat ditarik (*expandable* / *swipeable*).
- **Desktop**: *Sidebar popout* di sisi kiri atau kanan layar.
- **Informasi yang Ditampilkan**:
  - Foto/thumbnail atraksi
  - Nama dan tag kategori
  - Jam buka / operasional
  - Syarat/ketentuan khusus (contoh: tinggi badan minimal, wahana basah)
  - Deskripsi singkat
  - Tombol aksi: "Arahkan ke Sini" / "Beli Tiket" (jika ada tautan eksternal).

### 3.6. Geolocation (Posisi Pengguna Real-time)

- Tombol Floating Action Button (FAB) "Lokasi Saya".
- Meminta izin geolokasi browser (`navigator.geolocation`).
- Menampilkan titik biru (*blue pulsing dot*) di atas denah dengan penanda akurasi radius.
- Notifikasi jika pengunjung berada di luar batas koordinat kawasan (*Out of Bounds Warning*).

---

## 4. Persyaratan Non-Fungsional (Non-Functional Requirements)

- **Performa & Loading Speed**:
  - Ukuran bundle JavaScript awal < 350 KB (gzipped, di luar Mapbox GL library).
  - Gambar denah WebP terkompresi optimal (< 4 MB).
  - *Time to Interactive (TTI)* < 2.5 detik pada koneksi 4G standar.
- **Kompatibilitas Perangkat**:
  - Mobile Browser: Safari iOS (iOS 14+), Chrome Android.
  - Desktop Browser: Chrome, Firefox, Edge, Safari (versi stabil 2 tahun terakhir).
- **Aksesibilitas (A11y)**:
  - Kontras warna teks memenuhi standar WCAG AA.
  - Elemen interaktif memiliki *touch target* minimal 44 × 44 px.

---

## 5. Arsitektur Teknis & Tech Stack

```
┌────────────────────────────────────────────────────────┐
│                   Frontend Layer                       │
│  [Next.js / Vite (React)] + [Tailwind CSS]             │
├────────────────────────────────────────────────────────┤
│                    Mapbox Engine                       │
│  Mapbox GL JS v3 (WebGL Canvas + DOM Marker Layers)    │
├──────────────────────────┬─────────────────────────────┤
│        Aset Visual       │         Data Source         │
│  peta-ilustrasi.webp     │  poi-data.json / GeoJSON    │
│  (Static CDN / Storage)  │  (Static / Headless CMS)    │
└──────────────────────────┴─────────────────────────────┘
```

- **Framework**: **Next.js (App Router)** atau **Vite + React** (ringan, performa client-side cepat).
- **Styling**: **Tailwind CSS** (mempermudah pembuatan Bottom Sheet responsif).
- **Peta**: **Mapbox GL JS** (`mapbox-gl`).
- **Penyimpanan Data**: Static JSON di repo atau CMS sederhana (Strapi / Supabase / Contentful) jika data wahana sering berganti status operasional.

---

## 6. Spesifikasi Data POI (`poi-data.json`)

Setiap data lokasi harus mengikuti skema konsisten berikut:

```typescript
interface POILocation {
  id: string;
  name: string;
  slug: string;
  category: "rides" | "food" | "facility" | "gate";
  subcategory?: "adrenaline" | "kids" | "family" | "toilet" | "prayer_room" | "first_aid";
  coordinates: [number, number]; // [Longitude, Latitude]
  thumbnailUrl: string;
  description: string;
  meta?: {
    minHeightCm?: number;
    openHours?: string;
    isHalal?: boolean;
    ticketRequired?: boolean;
  };
}
```

---

## 7. Metrik Keberhasilan (Success Metrics)

1. **Adopsi**: Rata-rata sesi pengguna membuka minimal 3 detail POI per kunjungan.
2. **Crash Rate**: Tingkat kegagalan WebGL context lost < 0.1% pada perangkat ponsel menengah ke bawah.
3. **Engagement**: Penggunaan fitur pencarian dan filter kategori mencapai > 40% dari total sesi pengguna.

---

## 8. Rencana Implementasi & Sprint Milestones

| Sprint | Fokus Pengerjaan | Target Deliverable |
| --- | --- | --- |
| **Sprint 1** | Map Foundation & Coordinates Alignment | Setup project, integrasi WebP overlay ke koordinat 4 sudut, kalibrasi batas map. |
| **Sprint 2** | POI Engine & Markers | Parsing data JSON, rendering custom HTML pin, handling klik marker. |
| **Sprint 3** | UI Controls & Filter | Komponen Search bar, Category Filter Chips, dan responsive Bottom Sheet. |
| **Sprint 4** | Geolocation & Optimasi | Live user tracking via GPS, uji performa di berbagai smartphone, kompresi aset. |