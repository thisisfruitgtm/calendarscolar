import { Font } from '@react-pdf/renderer'
import { join } from 'path'

const fontsDir = join(process.cwd(), 'src/app/api/og/fonts')

Font.register({
  family: 'Inter',
  fonts: [
    { src: join(fontsDir, 'Inter-Regular.ttf'), fontWeight: 400 },
    { src: join(fontsDir, 'Inter-SemiBold.ttf'), fontWeight: 600 },
    { src: join(fontsDir, 'Inter-Black.ttf'), fontWeight: 900 },
  ],
})
