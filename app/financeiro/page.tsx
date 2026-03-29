import { financeiroService } from '@/services/financeiro'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ReceitaChart } from '@/components/financeiro/ReceitaChart'
import { ServicoBarChart } from '@/components/financeiro/ServicoBarChart'
import { TrendingUp, DollarSign, Users, AlertCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function FinanceiroPage() {
  const [porServico, mensal, ltv, potencial] = await Promise.all([
    financeiroService.getReceitaPorServico(),
    financeiroService.getReceitaMensalDetalhada(),
    financeiroService.getLTVPorCliente(),
    financeiroService.getReceitaPotencialPerdida(),
  ])

  const totalGerado = porServico.reduce((s, v) => s + v.total, 0)
  const receitaUltimoMes = mensal[mensal.length - 1]?.total ?? 0
  const top = ltv.slice(0, 10)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Inteligência Financeira</h1>
        <p className="text-sm text-slate-400 mt-1">Onde está o dinheiro e como fazer crescer</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
            <DollarSign className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalGerado)}</p>
          <p className="text-xs text-slate-400 mt-0.5">Receita total gerada</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800">
            {formatCurrency(receitaUltimoMes)}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">Receita último mês</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center mb-3">
            <Users className="w-4 h-4 text-violet-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800">
            {formatCurrency(ltv[0]?.total ?? 0)}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">Maior LTV individual</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center mb-3">
            <AlertCircle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-slate-800">
            {formatCurrency(potencial.totalPotencial)}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">Receita potencial perdida</p>
        </div>
      </div>

      {/* Gráfico receita avulso vs recorrente */}
      <ReceitaChart data={mensal} />

      {/* Receita por serviço */}
      <ServicoBarChart data={porServico} />

      {/* Receita potencial perdida */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-700">Receita Potencial Perdida</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Estimativa conservadora — sem dados históricos de vacinas ainda
          </p>
        </div>
        <div className="divide-y divide-slate-50">

          {/* Clientes sumidos */}
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">
                {potencial.clientesSumidos} clientes sumidos
              </p>
              <p className="text-xs text-slate-400">
                Estimativa: {potencial.clientesSumidos} × ticket médio{' '}
                {formatCurrency(potencial.ticketMedioGeral)}
              </p>
            </div>
            <span className="text-sm font-semibold text-red-500">
              −{formatCurrency(potencial.receitaSumidos)}/mês
            </span>
          </div>

          {/* Vagas do plano */}
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-700">
                {potencial.vagasPlano} vagas no plano mensal
              </p>
              <p className="text-xs text-slate-400">
                Meta de 25 assinantes — faltam {potencial.vagasPlano}
              </p>
            </div>
            <span className="text-sm font-semibold text-red-500">
              −{formatCurrency(potencial.receitaVagasPlano)}/mês
            </span>
          </div>

          {/* Total */}
          <div className="px-6 py-4 flex items-center justify-between bg-red-50">
            <div>
              <p className="text-sm font-semibold text-red-700">Total estimado perdido</p>
              <p className="text-xs text-red-400">
                Vacinas não incluídas — dado disponível após 30 dias de uso
              </p>
            </div>
            <span className="text-base font-bold text-red-600">
              {formatCurrency(potencial.totalPotencial)}/mês
            </span>
          </div>
        </div>
      </div>

      {/* Top 10 LTV */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-700">Top 10 Clientes por LTV</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quanto cada tutor gerou de receita no total
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-400 uppercase tracking-wide border-b border-slate-50">
                <th className="text-left px-6 py-3 font-medium">#</th>
                <th className="text-left px-6 py-3 font-medium">Tutor</th>
                <th className="text-left px-6 py-3 font-medium">Visitas</th>
                <th className="text-left px-6 py-3 font-medium">Última visita</th>
                <th className="text-left px-6 py-3 font-medium">LTV total</th>
                <th className="text-left px-6 py-3 font-medium">Ticket médio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {top.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                    Nenhum dado disponível ainda.
                  </td>
                </tr>
              ) : (
                top.map((c, i) => {
                  const diasSemVisita = c.ultimaVisita
                    ? Math.floor(
                        (Date.now() - new Date(c.ultimaVisita).getTime()) / 86400000
                      )
                    : 999
                  const emRisco = diasSemVisita > 60

                  return (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3 text-sm text-slate-400">{i + 1}</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-slate-700">{c.nome}</p>
                          {emRisco && (
                            <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-medium">
                              em risco
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-600">{c.visitas}</td>
                      <td className="px-6 py-3 text-sm text-slate-400">
                        {c.ultimaVisita ? formatDate(c.ultimaVisita) : '—'}
                      </td>
                      <td className="px-6 py-3 text-sm font-semibold text-slate-800">
                        {formatCurrency(c.total)}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-600">
                        {c.visitas > 0 ? formatCurrency(c.total / c.visitas) : '—'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}