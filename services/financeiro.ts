import { supabase } from '@/lib/supabase'

type AtendimentoRow = {
  valor_cobrado: number | null
  data_atendimento: string
}

type AnimalRow = {
  atendimentos: AtendimentoRow[]
}

type TutorComAnimais = {
  id: string
  nome: string
  telefone: string | null
  animais: AnimalRow[]
}

type TutorSumido = {
  id: string
  animais: { atendimentos: { data_atendimento: string }[] }[]
}

export const financeiroService = {

  async getReceitaPorServico(): Promise<{ nome: string; total: number; quantidade: number }[]> {
    const { data, error } = await supabase
      .from('atendimentos')
      .select('valor_cobrado, servicos(nome)')
      .not('valor_cobrado', 'is', null)
      .limit(10000)

    if (error) throw error

    const grouped: Record<string, { total: number; quantidade: number }> = {}

    for (const a of data || []) {
      const nome = (a.servicos as unknown as { nome: string } | null)?.nome ?? 'Sem serviço'
      if (!grouped[nome]) grouped[nome] = { total: 0, quantidade: 0 }
      grouped[nome].total += (a.valor_cobrado ?? 0)
      grouped[nome].quantidade += 1
    }

    return Object.entries(grouped)
      .map(([nome, v]) => ({ nome, total: v.total, quantidade: v.quantidade }))
      .sort((a, b) => b.total - a.total)
  },

  async getReceitaMensalDetalhada(): Promise<
    { mes: string; avulso: number; recorrente: number; total: number }[]
  > {
    const [atend, planos] = await Promise.all([
      supabase
        .from('atendimentos')
        .select('valor_cobrado, data_atendimento')
        .not('valor_cobrado', 'is', null)
        .limit(10000),
      supabase
        .from('plano_assinantes')
        .select('valor_mensal')
        .eq('ativo', true),
    ])

    if (atend.error) throw atend.error
    if (planos.error) throw planos.error

    const mrr = (planos.data ?? []).reduce(
      (s, p) => s + (p.valor_mensal ?? 0),
      0
    )

    const byMonth: Record<string, number> = {}
    for (const a of atend.data ?? []) {
      const mes = a.data_atendimento.substring(0, 7)
      byMonth[mes] = (byMonth[mes] ?? 0) + (a.valor_cobrado ?? 0)
    }

    return Object.entries(byMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([mes, avulso]) => ({
        mes,
        avulso,
        recorrente: mrr,
        total: avulso + mrr,
      }))
  },

  async getLTVPorCliente(): Promise<
    {
      id: string
      nome: string
      telefone: string | null
      total: number
      visitas: number
      ultimaVisita: string | null
    }[]
  > {
    const { data, error } = await supabase
      .from('tutores')
      .select('id, nome, telefone, animais(atendimentos(valor_cobrado, data_atendimento))')
      .limit(500)

    if (error) throw error

    return (data as unknown as TutorComAnimais[])
      .map((t) => {
        const ats = t.animais.flatMap((a) => a.atendimentos ?? [])
        const total = ats.reduce((s, a) => s + (a.valor_cobrado ?? 0), 0)
        const datas = ats.map((a) => a.data_atendimento).sort()
        return {
          id: t.id,
          nome: t.nome,
          telefone: t.telefone,
          total,
          visitas: ats.length,
          ultimaVisita: datas[datas.length - 1] ?? null,
        }
      })
      .sort((a, b) => b.total - a.total)
  },

  async getReceitaPotencialPerdida(): Promise<{
    clientesSumidos: number
    ticketMedioGeral: number
    receitaSumidos: number
    vagasPlano: number
    receitaVagasPlano: number
    totalPotencial: number
  }> {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 60)

    const [tutores, planos, ticketData] = await Promise.all([
      supabase
        .from('tutores')
        .select('id, animais(atendimentos(data_atendimento))')
        .limit(500),
      supabase
        .from('plano_assinantes')
        .select('valor_mensal')
        .eq('ativo', true),
      supabase
        .from('atendimentos')
        .select('valor_cobrado')
        .not('valor_cobrado', 'is', null)
        .gt('valor_cobrado', 0)
        .limit(10000),
    ])

    if (tutores.error) throw tutores.error
    if (planos.error) throw planos.error
    if (ticketData.error) throw ticketData.error

    const sumidos = (tutores.data as unknown as TutorSumido[]).filter((t) => {
      const ats = t.animais.flatMap((a) => a.atendimentos ?? [])
      if (!ats.length) return true
      const ultima = [...ats.map((a) => a.data_atendimento)].sort().pop()!
      return new Date(ultima) < cutoff
    })

    const valores = (ticketData.data ?? []).map((a) => (a.valor_cobrado as number))
    const ticketMedioGeral =
      valores.length > 0
        ? valores.reduce((s, v) => s + v, 0) / valores.length
        : 65

    const mrr = (planos.data ?? []).reduce((s, p) => s + (p.valor_mensal ?? 0), 0)
    const assinantesAtuais = (planos.data ?? []).length
    const vagasPlano = Math.max(0, 25 - assinantesAtuais)
    const valorMedio = assinantesAtuais > 0 ? mrr / assinantesAtuais : 120

    const receitaSumidos = sumidos.length * ticketMedioGeral
    const receitaVagasPlano = vagasPlano * valorMedio

    return {
      clientesSumidos: sumidos.length,
      ticketMedioGeral,
      receitaSumidos,
      vagasPlano,
      receitaVagasPlano,
      totalPotencial: receitaSumidos + receitaVagasPlano,
    }
  },
}