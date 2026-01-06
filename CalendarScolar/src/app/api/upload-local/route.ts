import { auth } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Verifică autentificarea
    const session = await auth()
    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'EDITOR')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validează tipul de fișier
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Validează dimensiunea (max 4MB)
    if (file.size > 4 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 4MB' }, { status: 400 })
    }

    // Creează folderul dacă nu există
    const uploadDir = join(process.cwd(), 'public', 'promos')
    await mkdir(uploadDir, { recursive: true })

    // Generează nume unic pentru fișier
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${timestamp}-${originalName}`
    const filePath = join(uploadDir, fileName)

    // Salvează fișierul
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Returnează calea publică
    const publicPath = `/promos/${fileName}`

    return NextResponse.json({ url: publicPath })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

