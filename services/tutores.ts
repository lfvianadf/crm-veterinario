import { supabase } from '@/lib/supabase'
import { Tutor } from '@/types'

export const tutoresService = {
  async getAll(): Promise<Tutor[]> {
    const { data, error } = await supabase
      .from('tutores')
      .select(`
        *,
        animais (*),
        plano_assinantes (*)
      `)
      .order('nome')

    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Tutor | null> {
    const { data, error } = await supabase
      .from('tutores')
      .select(`
        *,
        animais (
          *,
          vacinas (*),
          atendimentos (
            *,
            servicos (*)
          )
        ),
        plano_assinantes (*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(tutor: Omit<Tutor, 'id' | 'created_at'>): Promise<Tutor> {
    const { data, error } = await supabase
      .from('tutores')
      .insert(tutor)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, tutor: Partial<Tutor>): Promise<Tutor> {
    const { data, error } = await supabase
      .from('tutores')
      .update(tutor)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('tutores')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async getSumidos(dias = 60): Promise<Tutor[]> {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - dias)

    const { data, error } = await supabase
      .from('tutores')
      .select(`
        *,
        animais (
          atendimentos (data_atendimento)
        )
      `)

    if (error) throw error

    return (data || []).filter((tutor) => {
      const atendimentos = tutor.animais?.flatMap(
        (a: { atendimentos: { data_atendimento: string }[] }) => a.atendimentos || []
      ) || []

      if (atendimentos.length === 0) return true

      const ultimo = atendimentos.reduce(
        (max: string, a: { data_atendimento: string }) =>
          a.data_atendimento > max ? a.data_atendimento : max,
        atendimentos[0].data_atendimento
      )

      return new Date(ultimo) < cutoff
    })
  },
}
