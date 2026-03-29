import { tutoresService } from '@/services/tutores'
import { formatDate, formatCurrency } from '@/lib/utils'
import { ChevronLeft, Phone, Mail, PawPrint, Syringe, Receipt } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ClientePerfilPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const tutor = await tutoresService.getById(params.id).catch(() => null)
  if (!tutor) notFound()

  const planoAtivo = tutor.plano_assinantes?.some((p) => p.ativo)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/clientes"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 mb-3 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Voltar para clientes
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{tutor.nome}</h1>
            <div className="flex items-center gap-4 mt-2">
              {tutor.telefone && (
                <span className="flex items-center gap-1 text-sm text-slate-400">
                  <Phone className="w-3.5 h-3.5" /> {tutor.telefone}
                </span>
              )}
              {tutor.email && (
                <span className="flex items-center gap-1 text-sm text-slate-400">
                  <Mail className="w-3.5 h-3.5" /> {tutor.email}
                </span>
              )}
            </div>
          </div>
          {planoAtivo ? (
            <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-xl font-medium">
              ✓ Plano Ativo
            </span>
          ) : (
            <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1.5 rounded-xl">
              Sem plano
            </span>
          )}
        </div>
      </div>

      {/* Animais */}
      <div className="space-y-4">
        {tutor.animais?.map((animal) => (
          <div key={animal.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                <PawPrint className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-slate-700">{animal.nome}</p>
                <p className="text-xs text-slate-400">
                  {animal.especie} {animal.raca ? `· ${animal.raca}` : ''}{' '}
                  {animal.data_nascimento ? `· Nasc. ${formatDate(animal.data_nascimento)}` : ''}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-50">
              {/* Vacinas */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Syringe className="w-4 h-4 text-slate-400" />
                  <h3 className="text-sm font-semibold text-slate-600">Vacinas</h3>
                </div>
                {animal.vacinas && animal.vacinas.length > 0 ? (
                  <div className="space-y-2">
                    {animal.vacinas.map((v) => {
                      const atrasada = new Date(v.data_vencimento) < new Date()
                      return (
                        <div key={v.id} className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">{v.nome}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-lg font-medium ${
                            atrasada
                              ? 'bg-red-100 text-red-600'
                              : 'bg-emerald-100 text-emerald-600'
                          }`}>
                            {atrasada ? 'Atrasada' : formatDate(v.data_vencimento)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">Nenhuma vacina registrada</p>
                )}
              </div>

              {/* Atendimentos */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Receipt className="w-4 h-4 text-slate-400" />
                  <h3 className="text-sm font-semibold text-slate-600">Últimos Atendimentos</h3>
                </div>
                {animal.atendimentos && animal.atendimentos.length > 0 ? (
                  <div className="space-y-2">
                    {animal.atendimentos.slice(0, 5).map((a) => (
                      <div key={a.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-slate-600">
                            {(a.servicos as { nome: string } | undefined)?.nome || 'Consulta'}
                          </p>
                          <p className="text-xs text-slate-400">{formatDate(a.data_atendimento)}</p>
                        </div>
                        {a.valor_cobrado && (
                          <span className="text-sm font-medium text-slate-700">
                            {formatCurrency(a.valor_cobrado)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">Nenhum atendimento registrado</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
