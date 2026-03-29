import { supabase } from '@/lib/supabase'
import { PlanoAssinante } from '@/types'

export const planoService = {
  async getAtivos(): Promise<PlanoAssinante[]> {
    const { data, error } = await supabase
      .from('plano_assinantes')
      .select(`*, tutores (*)`)
      .eq('ativo', true)
      .order('data_inicio', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getAll(): Promise<PlanoAssinante[]> {
    const { data, error } = await supabase
      .from('plano_assinantes')
      .select(`*, tutores (*)`)
      .order('data_inicio', { ascending: false })

    if (error) throw error
    return data || []
  },

  async create(plano: Omit<PlanoAssinante, 'id' | 'created_at'>): Promise<PlanoAssinante> {
    const { data, error } = await supabase
      .from('plano_assinantes')
      .insert(plano)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async toggle(id: string, ativo: boolean): Promise<void> {
    const { error } = await supabase
      .from('plano_assinantes')
      .update({ ativo })
      .eq('id', id)

    if (error) throw error
  },

  async getMRR(): Promise<number> {
    const { data, error } = await supabase
      .from('plano_assinantes')
      .select('valor_mensal')
      .eq('ativo', true)

    if (error) throw error

    return (data || []).reduce((sum, p) => sum + (p.valor_mensal || 0), 0)
  },
}
