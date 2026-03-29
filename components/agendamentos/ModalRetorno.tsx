'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { agendamentosService } from '@/services/agendamentos'
import { servicosService } from '@/services/servicos'
import { Agendamento, Servico } from '@/types'
import { X } from 'lucide-react'

interface Props {
  agendamento: Agendamento
  servicos: Servico[]
  onClose: () => void
}

export function ModalRetorno({ agendamento, servicos, onClose }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    servico_id: agendamento.servico_id,
    data_agendamento: '',
    valor_cobrado: String(
      servicos.find((s) => s.id === agendamento.servico_id)?.preco || ''
    ),
  })

  const handleServicoChange = (id: string) => {
    const svc = servicos.find((s) => s.id === id)
    setForm({ ...form, servico_id: id, valor_cobrado: String(svc?.preco || '') })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Conclui o agendamento atual
      await agendamentosService.updateStatus(agendamento.id, 'concluido')
      // Cria o retorno
      await agendamentosService.create({
        tutor_id: agendamento.tutor_id,
        animal_id: agendamento.animal_id,
        servico_id: form.servico_id,
        data_agendamento: form.data_agendamento,
        status: 'agendado',
        observacoes: 'Retorno agendado no ato da consulta',
        valor_cobrado: form.valor_cobrado ? parseFloat(form.valor_cobrado) : null,
      })
      router.refresh()
      onClose()
    } catch (err) {
      console.error(err)
      alert('Erro ao salvar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 bg-white'

  const tutor = agendamento.tutores as { nome: string } | undefined
  const animal = agendamento.animais as { nome: string } | undefined

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <p className="font-semibold text-slate-800">Agendar Retorno</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {tutor?.nome} · {animal?.nome}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1.5">
              Serviço *
            </label>
            <select
              required
              value={form.servico_id}
              onChange={(e) => handleServicoChange(e.target.value)}
              className={inputClass}
            >
              <option value="">Selecionar serviço...</option>
              {servicos.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome} — R$ {s.preco.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1.5">
              Data e hora *
            </label>
            <input
              required
              type="datetime-local"
              value={form.data_agendamento}
              onChange={(e) => setForm({ ...form, data_agendamento: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1.5">
              Valor (R$)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.valor_cobrado}
              onChange={(e) => setForm({ ...form, valor_cobrado: e.target.value })}
              className={inputClass}
              placeholder="Preenchido automaticamente"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Só concluir
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Concluir e agendar retorno'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}