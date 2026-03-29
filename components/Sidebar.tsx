'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, Stethoscope, PawPrint,
  CalendarDays, ShieldCheck, BarChart2, Lightbulb
} from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/',             label: 'Dashboard',      icon: LayoutDashboard },
  { href: '/clientes',     label: 'Clientes',        icon: Users },
  { href: '/pets',         label: 'Pets',            icon: PawPrint },
  { href: '/agendamentos', label: 'Agendamentos',    icon: CalendarDays },
  { href: '/servicos',     label: 'Serviços',        icon: Stethoscope },
  { href: '/plano',        label: 'Plano Mensal',    icon: ShieldCheck },
  { divider: true },
  { href: '/inteligencia', label: 'Inteligência',    icon: Lightbulb },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-slate-100 flex flex-col z-20">
      <div className="px-6 py-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center">
            <PawPrint className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-slate-800 text-sm">Patinhas</p>
            <p className="text-xs text-slate-400">Clínica Veterinária</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map((item, i) => {
          if ('divider' in item) {
            return <div key={i} className="my-2 border-t border-slate-100" />
          }
          const { href, label, icon: Icon } = item
          const active = pathname === href || (href !== '/' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              )}
            >
              <Icon className={cn('w-4 h-4', active ? 'text-blue-500' : 'text-slate-400')} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-6 py-4 border-t border-slate-100">
        <p className="text-xs text-slate-400">v1.0 · MVP Patinhas</p>
      </div>
    </aside>
  )
}
