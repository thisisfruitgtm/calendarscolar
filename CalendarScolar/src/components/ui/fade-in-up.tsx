'use client'

import { useFadeInUp } from '@/hooks/use-fade-in-up'
import { ReactNode } from 'react'

interface FadeInUpProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  threshold?: number
}

export function FadeInUp({ 
  children, 
  className = '',
  delay = 0,
  duration = 600,
  threshold = 0.1,
}: FadeInUpProps) {
  const { ref, style } = useFadeInUp({ delay, duration, threshold })

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  )
}

