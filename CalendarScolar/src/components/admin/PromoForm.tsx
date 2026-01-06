'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { createPromo, updatePromo } from '@/app/actions/promos'
import { LocalUploadButton } from '@/components/ui/local-upload-button'

const promoSchema = z.object({
  title: z.string().min(1, 'Titlul este obligatoriu'),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  link: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  showOnCalendar: z.boolean(),
  showAsBanner: z.boolean(),
  backgroundColor: z.string().optional(),
  backgroundImageDesktop: z.string().optional(),
  backgroundImageMobile: z.string().optional(),
  priority: z.number().int().min(0).max(100),
  countyIds: z.array(z.string()).optional(),
  active: z.boolean(),
})

type PromoFormData = z.infer<typeof promoSchema>

interface PromoFormProps {
  promo?: {
    id: string
    title: string
    description?: string | null
    imageUrl?: string | null
    link?: string | null
    startDate: Date
    endDate: Date
    showOnCalendar: boolean
    showAsBanner: boolean
    backgroundColor?: string | null
    backgroundImageDesktop?: string | null
    backgroundImageMobile?: string | null
    priority: number
    counties?: Array<{ county: { id: string; name: string } }>
    active: boolean
    impressions: number
    clicks: number
  }
  counties?: Array<{ id: string; name: string }>
}

export function PromoForm({ promo, counties = [] }: PromoFormProps) {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState(promo?.imageUrl || '')
  const [backgroundImageDesktop, setBackgroundImageDesktop] = useState(promo?.backgroundImageDesktop || '')
  const [backgroundImageMobile, setBackgroundImageMobile] = useState(promo?.backgroundImageMobile || '')
  const [loading, setLoading] = useState(false)
  const [selectedCountyIds, setSelectedCountyIds] = useState<string[]>(
    promo?.counties?.map(c => c.county.id) || []
  )

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PromoFormData>({
    resolver: zodResolver(promoSchema),
    defaultValues: {
      title: promo?.title || '',
      description: promo?.description || '',
      imageUrl: promo?.imageUrl || '',
      link: promo?.link || '',
      startDate: promo?.startDate
        ? new Date(promo.startDate).toISOString().slice(0, 16)
        : '',
      endDate: promo?.endDate
        ? new Date(promo.endDate).toISOString().slice(0, 16)
        : '',
      showOnCalendar: promo?.showOnCalendar ?? true,
      showAsBanner: promo?.showAsBanner ?? false,
      backgroundColor: promo?.backgroundColor || '',
      backgroundImageDesktop: promo?.backgroundImageDesktop || '',
      backgroundImageMobile: promo?.backgroundImageMobile || '',
      priority: promo?.priority ?? 0,
      countyIds: promo?.counties?.map(c => c.county.id) || [],
      active: promo?.active ?? true,
    },
  })

  const onFormSubmit = async (data: PromoFormData) => {
    setLoading(true)
    try {
      const submitData = { 
        ...data, 
        imageUrl, 
        backgroundImageDesktop,
        backgroundImageMobile,
        countyIds: selectedCountyIds 
      }
      if (promo) {
        await updatePromo(promo.id, submitData)
      } else {
        await createPromo(submitData)
      }
      router.push('/admin/promos')
      router.refresh()
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {promo && (
        <div className="bg-slate-100 rounded-lg p-4 mb-6">
          <h3 className="font-medium mb-2">Statistici</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Afișări:</span>{' '}
              <span className="font-medium">{promo.impressions}</span>
            </div>
            <div>
              <span className="text-slate-500">Click-uri:</span>{' '}
              <span className="font-medium">{promo.clicks}</span>
            </div>
            <div>
              <span className="text-slate-500">CTR:</span>{' '}
              <span className="font-medium">
                {promo.impressions > 0 
                  ? ((promo.clicks / promo.impressions) * 100).toFixed(2) + '%'
                  : '0%'}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Titlu *</Label>
        <Input id="title" {...register('title')} />
        {errors.title && (
          <p className="text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descriere</Label>
        <Textarea id="description" {...register('description')} rows={4} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Dată Start *</Label>
          <Input
            id="startDate"
            type="datetime-local"
            {...register('startDate')}
          />
          {errors.startDate && (
            <p className="text-sm text-red-600">{errors.startDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">Dată Sfârșit *</Label>
          <Input id="endDate" type="datetime-local" {...register('endDate')} />
          {errors.endDate && (
            <p className="text-sm text-red-600">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="link">Link (redirect când click pe promo)</Label>
        <Input id="link" {...register('link')} placeholder="https://..." />
      </div>

      <div className="space-y-2">
        <Label>Imagine (opțional - pentru calendar)</Label>
        {imageUrl && (
          <div className="mb-2">
            <img src={imageUrl} alt="Preview" className="h-32 w-auto rounded border" />
          </div>
        )}
        <div className="flex gap-2">
          <Input
            placeholder="/promos/image.jpg"
            value={imageUrl}
            onChange={(e) => {
              setImageUrl(e.target.value)
              setValue('imageUrl', e.target.value)
            }}
            className="flex-1"
          />
          <LocalUploadButton
            onUploadComplete={(url) => {
              setImageUrl(url)
              setValue('imageUrl', url)
            }}
          />
        </div>
      </div>

      <div className="space-y-4 border-t pt-6">
        <div className="space-y-2">
          <Label>Imagine Background Desktop</Label>
          {backgroundImageDesktop && (
            <div className="mb-2">
              <img src={backgroundImageDesktop} alt="Desktop Preview" className="h-32 w-auto rounded border" />
            </div>
          )}
          <div className="flex gap-2">
            <Input
              placeholder="/promos/banner-desktop.jpg"
              value={backgroundImageDesktop}
              onChange={(e) => {
                setBackgroundImageDesktop(e.target.value)
                setValue('backgroundImageDesktop', e.target.value)
              }}
              className="flex-1"
            />
            <LocalUploadButton
              onUploadComplete={(url) => {
                setBackgroundImageDesktop(url)
                setValue('backgroundImageDesktop', url)
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Imagine Background Mobile</Label>
          {backgroundImageMobile && (
            <div className="mb-2">
              <img src={backgroundImageMobile} alt="Mobile Preview" className="h-32 w-auto rounded border" />
            </div>
          )}
          <div className="flex gap-2">
            <Input
              placeholder="/promos/banner-mobile.jpg"
              value={backgroundImageMobile}
              onChange={(e) => {
                setBackgroundImageMobile(e.target.value)
                setValue('backgroundImageMobile', e.target.value)
              }}
              className="flex-1"
            />
            <LocalUploadButton
              onUploadComplete={(url) => {
                setBackgroundImageMobile(url)
                setValue('backgroundImageMobile', url)
              }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="backgroundColor">Culoare Fundal</Label>
        <div className="flex gap-2">
          <Input 
            id="backgroundColor" 
            {...register('backgroundColor')} 
            placeholder="#3B82F6" 
            className="flex-1"
          />
          <Input 
            type="color"
            value={watch('backgroundColor') || '#3B82F6'}
            onChange={(e) => setValue('backgroundColor', e.target.value)}
            className="h-10 w-20 cursor-pointer"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="showOnCalendar"
            checked={watch('showOnCalendar')}
            onCheckedChange={(checked) => setValue('showOnCalendar', checked === true)}
          />
          <Label htmlFor="showOnCalendar" className="cursor-pointer">
            Afișează în calendar
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="showAsBanner"
            checked={watch('showAsBanner')}
            onCheckedChange={(checked) => setValue('showAsBanner', checked === true)}
          />
          <Label htmlFor="showAsBanner" className="cursor-pointer">
            Afișează ca banner pe pagină
          </Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Județe (opțional)</Label>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="all-counties"
              checked={selectedCountyIds.length === 0}
              onCheckedChange={(checked) => {
                if (checked) {
                  setSelectedCountyIds([])
                  setValue('countyIds', [])
                }
              }}
            />
            <Label htmlFor="all-counties" className="cursor-pointer font-medium">
              Toate județele
            </Label>
          </div>
          <div className="max-h-60 overflow-y-auto border rounded-md p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {counties.map((county) => (
                <div key={county.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`county-${county.id}`}
                    checked={selectedCountyIds.includes(county.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        const newIds = [...selectedCountyIds, county.id]
                        setSelectedCountyIds(newIds)
                        setValue('countyIds', newIds)
                      } else {
                        const newIds = selectedCountyIds.filter(id => id !== county.id)
                        setSelectedCountyIds(newIds)
                        setValue('countyIds', newIds)
                      }
                    }}
                  />
                  <Label htmlFor={`county-${county.id}`} className="cursor-pointer text-sm">
                    {county.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-500">
          Selectează județele specifice sau lasă &quot;Toate județele&quot; pentru a afișa peste tot
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Prioritate (0-100)</Label>
        <Input 
          id="priority" 
          type="number" 
          min={0} 
          max={100}
          {...register('priority', { valueAsNumber: true })} 
        />
        <p className="text-sm text-slate-500">
          Promo-urile cu prioritate mai mare apar primele
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="active"
          checked={watch('active')}
          onCheckedChange={(checked) => setValue('active', checked === true)}
        />
        <Label htmlFor="active" className="cursor-pointer">
          Activ
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

