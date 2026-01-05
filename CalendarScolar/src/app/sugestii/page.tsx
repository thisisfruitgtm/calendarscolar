'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lightbulb, Send, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SugestiiPage() {
  const [formData, setFormData] = useState({
    nume: '',
    email: '',
    tip: 'sugestie',
    mesaj: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulare trimitere (în producție ar trebui să trimită la un API endpoint)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSubmitted(true)
    setIsSubmitting(false)
    setFormData({ nume: '', email: '', tip: 'sugestie', mesaj: '' })
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-12 lg:py-16 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl mb-4">
            Sugestii și feedback
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Ne-ar plăcea să auzim părerea ta! Ajută-ne să îmbunătățim CalendarȘcolar.ro
          </p>
        </div>

        {submitted ? (
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Mulțumim pentru feedback!</h2>
                <p className="text-slate-600 mb-6">
                  Sugestia ta a fost trimisă cu succes. O vom analiza și vom lua în considerare pentru îmbunătățiri viitoare.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button asChild variant="outline">
                    <Link href="/sugestii" onClick={() => setSubmitted(false)}>
                      Trimite altă sugestie
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/">
                      Înapoi la pagina principală
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Formular */}
            <section className="mb-12">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Lightbulb className="h-6 w-6 text-yellow-600" />
                    <CardTitle className="text-2xl">Trimite o sugestie</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="nume">Nume (opțional)</Label>
                        <Input
                          id="nume"
                          value={formData.nume}
                          onChange={(e) => setFormData({ ...formData, nume: e.target.value })}
                          placeholder="Numele tău"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email (opțional)</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="email@exemplu.ro"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="tip">Tip de feedback</Label>
                      <select
                        id="tip"
                        value={formData.tip}
                        onChange={(e) => setFormData({ ...formData, tip: e.target.value })}
                        className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="sugestie">Sugestie de îmbunătățire</option>
                        <option value="bug">Raportare problemă/bug</option>
                        <option value="feature">Sugestie de funcționalitate nouă</option>
                        <option value="design">Sugestie de design</option>
                        <option value="altceva">Altceva</option>
                      </select>
                    </div>

                    <div>
                      <Label htmlFor="mesaj">Mesajul tău *</Label>
                      <Textarea
                        id="mesaj"
                        value={formData.mesaj}
                        onChange={(e) => setFormData({ ...formData, mesaj: e.target.value })}
                        placeholder="Descrie sugestia sau feedback-ul tău..."
                        className="mt-1 min-h-[150px]"
                        required
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        * Câmp obligatoriu
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <Button type="submit" size="lg" disabled={isSubmitting} className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        {isSubmitting ? 'Se trimite...' : 'Trimite sugestia'}
                      </Button>
                      <Button asChild type="button" variant="outline" size="lg">
                        <Link href="/">
                          Anulează
                        </Link>
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </section>

            {/* Informații */}
            <section className="mb-12">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-2xl">Ce tipuri de feedback acceptăm?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-slate-600">
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Sugestii de îmbunătățire:</strong> Idei pentru a face site-ul mai bun</li>
                    <li><strong>Raportări de probleme:</strong> Dacă ai întâmpinat erori sau bug-uri</li>
                    <li><strong>Funcționalități noi:</strong> Sugestii pentru caracteristici noi</li>
                    <li><strong>Îmbunătățiri de design:</strong> Sugestii pentru interfață</li>
                    <li><strong>Alte feedback-uri:</strong> Orice altceva consideri util</li>
                  </ul>
                  <p className="mt-4 text-sm">
                    Toate sugestiile sunt binevenite și le analizăm cu atenție. Mulțumim pentru timpul acordat!
                  </p>
                </CardContent>
              </Card>
            </section>
          </>
        )}

        {/* CTA */}
        {!submitted && (
          <section className="mt-16 mb-8 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/">
                Înapoi la pagina principală
              </Link>
            </Button>
          </section>
        )}
      </div>
    </main>
  )
}






