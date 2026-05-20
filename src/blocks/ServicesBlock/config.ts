import type { Block } from 'payload'

const ICON_OPTIONS = [
  // Pemerintahan & Koordinasi
  { label: 'Landmark (Pemerintahan)', value: 'landmark' },
  { label: 'Building (Gedung/Kantor)', value: 'building' },
  { label: 'Briefcase (Dinas/Jabatan)', value: 'briefcase' },
  { label: 'Handshake (Koordinasi)', value: 'handshake' },
  { label: 'Users (Masyarakat/Tim)', value: 'users' },
  { label: 'UserCheck (Verifikasi)', value: 'user-check' },

  // Layanan Publik
  { label: 'FileText (Dokumen/Surat)', value: 'file-text' },
  { label: 'FileBadge (Sertifikat)', value: 'file-badge' },
  { label: 'ClipboardList (Administrasi)', value: 'clipboard-list' },
  { label: 'ScrollText (Regulasi/Peraturan)', value: 'scroll-text' },
  { label: 'Scale (Hukum)', value: 'scale' },
  { label: 'ShieldCheck (Keamanan/Perizinan)', value: 'shield-check' },

  // Informasi & Komunikasi
  { label: 'Info (Informasi)', value: 'info' },
  { label: 'Megaphone (Pengumuman)', value: 'megaphone' },
  { label: 'Newspaper (Berita/PPID)', value: 'newspaper' },
  { label: 'Mail (Surat/Korespondensi)', value: 'mail' },
  { label: 'Phone (Kontak)', value: 'phone' },
  { label: 'Globe (Website/Portal)', value: 'globe' },

  // Pembangunan & Infrastruktur
  { label: 'HardHat (Pembangunan)', value: 'hard-hat' },
  { label: 'MapPin (Lokasi/Wilayah)', value: 'map-pin' },
  { label: 'Map (Peta Wilayah)', value: 'map' },
  { label: 'Route (Infrastruktur Jalan)', value: 'route' },
  { label: 'Droplets (Air/Sumber Daya)', value: 'droplets' },
  { label: 'Leaf (Lingkungan)', value: 'leaf' },

  // Pendidikan & Sosial
  { label: 'GraduationCap (Pendidikan)', value: 'graduation-cap' },
  { label: 'HeartPulse (Kesehatan)', value: 'heart-pulse' },
  { label: 'BookOpen (Pembelajaran)', value: 'book-open' },
  { label: 'Award (Penghargaan)', value: 'award' },

  // Keuangan & Data
  { label: 'BarChart3 (Statistik/Data)', value: 'bar-chart-3' },
  { label: 'PieChart (Anggaran)', value: 'pie-chart' },
  { label: 'TrendingUp (Perkembangan)', value: 'trending-up' },
  { label: 'Database (Basis Data)', value: 'database' },

  // Umum
  { label: 'Settings (Pengaturan)', value: 'settings' },
  { label: 'Calendar (Agenda/Jadwal)', value: 'calendar' },
  { label: 'Clock (Waktu/Jam Kerja)', value: 'clock' },
  { label: 'Download (Unduh)', value: 'download' },
  { label: 'ExternalLink (Tautan Luar)', value: 'external-link' },
  { label: 'Star (Unggulan)', value: 'star' },
]

export const ServicesBlock: Block = {
  slug: 'servicesBlock',
  interfaceName: 'ServicesBlock',
  labels: {
    singular: 'Layanan Block',
    plural: 'Layanan Blocks',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'sectionTitle',
          type: 'text',
          label: 'Judul Section',
          defaultValue: 'Layanan',
          admin: {
            width: '50%',
            placeholder: 'contoh: Layanan Kami',
          },
        },
        {
          name: 'sectionSubtitle',
          type: 'text',
          label: 'Subjudul Section',
          admin: {
            width: '50%',
            placeholder: 'contoh: Layanan publik yang kami sediakan',
          },
        },
      ],
    },
    {
      name: 'services',
      type: 'array',
      label: 'Daftar Layanan',
      minRows: 1,
      maxRows: 12,
      labels: {
        singular: 'Layanan',
        plural: 'Layanan',
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          label: 'Ikon',
          required: true,
          defaultValue: 'briefcase',
          options: ICON_OPTIONS,
          admin: {
            description: 'Pilih ikon yang merepresentasikan layanan ini',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Nama Layanan',
          admin: {
            placeholder: 'contoh: Layanan PPID',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Deskripsi Singkat',
          admin: {
            placeholder: 'Deskripsi singkat layanan (1-2 kalimat)',
            rows: 2,
          },
        },
        {
          name: 'link',
          type: 'group',
          label: 'Link (Opsional)',
          fields: [
            {
              name: 'type',
              type: 'radio',
              label: 'Tipe Link',
              options: [
                { label: 'Link Internal', value: 'reference' },
                { label: 'URL Eksternal', value: 'custom' },
              ],
              defaultValue: 'reference',
              admin: { layout: 'horizontal' },
            },
            {
              name: 'reference',
              type: 'relationship',
              relationTo: ['pages', 'posts'],
              label: 'Halaman Tujuan',
              maxDepth: 1,
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'reference',
              },
            },
            {
              name: 'url',
              type: 'text',
              label: 'URL Eksternal',
              admin: {
                condition: (_, siblingData) => siblingData?.type === 'custom',
                placeholder: 'https://...',
              },
            },
            {
              name: 'newTab',
              type: 'checkbox',
              label: 'Buka di tab baru',
              defaultValue: false,
            },
          ],
        },
      ],
    },
  ],
}