import Link from 'next/link'
import { Plus, Search } from 'lucide-react'
import { tutoresService } from '@/services/tutores'
import { formatDate } from '@/lib/utils'

export default async function ClientesPage() {
  const tutores = await tutoresService.getAll()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Clientes</h1>
          <p className="text-sm text-slate-400 mt-1">{tutores.length} tutores cadastrados</p>
        </div>
        <Link
          href="/clientes/novo"
          className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Cliente
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-slate-400 uppercase tracking-wide border-b border-slate-50">
                <th className="text-left px-6 py-3 font-medium">Tutor</th>
                <th className="text-left px-6 py-3 font-medium">Telefone</th>
                <th className="text-left px-6 py-3 font-medium">Animais</th>
                <th className="text-left px-6 py-3 font-medium">Plano</th>
                <th className="text-left px-6 py-3 font-medium">Cadastrado em</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tutores.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-slate-400">
                    Nenhum cliente cadastrado ainda.
                  </td>
                </tr>
              ) : (
                tutores.map((tutor) => {
                  const planoAtivo = tutor.plano_assinantes?.some((p) => p.ativo)
                  return (
                    <tr key={tutor.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-slate-800">{tutor.nome}</p>
                          <p className="text-xs text-slate-400">{tutor.email || '—'}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{tutor.telefone || '—'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {tutor.animais?.length || 0} animal(is)
                      </td>
                      <td className="px-6 py-4">
                        {planoAtivo ? (
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg font-medium">
                            Ativo
                          </span>
                        ) : (
                          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">
                            Sem plano
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {formatDate(tutor.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/clientes/${tutor.id}`}
                          className="text-xs text-blue-500 hover:text-blue-600 font-medium"
                        >
                          Ver perfil →
                        </Link>
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
