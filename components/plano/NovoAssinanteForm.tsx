'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { planoService } from '@/services/plano'
import { Tutor } from '@/types'
import { Button } from '@/components/ui/Button'

export function NovoAssinanteForm({ tutores }: { tutores: Tutor[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    tutor_id: '',
    data_inicio: new Date().toISOString().split('T')[0],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await planoService.create({
        tutor_id: form.tutor_id,
        ativo: true,
        data_inicio: form.data_inicio,
        valor_mensal: 120.00,
      })
      setForm({ tutor_id: '', data_inicio: new Date().toISOString().split('T')[0] })
      router.refresh()
    } catch (err) {
      console.error(err)
      alert('Erro ao salvar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4"
    >
      <div>
        <h2 className="font-semibold text-slate-700">Novo Assinante</h2>
        <p className="text-xs text-slate-400 mt-0.5">Plano de saúde preventiva · R$ 120,00/mês</p>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500 block mb-1.5">Tutor *</label>
        <select
          required
          value={form.tutor_id}
          onChange={(e) => setForm({ ...form, tutor_id: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
        >
          <option value="">Selecionar tutor...</option>
          {tutores.map((t) => (
            <option key={t.id} value={t.id}>
              {t.nome}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500 block mb-1.5">Data de início *</label>
        <input
          required
          type="date"
          value={form.data_inicio}
          onChange={(e) => setForm({ ...form, data_inicio: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Salvando...' : 'Adicionar Assinante'}
      </Button>
    </form>
  )
}