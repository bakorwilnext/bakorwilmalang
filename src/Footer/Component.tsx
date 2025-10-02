import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'
import { MapPin, Mail, Phone, Printer, Youtube, Twitter, Facebook, Instagram } from 'lucide-react'

import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

export async function Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)()

  const navItems = footerData?.navItems || []
  const contactInfo = footerData?.contactInfo
  const socialMedia = footerData?.socialMedia
  const partnerLogos = footerData?.partnerLogos || []

  return (
    <footer className="mt-auto bg-gray-900 text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Location Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-6">Lokasi</h3>
            
            {/* Google Maps Embed */}
            <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.3437000919366!2d112.62150207575247!3d-7.963387679366113!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd6282b6f0d0a61%3A0x474046e3ce87264a!2sBadan%20Koordinasi%20Wilayah%20Pemerintahan%20dan%20Pembangunan%20Jawa%20Timur%20III%20(%20BAKORWIL%20III%20)%20Malang!5e0!3m2!1sid!2sid!4v1721029756068!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi BAKORWIL III Malang"
              />
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-6">Kontak</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <div className="text-gray-300">
                  {contactInfo?.address ? (
                    <p className="whitespace-pre-line">{contactInfo.address}</p>
                  ) : (
                    <>
                      <p>Jl. Simpang Ijen No.2, Oro-oro Dowo,</p>
                      <p>Kec. Klojen, Kota Malang, Jawa Timur</p>
                      <p>65119</p>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <a 
                  href={`mailto:${contactInfo?.email || 'bakorwilmalang@jatimprov.go.id'}`}
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  {contactInfo?.email || 'bakorwilmalang@jatimprov.go.id'}
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <a 
                  href={`tel:${contactInfo?.phone || '(0341)555-366'}`}
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  {contactInfo?.phone || '(0341) 555-366'}
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <Printer className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300">{contactInfo?.fax || '(0341) 551-323'}</span>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex gap-3 pt-4">
              {socialMedia?.youtube && (
                <a 
                  href={socialMedia.youtube} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 hover:bg-red-600 rounded-full transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
              {socialMedia?.twitter && (
                <a 
                  href={socialMedia.twitter} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 hover:bg-blue-400 rounded-full transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {socialMedia?.facebook && (
                <a 
                  href={socialMedia.facebook} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 hover:bg-blue-600 rounded-full transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {socialMedia?.instagram && (
                <a 
                  href={socialMedia.instagram} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-800 hover:bg-pink-600 rounded-full transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Bakorwil Links Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white mb-6">Bakorwil</h3>
            
            <div className="space-y-3">
              <Link 
                href="/bakorwil-madiun" 
                className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors"
              >
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                Bakorwil I Madiun
              </Link>
              
              <Link 
                href="/bakorwil-bojonegoro" 
                className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors"
              >
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                Bakorwil II Bojonegoro
              </Link>
              
              <Link 
                href="/bakorwil-pamekasan" 
                className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors"
              >
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                Bakorwil IV Pamekasan
              </Link>
              
              <Link 
                href="/bakorwil-jember" 
                className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors"
              >
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                Bakorwil V Jember
              </Link>
            </div>

            {/* Navigation Items from Footer Config */}
            {navItems.length > 0 && (
              <div className="pt-6 border-t border-gray-700">
                <div className="space-y-2">
                  {navItems.map(({ link }, i) => (
                    <CMSLink 
                      key={i} 
                      {...link} 
                      className="block text-gray-300 hover:text-blue-400 transition-colors"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Partner Logos Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="bg-white rounded-full px-8 py-4 flex items-center justify-center">
            <div className="flex items-center gap-8 flex-wrap justify-center">
              {partnerLogos.length > 0 ? (
                partnerLogos.map((partner, index) => {
                  if (typeof partner.logo === 'object' && partner.logo !== null) {
                    return (
                      <div key={index} className="flex items-center">
                        {partner.url ? (
                          <a 
                            href={partner.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-80 transition-opacity"
                          >
                            <Media
                              resource={partner.logo}
                              className="h-8 w-auto object-contain"
                              imgClassName="h-8 w-auto object-contain"
                            />
                          </a>
                        ) : (
                          <Media
                            resource={partner.logo}
                            className="h-8 w-auto object-contain"
                            imgClassName="h-8 w-auto object-contain"
                          />
                        )}
                      </div>
                    )
                  }
                  return null
                })
              ) : (
                // Default partner logos if none configured
                <>

                </>
              )}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} BAKORWIL III Malang. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}