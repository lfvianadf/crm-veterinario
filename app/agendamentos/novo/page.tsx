import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { tutoresService } from '@/services/tutores'
import { servicosService } from '@/services/servicos'
import { NovoAgendamentoForm } from '@/components/agendamentos/NovoAgendamentoForm'

export default async function NovoAgendamentoPage() {
  const [tutores, servicos] = await Promise.all([
    tutoresService.getAll(),
    servicosService.getAll(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/agendamentos"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 mb-3 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Voltar para agendamentos
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Novo Agendamento</h1>
        <p className="text-sm text-slate-400 mt-1">
          Vincule um tutor, animal e serviço a uma data
        </p>
      </div>
      <NovoAgendamentoForm tutores={tutores} servicos={servicos} />
    </div>
  )
}
