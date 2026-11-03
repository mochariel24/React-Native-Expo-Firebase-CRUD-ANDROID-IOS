# Todo App — React Native Expo & Firebase CRUD

Aplikasi mobile untuk mengelola daftar todo dengan **React Native**, **Expo SDK 58**, **Expo Router**, dan **Cloud Firestore**. Perubahan pada daftar disinkronkan secara real time.

## Anggota

- Ardiyanti Daffa Maisan — NPM 41155050240022

## Fitur

- **Create:** menambahkan todo.
- **Read:** melihat daftar todo terbaru dari Firestore.
- **Update:** mengubah judul todo.
- **Delete:** menghapus todo setelah konfirmasi.
- Validasi judul kosong dan batas 140 karakter.
- Status loading, daftar kosong, dan pesan kesalahan.

Dokumen disimpan di koleksi `todos` dengan bentuk berikut:

```text
todos/{documentId}
  heading: string
  createdAt: Firestore Timestamp
  updatedAt: Firestore Timestamp (ditambahkan saat judul diedit)
```

## Persiapan Firebase

1. Buat proyek di [Firebase Console](https://console.firebase.google.com/), daftarkan aplikasi Web, lalu aktifkan **Cloud Firestore**.
2. Salin konfigurasi Web App dari Firebase Console.
3. Di folder proyek ini, buat `.env` dari file contoh:

   ```powershell
   Copy-Item .env.example .env
   ```

4. Isi enam nilai `EXPO_PUBLIC_FIREBASE_*` di `.env` dengan konfigurasi Web App Firebase.
5. Atur **Firestore Security Rules** agar aplikasi diizinkan membaca dan menulis. Untuk demo kelas tanpa login, gunakan data uji saja; jangan membuka akses publik untuk database produksi.

File `.env` tidak disertakan karena konfigurasi Firebase berbeda untuk tiap proyek. File ini juga dikecualikan dari Git; unggah `.env.example` sebagai panduan konfigurasi.

## Menjalankan aplikasi

Pastikan Node.js dan aplikasi **Expo Go** terpasang. Jalankan dari folder proyek ini:

```bash
npm install
npx expo start
```

Pindai QR code dengan Expo Go. Jika baru membuat atau mengubah `.env`, hentikan server lalu mulai dengan cache bersih:

```bash
npx expo start --clear
```

Untuk menjalankan di iPhone fisik, akun Expo di CLI dan Expo Go harus sama. Masuk dari terminal dengan `npx expo login`, lalu periksa akun dengan `npx expo whoami`.

Untuk emulator Android yang sudah berjalan, tekan `a` pada terminal Expo atau jalankan:

```bash
npm run android
```

## Pemeriksaan kode

```bash
npm run lint
npm run typecheck
```

## Struktur proyek

```text
assets/              Ikon aplikasi
config/firebase.ts   Inisialisasi Firebase dan Firestore
src/app/             Layar daftar dan detail (Expo Router)
src/components/      Komponen kartu todo
src/hooks/           Listener real-time daftar todo
src/services/        Operasi tambah, ubah, dan hapus
src/types/           Tipe data todo
.env.example         Contoh konfigurasi Firebase
```

Sumber materi: PDF **TodoApp: Sample CRUD React-Native Expo and Firebase** yang diberikan untuk tugas.
