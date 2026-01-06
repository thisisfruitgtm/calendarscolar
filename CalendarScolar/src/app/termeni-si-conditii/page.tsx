import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Shield, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = {
  title: 'Termeni și condiții - CalendarȘcolar.ro',
  description: 'Termenii și condițiile de utilizare ale platformei CalendarȘcolar.ro',
}

export default function TermeniSiConditiiPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-12 lg:py-16 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">
            Termeni și condiții
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Condițiile de utilizare ale platformei CalendarȘcolar.ro
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
                <FileText className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-2xl">Introducere</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600">
              <p>
                Bine ai venit pe CalendarȘcolar.ro! Prin accesarea și utilizarea acestui site, accepti să te supui 
                termenilor și condițiilor de utilizare prezentate mai jos. Dacă nu ești de acord cu acești termeni, 
                te rugăm să nu folosești site-ul.
              </p>
              <p>
                CalendarȘcolar.ro este o platformă care oferă calendarul școlar oficial pentru toate cele 42 de județe 
                din România plus București, cu date oficiale aprobate de Ministerul Educației.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Utilizarea serviciului */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Utilizarea serviciului</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600">
              <p>
                CalendarȘcolar.ro îți oferă acces gratuit la informații despre calendarul școlar oficial. 
                Poți utiliza aceste informații pentru:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Planificarea activităților personale și de familie</li>
                <li>Abonarea la feed-uri calendar prin aplicațiile tale de calendar</li>
                <li>Consultarea informațiilor despre vacanțe și zile libere</li>
              </ul>
              <p>
                Nu poți utiliza site-ul în scopuri comerciale fără permisiunea noastră scrisă, sau pentru activități 
                ilegale sau care încalcă drepturile altora.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Exactitatea informațiilor */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Shield className="h-6 w-6 text-green-600" />
                <CardTitle className="text-2xl">Exactitatea informațiilor</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600">
              <p>
                Ne străduim să oferim informații corecte și actualizate, bazate pe date oficiale aprobate de 
                Ministerul Educației. Cu toate acestea, nu putem garanta că toate informațiile sunt întotdeauna 
                complete, corecte sau actualizate.
              </p>
              <p>
                În cazul modificărilor oficiale în calendarul școlar, vom actualiza informațiile cât mai rapid posibil. 
                Te rugăm să verifici periodic site-ul sau să te abonezi la feed-ul calendar pentru a primi actualizări automate.
              </p>
              <p>
                Nu ne facem responsabili pentru eventuale daune rezultate din utilizarea sau neutilizarea informațiilor 
                furnizate pe acest site.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Proprietatea intelectuală */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Proprietatea intelectuală</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600">
              <p>
                Conținutul acestui site, inclusiv design-ul, logo-urile, textele și structura, este proprietatea 
                CalendarȘcolar.ro și este protejat de legile privind drepturile de autor.
              </p>
              <p>
                Poți utiliza feed-urile calendar (ICS) pentru uz personal și poți distribui link-urile către paginile 
                site-ului. Nu poți reproduce, distribui sau modifica conținutul site-ului fără permisiunea noastră scrisă.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Limita responsabilității */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="h-6 w-6 text-orange-600" />
                <CardTitle className="text-2xl">Limita responsabilității</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600">
              <p>
                CalendarȘcolar.ro este furnizat &quot;așa cum este&quot;, fără garanții de niciun fel, exprese sau implicite. 
                Nu garantăm că site-ul va funcționa fără întreruperi sau erori.
              </p>
              <p>
                Nu ne facem responsabili pentru:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Daune directe sau indirecte rezultate din utilizarea sau neutilizarea site-ului</li>
                <li>Pierderi de date sau informații</li>
                <li>Modificări în calendarul școlar oficial care pot afecta planurile tale</li>
                <li>Probleme tehnice sau întreruperi ale serviciului</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Modificări ale termenilor */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Modificări ale termenilor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-600">
              <p>
                Ne rezervăm dreptul de a modifica acești termeni și condiții în orice moment. Modificările vor intra 
                în vigoare imediat ce sunt publicate pe site.
              </p>
              <p>
                Utilizarea continuă a site-ului după modificarea termenilor constituie acceptarea noilor condiții. 
                Te rugăm să verifici periodic această pagină pentru a fi la curent cu modificările.
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
                Dacă ai întrebări despre acești termeni și condiții sau despre utilizarea site-ului, 
                te rugăm să ne contactezi prin intermediul site-ului.
              </p>
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




