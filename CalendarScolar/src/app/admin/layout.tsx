import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import { signOut } from '@/lib/auth'
import { Button } from '@/components/ui/button'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/admin-login')
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="text-xl font-bold text-blue-600">
                CalendarȘcolar Admin
              </Link>
              <div className="flex space-x-4">
                <Link
                  href="/admin/events"
                  className="text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                  Evenimente
                </Link>
                <Link
                  href="/admin/counties"
                  className="text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                  Județe
                </Link>
                <Link
                  href="/admin/promos"
                  className="text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                  Promoții
                </Link>
                <Link
                  href="/admin/subscribers"
                  className="text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                  Subscriberi
                </Link>
                <Link
                  href="/admin/settings"
                  className="text-sm font-medium text-slate-700 hover:text-slate-900"
                >
                  Setări
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">{session.user.email}</span>
              <form
                action={async () => {
                  'use server'
                  await signOut({ redirectTo: '/admin-login' })
                }}
              >
                <Button type="submit" variant="outline" size="sm">
                  Deconectează-te
                </Button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
