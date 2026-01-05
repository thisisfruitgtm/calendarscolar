'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { County, VacationGroup } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { updateCounty } from '@/app/actions/counties'

const countySchema = z.object({
  name: z.string().min(1, 'Numele este obligatoriu').max(100, 'Numele este prea lung'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug invalid - doar litere mici, cifre și cratime').min(1).max(100),
  capitalCity: z.string().min(1, 'Reședința este obligatorie').max(100, 'Reședința este prea lungă'),
  population: z.string().optional(),
  groupId: z.string().optional(),
  metaTitle: z.string().max(200, 'Meta title prea lung').optional(),
  metaDescription: z.string().max(500, 'Meta description prea lungă').optional(),
  active: z.boolean(),
})

type CountyFormData = {
  name: string
  slug: string
  capitalCity: string
  population?: string
  groupId?: string
  metaTitle?: string
  metaDescription?: string
  active: boolean
}

interface CountyFormProps {
  county: County & { group: VacationGroup | null }
  groups: VacationGroup[]
}

export function CountyForm({ county, groups }: CountyFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CountyFormData>({
    resolver: zodResolver(countySchema),
    defaultValues: {
      name: county.name,
      slug: county.slug,
      capitalCity: county.capitalCity,
      population: county.population ? String(county.population) : '',
      groupId: county.groupId || '',
      metaTitle: county.metaTitle || '',
      metaDescription: county.metaDescription || '',
      active: county.active,
    },
  })

  const onFormSubmit = async (data: CountyFormData) => {
    setLoading(true)
    try {
      await updateCounty(county.id, {
        ...data,
        population: data.population === '' ? undefined : data.population,
        groupId: data.groupId === '' ? undefined : data.groupId,
      })
      router.push('/admin/counties')
      router.refresh()
    } catch (error) {
      console.error('Error updating county:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nume Județ *</Label>
          <Input id="name" {...register('name')} />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug *</Label>
          <Input id="slug" {...register('slug')} placeholder="timis" />
          {errors.slug && (
            <p className="text-sm text-red-600">{errors.slug.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="capitalCity">Reședință *</Label>
          <Input id="capitalCity" {...register('capitalCity')} />
          {errors.capitalCity && (
            <p className="text-sm text-red-600">{errors.capitalCity.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="population">Populație</Label>
          <Input
            id="population"
            type="number"
            {...register('population')}
            placeholder="683540"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="groupId">Grupă Vacanță</Label>
        <Select
          value={watch('groupId') || ''}
          onValueChange={(value) => setValue('groupId', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selectează o grupă" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Fără grupă</SelectItem>
            {groups.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
        <Input
          id="metaTitle"
          {...register('metaTitle')}
          placeholder="Calendar Școlar Timiș 2025-2026"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
        <Textarea
          id="metaDescription"
          {...register('metaDescription')}
          rows={3}
          placeholder="Calendar școlar complet pentru județul Timiș..."
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="active"
          checked={watch('active')}
          onCheckedChange={(checked) => setValue('active', checked === true)}
        />
        <Label htmlFor="active" className="cursor-pointer">
          Activ (vizibil pe site)
        </Label>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Se salvează...' : 'Salvează'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Anulează
        </Button>
      </div>
    </form>
  )
}

