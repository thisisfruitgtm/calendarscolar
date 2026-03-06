import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: 'Când este vacanța de primăvară 2026?',
    answer: 'Vacanța de primăvară 2026 (anul școlar 2025-2026) se desfășoară în perioada 11-21 aprilie 2026. Aceasta include Paștele Ortodox și oferă elevilor aproximativ 10 zile de vacanță.',
  },
  {
    question: 'Când se termină școala în 2026?',
    answer: 'Anul școlar 2025-2026 se termină pe 19 iunie 2026 pentru majoritatea elevilor. Pentru clasele a XII-a zi și a XIII-a seral, ultima zi este 5 iunie 2026. Pentru clasa a VIII-a, ultima zi este 12 iunie 2026. Vacanța de vară 2026 începe pe 20 iunie și durează până pe 6 septembrie 2026.',
  },
  {
    question: 'Când începe anul școlar 2026-2027?',
    answer: 'Anul școlar 2026-2027 începe pe 7 septembrie 2026 (luni) pentru toți elevii din România, conform Ordinului Nr. 3.194/2026 publicat în Monitorul Oficial. Cursurile se desfășoară pe parcursul a 36 de săptămâni pentru majoritatea claselor.',
  },
  {
    question: 'Când este vacanța intersemestrială 2027?',
    answer: 'Vacanța intersemestrială din anul școlar 2026-2027 se desfășoară în perioada 15 februarie – 7 martie 2027, organizată în 3 grupe. Grupa A: 15-21 februarie (Timiș, Caraș-Severin, Gorj, Mehedinți, Dolj, Cluj). Grupa B: 22-28 februarie (Arad, Bihor, Satu Mare, Sălaj, Hunedoara, Alba, Sibiu, Vâlcea, Olt, Argeș, Teleorman, Giurgiu, Dâmbovița, Prahova, Brașov). Grupa C: 1-7 martie (Maramureș, Bistrița-Năsăud, Mureș, Covasna, Harghita, Suceava, Botoșani, Iași, Neamț, Bacău, Vaslui, Vrancea, Galați, Buzău, Brăila, Ialomița, Călărași, Constanța, Tulcea, Ilfov, București).',
  },
  {
    question: 'Când este vacanța de primăvară 2027?',
    answer: 'Vacanța de primăvară (vacanța de Paște) în anul școlar 2026-2027 este programată în perioada 19 aprilie – 3 mai 2027. Aceasta include Paștele Ortodox și oferă elevilor două săptămâni de vacanță.',
  },
  {
    question: 'Când este vacanța de vară 2027?',
    answer: 'Vacanța de vară 2027 începe pe 19 iunie 2027 (după ultima zi de cursuri) și durează până pe 5 septembrie 2027. Pentru elevii claselor a XII-a zi, a XIII-a seral și frecvență redusă, ultima zi de cursuri este 4 iunie 2027 (34 de săptămâni).',
  },
  {
    question: 'Care sunt zilele libere în anul școlar 2026-2027?',
    answer: 'Zilele libere legale în anul școlar 2026-2027 sunt: 30 noiembrie (Sfântul Andrei), 1 decembrie (Ziua Națională), 25-26 decembrie (Crăciunul), 1-2 ianuarie (Anul Nou), 24 ianuarie (Unirea Principatelor), 1 mai (Ziua Muncii), Paștele Ortodox, 1 iunie (Ziua Copilului), și Rusaliile. Toate aceste zile sunt nelucrătoare pentru elevi și cadre didactice.',
  },
  {
    question: 'Când se termină școala în 2027?',
    answer: 'Anul școlar 2026-2027 se termină pe 18 iunie 2027 (ultima zi de cursuri pentru majoritatea claselor). Pentru clasele a XII-a zi / a XIII-a seral, ultima zi este 4 iunie 2027. Pentru clasa a VIII-a, ultima zi este 11 iunie 2027. Vacanța de vară începe imediat după.',
  },
  {
    question: 'Cum adaug calendarul școlar în telefonul meu?',
    answer: 'Pe CalendarȘcolar.ro poți adăuga calendarul școlar direct în Google Calendar, Apple Calendar sau Outlook. Alege județul tău, apasă „Adaugă în calendar", selectează aplicația preferată, și gata! Calendarul se sincronizează automat și primești actualizări când apar modificări oficiale.',
  },
  {
    question: 'Ce este structura anului școlar 2026-2027?',
    answer: 'Anul școlar 2026-2027 are 2 semestre: Semestrul I (7 septembrie 2026 – 29 ianuarie 2027, ~20 săptămâni) și Semestrul II (9 februarie 2027 – 18 iunie 2027, ~16 săptămâni). Include vacanța de iarnă (19 decembrie 2026 – 4 ianuarie 2027), vacanța intersemestrială (15 feb – 7 mar 2027, pe grupe), vacanța de primăvară (19 apr – 3 mai 2027) și vacanța de vară (din 19 iunie 2027).',
  },
]

export function LandingSEOContent() {
  return (
    <>
      {/* 2025-2026 Remaining Events Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-center mb-8">
              Anul școlar 2025-2026 — Ce mai urmează
            </h2>

            <div className="prose prose-slate prose-lg max-w-none">
              <p className="text-slate-600 leading-relaxed">
                Anul școlar 2025-2026 este încă în desfășurare. Iată evenimentele rămase
                până la <strong>vacanța de vară 2026</strong>:
              </p>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-6 not-prose">
                <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-5">
                  <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">Vacanță</p>
                  <p className="font-bold text-slate-900">Vacanța de primăvară 2026</p>
                  <p className="text-sm text-slate-600">11 – 21 aprilie 2026</p>
                </div>
                <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-5">
                  <p className="text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1">Zi liberă</p>
                  <p className="font-bold text-slate-900">1 Mai – Ziua Muncii</p>
                  <p className="text-sm text-slate-600">vineri, 1 mai 2026</p>
                </div>
                <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-5">
                  <p className="text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1">Zi liberă</p>
                  <p className="font-bold text-slate-900">1 Iunie – Ziua Copilului</p>
                  <p className="text-sm text-slate-600">luni, 1 iunie 2026</p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">Ultima zi</p>
                  <p className="font-bold text-slate-900">Clasele XII/XIII</p>
                  <p className="text-sm text-slate-600">5 iunie 2026</p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">Ultima zi</p>
                  <p className="font-bold text-slate-900">Clasa a VIII-a</p>
                  <p className="text-sm text-slate-600">12 iunie 2026</p>
                </div>
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-5">
                  <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">Sfârșit</p>
                  <p className="font-bold text-slate-900">Vacanța de vară 2026</p>
                  <p className="text-sm text-slate-600">din 20 iunie 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2026-2027 Structure Section */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-center mb-8">
              Structura anului școlar 2026-2027
            </h2>

            <div className="prose prose-slate prose-lg max-w-none">
              <p className="text-slate-600 leading-relaxed">
                Anul școlar 2026-2027 este reglementat prin <strong>Ordinul Nr. 3.194/2026</strong> al
                Ministerului Educației, publicat în Monitorul Oficial Nr. 126 din 16 februarie 2026.
                Cursurile încep pe <strong>7 septembrie 2026</strong> și se încheie pe <strong>18 iunie 2027</strong> pentru
                majoritatea elevilor.
              </p>

              <div className="grid gap-6 md:grid-cols-2 mt-8 not-prose">
                {/* Semestrul I */}
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-6">
                  <h3 className="text-lg font-bold text-blue-900 mb-4">Semestrul I</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex justify-between">
                      <span>Cursuri</span>
                      <span className="font-medium">7 sept. – 19 dec. 2026</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Vacanța de iarnă</span>
                      <span className="font-medium">20 dec. 2026 – 5 ian. 2027</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Cursuri</span>
                      <span className="font-medium">6 ian. – 30 ian. 2027</span>
                    </li>
                  </ul>
                </div>

                {/* Semestrul II */}
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-6">
                  <h3 className="text-lg font-bold text-indigo-900 mb-4">Semestrul II</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex justify-between">
                      <span>Vacanța intersemestrială</span>
                      <span className="font-medium">15 feb. – 7 mar. 2027</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Vacanța de primăvară</span>
                      <span className="font-medium">19 apr. – 3 mai 2027</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Vacanța de vară</span>
                      <span className="font-medium">din 19 iun. 2027</span>
                    </li>
                  </ul>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed mt-6">
                Vacanța intersemestrială este organizată în <strong>3 grupe regionale</strong> pentru
                a distribui uniform perioadele de odihnă pe teritoriul țării. Fiecare inspectorat
                școlar județean (ISJ) este repartizat într-una din cele 3 grupe, cu săptămâni diferite
                de vacanță în perioada 15 februarie – 7 martie 2027. Acest sistem permite
                familiilor din diferite regiuni să beneficieze de condiții mai bune pentru
                activități recreative și turism intern.
              </p>

              <p className="text-slate-600 leading-relaxed">
                CalendarȘcolar.ro centralizează toate informațiile oficiale despre vacanțele școlare,
                zilele libere legale și structura anului școlar pentru toate cele <strong>42 de județe</strong> din
                România, inclusiv București. Platforma oferă sincronizare automată cu Google Calendar,
                Apple Calendar și Outlook, astfel încât părinții și elevii să aibă mereu informații
                actualizate direct în telefonul lor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl text-center mb-2">
              Întrebări frecvente
            </h2>
            <p className="text-center text-slate-600 mb-10">
              Răspunsuri la cele mai căutate întrebări despre anul școlar 2025-2026 și 2026-2027
            </p>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="group rounded-xl border border-slate-200 bg-white overflow-hidden"
                >
                  <summary className="flex cursor-pointer items-center justify-between p-5 text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors [&::-webkit-details-marker]:hidden list-none">
                    <span className="pr-4">{faq.question}</span>
                    <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(faq => ({
              '@type': 'Question',
              name: faq.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </>
  )
}
