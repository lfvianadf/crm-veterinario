'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface Props {
  data: { mes: string; receita: number }[]
  mesSelecionado?: string
}

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

export function RevenueChart({ data, mesSelecionado }: Props) {
  const formatted = data.map((d) => ({
    ...d,
    label: MESES[parseInt(d.mes.split('-')[1]) - 1],
  }))

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="mb-6">
        <h3 className="font-semibold text-slate-700">Receita por mês — {data[0]?.mes.split('-')[0] ?? '2026'}</h3>
        <p className="text-xs text-slate-400 mt-0.5">Atendimentos avulsos · mês destacado = selecionado</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={formatted} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barSize={32}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(Number(value)), 'Receita avulsa']}
            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
          />
          <Bar dataKey="receita" radius={[6, 6, 0, 0]}>
            {formatted.map((entry) => (
              <Cell
                key={entry.mes}
                fill={entry.mes === mesSelecionado ? '#3b82f6' : '#bfdbfe'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}