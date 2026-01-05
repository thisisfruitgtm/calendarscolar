import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AdminDashboard() {
  const eventCount = await db.event.count({ where: { active: true } })
  const adCount = await db.event.count({ where: { isAd: true, active: true } })
  const countyCount = await db.county.count({ where: { active: true } })
  const groupCount = await db.vacationGroup.count()
  const settings = await db.settings.findUnique({ where: { id: 'settings' } })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-600">Bine ai venit în panoul de administrare</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Evenimente Active</CardTitle>
            <CardDescription>Total evenimente în calendar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{eventCount}</div>
            <Button asChild className="mt-4" variant="outline">
              <Link href="/admin/events">Gestionează</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Județe</CardTitle>
            <CardDescription>{groupCount} grupe de vacanță</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{countyCount}</div>
            <Button asChild className="mt-4" variant="outline">
              <Link href="/admin/counties">Gestionează</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reclame Active</CardTitle>
            <CardDescription>Evenimente promoționale</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{adCount}</div>
            <Button asChild className="mt-4" variant="outline">
              <Link href="/admin/ads">Gestionează</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Setări</CardTitle>
            <CardDescription>Configurare calendar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Reclame:</span>{' '}
                {settings?.adsEnabled ? 'Activate' : 'Dezactivate'}
              </div>
              <Button asChild className="mt-4" variant="outline">
                <Link href="/admin/settings">Configurează</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

