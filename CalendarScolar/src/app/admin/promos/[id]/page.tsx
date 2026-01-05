import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { PromoForm } from '@/components/admin/PromoForm'

export default async function EditPromoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const promo = await db.promo.findUnique({
    where: { id },
    include: {
      counties: {
        include: {
          county: {
            select: { id: true, name: true },
          },
        },
      },
    },
  })

  if (!promo) {
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
        <h1 className="text-3xl font-bold text-slate-900">Editează Promoție</h1>
        <p className="mt-2 text-slate-600">Modifică detaliile promoției</p>
      </div>

      <div className="rounded-md border bg-white p-6">
        <PromoForm promo={promo} counties={counties} />
      </div>
    </div>
  )
}

