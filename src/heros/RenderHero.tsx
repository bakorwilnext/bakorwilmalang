import React from 'react'
import dynamic from 'next/dynamic'

import type { Page } from '@/payload-types'

const HighImpactHero = dynamic(() => import('@/heros/HighImpact').then(m => m.HighImpactHero))
const LowImpactHero = dynamic(() => import('@/heros/LowImpact').then(m => m.LowImpactHero))
const MediumImpactHero = dynamic(() => import('@/heros/MediumImpact').then(m => m.MediumImpactHero))
const CustomHero = dynamic(() => import('@/heros/CustomHero').then(m => m.CustomHero))

const heroes = {
  highImpact: HighImpactHero,
  lowImpact: LowImpactHero,
  mediumImpact: MediumImpactHero,
  customHero: CustomHero,
}

export const RenderHero: React.FC<Page['hero']> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type]

  if (!HeroToRender) return null

  return <HeroToRender {...props} />
}