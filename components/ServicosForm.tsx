'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { servicosService } from '@/services/servicos'
import { Button } from '@/components/ui/Button'

export function ServicoForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ nome: '', preco: '', descricao: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await servicosService.create({
        nome: form.nome,
        preco: parseFloat(form.preco),
        descricao: form.descricao || null,
      })
      setForm({ nome: '', preco: '', descricao: '' })
      router.refresh()
    } catch (err) {
      console.error(err)
      alert('Erro ao salvar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
      <h2 className="font-semibold text-slate-700">Novo Serviço</h2>

      <div>
        <label className="text-xs font-medium text-slate-500 block mb-1.5">Nome *</label>
        <input
          required
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
          placeholder="Ex: Consulta, Vacina, Banho..."
        />
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500 block mb-1.5">Preço (R$) *</label>
        <input
          required
          type="number"
          min="0"
          step="0.01"
          value={form.preco}
          onChange={(e) => setForm({ ...form, preco: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
          placeholder="0,00"
        />
      </div>

      <div>
        <label className="text-xs font-medium text-slate-500 block mb-1.5">Descrição</label>
        <textarea
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 resize-none"
          placeholder="Descrição opcional do serviço"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Salvando...' : 'Adicionar Serviço'}
      </Button>
    </form>
  )
}
