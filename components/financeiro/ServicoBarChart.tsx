'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface Props {
  data: { nome: string; total: number; quantidade: number }[]
}

export function ServicoBarChart({ data }: Props) {
  const top = data.slice(0, 8).map((d) => ({
    ...d,
    label: d.nome.length > 18 ? d.nome.substring(0, 17) + '…' : d.nome,
  }))

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <div className="mb-6">
        <h2 className="font-semibold text-slate-700">Receita por Serviço</h2>
        <p className="text-xs text-slate-400 mt-0.5">Ranking de onde vem o dinheiro</p>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={top} margin={{ top: 0, right: 0, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            angle={-30}
            textAnchor="end"
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `R$${v}`}
          />
          <Tooltip
            formatter={(value, _, props) => [
              `${formatCurrency(Number(value))} (${(props.payload as { quantidade: number }).quantidade} atend.)`,
              (props.payload as { nome: string }).nome,
            ]}
            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
          />
          <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={48} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
