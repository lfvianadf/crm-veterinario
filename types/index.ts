export interface Tutor {
  id: string
  nome: string
  telefone: string | null
  email: string | null
  created_at: string
  animais?: Animal[]
  plano_assinantes?: PlanoAssinante[]
}

export interface Animal {
  id: string
  tutor_id: string
  nome: string
  especie: string | null
  raca: string | null
  data_nascimento: string | null
  created_at: string
  tutores?: Tutor
  vacinas?: Vacina[]
  atendimentos?: Atendimento[]
}

export interface Servico {
  id: string
  nome: string
  preco: number
  descricao: string | null
  created_at: string
}

export interface Atendimento {
  id: string
  animal_id: string
  servico_id: string | null
  valor_cobrado: number | null
  data_atendimento: string
  observacoes: string | null
  created_at: string
  animais?: Animal
  servicos?: Servico
}

export interface Vacina {
  id: string
  animal_id: string
  nome: string
  data_aplicacao: string
  data_vencimento: string
  created_at: string
  animais?: Animal
}

export interface PlanoAssinante {
  id: string
  tutor_id: string
  ativo: boolean
  data_inicio: string
  valor_mensal: number | null
  created_at: string
  tutores?: Tutor
}

export interface DashboardStats {
  totalClientes: number
  assinantesAtivos: number
  vacinasAtrasadas: number
  clientesSumidos: number
  ticketMedio: number
  receitaMensal: number
  atendimentosMes: number
  custoPorCliente: number
}

export interface Agendamento {
  id: string
  tutor_id: string
  animal_id: string
  servico_id: string
  data_agendamento: string
  status: 'agendado' | 'concluido' | 'cancelado'
  observacoes: string | null
  valor_cobrado: number | null
  created_at: string
  tutores?: Tutor
  animais?: Animal
  servicos?: Servico
}
