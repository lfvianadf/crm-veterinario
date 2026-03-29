'use client'

import { formatCurrency } from '@/lib/utils'

interface Props {
  atual: number
  metaAluguel: number
  metaSalarios: number
  mrr: number
  valorMedio: number
}

export function MetaPlano({ atual, metaAluguel, metaSalarios, mrr, valorMedio }: Props) {
  const max = metaSalarios + 5
  const pct = (v: number) => Math.min(100, Math.round((v / max) * 100))

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
      <div>
        <h2 className="font-semibold text-slate-700">Termômetro do Plano Mensal</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Quanto falta para o plano cobrir os custos fixos da clínica
        </p>
      </div>

      {/* Barra principal */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>0 assinantes</span>
          <span className="font-semibold text-slate-700">{atual} atualmente</span>
          <span>{max} assinantes</span>
        </div>
        <div className="relative h-5 bg-slate-100 rounded-full overflow-hidden">
          {/* Barra de progresso */}
          <div
            className="absolute left-0 top-0 h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${pct(atual)}%` }}
          />
          {/* Marca aluguel */}
          <div
            className="absolute top-0 h-full w-0.5 bg-amber-400"
            style={{ left: `${pct(metaAluguel)}%` }}
          />
          {/* Marca salários */}
          <div
            className="absolute top-0 h-full w-0.5 bg-emerald-500"
            style={{ left: `${pct(metaSalarios)}%` }}
          />
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            {metaAluguel} assin. = cobre aluguel
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            {metaSalarios} assin. = cobre salários
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-50 rounded-xl p-4 text-center">
          <p className="text-xl font-bold text-slate-800">{atual}</p>
          <p className="text-xs text-slate-400 mt-0.5">Assinantes hoje</p>
          <p className="text-xs font-medium text-blue-600 mt-1">{formatCurrency(mrr)}/mês</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 text-center">
          <p className="text-xl font-bold text-amber-700">{metaAluguel}</p>
          <p className="text-xs text-amber-600 mt-0.5">Meta aluguel</p>
          <p className="text-xs font-medium text-amber-700 mt-1">
            faltam {Math.max(0, metaAluguel - atual)}
          </p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-4 text-center">
          <p className="text-xl font-bold text-emerald-700">{metaSalarios}</p>
          <p className="text-xs text-emerald-600 mt-0.5">Meta salários</p>
          <p className="text-xs font-medium text-emerald-700 mt-1">
            faltam {Math.max(0, metaSalarios - atual)}
          </p>
        </div>
      </div>
    </div>
  )
}
