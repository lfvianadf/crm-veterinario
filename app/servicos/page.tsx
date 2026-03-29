import { servicosService } from '@/services/servicos'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ServicoForm } from '@/components/ServicosForm'
import { ServicosActions } from '@/components/ServicosActions'


export default async function ServicosPage() {
  const servicos = await servicosService.getAll()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Serviços</h1>
        <p className="text-sm text-slate-400 mt-1">{servicos.length} serviços cadastrados</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-1">
          <ServicoForm />
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-700 text-sm">Serviços Cadastrados</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {servicos.length === 0 ? (
                <p className="px-6 py-12 text-sm text-slate-400 text-center">
                  Nenhum serviço cadastrado ainda.
                </p>
              ) : (
                servicos.map((s) => (
                  <div key={s.id} className="px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700">{s.nome}</p>
                      {s.descricao && (
                        <p className="text-xs text-slate-400 mt-0.5">{s.descricao}</p>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-blue-600 shrink-0">
                      {formatCurrency(s.preco)}
                    </span>
                    <ServicosActions servico={s} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
