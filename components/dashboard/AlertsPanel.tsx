'use client'

import { Vacina, Tutor } from '@/types'
import { formatDate, daysUntil, daysSince } from '@/lib/utils'
import { AlertTriangle, Clock, UserX } from 'lucide-react'

interface AlertsPanelProps {
  vacinasAtrasadas: Vacina[]
  clientesSumidos: Tutor[]
}

export function AlertsPanel({ vacinasAtrasadas, clientesSumidos }: AlertsPanelProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Vacinas atrasadas */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h3 className="font-semibold text-slate-700 text-sm">Vacinas Atrasadas</h3>
          <span className="ml-auto text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-lg font-medium">
            {vacinasAtrasadas.length}
          </span>
        </div>
        <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
          {vacinasAtrasadas.length === 0 ? (
            <p className="px-6 py-8 text-sm text-slate-400 text-center">Nenhuma vacina atrasada 🎉</p>
          ) : (
            vacinasAtrasadas.map((v) => (
              <div key={v.id} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    {(v.animais as { nome: string } | undefined)?.nome} — {v.nome}
                  </p>
                  <p className="text-xs text-slate-400">
                    Tutor: {(v.animais as { tutores?: { nome: string } } | undefined)?.tutores?.nome}
                  </p>
                </div>
                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-lg font-medium">
                  {Math.abs(daysUntil(v.data_vencimento))}d atraso
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Clientes sumidos */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <UserX className="w-4 h-4 text-red-400" />
          <h3 className="font-semibold text-slate-700 text-sm">Clientes Sumidos &gt;60 dias</h3>
          <span className="ml-auto text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-lg font-medium">
            {clientesSumidos.length}
          </span>
        </div>
        <div className="divide-y divide-slate-50 max-h-64 overflow-y-auto">
          {clientesSumidos.length === 0 ? (
            <p className="px-6 py-8 text-sm text-slate-400 text-center">Todos os clientes ativos 🎉</p>
          ) : (
            clientesSumidos.map((t) => (
              <div key={t.id} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">{t.nome}</p>
                  <p className="text-xs text-slate-400">{t.telefone}</p>
                </div>
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-lg font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  sem visita
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
