import { db } from '@/lib/db'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function SubscribersPage() {
  type SubscriptionWithCounty = Awaited<ReturnType<typeof db.calendarSubscription.findMany<{
    include: { county: { select: { name: true; slug: true } } }
  }>>>[0]
  
  type ActionWithCounty = Awaited<ReturnType<typeof db.subscriptionAction.findMany<{
    include: { county: { select: { name: true; slug: true } } }
  }>>>[0]
  
  let subscriptions: SubscriptionWithCounty[] = []
  let actions: ActionWithCounty[] = []
  
  try {
    subscriptions = await db.calendarSubscription.findMany({
      include: {
        county: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: {
        lastAccess: 'desc',
      },
    }) as SubscriptionWithCounty[]

    try {
      actions = await db.subscriptionAction.findMany({
        include: {
          county: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }) as ActionWithCounty[]
    } catch (actionError) {
      console.error('Error fetching actions:', actionError)
      actions = []
    }
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    // Return empty arrays if tables don't exist yet
    subscriptions = []
    actions = []
  }

  const totalSubscriptions = subscriptions.length
  const uniqueCounties = new Set(subscriptions.map((s) => s.countyId)).size
  
  // Group by county
  const byCounty = subscriptions.reduce((acc, sub) => {
    if (!sub.county) return acc
    const countyName = sub.county.name
    if (!acc[countyName]) {
      acc[countyName] = {
        county: sub.county,
        subscriptions: [],
        totalAccess: 0,
      }
    }
    acc[countyName].subscriptions.push(sub)
    acc[countyName].totalAccess += sub.accessCount
    return acc
  }, {} as Record<string, { county: { name: string; slug: string }; subscriptions: typeof subscriptions; totalAccess: number }>)

  // Group by user agent
  const byUserAgent = subscriptions.reduce((acc, sub) => {
    const ua = sub.userAgent || 'Necunoscut'
    if (!acc[ua]) {
      acc[ua] = { count: 0, totalAccess: 0 }
    }
    acc[ua].count++
    acc[ua].totalAccess += sub.accessCount
    return acc
  }, {} as Record<string, { count: number; totalAccess: number }>)

  // Group actions by type
  const actionStats = actions.reduce((acc, action) => {
    const type = action.actionType
    if (!acc[type]) {
      acc[type] = 0
    }
    acc[type]++
    return acc
  }, {} as Record<string, number>)

  const actionLabels: Record<string, string> = {
    google: 'Google Calendar',
    apple: 'Apple Calendar',
    outlook: 'Outlook',
    copy_url: 'Copiază URL Feed',
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Subscriberi Calendar</h1>
        <p className="mt-2 text-slate-600">Vezi statisticile despre abonările la calendar</p>
      </div>

      {/* Overview Stats */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Total Abonări</CardTitle>
            <CardDescription className="text-xs">Abonări active</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalSubscriptions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Județe Acoperite</CardTitle>
            <CardDescription className="text-xs">Județe cu abonări</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{uniqueCounties}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Total Accesări</CardTitle>
            <CardDescription className="text-xs">Sincronizări calendar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {subscriptions.reduce((sum, s) => sum + s.accessCount, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Click-uri Acțiuni</CardTitle>
            <CardDescription className="text-xs">Click-uri pe butoane</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{actions.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        {/* Click-uri pe Acțiuni */}
        <Card>
          <CardHeader>
            <CardTitle>Click-uri pe Acțiuni</CardTitle>
            <CardDescription>Distribuție pe tip de acțiune</CardDescription>
          </CardHeader>
          <CardContent>
            {actions.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">
                Nu există click-uri înregistrate încă.
              </p>
            ) : (
              <div className="space-y-3">
                {Object.entries(actionStats)
                  .sort((a, b) => b[1] - a[1])
                  .map(([type, count]) => (
                    <div
                      key={type}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <span className="font-medium text-sm">
                        {actionLabels[type] || type}
                      </span>
                      <Badge variant="secondary" className="font-semibold">
                        {count}
                      </Badge>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* După Județ */}
        <Card>
          <CardHeader>
            <CardTitle>După Județ</CardTitle>
            <CardDescription>Abonări pe județ</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(byCounty).length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">
                Nu există abonări pe județe încă.
              </p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {Object.entries(byCounty)
                  .sort((a, b) => b[1].totalAccess - a[1].totalAccess)
                  .map(([countyName, data]) => (
                    <div
                      key={countyName}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <div className="font-medium text-sm">{countyName}</div>
                        <div className="text-xs text-slate-500">
                          {data.subscriptions.length} abonări
                        </div>
                      </div>
                      <Badge variant="secondary" className="font-semibold">
                        {data.totalAccess}
                      </Badge>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* După Aplicație */}
        <Card>
          <CardHeader>
            <CardTitle>După Aplicație</CardTitle>
            <CardDescription>Abonări pe aplicație</CardDescription>
          </CardHeader>
          <CardContent>
            {Object.keys(byUserAgent).length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">
                Nu există abonări pe aplicații încă.
              </p>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {Object.entries(byUserAgent)
                  .sort((a, b) => b[1].count - a[1].count)
                  .map(([ua, data]) => (
                    <div
                      key={ua}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <div className="font-medium text-sm">{ua}</div>
                        <div className="text-xs text-slate-500">
                          {data.count} abonări
                        </div>
                      </div>
                      <Badge variant="secondary" className="font-semibold">
                        {data.totalAccess}
                      </Badge>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Toate Abonările</CardTitle>
          <CardDescription>Lista completă de abonări active</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Județ</TableHead>
                  <TableHead>Aplicație</TableHead>
                  <TableHead>Prima Abonare</TableHead>
                  <TableHead>Ultima Sincronizare</TableHead>
                  <TableHead className="text-right">Accesări</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                      Nu există abonări încă. Abonările vor apărea aici când utilizatorii se vor abona la calendar.
                    </TableCell>
                  </TableRow>
                ) : (
                  subscriptions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">
                        {sub.county.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {sub.userAgent || 'Necunoscut'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(sub.firstAccess).toLocaleDateString('ro-RO', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(sub.lastAccess).toLocaleDateString('ro-RO', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {sub.accessCount}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

