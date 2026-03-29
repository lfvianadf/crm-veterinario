'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { agendamentosService } from '@/services/agendamentos'
import { animaisService } from '@/services/animais'
import { Tutor, Servico, Animal } from '@/types'
import { Button } from '@/components/ui/Button'

interface Props {
  tutores: Tutor[]
  servicos: Servico[]
}

export function NovoAgendamentoForm({ tutores, servicos }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [animais, setAnimais] = useState<Animal[]>([])
  const [form, setForm] = useState({
    tutor_id: '',
    animal_id: '',
    servico_id: '',
    data_agendamento: '',
    observacoes: '',
    valor_cobrado: '',
  })

  useEffect(() => {
    if (!form.tutor_id) {
      setAnimais([])
      setForm((f) => ({ ...f, animal_id: '' }))
      return
    }
    animaisService
      .getAll()
      .then((all) => setAnimais(all.filter((a) => a.tutor_id === form.tutor_id)))
  }, [form.tutor_id])

  // Auto-fill price from selected service
  useEffect(() => {
    if (!form.servico_id) return
    const svc = servicos.find((s) => s.id === form.servico_id)
    if (svc) setForm((f) => ({ ...f, valor_cobrado: String(svc.preco) }))
  }, [form.servico_id, servicos])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await agendamentosService.create({
        tutor_id: form.tutor_id,
        animal_id: form.animal_id,
        servico_id: form.servico_id,
        data_agendamento: form.data_agendamento,
        status: 'agendado',
        observacoes: form.observacoes || null,
        valor_cobrado: form.valor_cobrado ? parseFloat(form.valor_cobrado) : null,
      })
      router.push('/agendamentos')
      router.refresh()
    } catch (err) {
      console.error(err)
      alert('Erro ao salvar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 bg-white'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-slate-700">Dados do Agendamento</h2>

        {/* Tutor */}
        <div>
          <label className="text-xs font-medium text-slate-500 block mb-1.5">Tutor *</label>
          <select
            required
            value={form.tutor_id}
            onChange={(e) => setForm({ ...form, tutor_id: e.target.value, animal_id: '' })}
            className={inputClass}
          >
            <option value="">Selecionar tutor...</option>
            {tutores.map((t) => (
              <option key={t.id} value={t.id}>{t.nome}</option>
            ))}
          </select>
        </div>

        {/* Animal */}
        <div>
          <label className="text-xs font-medium text-slate-500 block mb-1.5">Animal *</label>
          <select
            required
            value={form.animal_id}
            onChange={(e) => setForm({ ...form, animal_id: e.target.value })}
            className={inputClass}
            disabled={!form.tutor_id}
          >
            <option value="">
              {form.tutor_id ? 'Selecionar animal...' : 'Selecione um tutor primeiro'}
            </option>
            {animais.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nome} {a.especie ? `(${a.especie})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Serviço */}
        <div>
          <label className="text-xs font-medium text-slate-500 block mb-1.5">Serviço *</label>
          <select
            required
            value={form.servico_id}
            onChange={(e) => setForm({ ...form, servico_id: e.target.value })}
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

        {/* Data */}
        <div className="grid grid-cols-2 gap-4">
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
              Valor cobrado (R$)
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
        </div>

        {/* Observações */}
        <div>
          <label className="text-xs font-medium text-slate-500 block mb-1.5">Observações</label>
          <textarea
            rows={3}
            value={form.observacoes}
            onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
            className={`${inputClass} resize-none`}
            placeholder="Informações adicionais sobre o atendimento..."
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Criar Agendamento'}
        </Button>
      </div>
    </form>
  )
}
