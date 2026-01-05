'use client'

import { useState } from 'react'
import { Type, Eye, Zap, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAccessibility } from '@/contexts/AccessibilityContext'
import { AccessibilityIcon } from '@/components/icons/AccessibilityIcon'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function AccessibilityMenu() {
  const [open, setOpen] = useState(false)
  const { settings, updateSettings, resetSettings } = useAccessibility()

  return (
    <>
      <Button
        variant="default"
        size="icon"
        onClick={() => setOpen(true)}
        className="rounded-full bg-blue-600 hover:bg-blue-700 text-white"
        aria-label="Deschide setările de accesibilitate"
        title="Setări Accesibilitate"
      >
        <AccessibilityIcon className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Setări Accesibilitate</DialogTitle>
            <DialogDescription>
              Personalizează experiența pentru a o face mai accesibilă
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Font Size */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4 text-slate-600" />
                <label className="text-sm font-medium">Mărime text</label>
              </div>
              <div className="flex gap-2">
                {(['normal', 'large', 'extra-large'] as const).map((size) => (
                  <Button
                    key={size}
                    variant={settings.fontSize === size ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSettings({ fontSize: size })}
                    className="flex-1"
                  >
                    {size === 'normal' && 'Normal'}
                    {size === 'large' && 'Mare'}
                    {size === 'extra-large' && 'Foarte mare'}
                  </Button>
                ))}
              </div>
            </div>

            {/* High Contrast */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-slate-600" />
                <label className="text-sm font-medium">Contrast înalt</label>
              </div>
              <Button
                variant={settings.highContrast ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateSettings({ highContrast: !settings.highContrast })}
                className="w-full"
              >
                {settings.highContrast ? 'Activat' : 'Dezactivat'}
              </Button>
            </div>

            {/* Reduce Motion */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-slate-600" />
                <label className="text-sm font-medium">Reduce mișcare</label>
              </div>
              <Button
                variant={settings.reduceMotion ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateSettings({ reduceMotion: !settings.reduceMotion })}
                className="w-full"
              >
                {settings.reduceMotion ? 'Activat' : 'Dezactivat'}
              </Button>
              <p className="text-xs text-slate-500">
                Dezactivează animațiile pentru o experiență mai liniștită
              </p>
            </div>

            {/* Reset */}
            <div className="pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={resetSettings}
                className="w-full"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Resetează la setările implicite
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

