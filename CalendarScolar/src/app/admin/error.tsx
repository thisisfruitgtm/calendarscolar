'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Home, RefreshCw, Shield } from 'lucide-react'
import Link from 'next/link'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // In production, send to monitoring service
      console.error('Admin error:', {
        message: error.message,
        digest: error.digest,
        stack: error.stack,
      })
    } else {
      console.error('Admin error:', error)
    }
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-4">
            <Shield className="h-12 w-12 text-red-600" />
          </div>
        </div>
        
        <h1 className="mb-4 text-3xl font-bold text-slate-900">
          Eroare în Admin
        </h1>
        
        <p className="mb-6 text-slate-600">
          A apărut o eroare în panoul de administrare. Te rugăm să încerci din nou.
        </p>

        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-left">
            <p className="mb-2 text-sm font-semibold text-red-900">Detalii eroare (dev):</p>
            <p className="text-sm text-red-700">{error.message}</p>
            {error.digest && (
              <p className="mt-2 text-xs text-red-600">Digest: {error.digest}</p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset} variant="default" className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Încearcă din nou
          </Button>
          
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/admin">
              <Home className="mr-2 h-4 w-4" />
              Dashboard Admin
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

