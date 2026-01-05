'use client'

import { useEffect, useState } from 'react'

interface EdupeduArticle {
  title: string
  link: string
  pubDate: string
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('ro-RO', {
      day: 'numeric',
      month: 'short',
    }).format(date)
  } catch {
    return ''
  }
}

export function EdupeduArticles() {
  const [articles, setArticles] = useState<EdupeduArticle[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Legitimate hydration pattern
    setMounted(true)
    
    async function fetchArticles() {
      try {
        const response = await fetch('/api/edupedu-articles')
        if (response.ok) {
          const data = await response.json()
          setArticles(data.articles || [])
        }
      } catch (error) {
        console.error('Error fetching Edupedu articles:', error)
      }
    }

    fetchArticles()
  }, [])

  // Show consistent structure during SSR and initial client render
  if (!mounted) {
    return (
      <div>
        <h4 className="text-sm font-semibold text-white mb-5">
          Noutăți calendar școlar de la Edupedu.ro
        </h4>
        <p className="text-sm text-slate-500">Se încarcă...</p>
      </div>
    )
  }

  // Show section even if no articles, but with a message
  if (articles.length === 0) {
    return (
      <div>
        <h4 className="text-sm font-semibold text-white mb-9">
          Noutăți calendar școlar de la Edupedu.ro
        </h4>
        <p className="text-sm text-slate-500 mb-4">
          Nu există articole disponibile momentan.
        </p>
        <div>
          <a
            href="https://www.edupedu.ro/?s=calendar"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-white transition-colors underline inline-flex items-center gap-1"
          >
            Vezi toate articolele
            <span>→</span>
          </a>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h4 className="text-sm font-semibold text-white mb-5">
       Noutăți calendar școlar de la Edupedu.ro
      </h4>
      <ul className="space-y-4">
        {articles.map((article, index) => (
          <li key={index} className="border-l-2 border-slate-700 pl-4">
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="text-sm text-slate-300 group-hover:text-white transition-colors line-clamp-2 mb-1.5">
                {article.title}
              </div>
              {article.pubDate && (
                <div className="text-xs text-slate-500">
                  {formatDate(article.pubDate)}
                </div>
              )}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-5">
        <a
          href="https://www.edupedu.ro/?s=calendar"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-slate-400 hover:text-white transition-colors underline inline-flex items-center gap-1"
        >
          Vezi toate articolele
          <span>→</span>
        </a>
      </div>
    </div>
  )
}

