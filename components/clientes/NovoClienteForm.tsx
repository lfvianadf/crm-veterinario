'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { tutoresService } from '@/services/tutores'
import { animaisService } from '@/services/animais'
import { Button } from '@/components/ui/Button'
import { PlusCircle, Trash2 } from 'lucide-react'

interface AnimalForm {
  nome: string
  especie: string
  raca: string
  data_nascimento: string
}

export function NovoClienteForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [tutor, setTutor] = useState({ nome: '', telefone: '', email: '' })
  const [animais, setAnimais] = useState<AnimalForm[]>([
    { nome: '', especie: '', raca: '', data_nascimento: '' },
  ])

  const addAnimal = () =>
    setAnimais([...animais, { nome: '', especie: '', raca: '', data_nascimento: '' }])

  const removeAnimal = (i: number) => setAnimais(animais.filter((_, idx) => idx !== i))

  const updateAnimal = (i: number, field: keyof AnimalForm, value: string) => {
    const updated = [...animais]
    updated[i][field] = value
    setAnimais(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const novoTutor = await tutoresService.create(tutor)
      await Promise.all(
        animais
          .filter((a) => a.nome.trim())
          .map((a) => animaisService.create({ ...a, tutor_id: novoTutor.id }))
      )
      router.push('/clientes')
      router.refresh()
    } catch (err) {
      console.error(err)
      alert('Erro ao salvar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dados do tutor */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-slate-700">Dados do Tutor</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-slate-500 block mb-1.5">Nome *</label>
            <input
              required
              value={tutor.nome}
              onChange={(e) => setTutor({ ...tutor, nome: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
              placeholder="Nome completo"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1.5">Telefone</label>
            <input
              value={tutor.telefone}
              onChange={(e) => setTutor({ ...tutor, telefone: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
              placeholder="(84) 99999-9999"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 block mb-1.5">E-mail</label>
            <input
              type="email"
              value={tutor.email}
              onChange={(e) => setTutor({ ...tutor, email: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
              placeholder="email@exemplo.com"
            />
          </div>
        </div>
      </div>

      {/* Animais */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-700">Animais</h2>
          <Button type="button" variant="secondary" size="sm" onClick={addAnimal}>
            <PlusCircle className="w-4 h-4" /> Adicionar animal
          </Button>
        </div>

        {animais.map((animal, i) => (
          <div key={i} className="border border-slate-100 rounded-xl p-4 space-y-3 relative">
            {animais.length > 1 && (
              <button
                type="button"
                onClick={() => removeAnimal(i)}
                className="absolute top-3 right-3 text-slate-300 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <p className="text-xs font-medium text-slate-400">Animal {i + 1}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-slate-500 block mb-1">Nome *</label>
                <input
                  value={animal.nome}
                  onChange={(e) => updateAnimal(i, 'nome', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                  placeholder="Rex"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Espécie</label>
                <select
                  value={animal.especie}
                  onChange={(e) => updateAnimal(i, 'especie', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                >
                  <option value="">Selecionar</option>
                  <option value="Cão">Cão</option>
                  <option value="Gato">Gato</option>
                  <option value="Ave">Ave</option>
                  <option value="Roedor">Roedor</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Raça</label>
                <input
                  value={animal.raca}
                  onChange={(e) => updateAnimal(i, 'raca', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                  placeholder="Labrador"
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 block mb-1">Nascimento</label>
                <input
                  type="date"
                  value={animal.data_nascimento}
                  onChange={(e) => updateAnimal(i, 'data_nascimento', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Cliente'}
        </Button>
      </div>
    </form>
  )
}
