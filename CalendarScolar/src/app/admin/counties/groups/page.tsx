import { db } from '@/lib/db'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Edit, Plus } from 'lucide-react'

export default async function GroupsPage() {
  const groups = await db.vacationGroup.findMany({
    include: {
      counties: {
        orderBy: { name: 'asc' },
      },
      periods: {
        where: { schoolYear: '2025-2026' },
        orderBy: { startDate: 'asc' },
      },
    },
    orderBy: { name: 'asc' },
  })

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Grupe de Vacanță</h1>
          <p className="mt-2 text-slate-600">
            Gestionează grupele și perioadele de vacanță intersemestrială
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/counties">
            <span>Înapoi la Județe</span>
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {groups.map((group) => (
          <Card key={group.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-lg"
                    style={{ backgroundColor: group.color }}
                  />
                  <CardTitle>{group.name}</CardTitle>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/admin/counties/groups/${group.id}`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <CardDescription>
                {group.counties.length} județe
              </CardDescription>
            </CardHeader>
            <CardContent>
              {group.periods.length > 0 ? (
                <div className="space-y-2">
                  {group.periods.map((period) => (
                    <div
                      key={period.id}
                      className="flex items-center gap-2 rounded-lg bg-slate-50 p-2 text-sm"
                    >
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <div>
                        <div className="font-medium">{period.name}</div>
                        <div className="text-xs text-slate-500">
                          {new Date(period.startDate).toLocaleDateString('ro-RO')} -{' '}
                          {new Date(period.endDate).toLocaleDateString('ro-RO')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  Nu există perioade de vacanță configurate
                </p>
              )}
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link href={`/admin/counties/groups/${group.id}`}>
                  Gestionează Grupa
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}





