'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { MapPin, Search } from 'lucide-react'
import { db } from '@/lib/db'
import { County } from '@prisma/client'

interface CountyAutocompleteProps {
  counties: Array<{
    id: string
    name: string
    slug: string
    capitalCity: string
  }>
}

export function CountyAutocomplete({ counties }: CountyAutocompleteProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const filteredCounties = counties.filter(
    (county) =>
      county.name.toLowerCase().includes(query.toLowerCase()) ||
      county.capitalCity.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8)

  useEffect(() => {
    setIsOpen(query.length > 0 && filteredCounties.length > 0)
  }, [query, filteredCounties.length])

  const handleSelect = (slug: string) => {
    router.push(`/judet/${slug}`)
    setQuery('')
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
          handleSelect(filteredCounties[selectedIndex].slug)
        } else if (filteredCounties.length === 1) {
          handleSelect(filteredCounties[0].slug)
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
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Caută județul tău (ex: Cluj, București, Timiș...)"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelectedIndex(-1)
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query.length > 0 && filteredCounties.length > 0) {
              setIsOpen(true)
            }
          }}
          className="h-14 bg-white pl-12 pr-4 text-base font-medium shadow-lg"
        />
      </div>

      {/* Hint text */}
      {query.length === 0 && (
        <div className="mt-3 text-center">
          <p className="text-sm text-slate-500">
            Începe să scrii numele județului sau al orașului de reședință
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-slate-400">Sau încearcă:</span>
            {popularCounties.map((county) => (
              <button
                key={county.id}
                type="button"
                onClick={() => handleSelect(county.slug)}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-200 hover:text-blue-600"
              >
                {county.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && filteredCounties.length > 0 && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="relative max-h-96">
            <div
              ref={listRef}
              className="overflow-y-auto"
              style={{
                maskImage: 'linear-gradient(to bottom, black calc(100% - 3rem), transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black calc(100% - 3rem), transparent 100%)',
              }}
            >
              {filteredCounties.map((county, index) => (
                <button
                  key={county.id}
                  type="button"
                  onClick={() => handleSelect(county.slug)}
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
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-slate-200 bg-white p-4 text-center text-slate-500 shadow-xl">
          Nu s-a găsit niciun județ
        </div>
      )}
    </div>
  )
}

