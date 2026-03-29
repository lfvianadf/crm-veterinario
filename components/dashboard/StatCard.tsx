import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
  trend?: { value: number; label: string }
}

const colorMap = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-500',
    badge: 'bg-blue-100 text-blue-700',
  },
  green: {
    bg: 'bg-emerald-50',
    icon: 'text-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  yellow: {
    bg: 'bg-amber-50',
    icon: 'text-amber-500',
    badge: 'bg-amber-100 text-amber-700',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-500',
    badge: 'bg-red-100 text-red-700',
  },
  purple: {
    bg: 'bg-violet-50',
    icon: 'text-violet-500',
    badge: 'bg-violet-100 text-violet-700',
  },
}

export function StatCard({ title, value, subtitle, icon: Icon, color = 'blue', trend }: StatCardProps) {
  const colors = colorMap[color]

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', colors.bg)}>
          <Icon className={cn('w-5 h-5', colors.icon)} />
        </div>
        {trend && (
          <span className={cn('text-xs font-medium px-2 py-1 rounded-lg', colors.badge)}>
            {trend.value > 0 ? '+' : ''}{trend.value} {trend.label}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-sm text-slate-500 mt-0.5">{title}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  )
}
