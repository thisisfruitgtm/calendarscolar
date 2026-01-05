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
import { TogglePromoActive } from '@/components/admin/TogglePromoActive'
import { DeletePromoButton } from '@/components/admin/DeletePromoButton'

export default async function PromosPage() {
  const promos = await db.promo.findMany({
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
    orderBy: [{ priority: 'desc' }, { startDate: 'asc' }],
  })

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Promoții</h1>
          <p className="mt-2 text-slate-600">Gestionează reclamele și promoțiile</p>
        </div>
        <Button asChild>
          <Link href="/admin/promos/new">Adaugă Promoție</Link>
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titlu</TableHead>
              <TableHead>Județe</TableHead>
              <TableHead>Perioadă</TableHead>
              <TableHead>Afișări</TableHead>
              <TableHead>Click-uri</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-slate-500">
                  Nu există promoții. Adaugă prima promoție.
                </TableCell>
              </TableRow>
            ) : (
              promos.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell className="font-medium">
                    <div>
                      {promo.title}
                      {promo.link && (
                        <a
                          href={promo.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-xs text-blue-600 hover:underline truncate max-w-[200px]"
                        >
                          {promo.link}
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {promo.counties.length === 0 ? (
                      <Badge variant="outline">Toate</Badge>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {promo.counties.slice(0, 3).map((pc) => (
                          <Badge key={pc.id} variant="secondary" className="text-xs">
                            {pc.county.name}
                          </Badge>
                        ))}
                        {promo.counties.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{promo.counties.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(promo.startDate).toLocaleDateString('ro-RO')}
                    {' - '}
                    {new Date(promo.endDate).toLocaleDateString('ro-RO')}
                  </TableCell>
                  <TableCell>{promo.impressions}</TableCell>
                  <TableCell>{promo.clicks}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant={promo.active ? 'default' : 'secondary'}>
                        {promo.active ? 'Activ' : 'Inactiv'}
                      </Badge>
                      <div className="flex gap-1">
                        {promo.showOnCalendar && (
                          <Badge variant="outline" className="text-xs">Calendar</Badge>
                        )}
                        {promo.showAsBanner && (
                          <Badge variant="outline" className="text-xs">Banner</Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/promos/${promo.id}`}>Editează</Link>
                      </Button>
                      <TogglePromoActive id={promo.id} active={promo.active} />
                      <DeletePromoButton id={promo.id} />
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

