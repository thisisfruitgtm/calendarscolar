import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, MessageSquare, Send, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Contact - CalendarȘcolar.ro',
  description: 'Contactează echipa CalendarȘcolar.ro pentru întrebări, sugestii sau probleme tehnice.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-12 lg:py-16 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">
            Contact
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Ai întrebări sau sugestii? Suntem aici să te ajutăm!
          </p>
        </div>

        {/* Informații de contact */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-2xl">Cum ne poți contacta?</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600">
              <p>
                Pentru întrebări, sugestii sau probleme tehnice legate de CalendarȘcolar.ro, 
                te rugăm să ne contactezi prin intermediul site-ului sau prin partenerii noștri.
              </p>
              <div className="space-y-3 mt-6">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50">
                  <Mail className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Contact general</h3>
                    <p className="text-sm">
                      Pentru întrebări generale despre calendarul școlar sau funcționalitățile site-ului.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50">
                  <MessageSquare className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Sugestii și feedback</h3>
                    <p className="text-sm">
                      Ai o idee pentru îmbunătățirea site-ului? Ne-ar plăcea să o auzim! 
                      Folosește pagina de{' '}
                      <Link href="/sugestii" className="text-blue-600 hover:underline font-medium">
                        sugestii
                      </Link>
                      {' '}pentru a ne trimite feedback-ul tău.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-slate-50">
                  <Send className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Probleme tehnice</h3>
                    <p className="text-sm">
                      Dacă întâmpini probleme cu feed-ul calendar sau cu funcționalitățile site-ului, 
                      te rugăm să ne contactezi cu detalii despre problema întâmpinată.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Parteneri */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Parteneri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600">
              <p>
                CalendarȘcolar.ro este un produs realizat în colaborare cu:
              </p>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    <a href="https://marincea.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Marincea Digital Consulting
                    </a>
                  </h3>
                  <p className="text-sm">Consultanță digitală</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    <a href="https://edupedu.ro" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Edupedu.ro
                    </a>
                  </h3>
                  <p className="text-sm">Știri la zi prin educație</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    <a href="https://thisisfruit.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Fruit Creative SRL
                    </a>
                  </h3>
                  <p className="text-sm">Dezvoltatorul aplicației - înregistrată ANSPDCP nr. 10677</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Link-uri utile */}
        <section className="mb-12">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <HelpCircle className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-2xl">Link-uri utile</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-slate-600">
              <p className="mb-4">Înainte de a ne contacta, verifică dacă răspunsul la întrebarea ta se găsește aici:</p>
              <ul className="space-y-2">
                <li>
                  <Link href="/cum-functioneaza" className="text-blue-600 hover:underline">
                    Cum funcționează CalendarȘcolar
                  </Link>
                </li>
                <li>
                  <Link href="/judete" className="text-blue-600 hover:underline">
                    Toate județele
                  </Link>
                </li>
                <li>
                  <Link href="/sugestii" className="text-blue-600 hover:underline">
                    Trimite o sugestie
                  </Link>
                </li>
                <li>
                  <Link href="/termeni-si-conditii" className="text-blue-600 hover:underline">
                    Termeni și condiții
                  </Link>
                </li>
                <li>
                  <Link href="/politica-de-confidentialitate" className="text-blue-600 hover:underline">
                    Politica de confidențialitate
                  </Link>
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section className="mt-16 mb-8 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/">
              Înapoi la pagina principală
            </Link>
          </Button>
        </section>
      </div>
    </main>
  )
}






