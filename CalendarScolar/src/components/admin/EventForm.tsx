'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { EventType } from '@prisma/client'
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
import { UploadButton } from '@/lib/uploadthing'
import { createEvent, updateEvent } from '@/app/actions/events'

const eventSchema = z.object({
  title: z.string().min(1, 'Titlul este obligatoriu'),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  type: z.nativeEnum(EventType),
  imageUrl: z.string().optional(),
  backgroundColor: z.string().optional(),
  countyId: z.string().optional(),
  active: z.boolean(),
})

type EventFormData = z.infer<typeof eventSchema>

interface EventFormProps {
  event?: {
    id: string
    title: string
    description?: string | null
    startDate: Date
    endDate?: Date | null
    type: EventType
    imageUrl?: string | null
    backgroundColor?: string | null
    countyId?: string | null
    active: boolean
  }
  counties?: Array<{ id: string; name: string }>
}

export function EventForm({ event, counties = [] }: EventFormProps) {
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState(event?.imageUrl || '')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title || '',
      description: event?.description || '',
      startDate: event?.startDate
        ? new Date(event.startDate).toISOString().slice(0, 16)
        : '',
      endDate: event?.endDate
        ? new Date(event.endDate).toISOString().slice(0, 16)
        : '',
      type: event?.type || EventType.HOLIDAY,
      imageUrl: event?.imageUrl || '',
      backgroundColor: event?.backgroundColor || '',
      countyId: event?.countyId || '',
      active: event?.active ?? true,
    },
  })

  const onFormSubmit = async (data: EventFormData) => {
    setLoading(true)
    try {
      if (event) {
        await updateEvent(event.id, { ...data, imageUrl })
      } else {
        await createEvent({ ...data, imageUrl })
      }
      router.push('/admin/events')
      router.refresh()
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
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
          <Label htmlFor="endDate">Dată Sfârșit</Label>
          <Input id="endDate" type="datetime-local" {...register('endDate')} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Tip Eveniment *</Label>
        <Select
          value={watch('type')}
          onValueChange={(value) => setValue('type', value as EventType)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={EventType.VACATION}>Vacanță</SelectItem>
            <SelectItem value={EventType.HOLIDAY}>Sărbătoare Legală</SelectItem>
            <SelectItem value={EventType.LAST_DAY}>Ultima Zi Cursuri</SelectItem>
            <SelectItem value={EventType.SEMESTER_START}>Început Semestru</SelectItem>
            <SelectItem value={EventType.SEMESTER_END}>Sfârșit Semestru</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="countyId">Județ (opțional)</Label>
        <Select
          value={watch('countyId') || ''}
          onValueChange={(value) => setValue('countyId', value || undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Toate județele" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Toate județele</SelectItem>
            {counties.map((county) => (
              <SelectItem key={county.id} value={county.id}>
                {county.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-slate-500">
          Lasă gol pentru evenimente naționale
        </p>
      </div>

      <div className="space-y-2">
        <Label>Imagine</Label>
        {imageUrl && (
          <div className="mb-2">
            <img src={imageUrl} alt="Preview" className="h-32 w-auto rounded" />
          </div>
        )}
        <UploadButton
          endpoint="imageUploader"
          onClientUploadComplete={(res) => {
            if (res && res[0]) {
              setImageUrl(res[0].url)
              setValue('imageUrl', res[0].url)
            }
          }}
          onUploadError={(error) => {
            console.error('Upload error:', error)
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="backgroundColor">Culoare Fundal (opțional)</Label>
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
