import type { Dictionary } from './en';

export const id: Dictionary = {
  common: {
    loading: 'Memuat...',
    error: 'Terjadi kesalahan',
    retry: 'Coba lagi',
    close: 'Tutup',
    search: 'Cari',
    noResults: 'Tidak ada hasil ditemukan',
  },
  map: {
    searchPlaceholder: 'Cari lokasi...',
    allCategories: 'Semua Kategori',
    categories: {
      rides: 'Wahana',
      food: 'Makanan & Minuman',
      facility: 'Fasilitas',
      gate: 'Gerbang',
    },
    noImage: 'Tidak ada gambar',
    directions: 'Dapatkan Rute',
    openDetail: 'Lihat Detail',
  },
  errors: {
    notFound: {
      title: 'Halaman tidak ditemukan',
      description: 'Halaman yang Anda cari tidak ada.',
      backHome: 'Kembali ke beranda',
    },
    serverError: {
      title: 'Terjadi kesalahan',
      description: 'Kesalahan tak terduga terjadi. Silakan coba lagi.',
      retry: 'Coba lagi',
    },
  },
};
