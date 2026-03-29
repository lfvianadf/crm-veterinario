import { supabase } from '@/lib/supabase'
import { Agendamento } from '@/types'

export const agendamentosService = {
  async getAll(): Promise<Agendamento[]> {
    const { data, error } = await supabase
      .from('agendamentos')
      .select(`*, tutores(*), animais(*), servicos(*)`)
      .order('data_agendamento', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getPaginated(
  page: number,
  pageSize: number,
  filtro?: 'hoje' | 'agendado' | 'concluido' | 'cancelado'
): Promise<{ data: Agendamento[]; total: number }> {
  let query = supabase
    .from('agendamentos')
    .select(`*, tutores(*), animais(*), servicos(*)`, { count: 'exact' })

  if (filtro === 'hoje') {
    const hoje = new Date()
    const inicio = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`
    const fim = new Date(hoje)
    fim.setDate(fim.getDate() + 1)
    const fimStr = `${fim.getFullYear()}-${String(fim.getMonth() + 1).padStart(2, '0')}-${String(fim.getDate()).padStart(2, '0')}`
    query = query.gte('data_agendamento', inicio).lt('data_agendamento', fimStr)
  } else if (filtro) {
    query = query.eq('status', filtro)
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await query
    .order('data_agendamento', { ascending: false })
    .range(from, to)

  if (error) throw error
  return { data: data || [], total: count || 0 }
},

  async getByStatus(status: Agendamento['status']): Promise<Agendamento[]> {
    const { data, error } = await supabase
      .from('agendamentos')
      .select(`*, tutores(*), animais(*), servicos(*)`)
      .eq('status', status)
      .order('data_agendamento', { ascending: true })

    if (error) throw error
    return data || []
  },

  async create(
    ag: Omit<Agendamento, 'id' | 'created_at'>
  ): Promise<Agendamento> {
    const { data, error } = await supabase
      .from('agendamentos')
      .insert(ag)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateStatus(
    id: string,
    status: Agendamento['status'],
    valor_cobrado?: number
  ): Promise<void> {
    const { error } = await supabase
      .from('agendamentos')
      .update({ status, ...(valor_cobrado !== undefined ? { valor_cobrado } : {}) })
      .eq('id', id)

    if (error) throw error
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('agendamentos')
      .delete()
      .eq('id', id)

    if (error) throw error
  },
}
