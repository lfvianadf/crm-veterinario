'use client'

import { Recomendacao } from '@/services/inteligencia'
import { formatCurrency } from '@/lib/utils'
import { MessageCircle, RefreshCw, Syringe, ShieldCheck, TrendingUp } from 'lucide-react'

const iconMap = {
  reativacao: RefreshCw,
  vacina: Syringe,
  plano: ShieldCheck,
  preco: TrendingUp,
}

const colorMap = {
  alta: {
    badge: 'bg-red-100 text-red-700',
    border: 'border-red-100',
    icon: 'bg-red-50 text-red-500',
  },
  media: {
    badge: 'bg-amber-100 text-amber-700',
    border: 'border-amber-100',
    icon: 'bg-amber-50 text-amber-500',
  },
}

interface Props {
  rec: Recomendacao
}

export function RecomendacaoCard({ rec }: Props) {
  const Icon = iconMap[rec.tipo]
  const colors = colorMap[rec.prioridade]

  const abrirWhatsApp = () => {
    if (!rec.acao || !rec.mensagemWhatsApp) return
    const msg = encodeURIComponent(rec.mensagemWhatsApp)
    window.open(`${rec.acao}?text=${msg}`, '_blank')
  }

  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 space-y-3 ${colors.border}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${colors.icon}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{rec.titulo}</p>
            <p className="text-xs text-slate-400 mt-0.5">{rec.descricao}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-1 rounded-lg font-medium flex-shrink-0 ${colors.badge}`}>
          {rec.prioridade === 'alta' ? 'Urgente' : 'Recomendado'}
        </span>
      </div>

      {rec.valor !== undefined && (
        <div className="bg-slate-50 rounded-xl px-4 py-2">
          <p className="text-xs text-slate-400">Impacto estimado</p>
          <p className="text-sm font-semibold text-emerald-600">
            +{formatCurrency(rec.valor)}
          </p>
        </div>
      )}

      {rec.mensagemWhatsApp && (
        <div className="bg-green-50 rounded-xl px-4 py-3">
          <p className="text-xs text-slate-500 mb-1">Mensagem pronta</p>
          <p className="text-xs text-slate-600 leading-relaxed italic">
            "{rec.mensagemWhatsApp}"
          </p>
        </div>
      )}

      {rec.acao && rec.mensagemWhatsApp && (
        <button
          onClick={abrirWhatsApp}
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Enviar pelo WhatsApp
        </button>
      )}

      {rec.tipo === 'preco' && (
        <p className="text-xs text-slate-400 text-center">
          Revisar na aba Serviços
        </p>
      )}
    </div>
  )
}
