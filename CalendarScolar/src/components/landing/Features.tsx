import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, MapPin, Shield, Zap, Search, FileText } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FadeInUp } from '@/components/ui/fade-in-up'

const features = [
  {
    name: 'Planifică Vacanțele',
    description: 'Află exact când sunt vacanțele pentru județul tău și planifică-ți concediile în avans. Nu mai rata nicio vacanță!',
    icon: Calendar,
    color: 'text-blue-600',
  },
  {
    name: 'Organizează-te Mai Bine',
    description: 'Știi din timp când sunt zilele libere și poți programa activitățile copilului tău fără conflicte cu școala.',
    icon: Zap,
    color: 'text-green-600',
  },
  {
    name: 'Informații Oficiale',
    description: 'Date oficiale aprobate de Ministerul Educației. Ai încredere că informațiile sunt corecte și actualizate.',
    icon: Shield,
    color: 'text-purple-600',
  },
  {
    name: 'Pentru Fiecare Județ',
    description: 'Vacanțele intersemestriale diferă în funcție de județ. Găsește calendarul exact pentru zona ta.',
    icon: MapPin,
    color: 'text-orange-600',
  },
  {
    name: 'Complet și Gratuit',
    description: 'Toate vacanțele, zilele libere și evenimentele importante într-un singur loc. Complet gratuit, fără costuri.',
    icon: FileText,
    color: 'text-yellow-600',
  },
  {
    name: 'Adaugă în Calendar',
    description: 'Importă calendarul direct în Google Calendar, Apple Calendar sau Outlook și primește notificări automate.',
    icon: Search,
    color: 'text-red-600',
  },
]

export function Features() {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <FadeInUp>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              De ce să folosești CalendarȘcolar?
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Imaginează-ți că știi exact când sunt vacanțele pentru județul tău, când sunt zilele libere și 
              când începe sau se termină semestrul. Fără bătăi de cap, fără verificări pe mai multe site-uri. 
              Tot ce ai nevoie, actualizat și verificat, într-un singur loc.
            </p>
          </div>
        </FadeInUp>
        
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {features.map((feature, index) => (
            <FadeInUp key={feature.name} delay={index * 100} duration={500}>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  <CardTitle className="mt-4">{feature.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </FadeInUp>
          ))}
        </div>

        {/* Vacation Groups Info */}
        <FadeInUp delay={300} duration={700}>
          <div className="mx-auto mt-20 max-w-4xl">
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 lg:p-12">
            <h3 className="text-2xl font-bold text-slate-900 text-center mb-6">
              Grupele de Vacanță Intersemestrială
            </h3>
            <p className="text-center text-slate-600 mb-8">
              Vacanța de februarie este organizată în 3 grupe pentru a distribui 
              uniform perioadele de odihnă pe teritoriul țării.
            </p>
            
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-6 w-6 rounded-full bg-blue-800" />
                  <h4 className="font-semibold text-slate-900">Grupa A</h4>
                </div>
                <p className="text-sm text-slate-600 mb-2">9-15 februarie 2026</p>
                <p className="text-xs text-slate-500">5 județe</p>
              </div>
              
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-6 w-6 rounded-full bg-blue-400" />
                  <h4 className="font-semibold text-slate-900">Grupa B</h4>
                </div>
                <p className="text-sm text-slate-600 mb-2">16-22 februarie 2026</p>
                <p className="text-xs text-slate-500">16 județe</p>
              </div>
              
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-6 w-6 rounded-full bg-green-500" />
                  <h4 className="font-semibold text-slate-900">Grupa C</h4>
                </div>
                <p className="text-sm text-slate-600 mb-2">23 feb - 1 mar 2026</p>
                <p className="text-xs text-slate-500">21 județe</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button asChild size="lg" variant="outline" className="bg-white">
                <Link href="/judete">
                  Vezi Distribuția Completă pe Județe
                </Link>
              </Button>
            </div>
          </div>
        </div>
        </FadeInUp>
      </div>
    </section>
  )
}
