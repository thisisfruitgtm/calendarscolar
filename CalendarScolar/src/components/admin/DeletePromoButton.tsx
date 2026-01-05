'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { deletePromo } from '@/app/actions/promos'

interface DeletePromoButtonProps {
  id: string
}

export function DeletePromoButton({ id }: DeletePromoButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Sigur vrei să ștergi această promoție?')) return
    
    setLoading(true)
    try {
      await deletePromo(id)
    } catch (error) {
      console.error('Error deleting promo:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? '...' : 'Șterge'}
    </Button>
  )
}



