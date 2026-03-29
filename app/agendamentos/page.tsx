import Link from 'next/link'
import { Plus } from 'lucide-react'
import { agendamentosService } from '@/services/agendamentos'
import { AgendamentoStatusButton } from '@/components/agendamentos/AgendamentoStatusButton'
import { formatCurrency } from '@/lib/utils'
import { AgendamentoFiltros } from '@/components/agendamentos/AgendamentoFiltros'

export const dynamic = 'force-dynamic'

const statusStyle: Record<string, string> = {
  agendado:  'bg-blue-100 text-blue-700',
  concluido: 'bg-emerald-100 text-emerald-700',
  cancelado: 'bg-slate-100 text-slate-500',
}

const statusLabel: Record<string, string> = {
  agendado:  'Agendado',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
}

const PAGE_SIZE = 15

export default async function AgendamentosPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; filtro?: string }>
}) {
  const params = await searchParams
  const page   = parseInt(params.page  || '1')
  const filtro = (params.filtro || '') as 'hoje' | 'agendado' | 'concluido' | 'cancelado' | ''

  const { data: agendamentos, total } = await agendamentosService.getPaginated(
    page,
    PAGE_SIZE,
    filtro || undefined
  )

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Agendamentos</h1>
          <p className="text-sm text-slate-400 mt-1">{total} registros</p>
        </div>
        <Link
          href="/agendamentos/novo"
          className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Agendamento
        </Link>
      </div>

      {/* Filtros */}
      <AgendamentoFiltros filtroAtivo={filtro} />

      {/* Tabela */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-400 uppercase tracking-wide border-b border-slate-100">
                <th className="text-left px-6 py-3 font-medium">Tutor / Animal</th>
                <th className="text-left px-6 py-3 font-medium">Serviço</th>
                <th className="text-left px-6 py-3 font-medium">Data</th>
                <th className="text-left px-6 py-3 font-medium">Valor</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {agendamentos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                    Nenhum agendamento encontrado.
                  </td>
                </tr>
              ) : (
                agendamentos.map((ag) => (
                  <tr key={ag.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-800">
                        {(ag.tutores as { nome: string } | undefined)?.nome}
                      </p>
                      <p className="text-xs text-slate-400">
                        {(ag.animais as { nome: string } | undefined)?.nome}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {(ag.servicos as { nome: string } | undefined)?.nome}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(ag.data_agendamento).toLocaleString('pt-BR', {
                        day: '2-digit', month: '2-digit', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {ag.valor_cobrado ? formatCurrency(ag.valor_cobrado) : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded-lg font-medium ${statusStyle[ag.status]}`}>
                        {statusLabel[ag.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <AgendamentoStatusButton agendamento={ag} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Página {page} de {totalPages} · {total} registros
            </p>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/agendamentos?page=${p}${filtro ? `&filtro=${filtro}` : ''}`}
                  className={`w-8 h-8 rounded-lg text-xs font-medium flex items-center justify-center transition-colors ${
                    p === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}