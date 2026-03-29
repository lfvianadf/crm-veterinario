import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/Sidebar'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Patinhas CRM',
  description: 'Sistema de gestão para Clínica Veterinária Patinhas',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${geist.className} bg-slate-50 text-slate-800`}>
        <Sidebar />
        <main className="ml-60 min-h-screen">
          <div className="max-w-7xl mx-auto px-8 py-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}
