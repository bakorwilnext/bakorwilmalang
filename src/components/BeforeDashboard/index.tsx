'use client'

import { Banner } from '@payloadcms/ui/elements/Banner'
import React, { useState } from 'react'

import { SeedButton } from './SeedButton'
import AdminGuide from '../AdminGuide'
import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  const [showGuide, setShowGuide] = useState(false)

  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Selamat datang di Dashboard Admin! 👋</h4>
      </Banner>
      
      <div className={`${baseClass}__quick-actions`}>
        <button 
          className={`${baseClass}__guide-button`}
          onClick={() => setShowGuide(!showGuide)}
        >
          📚 {showGuide ? 'Sembunyikan Panduan' : 'Lihat Panduan Lengkap'}
        </button>
      </div>

      {showGuide && <AdminGuide />}

      {!showGuide && (
        <>
          <div className={`${baseClass}__intro`}>
            <h5>Langkah Awal:</h5>
            <ul className={`${baseClass}__instructions`}>
              {/* <li>
                <strong>Seed Database:</strong> <SeedButton />
                {' dengan contoh halaman, artikel, dan konten lainnya untuk memulai website Anda.'}
              </li> */}
              <li>
                <strong>Buat Artikel:</strong> Klik menu <strong>Posts</strong> di sidebar kiri untuk membuat artikel/berita baru.
              </li>
              <li>
                <strong>Edit Halaman:</strong> Klik menu <strong>Pages</strong> untuk mengedit halaman website seperti Home, About, dll.
              </li>
              <li>
                <strong>Upload Gambar:</strong> Klik menu <strong>Media</strong> untuk upload dan kelola gambar/file (disarankan untuk foto menggunakan format .webp dan tidak lebih dari 2mb).
              </li>
              <li>
                <strong>Buat Formulir:</strong> Klik menu <strong>Forms</strong> untuk membuat formulir kontak, pengaduan, dll.
              </li>
            </ul>
          </div>

          <div className={`${baseClass}__help-box`}>
            <h5>💡 Tips Cepat:</h5>
            <ul>
              <li>Gunakan tombol <strong>"Live Preview"</strong> untuk melihat tampilan sebelum publish</li>
              <li>Klik tombol <strong>"Save draft"</strong> untuk menyimpan tanpa publish</li>
              <li>Klik tombol <strong>"Publish"</strong> untuk mempublikasikan ke website</li>
              <li>Sistem akan otomatis menyimpan perubahan Anda setiap beberapa detik</li>
              <li>Klik tombol <strong>"📚 Lihat Panduan Lengkap"</strong> di atas untuk tutorial detail</li>
            </ul>
          </div>

          <div className={`${baseClass}__warning-box`}>
            <h5>⚠️ Penting untuk Diingat:</h5>
            <ul>
              <li>Selalu logout setelah selesai menggunakan admin panel</li>
              <li>Jangan bagikan password Anda ke orang lain</li>
              <li>Cek preview sebelum mempublikasikan konten</li>
              <li>Backup data penting secara berkala</li>
              <li>Hubungi admin IT jika mengalami masalah teknis</li>
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

export default BeforeDashboard