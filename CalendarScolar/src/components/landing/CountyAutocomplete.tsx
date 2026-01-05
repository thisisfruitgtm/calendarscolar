'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { MapPin, Search } from 'lucide-react'

interface County {
  id: string
  name: string
  slug: string
  capitalCity: string
}

interface CountyAutocompleteProps {
  counties: County[]
  onSelect?: (county: County) => void
  placeholder?: string
}

/**
 * Normalizează un string eliminând diacriticele pentru căutare fără diacritice
 * Ex: "Iași" → "iasi", "Timiș" → "timis"
 */
function normalizeForSearch(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimină diacriticele
}

export function CountyAutocomplete({ 
  counties, 
  onSelect,
  placeholder = "Caută județul tău (ex: Cluj, București, Timiș...)"
}: CountyAutocompleteProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const normalizedQuery = normalizeForSearch(query)
  
  const filteredCounties = counties.filter(
    (county) =>
      normalizeForSearch(county.name).includes(normalizedQuery) ||
      normalizeForSearch(county.capitalCity).includes(normalizedQuery)
  ).slice(0, 8)

  // Calculăm dacă dropdown-ul ar trebui să fie deschis
  const showDropdown = isOpen && query.length > 0 && filteredCounties.length > 0

  // Închide dropdown-ul când se dă click în exterior
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = (county: County) => {
    if (onSelect) {
      onSelect(county)
    }
    setQuery(county.name)
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < filteredCounties.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && filteredCounties[selectedIndex]) {
          handleSelect(filteredCounties[selectedIndex])
        } else if (filteredCounties.length === 1) {
          handleSelect(filteredCounties[0])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const items = listRef.current.children
      if (items[selectedIndex]) {
        items[selectedIndex].scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  // Popular counties for quick access
  const popularCounties = counties
    .filter(c => ['București', 'Cluj', 'Timiș', 'Constanța', 'Iași', 'Dolj'].includes(c.name))
    .slice(0, 6)

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelectedIndex(-1)
            setIsOpen(true)
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsOpen(true)
          }}
          className="h-14 bg-white pl-12 pr-4 text-base font-medium shadow-lg border-2 border-slate-200 focus:border-blue-500"
        />
      </div>

      {/* Hint text */}
      {query.length === 0 && (
        <div className="mt-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-slate-500">Județe populare:</span>
            {popularCounties.map((county) => (
              <button
                key={county.id}
                type="button"
                onClick={() => handleSelect(county)}
                className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100 hover:text-blue-800"
              >
                {county.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {showDropdown && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border-2 border-blue-200 bg-white shadow-xl">
          <div className="relative max-h-96">
            <div
              ref={listRef}
              className="overflow-y-auto"
            >
              {filteredCounties.map((county, index) => (
                <button
                  key={county.id}
                  type="button"
                  onClick={() => handleSelect(county)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                    index === selectedIndex
                      ? 'bg-blue-50 text-blue-900'
                      : 'hover:bg-slate-50 text-slate-900'
                  }`}
                >
                  <MapPin className="h-5 w-5 shrink-0 text-slate-400" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{county.name}</div>
                    <div className="text-sm text-slate-500">{county.capitalCity}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {query.length > 0 && filteredCounties.length === 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border-2 border-slate-200 bg-white p-4 text-center text-slate-500 shadow-xl">
          Nu s-a găsit niciun județ
        </div>
      )}
    </div>
  )
}
