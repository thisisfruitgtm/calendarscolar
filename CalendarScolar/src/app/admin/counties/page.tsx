import { db } from '@/lib/db'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar, Edit } from 'lucide-react'
import { ToggleCountyActive } from '@/components/admin/ToggleCountyActive'

export default async function CountiesPage() {
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

  const allCounties = await db.county.findMany({
    orderBy: { name: 'asc' },
    include: {
      group: true,
    },
  })

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Gestionare Județe</h1>
          <p className="mt-2 text-slate-600">
            Gestionează județele și grupele de vacanță intersemestrială
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/counties/groups">Gestionează Grupe</Link>
        </Button>
      </div>

      {/* Groups Overview */}
      <div className="mb-8 grid gap-6 md:grid-cols-3">
        {groups.map((group) => (
          <Card key={group.id}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div
                  className="h-6 w-6 rounded-full"
                  style={{ backgroundColor: group.color }}
                />
                <CardTitle>{group.name}</CardTitle>
              </div>
              <CardDescription>
                {group.counties.length} județe
              </CardDescription>
            </CardHeader>
            <CardContent>
              {group.periods[0] && (
                <div className="text-sm text-slate-600">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  {new Date(group.periods[0].startDate).toLocaleDateString('ro-RO')} -{' '}
                  {new Date(group.periods[0].endDate).toLocaleDateString('ro-RO')}
                </div>
              )}
              <Button asChild variant="outline" className="mt-4 w-full">
                <Link href={`/admin/counties/groups/${group.id}`}>
                  Editează Grupa
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Counties List */}
      <Card>
        <CardHeader>
          <CardTitle>Toate Județele</CardTitle>
          <CardDescription>
            {allCounties.length} județe în total ({allCounties.filter(c => c.active).length} active)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    Județ
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    Reședință
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    Grupă
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-slate-700">
                    Acțiuni
                  </th>
                </tr>
              </thead>
              <tbody>
                {allCounties.map((county) => (
                  <tr key={county.id} className="border-b hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span className="font-medium">{county.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {county.capitalCity}
                    </td>
                    <td className="px-4 py-3">
                      {county.group ? (
                        <Badge
                          style={{
                            backgroundColor: `${county.group.color}20`,
                            color: county.group.color,
                            borderColor: county.group.color,
                          }}
                        >
                          {county.group.name}
                        </Badge>
                      ) : (
                        <span className="text-sm text-slate-400">Fără grupă</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <ToggleCountyActive county={county} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/counties/${county.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}







