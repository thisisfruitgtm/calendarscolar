'use client'

import { Button } from '@/components/ui/button'
import { togglePromoActive } from '@/app/actions/promos'

interface TogglePromoActiveProps {
  id: string
  active: boolean
}

export function TogglePromoActive({ id, active }: TogglePromoActiveProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => togglePromoActive(id)}
    >
      {active ? 'Dezactivează' : 'Activează'}
    </Button>
  )
}

