'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { VacationGroup, VacationPeriod, VacationType } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { updateVacationGroup, createVacationPeriod, updateVacationPeriod } from '@/app/actions/counties'
import { Plus, Trash2 } from 'lucide-react'

const groupSchema = z.object({
  name: z.string().min(1, 'Numele este obligatoriu'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Culoarea trebuie să fie în format hex (#RRGGBB)'),
})

const periodSchema = z.object({
  name: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  type: z.nativeEnum(VacationType),
  schoolYear: z.string(),
})

type GroupFormData = z.infer<typeof groupSchema>
type PeriodFormData = z.infer<typeof periodSchema>

interface VacationGroupFormProps {
  group: VacationGroup & {
    periods: VacationPeriod[]
  }
}

export function VacationGroupForm({ group }: VacationGroupFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [periods, setPeriods] = useState<PeriodFormData[]>(
    group.periods.map((p) => ({
      name: p.name,
      startDate: new Date(p.startDate).toISOString().slice(0, 16),
      endDate: new Date(p.endDate).toISOString().slice(0, 16),
      type: p.type,
      schoolYear: p.schoolYear,
    }))
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GroupFormData>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: group.name,
      color: group.color,
    },
  })

  const onGroupSubmit = async (data: GroupFormData) => {
    setLoading(true)
    try {
      await updateVacationGroup(group.id, data)
      router.refresh()
    } catch (error) {
      console.error('Error updating group:', error)
    } finally {
      setLoading(false)
    }
  }

  const addPeriod = () => {
    setPeriods([
      ...periods,
      {
        name: 'Vacanța intersemestrială',
        startDate: '',
        endDate: '',
        type: VacationType.INTERSEMESTER,
        schoolYear: '2025-2026',
      },
    ])
  }

  const removePeriod = (index: number) => {
    setPeriods(periods.filter((_, i) => i !== index))
  }

  const updatePeriod = (index: number, field: keyof PeriodFormData, value: string) => {
    const updated = [...periods]
    updated[index] = { ...updated[index], [field]: value }
    setPeriods(updated)
  }

  const savePeriod = async (index: number, period: PeriodFormData) => {
    setLoading(true)
    try {
      const existingPeriod = group.periods[index]
      if (existingPeriod) {
        await updateVacationPeriod(existingPeriod.id, period)
      } else {
        await createVacationPeriod(group.id, period)
      }
      router.refresh()
    } catch (error) {
      console.error('Error saving period:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Group Info */}
      <form onSubmit={handleSubmit(onGroupSubmit)} className="space-y-4">
        <h2 className="text-xl font-semibold">Informații Grupă</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nume Grupă *</Label>
            <Input id="name" {...register('name')} />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Culoare *</Label>
            <div className="flex gap-2">
              <Input
                id="color"
                type="color"
                {...register('color')}
                className="h-10 w-20"
              />
              <Input
                {...register('color')}
                placeholder="#1E40AF"
                className="flex-1"
              />
            </div>
            {errors.color && (
              <p className="text-sm text-red-600">{errors.color.message}</p>
            )}
          </div>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Se salvează...' : 'Salvează Grupa'}
        </Button>
      </form>

      {/* Periods */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Perioade de Vacanță</h2>
          <Button type="button" variant="outline" onClick={addPeriod}>
            <Plus className="h-4 w-4 mr-2" />
            Adaugă Perioadă
          </Button>
        </div>

        <div className="space-y-4">
          {periods.map((period, index) => (
            <div
              key={index}
              className="rounded-lg border border-slate-200 p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-medium">Perioada {index + 1}</h3>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removePeriod(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nume</Label>
                  <Input
                    value={period.name}
                    onChange={(e) => updatePeriod(index, 'name', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tip</Label>
                  <Select
                    value={period.type}
                    onValueChange={(value) =>
                      updatePeriod(index, 'type', value as VacationType)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={VacationType.INTERSEMESTER}>
                        Intersemestrială
                      </SelectItem>
                      <SelectItem value={VacationType.WINTER}>Iarnă</SelectItem>
                      <SelectItem value={VacationType.SPRING}>Primăvară</SelectItem>
                      <SelectItem value={VacationType.SUMMER}>Vară</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Dată Start</Label>
                  <Input
                    type="datetime-local"
                    value={period.startDate}
                    onChange={(e) => updatePeriod(index, 'startDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Dată Sfârșit</Label>
                  <Input
                    type="datetime-local"
                    value={period.endDate}
                    onChange={(e) => updatePeriod(index, 'endDate', e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => savePeriod(index, period)}
                disabled={loading}
              >
                Salvează Perioada
              </Button>
            </div>
          ))}

          {periods.length === 0 && (
            <p className="text-sm text-slate-400">
              Nu există perioade configurate. Adaugă una pentru a începe.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}





