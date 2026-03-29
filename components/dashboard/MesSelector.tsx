'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function navegar(mes: string, delta: number): string {
  const [ano, m] = mes.split('-').map(Number)
  const d = new Date(ano, m - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function mesLabel(mes: string): string {
  const [ano, m] = mes.split('-')
  return `${MESES[parseInt(m) - 1]}/${ano}`
}

export function MesSelector({ mes, mesAtual }: { mes: string; mesAtual: string }) {
  const router = useRouter()

  const anterior = navegar(mes, -1)
  const proximo = navegar(mes, 1)
  const podeAvancar = proximo <= mesAtual

  return (
    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2 py-1.5 shadow-sm">
      <button
        onClick={() => router.push(`/?mes=${anterior}`, { scroll: false })}
        className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-sm font-semibold text-slate-700 min-w-[90px] text-center">
        {mesLabel(mes)}
      </span>
      <button
        onClick={() => router.push(`/?mes=${proximo}`, { scroll: false })}
        disabled={!podeAvancar}
        className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}