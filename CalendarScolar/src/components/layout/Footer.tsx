import Link from 'next/link'
import { EdupeduArticles } from './EdupeduArticles'

export function Footer() {
  return (
    <footer className="bg-slate-900 py-16">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-3">
            <h3 className="text-xl font-bold text-white mb-4">CalendarȘcolar.ro</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Calendar școlar complet pentru toate cele 43 de județe. 
              Planifică-ți vacanțele și organizează-te pentru tot anul școlar 2025-2026.
            </p>
          </div>
          
          {/* Edupedu Articles - Wider column */}
          <div className="lg:col-span-5">
            <EdupeduArticles />
          </div>
          
          {/* Links Section */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Link-uri utile</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/judete" className="text-sm text-slate-400 hover:text-white transition-colors inline-block">
                    Toate Județele
                  </Link>
                </li>
                <li>
                  <Link href="/cum-functioneaza" className="text-sm text-slate-400 hover:text-white transition-colors inline-block">
                    Cum Funcționează
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors inline-block">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/sugestii" className="text-sm text-slate-400 hover:text-white transition-colors inline-block">
                    Sugestii
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/termeni-si-conditii" className="text-sm text-slate-400 hover:text-white transition-colors inline-block">
                    Termeni și condiții
                  </Link>
                </li>
                <li>
                  <Link href="/politica-de-confidentialitate" className="text-sm text-slate-400 hover:text-white transition-colors inline-block">
                    Politica de confidențialitate
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="pt-8 border-t border-slate-800">
          {/* Partners Section */}
          <div className="mb-8">
            <p className="text-xs text-slate-500 text-center leading-relaxed max-w-4xl mx-auto mb-6">
              Acest produs este oferit de{' '}
              <a href="https://marincea.com" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors underline">
                marincea.com
              </a>
              {' '}- Consultanță digitală impreună cu{' '}
              <a href="https://edupedu.ro" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors underline">
                edupedu.ro
              </a>
              {' '}- Știri la zi prin educație, prin{' '}
              <a href="https://thisisfruit.com" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors underline">
                Fruit Creative SRL
              </a>
              {' '}-{' '}
              <a href="https://thisisfruit.com" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors underline">
                thisisfruit.com
              </a>
              {' '}- Dezvoltatorul aplicației
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-8 mb-6 hidden">
              <a href="https://marincea.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <img 
                  src="https://marincea.com/img/Logo_marincea_digital_consulting.svg" 
                  alt="Marincea Digital Consulting" 
                  className="h-8 filter brightness-0 invert"
                />
              </a>
              <a href="https://edupedu.ro" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <img 
                  src="/logo-edupedu.png" 
                  alt="Edupedu" 
                  className="h-8"
                />
              </a>
              <a href="https://thisisfruit.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <img 
                  src="/logo-fruit.svg" 
                  alt="Fruit Creative" 
                  className="h-8"
                />
              </a>
            </div>
            
            <p className="text-xs text-slate-500 text-center">
              Fruit Creative - înregistrată ANSPDCP nr. 10677
            </p>
          </div>
          
          {/* Copyright */}
          <div className="text-center pt-6 border-t border-slate-800">
            <p className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} CalendarȘcolar.ro. Toate drepturile rezervate.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

