'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface Props {
  data: { mes: string; avulso: number; recorrente: number; total: number }[]
}

export function ReceitaChart({ data }: Props) {
  const formatted = data.map((d) => ({ ...d, label: d.mes.replace('-', '/') }))

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="mb-6">
        <h2 className="font-semibold text-slate-700">Receita: Avulso vs Recorrente</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Quanto vem de atendimentos pontuais e quanto vem do plano fixo
        </p>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={formatted} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gAvulso" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gRecorrente" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v}`} />
          <Tooltip
            formatter={(value, name) => [
              formatCurrency(Number(value)),
              name === 'avulso' ? 'Avulso' : 'Recorrente',
            ]}
            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
          />
          <Legend formatter={(v) => (v === 'avulso' ? 'Avulso' : 'Recorrente (plano)')} />
          <Area type="monotone" dataKey="recorrente" stroke="#10b981" strokeWidth={2} fill="url(#gRecorrente)" />
          <Area type="monotone" dataKey="avulso" stroke="#3b82f6" strokeWidth={2} fill="url(#gAvulso)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
