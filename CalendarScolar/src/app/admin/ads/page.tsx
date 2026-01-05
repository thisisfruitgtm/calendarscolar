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

export default async function AdsPage() {
  const ads = await db.event.findMany({
    where: { isAd: true },
    include: {
      counties: {
        include: {
          county: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: { startDate: 'asc' },
  })

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reclame</h1>
          <p className="mt-2 text-slate-600">Gestionează evenimentele promoționale</p>
        </div>
        <Button asChild>
          <Link href="/admin/events/new?isAd=true">Adaugă Reclamă</Link>
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titlu</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Județe</TableHead>
              <TableHead>Dată Start</TableHead>
              <TableHead>Dată Sfârșit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-slate-500">
                  Nu există reclame. Adaugă prima reclamă.
                </TableCell>
              </TableRow>
            ) : (
              ads.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell className="font-medium">{ad.title}</TableCell>
                  <TableCell>
                    {ad.adLink ? (
                      <a
                        href={ad.adLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {ad.adLink}
                      </a>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {ad.counties.length === 0 ? (
                      <Badge variant="outline">Toate județele</Badge>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {ad.counties.map((ec) => (
                          <Badge key={ec.id} variant="secondary">
                            {ec.county.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(ad.startDate).toLocaleDateString('ro-RO')}
                  </TableCell>
                  <TableCell>
                    {ad.endDate
                      ? new Date(ad.endDate).toLocaleDateString('ro-RO')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={ad.active ? 'default' : 'secondary'}>
                      {ad.active ? 'Activ' : 'Inactiv'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/events/${ad.id}`}>Editează</Link>
                      </Button>
                      <ToggleEventActive id={ad.id} active={ad.active} />
                      <DeleteEventButton id={ad.id} />
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

