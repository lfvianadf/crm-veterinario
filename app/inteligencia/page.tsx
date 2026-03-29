import { inteligenciaService } from '@/services/inteligencia'
import { RecomendacaoCard } from '@/components/inteligencia/RecomendacaoCard'
import { MetaPlano } from '@/components/inteligencia/MetaPlano'
import { Lightbulb } from 'lucide-react'

export default async function InteligenciaPage() {
  const [recomendacoes, meta] = await Promise.all([
    inteligenciaService.getRecomendacoes(),
    inteligenciaService.getMetaPlano(),
  ])

  const urgentes = recomendacoes.filter((r) => r.prioridade === 'alta')
  const recomendadas = recomendacoes.filter((r) => r.prioridade === 'media')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Inteligência</h1>
        <p className="text-sm text-slate-400 mt-1">
          O que fazer hoje para a clínica faturar mais
        </p>
      </div>

      {/* Aviso do dia */}
      {recomendacoes.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-6 py-4 flex items-center gap-3">
          <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <p className="text-sm text-blue-700">
            <span className="font-semibold">
              {urgentes.length} ação urgente{urgentes.length !== 1 ? 's' : ''} hoje.
            </span>{' '}
            Se executadas, podem gerar até{' '}
            <span className="font-semibold">
              R${' '}
              {recomendacoes
                .reduce((s, r) => s + (r.valor || 0), 0)
                .toFixed(2)
                .replace('.', ',')}
            </span>{' '}
            em receita adicional.
          </p>
        </div>
      )}

      {/* Meta do plano */}
      <MetaPlano {...meta} />

      {/* Urgentes */}
      {urgentes.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
            Ações urgentes
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {urgentes.map((r, i) => (
              <RecomendacaoCard key={i} rec={r} />
            ))}
          </div>
        </div>
      )}

      {/* Recomendadas */}
      {recomendadas.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
            Recomendações
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recomendadas.map((r, i) => (
              <RecomendacaoCard key={i} rec={r} />
            ))}
          </div>
        </div>
      )}

      {recomendacoes.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-16 text-center">
          <p className="text-2xl mb-2">🎉</p>
          <p className="text-sm font-medium text-slate-700">Tudo em dia!</p>
          <p className="text-xs text-slate-400 mt-1">
            Nenhuma ação urgente no momento.
          </p>
        </div>
      )}
    </div>
  )
}
