import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import { getCachedCountyBySlug } from '@/lib/cache'

export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    
    const county = await getCachedCountyBySlug(slug)

    if (!county) {
      return new Response('County not found', { status: 404 })
    }

    const groupColor = county.group?.color || '#3B82F6'
    const nextVacation = county.group?.periods[0]

    function formatDate(date: Date): string {
      return new Intl.DateTimeFormat('ro-RO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(date))
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${groupColor}15 0%, ${groupColor}30 100%)`,
            position: 'relative',
            fontFamily: 'system-ui, -apple-system',
          }}
        >
          {/* Decorative circles */}
          <div
            style={{
              position: 'absolute',
              top: -160,
              right: -160,
              width: 320,
              height: 320,
              borderRadius: '50%',
              backgroundColor: groupColor,
              opacity: 0.2,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -80,
              left: -80,
              width: 240,
              height: 240,
              borderRadius: '50%',
              backgroundColor: groupColor,
              opacity: 0.1,
            }}
          />

          {/* Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px',
              maxWidth: '1200px',
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Title */}
            <div
              style={{
                fontSize: 64,
                fontWeight: 'bold',
                color: '#0f172a',
                marginBottom: 16,
                lineHeight: 1.2,
              }}
            >
              Calendar Școlar
            </div>
            <div
              style={{
                fontSize: 64,
                fontWeight: 'bold',
                color: groupColor,
                marginBottom: 24,
                lineHeight: 1.2,
              }}
            >
              {county.name}
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: 28,
                color: '#475569',
                marginBottom: 40,
                maxWidth: '900px',
                lineHeight: 1.5,
              }}
            >
              Toate vacanțele și zilele libere pentru anul școlar 2025-2026 în județul {county.name}
            </div>

            {/* Vacation card */}
            {nextVacation && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  padding: '20px 32px',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: 16,
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
              >
                <div
                  style={{
                    fontSize: 20,
                    color: '#64748b',
                  }}
                >
                  Vacanța intersemestrială
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: '600',
                    color: '#0f172a',
                  }}
                >
                  {formatDate(nextVacation.startDate)} - {formatDate(nextVacation.endDate)}
                </div>
              </div>
            )}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: unknown) {
    const error = e instanceof Error ? e.message : 'Unknown error'
    console.error('Error generating OG image:', error)
    return new Response(`Failed to generate image: ${error}`, {
      status: 500,
    })
  }
}

