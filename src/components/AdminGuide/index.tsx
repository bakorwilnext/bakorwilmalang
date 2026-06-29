import React, { useState } from 'react'
import './index.css'

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
          content: 'Klik menu &quot;Posts&quot; di sidebar sebelah kiri. Di sini Anda akan melihat semua artikel yang sudah dibuat.',
        },
        {
          title: 'Langkah 2: Buat Artikel Baru',
          content: 'Klik tombol &quot;Create New&quot; di pojok kanan atas untuk membuat artikel baru.',
        },
        {
          title: 'Langkah 3: Isi Judul Artikel',
          content: 'Ketik judul artikel Anda di kolom &quot;Title&quot;. Contoh: &quot;Rapat Koordinasi Wilayah III Bulan Juni 2025&quot;',
        },
        {
          title: 'Langkah 4: Tambahkan Gambar Utama',
          content: 'Klik tab &quot;Content&quot;, lalu klik &quot;Choose from existing&quot; atau &quot;Upload new&quot; untuk menambahkan gambar utama artikel. Gambar ini akan muncul di halaman artikel.',
        },
        {
          title: 'Langkah 5: Tulis Isi Artikel',
          content: 'Di kolom &quot;Content&quot;, tulis isi artikel Anda. Anda bisa:\n• Membuat heading (judul bagian) dengan klik tombol H2, H3, H4\n• Membuat teks tebal dengan klik tombol B\n• Membuat teks miring dengan klik tombol I\n• Menambahkan gambar dengan klik tombol gambar\n• Membuat link dengan klik tombol rantai',
        },
        {
          title: 'Langkah 6: Pilih Kategori',
          content: 'Klik tab &quot;Meta&quot;, lalu pilih kategori artikel di kolom &quot;Categories&quot;. Contoh: Berita, Pengumuman, Kegiatan, dll.',
        },
        {
          title: 'Langkah 7: Simpan atau Publikasikan',
          content: '• Klik &quot;Save draft&quot; untuk menyimpan tanpa dipublikasikan (hanya admin yang bisa lihat)\n• Klik &quot;Publish&quot; untuk mempublikasikan artikel (semua orang bisa lihat di website)',
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
          content: 'Klik menu &quot;Pages&quot; di sidebar kiri untuk melihat semua halaman website.',
        },
        {
          title: 'Langkah 2: Edit Halaman yang Ada',
          content: 'Klik nama halaman yang ingin diedit. Contoh: &quot;Home&quot; untuk mengedit halaman depan.',
        },
        {
          title: 'Langkah 3: Edit Hero (Bagian Atas)',
          content: 'Tab &quot;Hero&quot; adalah bagian paling atas halaman:\n• Isi &quot;Rich Text&quot; untuk teks utama\n• Upload gambar di &quot;Media&quot;\n• Pilih tipe tampilan di &quot;Type&quot; (Low Impact / High Impact)',
        },
        {
          title: 'Langkah 4: Edit Konten Halaman',
          content: 'Di tab &quot;Content&quot;, Anda bisa menambahkan berbagai blok:\n• Content Block: Untuk teks dan gambar\n• Call To Action: Tombol ajakan (contoh: &quot;Hubungi Kami&quot;)\n• Media Block: Untuk gambar atau video besar\n• Archive: Menampilkan daftar artikel\n• Form: Menampilkan formulir',
        },
        {
          title: 'Langkah 5: Tambah Blok Baru',
          content: 'Klik &quot;+ Add Content&quot;, lalu pilih jenis blok yang ingin ditambahkan. Setiap blok punya fungsi berbeda sesuai kebutuhan.',
        },
        {
          title: 'Langkah 6: Atur SEO',
          content: 'Di tab &quot;SEO&quot;, isi:\n• Meta Title: Judul yang muncul di Google\n• Meta Description: Deskripsi singkat untuk Google\n• Meta Image: Gambar yang muncul saat dibagikan di media sosial',
        },
        {
          title: 'Langkah 7: Simpan Perubahan',
          content: 'Klik &quot;Save&quot; untuk menyimpan perubahan, atau &quot;Publish&quot; jika ada perubahan yang perlu dipublikasikan.',
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
          content: 'Klik menu &quot;Forms&quot; di sidebar kiri untuk melihat semua formulir yang tersedia.',
        },
        {
          title: 'Langkah 2: Buat Formulir Baru',
          content: 'Klik &quot;Create New&quot; untuk membuat formulir baru. Beri nama formulir, contoh: &quot;Formulir Pengaduan&quot; atau &quot;Formulir Kontak&quot;.',
        },
        {
          title: 'Langkah 3: Tambah Kolom Formulir',
          content: 'Klik &quot;+ Add Field&quot; untuk menambah kolom input. Pilih tipe field:\n• Text: Input teks pendek (nama, email, dll)\n• Textarea: Input teks panjang (pesan, keterangan)\n• Email: Khusus untuk email\n• Number: Khusus untuk angka\n• Select: Pilihan dropdown\n• Checkbox: Kotak centang',
        },
        {
          title: 'Langkah 4: Atur Setiap Kolom',
          content: 'Untuk setiap field yang ditambahkan:\n• Name: Nama field (tanpa spasi, contoh: namaLengkap)\n• Label: Label yang terlihat user (contoh: Nama Lengkap)\n• Required: Centang jika wajib diisi\n• Placeholder: Teks petunjuk (contoh: &quot;Masukkan nama Anda&quot;)',
        },
        {
          title: 'Langkah 5: Atur Email Pemberitahuan',
          content: 'Di bagian &quot;Emails&quot;, atur:\n• Email To: Email penerima notifikasi saat ada pengiriman form\n• Email From: Email pengirim\n• Subject: Judul email\n• Message: Isi email pemberitahuan',
        },
        {
          title: 'Langkah 6: Atur Pesan Konfirmasi',
          content: 'Di &quot;Confirmation&quot;:\n• Type: Pilih &quot;Message&quot; untuk pesan sukses\n• Message: Tulis pesan terima kasih, contoh: &quot;Terima kasih! Formulir Anda telah dikirim.&quot;',
        },
        {
          title: 'Langkah 7: Tampilkan di Halaman',
          content: 'Setelah form jadi:\n1. Buka menu &quot;Pages&quot;\n2. Edit halaman yang ingin ditambahkan form\n3. Di tab &quot;Content&quot;, klik &quot;+ Add Content&quot;\n4. Pilih &quot;Form Block&quot;\n5. Pilih form yang sudah dibuat\n6. Save dan Publish',
        },
        {
          title: 'Langkah 8: Lihat Data Masuk',
          content: 'Untuk melihat data yang dikirim:\n• Klik menu &quot;Form Submissions&quot; di sidebar\n• Pilih form yang ingin dilihat\n• Lihat semua data yang masuk\n• Klik detail untuk melihat isi lengkap',
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
          content: 'Klik menu &quot;Media&quot; di sidebar kiri untuk melihat semua file yang sudah diupload.',
        },
        {
          title: 'Langkah 2: Upload File Baru',
          content: 'Klik &quot;Upload&quot; di pojok kanan atas. Pilih file dari komputer Anda:\n• Gambar: JPG, PNG, WebP\n• Dokumen: PDF\n• Ukuran maksimal: 10MB per file',
        },
        {
          title: 'Langkah 3: Isi Informasi File',
          content: 'Setelah upload:\n• Alt Text: Deskripsi gambar (penting untuk SEO dan aksesibilitas)\n• Caption: Keterangan gambar (opsional)',
        },
        {
          title: 'Langkah 4: Gunakan Gambar',
          content: 'Untuk menggunakan gambar yang sudah diupload:\n1. Saat membuat artikel/halaman\n2. Klik tombol upload gambar\n3. Pilih &quot;Choose from existing&quot;\n4. Cari dan pilih gambar yang diinginkan',
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
          content: 'Klik menu &quot;Categories&quot; di sidebar kiri untuk melihat semua kategori artikel.',
        },
        {
          title: 'Langkah 2: Buat Kategori Baru',
          content: 'Klik &quot;Create New&quot; untuk membuat kategori baru. Contoh kategori:\n• Berita\n• Pengumuman\n• Kegiatan\n• Laporan\n• Agenda',
        },
        {
          title: 'Langkah 3: Isi Nama Kategori',
          content: 'Ketik nama kategori di kolom &quot;Title&quot;. Nama harus jelas dan mudah dipahami.',
        },
        {
          title: 'Langkah 4: Slug Otomatis',
          content: 'Slug (URL) akan otomatis dibuat dari judul. Contoh:\n• Judul: &quot;Pengumuman Penting&quot;\n• Slug: pengumuman-penting',
        },
        {
          title: 'Langkah 5: Gunakan Kategori',
          content: 'Saat membuat artikel:\n1. Buka tab &quot;Meta&quot;\n2. Pilih kategori di kolom &quot;Categories&quot;\n3. Bisa pilih lebih dari satu kategori',
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
          content: 'Gunakan tombol &quot;Live Preview&quot; di pojok kanan atas untuk melihat tampilan artikel/halaman sebelum dipublikasi.',
        },
        {
          title: 'Auto Save',
          content: 'Sistem akan otomatis menyimpan perubahan Anda setiap beberapa detik. Lihat status &quot;Saving...&quot; atau &quot;Saved&quot; di atas.',
        },
        {
          title: 'Search & Filter',
          content: 'Di halaman daftar artikel/halaman:\n• Gunakan kotak search untuk mencari\n• Gunakan filter untuk menyaring berdasarkan kategori/status\n• Klik nama kolom untuk mengurutkan',
        },
        {
          title: 'Versi & Draft',
          content: 'Sistem menyimpan versi lama artikel Anda. Klik &quot;Versions&quot; untuk melihat dan restore versi sebelumnya jika diperlukan.',
        },
        {
          title: 'Penjadwalan Publikasi',
          content: 'Anda bisa menjadwalkan artikel untuk dipublikasi nanti:\n1. Pilih status &quot;Draft&quot;\n2. Klik &quot;Schedule Publish&quot;\n3. Pilih tanggal dan waktu\n4. Save',
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
