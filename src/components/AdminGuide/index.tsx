// src/components/AdminGuide/index.tsx
import React, { useState } from 'react'
import './index.scss'

const baseClass = 'admin-guide'

const AdminGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('posts')

  const sections = {
    posts: {
      title: '📝 Membuat Artikel/Berita',
      icon: '📰',
      steps: [
        {
          title: 'Langkah 1: Buka Menu Posts',
          content: 'Klik menu "Posts" di sidebar sebelah kiri. Di sini Anda akan melihat semua artikel yang sudah dibuat.',
        },
        {
          title: 'Langkah 2: Buat Artikel Baru',
          content: 'Klik tombol "Create New" di pojok kanan atas untuk membuat artikel baru.',
        },
        {
          title: 'Langkah 3: Isi Judul Artikel',
          content: 'Ketik judul artikel Anda di kolom "Title". Contoh: "Rapat Koordinasi Wilayah III Bulan Juni 2025"',
        },
        {
          title: 'Langkah 4: Tambahkan Gambar Utama',
          content: 'Klik tab "Content", lalu klik "Choose from existing" atau "Upload new" untuk menambahkan gambar utama artikel. Gambar ini akan muncul di halaman artikel.',
        },
        {
          title: 'Langkah 5: Tulis Isi Artikel',
          content: 'Di kolom "Content", tulis isi artikel Anda. Anda bisa:\n• Membuat heading (judul bagian) dengan klik tombol H2, H3, H4\n• Membuat teks tebal dengan klik tombol B\n• Membuat teks miring dengan klik tombol I\n• Menambahkan gambar dengan klik tombol gambar\n• Membuat link dengan klik tombol rantai',
        },
        {
          title: 'Langkah 6: Pilih Kategori',
          content: 'Klik tab "Meta", lalu pilih kategori artikel di kolom "Categories". Contoh: Berita, Pengumuman, Kegiatan, dll.',
        },
        {
          title: 'Langkah 7: Simpan atau Publikasikan',
          content: '• Klik "Save draft" untuk menyimpan tanpa dipublikasikan (hanya admin yang bisa lihat)\n• Klik "Publish" untuk mempublikasikan artikel (semua orang bisa lihat di website)',
        },
      ],
      tips: [
        'Gunakan judul yang jelas dan mudah dipahami',
        'Tambahkan gambar berkualitas baik (minimal 800x600 pixel)',
        'Pisahkan paragraf agar mudah dibaca',
        'Gunakan heading untuk membagi artikel menjadi bagian-bagian',
        'Cek preview sebelum publish untuk memastikan tampilan sudah benar',
      ],
    },
    pages: {
      title: '📄 Mengelola Halaman',
      icon: '🏠',
      steps: [
        {
          title: 'Langkah 1: Buka Menu Pages',
          content: 'Klik menu "Pages" di sidebar kiri untuk melihat semua halaman website.',
        },
        {
          title: 'Langkah 2: Edit Halaman yang Ada',
          content: 'Klik nama halaman yang ingin diedit. Contoh: "Home" untuk mengedit halaman depan.',
        },
        {
          title: 'Langkah 3: Edit Hero (Bagian Atas)',
          content: 'Tab "Hero" adalah bagian paling atas halaman:\n• Isi "Rich Text" untuk teks utama\n• Upload gambar di "Media"\n• Pilih tipe tampilan di "Type" (Low Impact / High Impact)',
        },
        {
          title: 'Langkah 4: Edit Konten Halaman',
          content: 'Di tab "Content", Anda bisa menambahkan berbagai blok:\n• Content Block: Untuk teks dan gambar\n• Call To Action: Tombol ajakan (contoh: "Hubungi Kami")\n• Media Block: Untuk gambar atau video besar\n• Archive: Menampilkan daftar artikel\n• Form: Menampilkan formulir',
        },
        {
          title: 'Langkah 5: Tambah Blok Baru',
          content: 'Klik "+ Add Content", lalu pilih jenis blok yang ingin ditambahkan. Setiap blok punya fungsi berbeda sesuai kebutuhan.',
        },
        {
          title: 'Langkah 6: Atur SEO',
          content: 'Di tab "SEO", isi:\n• Meta Title: Judul yang muncul di Google\n• Meta Description: Deskripsi singkat untuk Google\n• Meta Image: Gambar yang muncul saat dibagikan di media sosial',
        },
        {
          title: 'Langkah 7: Simpan Perubahan',
          content: 'Klik "Save" untuk menyimpan perubahan, atau "Publish" jika ada perubahan yang perlu dipublikasikan.',
        },
      ],
      tips: [
        'Halaman "Home" adalah halaman depan website',
        'Jangan hapus halaman penting seperti Home atau About',
        'Gunakan blok "Archive" untuk menampilkan artikel terbaru',
        'Isi SEO dengan baik agar mudah ditemukan di Google',
        'Preview perubahan sebelum publish',
      ],
    },
    forms: {
      title: '📋 Mengelola Formulir',
      icon: '✍️',
      steps: [
        {
          title: 'Langkah 1: Buka Menu Forms',
          content: 'Klik menu "Forms" di sidebar kiri untuk melihat semua formulir yang tersedia.',
        },
        {
          title: 'Langkah 2: Buat Formulir Baru',
          content: 'Klik "Create New" untuk membuat formulir baru. Beri nama formulir, contoh: "Formulir Pengaduan" atau "Formulir Kontak".',
        },
        {
          title: 'Langkah 3: Tambah Kolom Formulir',
          content: 'Klik "+ Add Field" untuk menambah kolom input. Pilih tipe field:\n• Text: Input teks pendek (nama, email, dll)\n• Textarea: Input teks panjang (pesan, keterangan)\n• Email: Khusus untuk email\n• Number: Khusus untuk angka\n• Select: Pilihan dropdown\n• Checkbox: Kotak centang',
        },
        {
          title: 'Langkah 4: Atur Setiap Kolom',
          content: 'Untuk setiap field yang ditambahkan:\n• Name: Nama field (tanpa spasi, contoh: namaLengkap)\n• Label: Label yang terlihat user (contoh: Nama Lengkap)\n• Required: Centang jika wajib diisi\n• Placeholder: Teks petunjuk (contoh: "Masukkan nama Anda")',
        },
        {
          title: 'Langkah 5: Atur Email Pemberitahuan',
          content: 'Di bagian "Emails", atur:\n• Email To: Email penerima notifikasi saat ada pengiriman form\n• Email From: Email pengirim\n• Subject: Judul email\n• Message: Isi email pemberitahuan',
        },
        {
          title: 'Langkah 6: Atur Pesan Konfirmasi',
          content: 'Di "Confirmation":\n• Type: Pilih "Message" untuk pesan sukses\n• Message: Tulis pesan terima kasih, contoh: "Terima kasih! Formulir Anda telah dikirim."',
        },
        {
          title: 'Langkah 7: Tampilkan di Halaman',
          content: 'Setelah form jadi:\n1. Buka menu "Pages"\n2. Edit halaman yang ingin ditambahkan form\n3. Di tab "Content", klik "+ Add Content"\n4. Pilih "Form Block"\n5. Pilih form yang sudah dibuat\n6. Save dan Publish',
        },
        {
          title: 'Langkah 8: Lihat Data Masuk',
          content: 'Untuk melihat data yang dikirim:\n• Klik menu "Form Submissions" di sidebar\n• Pilih form yang ingin dilihat\n• Lihat semua data yang masuk\n• Klik detail untuk melihat isi lengkap',
        },
      ],
      tips: [
        'Buat nama field tanpa spasi (gunakan camelCase: namaLengkap)',
        'Tandai field penting sebagai "Required"',
        'Gunakan tipe field yang sesuai (Email untuk email, Number untuk angka)',
        'Tes formulir sebelum dipublikasikan',
        'Cek email pemberitahuan masuk ke spam atau tidak',
        'Backup data form submissions secara berkala',
      ],
    },
    media: {
      title: '🖼️ Mengelola Gambar & File',
      icon: '📁',
      steps: [
        {
          title: 'Langkah 1: Buka Menu Media',
          content: 'Klik menu "Media" di sidebar kiri untuk melihat semua file yang sudah diupload.',
        },
        {
          title: 'Langkah 2: Upload File Baru',
          content: 'Klik "Upload" di pojok kanan atas. Pilih file dari komputer Anda:\n• Gambar: JPG, PNG, WebP\n• Dokumen: PDF\n• Ukuran maksimal: 10MB per file',
        },
        {
          title: 'Langkah 3: Isi Informasi File',
          content: 'Setelah upload:\n• Alt Text: Deskripsi gambar (penting untuk SEO dan aksesibilitas)\n• Caption: Keterangan gambar (opsional)',
        },
        {
          title: 'Langkah 4: Gunakan Gambar',
          content: 'Untuk menggunakan gambar yang sudah diupload:\n1. Saat membuat artikel/halaman\n2. Klik tombol upload gambar\n3. Pilih "Choose from existing"\n4. Cari dan pilih gambar yang diinginkan',
        },
        {
          title: 'Langkah 5: Edit atau Hapus',
          content: '• Klik nama file untuk mengedit informasi\n• Klik tombol hapus untuk menghapus file (hati-hati: tidak bisa dikembalikan)',
        },
      ],
      tips: [
        'Gunakan nama file yang jelas (contoh: rapat-koordinasi-juni-2025.jpg)',
        'Kompres gambar sebelum upload untuk mempercepat loading',
        'Isi Alt Text untuk semua gambar (contoh: "Foto rapat koordinasi di Malang")',
        'Ukuran gambar ideal: 1200x800 pixel untuk artikel',
        'Jangan upload file yang terlalu besar (maksimal 2MB untuk web)',
        'Hapus file yang sudah tidak digunakan untuk menghemat space',
      ],
    },
    categories: {
      title: '🏷️ Mengelola Kategori',
      icon: '📑',
      steps: [
        {
          title: 'Langkah 1: Buka Menu Categories',
          content: 'Klik menu "Categories" di sidebar kiri untuk melihat semua kategori artikel.',
        },
        {
          title: 'Langkah 2: Buat Kategori Baru',
          content: 'Klik "Create New" untuk membuat kategori baru. Contoh kategori:\n• Berita\n• Pengumuman\n• Kegiatan\n• Laporan\n• Agenda',
        },
        {
          title: 'Langkah 3: Isi Nama Kategori',
          content: 'Ketik nama kategori di kolom "Title". Nama harus jelas dan mudah dipahami.',
        },
        {
          title: 'Langkah 4: Slug Otomatis',
          content: 'Slug (URL) akan otomatis dibuat dari judul. Contoh:\n• Judul: "Pengumuman Penting"\n• Slug: pengumuman-penting',
        },
        {
          title: 'Langkah 5: Gunakan Kategori',
          content: 'Saat membuat artikel:\n1. Buka tab "Meta"\n2. Pilih kategori di kolom "Categories"\n3. Bisa pilih lebih dari satu kategori',
        },
      ],
      tips: [
        'Buat kategori yang umum dan tidak terlalu spesifik',
        'Maksimal 5-7 kategori utama saja',
        'Gunakan nama kategori yang konsisten',
        'Jangan hapus kategori yang masih digunakan artikel',
        'Review kategori secara berkala dan gabungkan yang mirip',
      ],
    },
    tips: {
      title: '💡 Tips & Trik Umum',
      icon: '🎯',
      steps: [
        {
          title: 'Menyimpan vs Publikasi',
          content: '• Save Draft: Menyimpan tanpa publish (hanya admin yang bisa lihat)\n• Publish: Mempublikasikan ke website (semua orang bisa lihat)\n• Unpublish: Menghilangkan dari website tapi tidak dihapus',
        },
        {
          title: 'Live Preview',
          content: 'Gunakan tombol "Live Preview" di pojok kanan atas untuk melihat tampilan artikel/halaman sebelum dipublikasi.',
        },
        {
          title: 'Auto Save',
          content: 'Sistem akan otomatis menyimpan perubahan Anda setiap beberapa detik. Lihat status "Saving..." atau "Saved" di atas.',
        },
        {
          title: 'Search & Filter',
          content: 'Di halaman daftar artikel/halaman:\n• Gunakan kotak search untuk mencari\n• Gunakan filter untuk menyaring berdasarkan kategori/status\n• Klik nama kolom untuk mengurutkan',
        },
        {
          title: 'Versi & Draft',
          content: 'Sistem menyimpan versi lama artikel Anda. Klik "Versions" untuk melihat dan restore versi sebelumnya jika diperlukan.',
        },
        {
          title: 'Penjadwalan Publikasi',
          content: 'Anda bisa menjadwalkan artikel untuk dipublikasi nanti:\n1. Pilih status "Draft"\n2. Klik "Schedule Publish"\n3. Pilih tanggal dan waktu\n4. Save',
        },
        {
          title: 'Keyboard Shortcuts',
          content: 'Percepat pekerjaan dengan shortcut:\n• Ctrl/Cmd + S: Simpan\n• Ctrl/Cmd + B: Tebal\n• Ctrl/Cmd + I: Miring\n• Ctrl/Cmd + K: Buat link',
        },
      ],
      tips: [
        'Logout setelah selesai menggunakan admin panel',
        'Gunakan password yang kuat dan jangan bagikan ke orang lain',
        'Backup konten penting secara berkala',
        'Jika ada error, refresh halaman atau logout lalu login lagi',
        'Hubungi admin IT jika ada masalah teknis',
        'Cek tampilan di mobile dan desktop sebelum publish',
      ],
    },
  }

  return (
    <div className={baseClass}>
      <div className={`${baseClass}__header`}>
        <h2>📚 Panduan Penggunaan Admin Panel</h2>
        <p>Panduan lengkap cara menggunakan sistem admin website. Pilih menu di bawah untuk melihat panduan detail.</p>
      </div>

      <div className={`${baseClass}__navigation`}>
        {Object.entries(sections).map(([key, section]) => (
          <button
            key={key}
            className={`${baseClass}__nav-button ${activeSection === key ? 'active' : ''}`}
            onClick={() => setActiveSection(key)}
          >
            <span className={`${baseClass}__nav-icon`}>{section.icon}</span>
            <span className={`${baseClass}__nav-text`}>{section.title}</span>
          </button>
        ))}
      </div>

      <div className={`${baseClass}__content`}>
        <h3>{sections[activeSection as keyof typeof sections].title}</h3>
        
        <div className={`${baseClass}__steps`}>
          {sections[activeSection as keyof typeof sections].steps.map((step, index) => (
            <div key={index} className={`${baseClass}__step`}>
              <div className={`${baseClass}__step-number`}>{index + 1}</div>
              <div className={`${baseClass}__step-content`}>
                <h4>{step.title}</h4>
                <p style={{ whiteSpace: 'pre-line' }}>{step.content}</p>
              </div>
            </div>
          ))}
        </div>

        {sections[activeSection as keyof typeof sections].tips && (
          <div className={`${baseClass}__tips-box`}>
            <h4>💡 Tips & Saran:</h4>
            <ul>
              {sections[activeSection as keyof typeof sections].tips?.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className={`${baseClass}__footer`}>
        <p>
          <strong>Butuh bantuan?</strong> Hubungi tim IT atau admin website untuk bantuan lebih lanjut.
        </p>
        <p className={`${baseClass}__footer-note`}>
          Simpan panduan ini sebagai referensi. Anda bisa kembali ke halaman ini kapan saja dari menu Dashboard.
        </p>
      </div>
    </div>
  )
}

export default AdminGuide