'use client'

import { useRouter } from 'next/navigation'

const filtros = [
  { label: 'Todos',     value: '' },
  { label: 'Hoje',      value: 'hoje' },
  { label: 'Agendados', value: 'agendado' },
  { label: 'Concluídos',value: 'concluido' },
  { label: 'Cancelados',value: 'cancelado' },
]

export function AgendamentoFiltros({ filtroAtivo }: { filtroAtivo: string }) {
  const router = useRouter()

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {filtros.map((f) => (
        <button
          key={f.value}
          onClick={() => router.push(`/agendamentos?page=1${f.value ? `&filtro=${f.value}` : ''}`)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            filtroAtivo === f.value
              ? 'bg-blue-500 text-white'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}