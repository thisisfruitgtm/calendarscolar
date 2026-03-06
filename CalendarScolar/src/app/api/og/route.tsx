import { ImageResponse } from '@vercel/og'

export const runtime = 'nodejs'

export async function GET() {
  try {
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
            background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 50%, #BFDBFE 100%)',
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
              backgroundColor: '#3B82F6',
              opacity: 0.15,
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
              backgroundColor: '#3B82F6',
              opacity: 0.1,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: 100,
              left: -60,
              width: 180,
              height: 180,
              borderRadius: '50%',
              backgroundColor: '#60A5FA',
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
              padding: '60px 80px',
              maxWidth: '1200px',
              textAlign: 'center',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {/* Title */}
            <div
              style={{
                fontSize: 72,
                fontWeight: 'bold',
                color: '#0f172a',
                marginBottom: 8,
                lineHeight: 1.2,
              }}
            >
              Calendar Școlar
            </div>
            <div
              style={{
                fontSize: 72,
                fontWeight: 'bold',
                color: '#2563EB',
                marginBottom: 32,
                lineHeight: 1.2,
              }}
            >
              2026-2027
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
              Vacanțe, zile libere și structura anului școlar pentru toate cele 42 de județe
            </div>

            {/* Feature pills */}
            <div
              style={{
                display: 'flex',
                gap: 16,
              }}
            >
              {['Sincronizare calendar', 'Actualizări automate', '42 județe'].map(
                (text) => (
                  <div
                    key={text}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      borderRadius: 12,
                      fontSize: 20,
                      color: '#1e40af',
                      fontWeight: '600',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
                    }}
                  >
                    {text}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: 24,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 20,
              color: '#64748b',
            }}
          >
            CalendarȘcolar.ro
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: unknown) {
    console.error('Error generating OG image:', e instanceof Error ? e.message : e)
    return new Response('Failed to generate image', { status: 500 })
  }
}
