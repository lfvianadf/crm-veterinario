import { supabase } from '@/lib/supabase'
import { Atendimento } from '@/types'

const getMesAtual = () => {
  const d = new Date()
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d
}

const getMesFim = () => {
  const d = new Date()
  d.setMonth(d.getMonth() + 1)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d
}

const getMesAnteriorInicio = () => {
  const d = new Date()
  d.setMonth(d.getMonth() - 1)
  d.setDate(1)
  d.setHours(0, 0, 0, 0)
  return d
}

export const atendimentosService = {
  async getAll(): Promise<Atendimento[]> {
    const { data, error } = await supabase
      .from('atendimentos')
      .select(`*, animais (*, tutores (*)), servicos (*)`)
      .order('data_atendimento', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getByAnimal(animalId: string): Promise<Atendimento[]> {
    const { data, error } = await supabase
      .from('atendimentos')
      .select(`*, servicos (*)`)
      .eq('animal_id', animalId)
      .order('data_atendimento', { ascending: false })

    if (error) throw error
    return data || []
  },

  async create(atendimento: Omit<Atendimento, 'id' | 'created_at'>): Promise<Atendimento> {
    const { data, error } = await supabase
      .from('atendimentos')
      .insert(atendimento)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getAtendimentosMes(): Promise<number> {
    const { count, error } = await supabase
      .from('atendimentos')
      .select('*', { count: 'exact', head: true })
      .gte('data_atendimento', getMesAtual().toISOString())
      .lt('data_atendimento', getMesFim().toISOString())

    if (error) throw error
    return count || 0
  },

  async getReceitaMesAtual(): Promise<number> {
    const { data, error } = await supabase
      .from('atendimentos')
      .select('valor_cobrado')
      .gte('data_atendimento', getMesAtual().toISOString())
      .lt('data_atendimento', getMesFim().toISOString())
      .not('valor_cobrado', 'is', null)

    if (error) throw error
    return (data || []).reduce((s, a) => s + (a.valor_cobrado || 0), 0)
  },

  async getTicketMedio(): Promise<number> {
    const { data, error } = await supabase
      .from('atendimentos')
      .select('valor_cobrado')
      .gte('data_atendimento', getMesAtual().toISOString())
      .lt('data_atendimento', getMesFim().toISOString())
      .not('valor_cobrado', 'is', null)

    if (error) throw error
    const valores = (data || []).map((a) => a.valor_cobrado || 0)
    if (!valores.length) return 0
    return valores.reduce((s, v) => s + v, 0) / valores.length
  },

  async getResumoMesAnterior(): Promise<{
    atendimentos: number
    receita: number
    ticketMedio: number
  }> {
    const { data, error } = await supabase
      .from('atendimentos')
      .select('valor_cobrado')
      .gte('data_atendimento', getMesAnteriorInicio().toISOString())
      .lt('data_atendimento', getMesAtual().toISOString())
      .not('valor_cobrado', 'is', null)

    if (error) throw error

    const valores = (data || []).map((a) => a.valor_cobrado || 0)
    const receita = valores.reduce((s, v) => s + v, 0)
    const atendimentos = valores.length
    const ticketMedio = atendimentos ? receita / atendimentos : 0

    return { atendimentos, receita, ticketMedio }
  },

  async getReceitaMensal(): Promise<{ mes: string; receita: number }[]> {
    const inicio = new Date()
    inicio.setMonth(inicio.getMonth() - 5)
    inicio.setDate(1)
    inicio.setHours(0, 0, 0, 0)

    const { data, error } = await supabase
      .from('atendimentos')
      .select('data_atendimento, valor_cobrado')
      .gte('data_atendimento', inicio.toISOString())
      .order('data_atendimento')

    if (error) throw error

    const byMonth: Record<string, number> = {}
    ;(data || []).forEach((a) => {
      const mes = a.data_atendimento.substring(0, 7)
      byMonth[mes] = (byMonth[mes] || 0) + (a.valor_cobrado || 0)
    })

    return Object.entries(byMonth).map(([mes, receita]) => ({ mes, receita }))
  },
}