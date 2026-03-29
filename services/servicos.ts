import { supabase } from '@/lib/supabase'
import { Servico } from '@/types'

export const servicosService = {
  async getAll(): Promise<Servico[]> {
    const { data, error } = await supabase
      .from('servicos')
      .select('*')
      .order('nome')

    if (error) throw error
    return data || []
  },

  async hasAgendamentos(id: string): Promise<boolean> {
  const { count, error } = await supabase
    .from('agendamentos')
    .select('*', { count: 'exact', head: true })
    .eq('servico_id', id)

  if (error) throw error
  return (count ?? 0) > 0
},

async hasAtendimentos(id: string): Promise<boolean> {
  const { count, error } = await supabase
    .from('atendimentos')
    .select('*', { count: 'exact', head: true })
    .eq('servico_id', id)

  if (error) throw error
  return (count ?? 0) > 0
},

  async create(servico: Omit<Servico, 'id' | 'created_at'>): Promise<Servico> {
    const { data, error } = await supabase
      .from('servicos')
      .insert(servico)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, servico: Partial<Servico>): Promise<Servico> {
    const { data, error } = await supabase
      .from('servicos')
      .update(servico)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('servicos').delete().eq('id', id)
    if (error) throw error
  },
}
