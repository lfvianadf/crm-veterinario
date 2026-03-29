'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { servicosService } from '@/services/servicos'
import { Servico } from '@/types'
import { Pencil, Trash2, X, Check } from 'lucide-react'

interface Props {
  servico: Servico
}

export function ServicosActions({ servico }: Props) {
  const router = useRouter()
  const [editando, setEditando] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    nome: servico.nome,
    preco: String(servico.preco),
    descricao: servico.descricao ?? '',
  })

  const inputClass =
    'px-2 py-1 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300'

  const salvar = async () => {
    setLoading(true)
    try {
      await servicosService.update(servico.id, {
        nome: form.nome,
        preco: parseFloat(form.preco),
        descricao: form.descricao || null,
      })
      setEditando(false)
      router.refresh()
    } catch {
      alert('Erro ao salvar.')
    } finally {
      setLoading(false)
    }
  }

  const excluir = async () => {
    setLoading(true)
    try {
      const temAgendamento = await servicosService.hasAgendamentos(servico.id)
      const temAtendimento = await servicosService.hasAtendimentos(servico.id)

      if (temAgendamento || temAtendimento) {
        alert(
          'Este serviço não pode ser excluído pois possui ' +
          (temAgendamento ? 'agendamentos' : 'atendimentos') +
          ' vinculados.'
        )
        return
      }

      if (!confirm(`Excluir "${servico.nome}"?`)) return

      await servicosService.delete(servico.id)
      router.refresh()
    } catch {
      alert('Erro ao excluir.')
    } finally {
      setLoading(false)
    }
  }

  if (editando) {
    return (
      <div className="flex items-center gap-2 flex-1">
        <input
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          className={`${inputClass} flex-1`}
          placeholder="Nome"
        />
        <input
          type="number"
          value={form.preco}
          onChange={(e) => setForm({ ...form, preco: e.target.value })}
          className={`${inputClass} w-24`}
          placeholder="Preço"
          min="0"
          step="0.01"
        />
        <input
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          className={`${inputClass} w-36`}
          placeholder="Descrição"
        />
        <button
          onClick={salvar}
          disabled={loading}
          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={() => setEditando(false)}
          className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setEditando(true)}
        className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={excluir}
        disabled={loading}
        className="p-1.5 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition-colors disabled:opacity-50"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}