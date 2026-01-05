'use client'

import { useState } from 'react'
import { toggleCountyActive } from '@/app/actions/counties'
import { Badge } from '@/components/ui/badge'
import { County } from '@prisma/client'

interface ToggleCountyActiveProps {
  county: County
}

export function ToggleCountyActive({ county }: ToggleCountyActiveProps) {
  const [active, setActive] = useState(county.active)
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    try {
      const updated = await toggleCountyActive(county.id)
      setActive(updated.active)
    } catch (error) {
      console.error('Error toggling county:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="cursor-pointer disabled:opacity-50"
    >
      {active ? (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
          Activ
        </Badge>
      ) : (
        <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-200">
          Inactiv
        </Badge>
      )}
    </button>
  )
}





