import { supabase } from '@/lib/supabase'
import { Vacina } from '@/types'

export const vacinasService = {
  async getAtrasadas(): Promise<Vacina[]> {
    const hoje = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('vacinas')
      .select(`*, animais (*, tutores (*))`)
      .lt('data_vencimento', hoje)
      .order('data_vencimento')

    if (error) throw error
    return data || []
  },

  async getProximasDoVencimento(dias = 7): Promise<Vacina[]> {
    const hoje = new Date().toISOString().split('T')[0]
    const futuro = new Date()
    futuro.setDate(futuro.getDate() + dias)
    const futuroDia = futuro.toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('vacinas')
      .select(`*, animais (*, tutores (*))`)
      .gte('data_vencimento', hoje)
      .lte('data_vencimento', futuroDia)
      .order('data_vencimento')

    if (error) throw error
    return data || []
  },

  async create(vacina: Omit<Vacina, 'id' | 'created_at'>): Promise<Vacina> {
    const { data, error } = await supabase
      .from('vacinas')
      .insert(vacina)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('vacinas').delete().eq('id', id)
    if (error) throw error
  },
}
