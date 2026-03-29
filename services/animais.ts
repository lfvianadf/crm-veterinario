import { supabase } from '@/lib/supabase'
import { Animal } from '@/types'

export const animaisService = {
  async getAll(): Promise<Animal[]> {
    const { data, error } = await supabase
      .from('animais')
      .select(`*, tutores (*, plano_assinantes(*)), vacinas (*)`)
      .order('nome')

    if (error) throw error
    return data || []
  },

  async getById(id: string): Promise<Animal | null> {
    const { data, error } = await supabase
      .from('animais')
      .select(`*, tutores (*), vacinas (*), atendimentos (*, servicos (*))`)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(animal: Omit<Animal, 'id' | 'created_at'>): Promise<Animal> {
    const { data, error } = await supabase
      .from('animais')
      .insert(animal)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, animal: Partial<Animal>): Promise<Animal> {
    const { data, error } = await supabase
      .from('animais')
      .update(animal)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('animais').delete().eq('id', id)
    if (error) throw error
  },
}
