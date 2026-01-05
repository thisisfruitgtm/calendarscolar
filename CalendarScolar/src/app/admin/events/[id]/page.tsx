import { db } from '@/lib/db'
import { EventForm } from '@/components/admin/EventForm'
import { notFound } from 'next/navigation'

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const event = await db.event.findUnique({
    where: { id },
  })

  if (!event) {
    notFound()
  }

  const counties = await db.county.findMany({
    where: { active: true },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Editează Eveniment</h1>
        <p className="mt-2 text-slate-600">Modifică detaliile evenimentului</p>
      </div>

      <div className="rounded-md border bg-white p-6">
        <EventForm event={event} counties={counties} />
      </div>
    </div>
  )
}
