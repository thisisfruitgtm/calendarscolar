import { db } from '@/lib/db'
import { EventForm } from '@/components/admin/EventForm'

export default async function NewEventPage({
  searchParams,
}: {
  searchParams: Promise<{ isAd?: string }>
}) {
  const params = await searchParams
  const isAd = params.isAd === 'true'

  const counties = await db.county.findMany({
    where: { active: true },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          {isAd ? 'Adaugă Reclamă' : 'Adaugă Eveniment'}
        </h1>
        <p className="mt-2 text-slate-600">
          {isAd
            ? 'Creează un nou eveniment promoțional'
            : 'Creează un nou eveniment în calendar'}
        </p>
      </div>

      <div className="rounded-md border bg-white p-6">
        <EventForm defaultIsAd={isAd} counties={counties} />
      </div>
    </div>
  )
}
