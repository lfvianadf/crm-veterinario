import { NovoClienteForm } from '@/components/clientes/NovoClienteForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function NovoClientePage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/clientes"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 mb-3 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Voltar para clientes
        </Link>
        <h1 className="text-2xl font-bold text-slate-800">Novo Cliente</h1>
        <p className="text-sm text-slate-400 mt-1">Cadastre o tutor e seus animais</p>
      </div>
      <NovoClienteForm />
    </div>
  )
}
