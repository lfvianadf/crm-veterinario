import { animaisService } from '@/services/animais'
import { formatDate } from '@/lib/utils'
import { PawPrint, ShieldCheck, Syringe } from 'lucide-react'
import Link from 'next/link'

export default async function PetsPage() {
  const animais = await animaisService.getAll()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Pets</h1>
        <p className="text-sm text-slate-400 mt-1">{animais.length} animais cadastrados</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {animais.length === 0 ? (
          <p className="text-sm text-slate-400 col-span-full text-center py-12">
            Nenhum animal cadastrado ainda.
          </p>
        ) : (
          animais.map((animal) => {
            const vacinasAtrasadas =
              animal.vacinas?.filter(
                (v) => new Date(v.data_vencimento) < new Date()
              ) || []

            const tutor = animal.tutores as
              | { nome: string; telefone?: string; plano_assinantes?: { ativo: boolean }[] }
              | undefined

            const planoAtivo = tutor?.plano_assinantes?.some((p) => p.ativo)

            return (
              <Link
                key={animal.id}
                href={`/clientes/${animal.tutor_id}`}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:border-blue-200 hover:shadow-md transition-all block"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                      <PawPrint className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{animal.nome}</p>
                      <p className="text-xs text-slate-400">
                        {animal.especie}
                        {animal.raca ? ` · ${animal.raca}` : ''}
                      </p>
                    </div>
                  </div>
                  {vacinasAtrasadas.length > 0 && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-lg font-medium">
                      {vacinasAtrasadas.length} vacina(s) atrasada(s)
                    </span>
                  )}
                </div>

                {/* Tutor */}
                <div className="mb-3 pb-3 border-b border-slate-50">
                  <p className="text-xs text-slate-400 mb-0.5">Tutor</p>
                  <p className="text-sm text-slate-700 font-medium">{tutor?.nome || '—'}</p>
                  {tutor?.telefone && (
                    <p className="text-xs text-slate-400">{tutor.telefone}</p>
                  )}
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  {animal.data_nascimento && (
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">
                      Nasc. {formatDate(animal.data_nascimento)}
                    </span>
                  )}

                  {planoAtivo ? (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Plano ativo
                    </span>
                  ) : (
                    <span className="text-xs bg-slate-100 text-slate-400 px-2 py-1 rounded-lg">
                      Sem plano
                    </span>
                  )}

                  {vacinasAtrasadas.length === 0 && (animal.vacinas?.length ?? 0) > 0 && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg flex items-center gap-1">
                      <Syringe className="w-3 h-3" /> Vacinas em dia
                    </span>
                  )}

                  {(animal.vacinas?.length ?? 0) === 0 && (
                    <span className="text-xs bg-amber-100 text-amber-600 px-2 py-1 rounded-lg flex items-center gap-1">
                      <Syringe className="w-3 h-3" /> Sem vacinas
                    </span>
                  )}
                </div>
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
