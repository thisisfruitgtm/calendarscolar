import Link from 'next/link'
import { MapPin, Home, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-lg text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-6">
          <Search className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Pagină negăsită
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          Ne pare rău, pagina pe care o cauți nu există sau a fost mutată.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Pagina principală
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/judete">
              <MapPin className="h-4 w-4 mr-2" />
              Vezi toate județele
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
