import { planoService } from '@/services/plano'
import { tutoresService } from '@/services/tutores'
import { formatCurrency, formatDate } from '@/lib/utils'
import { PlanoActions } from '@/components/plano/PlanoActions'
import { NovoAssinanteForm } from '@/components/plano/NovoAssinanteForm'
import { ShieldCheck, TrendingUp } from 'lucide-react'

export default async function PlanoPage() {
  const [assinantes, tutores] = await Promise.all([
    planoService.getAll(),
    tutoresService.getAll(),
  ])

  const ativos = assinantes.filter((a) => a.ativo)
  const mrr = ativos.reduce((sum, a) => sum + (a.valor_mensal || 0), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Plano Mensal</h1>
        <p className="text-sm text-slate-400 mt-1">Gerencie os assinantes do plano de saúde preventiva</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{ativos.length}</p>
            <p className="text-sm text-slate-400">Assinantes ativos</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(mrr)}</p>
            <p className="text-sm text-slate-400">Receita recorrente mensal</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Novo assinante */}
        <div className="lg:col-span-1">
          <NovoAssinanteForm tutores={tutores} />
        </div>

        {/* Lista */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-700 text-sm">Todos os Assinantes</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {assinantes.length === 0 ? (
              <p className="px-6 py-12 text-sm text-slate-400 text-center">
                Nenhum assinante cadastrado ainda.
              </p>
            ) : (
              assinantes.map((a) => (
                <div key={a.id} className="px-6 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      {(a.tutores as { nome: string } | undefined)?.nome}
                    </p>
                    <p className="text-xs text-slate-400">
                      Desde {formatDate(a.data_inicio)} ·{' '}
                      {a.valor_mensal ? formatCurrency(a.valor_mensal) + '/mês' : 'Valor não definido'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-lg font-medium ${
                        a.ativo
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {a.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                    <PlanoActions id={a.id} ativo={a.ativo} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
