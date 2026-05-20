import React from 'react'
import Link from 'next/link'
import {
  Landmark,
  Building,
  Briefcase,
  Handshake,
  Users,
  UserCheck,
  FileText,
  FileBadge,
  ClipboardList,
  ScrollText,
  Scale,
  ShieldCheck,
  Info,
  Megaphone,
  Newspaper,
  Mail,
  Phone,
  Globe,
  HardHat,
  MapPin,
  Map,
  Route,
  Droplets,
  Leaf,
  GraduationCap,
  HeartPulse,
  BookOpen,
  Award,
  BarChart3,
  PieChart,
  TrendingUp,
  Database,
  Settings,
  Calendar,
  Clock,
  Download,
  ExternalLink,
  Star,
  type LucideIcon,
} from 'lucide-react'

/* ─── Icon map ─── */

const ICON_MAP: Record<string, LucideIcon> = {
  landmark: Landmark,
  building: Building,
  briefcase: Briefcase,
  handshake: Handshake,
  users: Users,
  'user-check': UserCheck,
  'file-text': FileText,
  'file-badge': FileBadge,
  'clipboard-list': ClipboardList,
  'scroll-text': ScrollText,
  scale: Scale,
  'shield-check': ShieldCheck,
  info: Info,
  megaphone: Megaphone,
  newspaper: Newspaper,
  mail: Mail,
  phone: Phone,
  globe: Globe,
  'hard-hat': HardHat,
  'map-pin': MapPin,
  map: Map,
  route: Route,
  droplets: Droplets,
  leaf: Leaf,
  'graduation-cap': GraduationCap,
  'heart-pulse': HeartPulse,
  'book-open': BookOpen,
  award: Award,
  'bar-chart-3': BarChart3,
  'pie-chart': PieChart,
  'trending-up': TrendingUp,
  database: Database,
  settings: Settings,
  calendar: Calendar,
  clock: Clock,
  download: Download,
  'external-link': ExternalLink,
  star: Star,
}

/* ─── Types ─── */

interface ServiceItem {
  icon?: string
  title: string
  description?: string | null
  link?: {
    type?: 'reference' | 'custom'
    reference?: {
      value: any
      relationTo: 'pages' | 'posts'
    }
    url?: string | null
    newTab?: boolean
  }
}

interface ServicesBlockProps {
  sectionTitle?: string | null
  sectionSubtitle?: string | null
  services?: ServiceItem[]
  className?: string
  disableInnerContainer?: boolean
}

/* ─── Helpers ─── */

function resolveHref(service: ServiceItem): string | null {
  const { link } = service
  if (!link) return null

  if (link.type === 'custom' && link.url) return link.url

  if (link.type === 'reference' && link.reference) {
    const { value, relationTo } = link.reference
    if (typeof value === 'object' && value?.slug) {
      if (relationTo === 'pages') return value.slug === 'home' ? '/' : `/${value.slug}`
      if (relationTo === 'posts') return `/posts/${value.slug}`
    }
  }

  return null
}

/* ─── Main Component ─── */

export const ServicesBlock: React.FC<ServicesBlockProps> = ({
  sectionTitle = 'Layanan',
  sectionSubtitle,
  services,
  disableInnerContainer,
}) => {
  if (!services || services.length === 0) return null

  return (
    <section className="bg-cyan-500 py-12 sm:py-16">
      <div className={`container mx-auto ${disableInnerContainer ? '' : 'px-4 sm:px-6 lg:px-8'}`}>
        {/* Section Header */}
        {sectionTitle && (
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {sectionTitle}
            </h2>
            {sectionSubtitle && (
              <p className="text-cyan-100 mt-2 text-sm sm:text-base max-w-2xl mx-auto">
                {sectionSubtitle}
              </p>
            )}
          </div>
        )}

        {/* Services Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Service Card ─── */

function ServiceCard({ service }: { service: ServiceItem }) {
  const { icon, title, description, link } = service
  const href = resolveHref(service)
  const isExternal = link?.type === 'custom' && link?.url?.startsWith('http')
  const IconComponent = ICON_MAP[icon || 'briefcase'] || Briefcase

  const content = (
    <div className="group flex flex-col items-center text-center">
      {/* Icon Circle */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white/40 flex items-center justify-center mb-4 group-hover:border-white/80 transition-colors duration-300">
        <IconComponent className="w-7 h-7 sm:w-9 sm:h-9 text-white" strokeWidth={1.5} />
      </div>

      {/* Title */}
      <h3 className="text-sm sm:text-base font-bold text-white mb-1 leading-tight group-hover:underline underline-offset-4 decoration-2 transition-all duration-200">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-[11px] sm:text-xs text-cyan-100 leading-relaxed max-w-[160px]">
          {description}
        </p>
      )}
    </div>
  )

  if (!href) return content

  if (isExternal) {
    return (
      <a
        href={href}
        target={link?.newTab ? '_blank' : '_self'}
        rel={link?.newTab ? 'noopener noreferrer' : undefined}
      >
        {content}
      </a>
    )
  }

  return (
    <Link href={href} target={link?.newTab ? '_blank' : '_self'}>
      {content}
    </Link>
  )
}