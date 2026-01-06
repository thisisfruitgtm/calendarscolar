'use client'

import { Promo } from '@prisma/client'
import Link from 'next/link'
import { X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { trackPromoClick, trackPromoImpression } from '@/app/actions/promos'

interface PromoBannerProps {
  promo: Omit<Promo, 'counties'>
}

export function PromoBanner({ promo }: PromoBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  // Track impression on mount
  useEffect(() => {
    if (!dismissed) {
      trackPromoImpression(promo.id).catch(() => {
        // Silently fail - don't break UI
      })
    }
  }, [promo.id, dismissed])

  if (dismissed) return null

  const handleClick = async () => {
    if (promo.link) {
      await trackPromoClick(promo.id).catch(() => {
        // Silently fail
      })
    }
  }

  const backgroundImage = promo.backgroundImageDesktop || promo.backgroundImageMobile || promo.imageUrl
  
  const content = (
    <div 
      className="relative rounded-xl overflow-hidden mb-4 transition-all hover:shadow-lg"
      style={{
        backgroundColor: promo.backgroundColor || '#3B82F6',
        minHeight: backgroundImage ? '120px' : '80px',
      }}
    >
      {promo.backgroundImageDesktop && (
        <div 
          className="hidden md:block absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${promo.backgroundImageDesktop})` }}
        />
      )}
      {promo.backgroundImageMobile && (
        <div 
          className="md:hidden absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${promo.backgroundImageMobile})` }}
        />
      )}
      {!promo.backgroundImageDesktop && !promo.backgroundImageMobile && promo.imageUrl && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${promo.imageUrl})` }}
        />
      )}
      
      {/* Overlay */}
      <div className={`absolute inset-0 ${backgroundImage ? 'bg-black/50' : ''}`} />
      
      {/* Content */}
      <div className="relative z-10 p-4 md:p-6 flex items-center justify-between">
        <div className="text-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider opacity-90">
              📢 Promoție
            </span>
          </div>
          <h3 className="font-bold text-lg md:text-xl">
            {promo.title}
          </h3>
          {promo.description && (
            <p className="mt-1 text-sm opacity-90 line-clamp-2">
              {promo.description}
            </p>
          )}
        </div>
        
        {promo.link && (
          <span className="hidden md:inline-flex bg-white text-slate-900 px-4 py-2 rounded-lg font-medium text-sm hover:bg-slate-100 transition-colors">
            Află mai multe →
          </span>
        )}
      </div>
      
      {/* Dismiss button */}
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setDismissed(true)
        }}
        className="absolute top-2 right-2 z-20 p-1 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
        aria-label="Închide"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )

  if (promo.link) {
    return (
      <Link 
        href={promo.link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block"
        onClick={handleClick}
      >
        {content}
      </Link>
    )
  }

  return content
}
