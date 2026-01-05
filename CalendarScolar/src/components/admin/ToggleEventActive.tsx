'use client'

import { useState } from 'react'
import { toggleEventActive } from '@/app/actions/events'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function ToggleEventActive({ id, active }: { id: string; active: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    try {
      await toggleEventActive(id)
      router.refresh()
    } catch (error) {
      console.error('Error toggling event:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      disabled={loading}
    >
      {active ? 'Dezactivează' : 'Activează'}
    </Button>
  )
}







