import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { CountyForm } from '@/components/admin/CountyForm'

export default async function EditCountyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const county = await db.county.findUnique({
    where: { id },
    include: {
      group: true,
    },
  })

  if (!county) {
    notFound()
  }

  const groups = await db.vacationGroup.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Editează Județ: {county.name}
        </h1>
        <p className="mt-2 text-slate-600">
          Modifică detaliile județului și asociază-l cu o grupă de vacanță
        </p>
      </div>

      <div className="rounded-md border bg-white p-6">
        <CountyForm county={county} groups={groups} />
      </div>
    </div>
  )
}





