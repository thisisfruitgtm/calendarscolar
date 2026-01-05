import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, RefreshCw, Shield, Zap, Link as LinkIcon, Smartphone, Globe, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Cum funcționează - CalendarȘcolar.ro',
  description: 'Află cum funcționează sistemul CalendarȘcolar, cum se adaugă calendarul în aplicațiile tale și cum se actualizează automat.',
}

export default function CumFunctioneazaPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-12 lg:py-16 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">
            Cum funcționează CalendarȘcolar
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Un ghid complet despre cum funcționează sistemul nostru de calendar școlar și cum îl poți folosi pentru a-ți organiza anul școlar.
          </p>
        </div>

        {/* Ce este CalendarȘcolar */}
        <section className="mb-20">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-2xl">Ce este CalendarȘcolar?</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600">
              <p>
                CalendarȘcolar este o platformă care oferă calendarul școlar oficial pentru toate cele 42 de județe din România plus București. 
                Toate datele sunt oficiale, aprobate de Ministerul Educației și actualizate automat.
              </p>
              <p>
                Sistemul folosește tehnologia <strong>ICS (iCalendar)</strong>, un standard internațional pentru calendare digitale, 
                care permite sincronizarea automată cu orice aplicație de calendar modernă.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Cum funcționează feed-ul ICS */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-slate-900 mb-10">Cum funcționează feed-ul ICS?</h2>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <LinkIcon className="h-6 w-6 text-green-600" />
                  <CardTitle>Ce este un Feed ICS?</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-slate-600">
                <p>
                  Un feed ICS (iCalendar) este un link special care conține toate evenimentele calendarului într-un format standard. 
                  Când te abonezi la un feed ICS, aplicația ta de calendar verifică periodic acest link și actualizează automat evenimentele.
                </p>
                <p>
                  <strong>Avantaje:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Actualizare automată - nu trebuie să verifici manual</li>
                  <li>Sincronizare în timp real - modificările apar automat în calendarul tău</li>
                  <li>Compatibilitate universală - funcționează cu toate aplicațiile de calendar</li>
                  <li>Fără instalare - doar te abonezi la link</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <RefreshCw className="h-6 w-6 text-purple-600" />
                  <CardTitle>Actualizare Automată</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-slate-600">
                <p>
                  Calendarul tău se actualizează automat fără intervenția ta. Aplicațiile de calendar verifică periodic feed-ul 
                  (de obicei la fiecare 15-30 de minute sau când deschizi aplicația) și descarcă modificările.
                </p>
                <p>
                  Dacă apare o modificare în calendarul școlar (de exemplu, o vacanță este mutată sau adăugată un eveniment nou), 
                  aceasta va apărea automat în calendarul tău la următoarea sincronizare.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Pași pentru adăugare */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-slate-900 mb-10">Cum adaugi calendarul școlar?</h2>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">1</span>
                  Accesează pagina județului
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                <p>
                  Navighează la pagina calendarului pentru județul tău. Poți găsi toate județele pe pagina{' '}
                  <Link href="/judete" className="text-blue-600 hover:underline font-medium">Județe</Link>.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">2</span>
                  Apasă "Adaugă în Calendar"
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                <p>
                  Pe pagina județului, găsește butonul mare "Adaugă în calendar" și apasă pe el. 
                  Se va deschide un dialog cu opțiuni pentru diferite aplicații de calendar.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">3</span>
                  Alege aplicația ta preferată
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600 space-y-3">
                <p>Alege una dintre opțiunile disponibile:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Google Calendar</strong> - Pentru utilizatorii Google (Gmail, Android)</li>
                  <li><strong>Apple Calendar</strong> - Pentru iPhone, iPad și Mac</li>
                  <li><strong>Outlook</strong> - Pentru Microsoft 365 și Outlook</li>
                  <li><strong>Copiază URL Feed</strong> - Pentru alte aplicații de calendar</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold">4</span>
                  Confirmă abonarea
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                <p>
                  Aplicația ta de calendar se va deschide și îți va cere să confirmi abonarea. 
                  Apasă "Adaugă" sau "Subscribe" și calendarul va fi adăugat automat. 
                  Evenimentele vor apărea imediat în calendarul tău!
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Compatibilitate */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-slate-900 mb-10">Compatibilitate</h2>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Smartphone className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Google Calendar</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                <p className="text-sm">
                  Funcționează perfect pe Android, iOS, web și desktop. Sincronizare automată prin contul Google.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Smartphone className="h-8 w-8 text-gray-600 mb-2" />
                <CardTitle>Apple Calendar</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                <p className="text-sm">
                  Compatibil cu iPhone, iPad și Mac. Folosește protocolul webcal:// pentru conectare automată.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-8 w-8 text-blue-500 mb-2" />
                <CardTitle>Outlook / Microsoft 365</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                <p className="text-sm">
                  Funcționează pe Outlook web, desktop și aplicația mobilă. Sincronizare prin contul Microsoft.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Thunderbird</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                <p className="text-sm">
                  Compatibil cu Thunderbird Calendar. Folosește opțiunea "Copiază URL Feed" pentru a adăuga manual.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Alte Aplicații</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                <p className="text-sm">
                  Orice aplicație care suportă standardul ICS/RFC 5545 poate folosi feed-ul nostru.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Grupele de vacanță */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-slate-900 mb-10">Grupele de vacanță intersemestrială</h2>
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="h-6 w-6 text-orange-600" />
                <CardTitle>De ce există grupe?</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600">
              <p>
                Vacanța intersemestrială (vacanța de februarie) este organizată în 3 grupe pentru a distribui uniform 
                perioadele de odihnă pe teritoriul țării și pentru a evita aglomerația în stațiunile de schi.
              </p>
              <p>
                Fiecare județ face parte dintr-o grupă specifică (A, B sau C), iar vacanța se desfășoară în perioade diferite:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Grupa A:</strong> 9-15 februarie 2026</li>
                <li><strong>Grupa B:</strong> 16-22 februarie 2026</li>
                <li><strong>Grupa C:</strong> 23 februarie - 1 martie 2026</li>
              </ul>
              <p>
                Calendarul nostru știe automat în ce grupă se află județul tău și îți arată datele corecte pentru vacanța intersemestrială.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Date oficiale */}
        <section className="mb-20">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <CardTitle>Date oficiale și verificate</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-600">
              <p>
                Toate datele din CalendarȘcolar sunt oficiale, aprobate de Ministerul Educației și verificate de echipa noastră. 
                Nu trebuie să te îngrijorezi că informațiile sunt incorecte sau depășite.
              </p>
              <div className="flex items-start gap-2 mt-4">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                <p className="text-sm">
                  <strong>Actualizare automată:</strong> Când apar modificări oficiale, calendarul se actualizează automat și tu primești modificările în aplicația ta.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="mt-24 mb-16">
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-8 lg:p-12 text-white shadow-xl">
            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Gata să începi?</h2>
              <p className="text-lg mb-8 text-blue-100 max-w-2xl mx-auto">
                Adaugă calendarul școlar în aplicația ta preferată și nu mai rata nicio vacanță sau zi liberă!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8">
                  <Link href="/judete">
                    Vezi Toate Județele
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-white bg-transparent text-white hover:bg-transparent hover:text-white font-semibold px-8">
                  <Link href="/">
                    Pagina Principală
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

