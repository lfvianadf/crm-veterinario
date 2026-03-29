import { supabase } from '@/lib/supabase'

export type Recomendacao = {
  tipo: 'reativacao' | 'vacina' | 'plano' | 'preco'
  prioridade: 'alta' | 'media'
  titulo: string
  descricao: string
  acao: string
  mensagemWhatsApp?: string
  valor?: number
}

export const inteligenciaService = {
  async getRecomendacoes(): Promise<Recomendacao[]> {
    const recomendacoes: Recomendacao[] = []
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 60)
    const hoje = new Date().toISOString().split('T')[0]

    const [tutores, vacinas, planos, servicos] = await Promise.all([
      supabase.from('tutores').select(`
        id, nome, telefone,
        animais(
          nome,
          atendimentos(valor_cobrado, data_atendimento),
          vacinas(data_vencimento)
        ),
        plano_assinantes(ativo)
      `),
      supabase.from('vacinas').select(`
        nome, data_vencimento,
        animais(nome, tutores(nome, telefone))
      `).lt('data_vencimento', hoje).limit(10),
      supabase.from('plano_assinantes').select('ativo').eq('ativo', true),
      supabase.from('servicos').select('nome, preco'),
    ])

    if (tutores.error || vacinas.error || planos.error) return []

    // 1. Reativação: clientes sumidos com LTV alto
    const sumidosLTV = (tutores.data || [])
      .map((t) => {
        const ats = (t.animais as {
          nome: string
          atendimentos: { valor_cobrado: number; data_atendimento: string }[]
        }[])?.flatMap((a) => a.atendimentos || []) || []

        if (!ats.length) return null
        const ultima = ats.map((a) => a.data_atendimento).sort().pop()!
        if (new Date(ultima) >= cutoff) return null

        const ltv = ats.reduce((s, a) => s + (a.valor_cobrado || 0), 0)
        const nomeAnimal = (t.animais as { nome: string }[])?.[0]?.nome || 'seu pet'
        return { nome: t.nome, telefone: t.telefone, ltv, nomeAnimal }
      })
      .filter(Boolean)
      .sort((a, b) => b!.ltv - a!.ltv)
      .slice(0, 3) as { nome: string; telefone: string | null; ltv: number; nomeAnimal: string }[]

    for (const c of sumidosLTV) {
      recomendacoes.push({
        tipo: 'reativacao',
        prioridade: c.ltv > 200 ? 'alta' : 'media',
        titulo: `Reativar ${c.nome}`,
        descricao: `LTV de R$ ${c.ltv.toFixed(2)} — sem visita há mais de 60 dias`,
        acao: c.telefone ? `https://wa.me/55${c.telefone.replace(/\D/g, '')}` : '',
        mensagemWhatsApp: `Oi ${c.nome.split(' ')[0]}! Tudo bem com o ${c.nomeAnimal}? Faz um tempo que não te vemos por aqui. Que tal agendar uma revisãozinha? Temos horários disponíveis essa semana 🐾`,
        valor: c.ltv,
      })
    }

    // 2. Vacinas atrasadas
    for (const v of (vacinas.data || []).slice(0, 3)) {
      const animal = v.animais as unknown as { nome: string; tutores: { nome: string; telefone: string } | null } | null
      const tutor = animal?.tutores
      recomendacoes.push({
        tipo: 'vacina',
        prioridade: 'alta',
        titulo: `Vacina atrasada — ${animal?.nome}`,
        descricao: `${v.nome} venceu em ${new Date(v.data_vencimento).toLocaleDateString('pt-BR')}`,
        acao: tutor?.telefone ? `https://wa.me/55${tutor.telefone.replace(/\D/g, '')}` : '',
        mensagemWhatsApp: `Oi ${tutor?.nome?.split(' ')[0] || ''}! Passando para avisar que a vacina ${v.nome} do ${animal?.nome} está em atraso. Podemos agendar rapidinho? 💉`,
        valor: 60,
      })
    }

    // 3. Plano: frequentes sem assinatura
    const semPlano = (tutores.data || []).filter((t) => {
      const temPlano = (t.plano_assinantes as { ativo: boolean }[])?.some((p) => p.ativo)
      if (temPlano) return false
      const ats = (t.animais as { atendimentos: { data_atendimento: string }[] }[])
        ?.flatMap((a) => a.atendimentos || []) || []
      return ats.length >= 3
    }).slice(0, 2)

    for (const t of semPlano) {
      const ats = (t.animais as { atendimentos: { data_atendimento: string }[] }[])
        ?.flatMap((a) => a.atendimentos || []) || []
      recomendacoes.push({
        tipo: 'plano',
        prioridade: 'media',
        titulo: `Oferecer plano para ${t.nome}`,
        descricao: `${ats.length} atendimentos registrados — perfil ideal para o plano mensal`,
        acao: t.telefone ? `https://wa.me/55${(t.telefone as string).replace(/\D/g, '')}` : '',
        mensagemWhatsApp: `Oi ${t.nome.split(' ')[0]}! Como cliente frequente, você pode economizar bastante com nosso plano mensal por R$ 99/mês. Inclui consulta + vermífugo + desconto em exames. Quer saber mais? 🐶`,
        valor: 99,
      })
    }

    // 4. Preço: serviço com ticket abaixo da média
    const svcs = servicos.data || []
    if (svcs.length > 1) {
      const media = svcs.reduce((s, sv) => s + sv.preco, 0) / svcs.length
      const abaixo = svcs.filter((sv) => sv.preco < media * 0.5)
      for (const sv of abaixo.slice(0, 1)) {
        recomendacoes.push({
          tipo: 'preco',
          prioridade: 'media',
          titulo: `Revisar preço: ${sv.nome}`,
          descricao: `R$ ${sv.preco.toFixed(2)} — abaixo de 50% da média dos serviços (R$ ${media.toFixed(2)})`,
          acao: '',
          valor: media - sv.preco,
        })
      }
    }

    return recomendacoes.sort((a, b) =>
      a.prioridade === 'alta' && b.prioridade !== 'alta' ? -1 : 1
    )
  },

  async getMetaPlano(): Promise<{
    atual: number
    metaAluguel: number
    metaSalarios: number
    mrr: number
    valorMedio: number
  }> {
    const { data } = await supabase
      .from('plano_assinantes')
      .select('valor_mensal')
      .eq('ativo', true)

    const atual = (data || []).length
    const mrr = (data || []).reduce((s, p) => s + (p.valor_mensal || 0), 0)
    const valorMedio = atual ? mrr / atual : 99

    return {
      atual,
      metaAluguel: Math.ceil(1500 / valorMedio),
      metaSalarios: Math.ceil(4000 / valorMedio),
      mrr,
      valorMedio,
    }
  },
}
