import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Shield, Lock, Eye, Database, Cookie } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Politica de confidențialitate - CalendarȘcolar.ro',
  description: 'Politica de confidențialitate și protecția datelor personale pe CalendarȘcolar.ro',
}

export default function PoliticaDeConfidentialitatePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-12 lg:py-16 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">
            Politica de confidențialitate
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Cum colectăm, folosim și protejăm informațiile tale personale
          </p>
        </div>

        {/* Ultima actualizare */}
        <div className="mb-8 text-center">
          <p className="text-sm text-slate-500">
            Ultima actualizare: 30 decembrie 2025
          </p>
        </div>

        {/* Introducere */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-2xl">Introducere</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600">
              <p>
                La CalendarȘcolar.ro, respectăm confidențialitatea ta și ne angajăm să protejăm datele tale personale. 
                Această politică de confidențialitate explică cum colectăm, folosim, stocăm și protejăm informațiile tale 
                când accesezi și folosești site-ul nostru.
              </p>
              <p>
                Utilizând CalendarȘcolar.ro, accepti practicile descrise în această politică de confidențialitate. 
                Dacă nu ești de acord cu această politică, te rugăm să nu folosești site-ul.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Operatorul de date */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Operatorul de date</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600">
              <p>
                Acest produs este oferit de{' '}
                <a href="https://marincea.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  marincea.com
                </a>
                {' '}- Consultanță digitală, impreună cu{' '}
                <a href="https://edupedu.ro" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  edupedu.ro
                </a>
                {' '}- Știri la zi prin educație, prin{' '}
                <a href="https://thisisfruit.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Fruit Creative SRL
                </a>
                {' '}- Dezvoltatorul aplicației.
              </p>
              <p>
                <strong>Operator responsabil:</strong> Fruit Creative SRL - înregistrată ANSPDCP nr. 10677
              </p>
              <p>
                Operatorul este responsabil pentru procesarea datelor personale în conformitate cu Regulamentul General privind 
                Protecția Datelor (GDPR) și legislația română aplicabilă.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Informații colectate */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Database className="h-6 w-6 text-green-600" />
                <CardTitle className="text-2xl">Ce informații colectăm?</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600">
              <p>
                CalendarȘcolar.ro colectează un minim de informații necesare pentru funcționarea site-ului:
              </p>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Informații colectate automat:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Adresa IP (pentru securitate și analiză)</li>
                    <li>Tipul de browser și versiunea</li>
                    <li>Sistemul de operare</li>
                    <li>Pagina de referință (de unde ai ajuns pe site)</li>
                    <li>Data și ora accesării</li>
                    <li>Acțiuni efectuate pe site (de exemplu, abonări la calendar)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Informații despre abonări:</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Județul pentru care te-ai abonat</li>
                    <li>Tipul de aplicație folosită (Google Calendar, Apple Calendar, Outlook)</li>
                    <li>Numărul de accesări la feed-ul calendar</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4">
                <strong>Nu colectăm:</strong> nume, adrese de email, numere de telefon sau alte date personale identificabile, 
                cu excepția adresei IP care este necesară pentru funcționarea site-ului.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Cum folosim informațiile */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Eye className="h-6 w-6 text-purple-600" />
                <CardTitle className="text-2xl">Cum folosim informațiile?</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600">
              <p>Folosim informațiile colectate pentru:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Funcționarea site-ului:</strong> pentru a-ți oferi acces la calendarul școlar și feed-urile ICS</li>
                <li><strong>Îmbunătățirea serviciului:</strong> pentru a înțelege cum este folosit site-ul și cum îl putem îmbunătăți</li>
                <li><strong>Securitate:</strong> pentru a detecta și preveni utilizări abuzive sau atacuri</li>
                <li><strong>Statistici:</strong> pentru a genera statistici anonime despre utilizarea site-ului</li>
              </ul>
              <p>
                <strong>Nu vindem, nu închiriem și nu partajăm datele tale cu terți</strong> în scopuri comerciale sau de marketing.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Cookie-uri */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Cookie className="h-6 w-6 text-orange-600" />
                <CardTitle className="text-2xl">Cookie-uri și tehnologii similare</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600">
              <p>
                CalendarȘcolar.ro folosește cookie-uri și tehnologii similare pentru a îmbunătăți experiența ta de utilizare:
              </p>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Cookie-uri esențiale:</h3>
                  <p className="ml-4">
                    Necesare pentru funcționarea de bază a site-ului. Acestea nu pot fi dezactivate.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Cookie-uri de analiză:</h3>
                  <p className="ml-4">
                    Ne ajută să înțelegem cum este folosit site-ul. Acestea sunt anonime și nu te identifică personal.
                  </p>
                </div>
              </div>
              <p>
                Poți controla cookie-urile prin setările browserului tău. Dezactivarea cookie-urilor poate afecta 
                funcționalitatea anumitor părți ale site-ului.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Securitatea datelor */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Lock className="h-6 w-6 text-red-600" />
                <CardTitle className="text-2xl">Securitatea datelor</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600">
              <p>
                Ne angajăm să protejăm datele tale folosind măsuri de securitate tehnice și organizaționale adecvate:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Criptare SSL/TLS pentru toate comunicările</li>
                <li>Acces restricționat la date doar pentru personalul autorizat</li>
                <li>Monitorizare continuă pentru detectarea vulnerabilităților</li>
                <li>Backup-uri regulate ale datelor</li>
              </ul>
              <p>
                Cu toate acestea, niciun sistem nu este 100% sigur. Nu putem garanta securitatea absolută a datelor, 
                dar luăm toate măsurile rezonabile pentru a le proteja.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Stocarea datelor */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Stocarea și păstrarea datelor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600">
              <p>
                Datele sunt stocate pe servere securizate și sunt păstrate doar atât timp cât este necesar pentru 
                funcționarea site-ului și îndeplinirea scopurilor descrise în această politică.
              </p>
              <p>
                Datele statistice anonime pot fi păstrate pe termen lung pentru analiză și îmbunătățirea serviciului.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Drepturile tale */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Drepturile tale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600">
              <p>
                Conform GDPR, ai următoarele drepturi:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Dreptul la informare:</strong> să știi ce date colectăm și cum le folosim</li>
                <li><strong>Dreptul de acces:</strong> să ceri o copie a datelor tale</li>
                <li><strong>Dreptul la ștergere:</strong> să ceri ștergerea datelor tale</li>
                <li><strong>Dreptul la restricționare:</strong> să limitezi procesarea datelor</li>
                <li><strong>Dreptul la portabilitate:</strong> să primești datele într-un format structurat</li>
              </ul>
              <p>
                Pentru a exercita aceste drepturi, te rugăm să ne contactezi prin intermediul site-ului.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Link-uri către terți */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Link-uri către site-uri terțe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600">
              <p>
                Site-ul nostru poate conține link-uri către site-uri terțe (de exemplu, Google Calendar, Outlook). 
                Nu suntem responsabili pentru practicile de confidențialitate sau conținutul acestor site-uri terțe.
              </p>
              <p>
                Te rugăm să citești politicile de confidențialitate ale acestor site-uri înainte de a le accesa.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Modificări */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Modificări ale politicii</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600">
              <p>
                Ne rezervăm dreptul de a modifica această politică de confidențialitate în orice moment. 
                Modificările vor fi publicate pe această pagină cu data actualizării.
              </p>
              <p>
                Utilizarea continuă a site-ului după modificarea politicii constituie acceptarea noilor condiții. 
                Te rugăm să verifici periodic această pagină.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Contact */}
        <section className="mb-12">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-2xl">Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600">
              <p>
                Dacă ai întrebări despre această politică de confidențialitate sau despre datele tale, 
                te rugăm să ne contactezi prin intermediul site-ului.
              </p>
              <div className="mt-4 pt-4 border-t border-blue-200">
                <p className="text-sm">
                  <strong>Operator responsabil:</strong> Fruit Creative SRL<br />
                  <strong>Înregistrare ANSPDCP:</strong> nr. 10677<br />
                  <strong>Website:</strong>{' '}
                  <a href="https://thisisfruit.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    thisisfruit.com
                  </a>
                </p>
              </div>
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

