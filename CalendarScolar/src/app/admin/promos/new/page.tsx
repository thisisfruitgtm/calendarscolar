import { db } from '@/lib/db'
import { PromoForm } from '@/components/admin/PromoForm'

export default async function NewPromoPage() {
  const counties = await db.county.findMany({
    where: { active: true },
    select: { id: true, name: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Adaugă Promoție</h1>
        <p className="mt-2 text-slate-600">Creează o nouă promoție sau reclamă</p>
      </div>

      <div className="rounded-md border bg-white p-6">
        <PromoForm counties={counties} />
      </div>
    </div>
  )
}

