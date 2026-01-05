import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { VacationGroupForm } from '@/components/admin/VacationGroupForm'

export default async function EditGroupPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const group = await db.vacationGroup.findUnique({
    where: { id },
    include: {
      counties: {
        orderBy: { name: 'asc' },
      },
      periods: {
        where: { schoolYear: '2025-2026' },
        orderBy: { startDate: 'asc' },
      },
    },
  })

  if (!group) {
    notFound()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Editează Grupa: {group.name}
        </h1>
        <p className="mt-2 text-slate-600">
          Modifică detaliile grupei și perioadele de vacanță
        </p>
      </div>

      <div className="space-y-6">
        <div className="rounded-md border bg-white p-6">
          <VacationGroupForm group={group} />
        </div>

        <div className="rounded-md border bg-white p-6">
          <h2 className="mb-4 text-xl font-semibold">Județe în această grupă</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {group.counties.map((county) => (
              <div
                key={county.id}
                className="rounded-lg border border-slate-200 p-3 text-sm"
              >
                {county.name}
              </div>
            ))}
            {group.counties.length === 0 && (
              <p className="text-sm text-slate-400">Nu există județe asociate</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}





