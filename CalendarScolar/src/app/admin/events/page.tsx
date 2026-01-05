import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { ToggleEventActive } from '@/components/admin/ToggleEventActive'
import { DeleteEventButton } from '@/components/admin/DeleteEventButton'
import { EventType } from '@prisma/client'

function getEventTypeLabel(type: EventType): string {
  switch (type) {
    case EventType.VACATION:
      return 'Vacanță'
    case EventType.HOLIDAY:
      return 'Sărbătoare Legală'
    case EventType.SEMESTER_START:
      return 'Început Semestru'
    case EventType.SEMESTER_END:
      return 'Sfârșit Semestru'
    case EventType.LAST_DAY:
      return 'Ultima Zi Cursuri'
    case EventType.PROMO:
      return 'Promo'
    default:
      return type
  }
}

export default async function EventsPage() {
  const events = await db.event.findMany({
    orderBy: { startDate: 'asc' },
  })

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Evenimente</h1>
          <p className="mt-2 text-slate-600">Gestionează evenimentele din calendar</p>
        </div>
        <Button asChild>
          <Link href="/admin/events/new">Adaugă Eveniment</Link>
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titlu</TableHead>
              <TableHead>Tip</TableHead>
              <TableHead>Dată Start</TableHead>
              <TableHead>Dată Sfârșit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-slate-500">
                  Nu există evenimente. Adaugă primul eveniment.
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.title}</TableCell>
                  <TableCell>
                    <Badge variant={event.isAd ? 'destructive' : 'default'}>
                      {event.isAd ? 'Reclamă' : getEventTypeLabel(event.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(event.startDate).toLocaleDateString('ro-RO')}
                  </TableCell>
                  <TableCell>
                    {event.endDate
                      ? new Date(event.endDate).toLocaleDateString('ro-RO')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={event.active ? 'default' : 'secondary'}>
                      {event.active ? 'Activ' : 'Inactiv'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/events/${event.id}`}>Editează</Link>
                      </Button>
                      <ToggleEventActive id={event.id} active={event.active} />
                      <DeleteEventButton id={event.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

