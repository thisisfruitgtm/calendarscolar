'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AccessibilityMenu } from '@/components/accessibility/AccessibilityMenu'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-slate-900 hover:text-slate-800 transition-colors">
              CalendarȘcolar.ro
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/judete"
                className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
              >
                Județe
              </Link>
              <Link
                href="/cum-functioneaza"
                className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
              >
                Cum Funcționează
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <AccessibilityMenu />
            <Button asChild variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm hover:bg-white">
              <Link href="/judete">
                Vezi Toate Județele
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

