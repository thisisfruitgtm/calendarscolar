'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'

interface LocalUploadButtonProps {
  onUploadComplete: (url: string) => void
  onUploadError?: (error: string) => void
  accept?: string
  className?: string
}

export function LocalUploadButton({
  onUploadComplete,
  onUploadError,
  accept = 'image/*',
  className = '',
}: LocalUploadButtonProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-local', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await response.json()
      onUploadComplete(data.url)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      console.error('Upload error:', errorMessage)
      if (onUploadError) {
        onUploadError(errorMessage)
      } else {
        alert(`Eroare la upload: ${errorMessage}`)
      }
    } finally {
      setUploading(false)
      // Reset input pentru a permite același fișier să fie încărcat din nou
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        <Upload className="h-4 w-4 mr-2" />
        {uploading ? 'Se încarcă...' : 'Încarcă imagine'}
      </Button>
    </div>
  )
}

