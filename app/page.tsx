import {
  Users, ShieldCheck, Syringe, UserX,
  TrendingUp, CalendarDays, ArrowUp, ArrowDown, Minus,
} from 'lucide-react'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { MesSelector } from '@/components/dashboard/MesSelector'
import { supabase } from '@/lib/supabase'
import { formatCurrency } from '@/lib/utils'

export const dynamic = 'force-dynamic'

function Variacao({ atual, anterior }: { atual: number; anterior: number }) {
  if (!anterior) return null
  const pct = Math.round(((atual - anterior) / anterior) * 100)
  const cor = pct > 0 ? 'text-emerald-600' : pct < 0 ? 'text-red-500' : 'text-slate-400'
  const Icon = pct > 0 ? ArrowUp : pct < 0 ? ArrowDown : Minus
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${cor}`}>
      <Icon className="w-3 h-3" />
      {Math.abs(pct)}% vs mês ant.
    </span>
  )
}

async function getDashboardData(mes: string) {
  const [anoN, mesN] = mes.split('-').map(Number)

  const inicio = `${anoN}-${String(mesN).padStart(2, '0')}-01`
  const fimMes = mesN === 12 ? `${anoN + 1}-01-01` : `${anoN}-${String(mesN + 1).padStart(2, '0')}-01`
  const inicioAnt = mesN <= 1 ? `${anoN - 1}-12-01` : `${anoN}-${String(mesN - 1).padStart(2, '0')}-01`

  const [atendAtual, atendAnterior, planos, tutores, vacinas, historico] = await Promise.all([
    supabase
      .from('atendimentos')
      .select('valor_cobrado')
      .gte('data_atendimento', inicio)
      .lt('data_atendimento', fimMes)
      .not('valor_cobrado', 'is', null),

    supabase
      .from('atendimentos')
      .select('valor_cobrado')
      .gte('data_atendimento', inicioAnt)
      .lt('data_atendimento', inicio)
      .not('valor_cobrado', 'is', null),

    supabase.from('plano_assinantes').select('valor_mensal').eq('ativo', true),
    supabase.from('tutores').select('id'),
    supabase.from('vacinas').select('id').lt('data_vencimento', new Date().toISOString().split('T')[0]),

    supabase.rpc('receita_por_mes', { ano: anoN }),

  ])

  const valAtual = (atendAtual.data || []).map((a) => a.valor_cobrado || 0)
  const valAnterior = (atendAnterior.data || []).map((a) => a.valor_cobrado || 0)

  const receitaAtual = valAtual.reduce((s, v) => s + v, 0)
  const receitaAnterior = valAnterior.reduce((s, v) => s + v, 0)
  const atendimentosAtual = valAtual.length
  const atendimentosAnterior = valAnterior.length
  const ticketAtual = atendimentosAtual ? receitaAtual / atendimentosAtual : 0
  const ticketAnterior = atendimentosAnterior ? receitaAnterior / atendimentosAnterior : 0
  const mrr = (planos.data || []).reduce((s, p) => s + (p.valor_mensal || 0), 0)
  const assinantes = (planos.data || []).length

  const byMonth: Record<string, number> = {}
    ; const receitaMensal = (historico.data || []) as { mes: string; receita: number }[]

  return {
    atual: { atendimentos: atendimentosAtual, receita: receitaAtual, ticketMedio: ticketAtual, mrr, assinantes, total: receitaAtual + mrr },
    anterior: { atendimentos: atendimentosAnterior, receita: receitaAnterior, ticketMedio: ticketAnterior, total: receitaAnterior + mrr },
    totalClientes: (tutores.data || []).length,
    vacinasAtrasadas: (vacinas.data || []).length,
    receitaMensal,
  }
}

function mesLabel(mes: string) {
  const [ano, m] = mes.split('-')
  const nomes = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
  return `${nomes[parseInt(m) - 1]} ${ano}`
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>
}) {
  const params = await searchParams
  const hoje = new Date()
  const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`
  const mes = params?.mes || mesAtual

  const { atual, anterior, totalClientes, vacinasAtrasadas, receitaMensal } =
    await getDashboardData(mes)

  const ticketMedioPlano = atual.assinantes ? atual.mrr / atual.assinantes : 99

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-400 mt-1">{mesLabel(mes)}</p>
        </div>
        <MesSelector mes={mes} mesAtual={mesAtual} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800">{totalClientes}</p>
          <p className="text-xs text-slate-400 mt-0.5">Total de clientes</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800">{atual.assinantes}</p>
          <p className="text-xs text-slate-400 mt-0.5">Assinantes do plano</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center mb-3">
            <Syringe className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800">{vacinasAtrasadas}</p>
          <p className="text-xs text-slate-400 mt-0.5">Vacinas atrasadas</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center mb-3">
            <UserX className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-slate-800">{atual.atendimentos}</p>
          <p className="text-xs text-slate-400 mt-0.5">Atendimentos no mês</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-4 h-4 text-blue-400" />
            <p className="text-sm font-medium text-slate-500">Atendimentos</p>
          </div>
          <p className="text-3xl font-bold text-slate-800">{atual.atendimentos}</p>
          <div className="mt-1">
            <Variacao atual={atual.atendimentos} anterior={anterior.atendimentos} />
          </div>
          <div className="mt-3 pt-3 border-t border-slate-50 space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Receita avulsa</span>
              <div className="text-right">
                <span className="font-semibold text-slate-700 block">{formatCurrency(atual.receita)}</span>
                <Variacao atual={atual.receita} anterior={anterior.receita} />
              </div>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Ticket médio</span>
              <div className="text-right">
                <span className="font-semibold text-slate-700 block">{formatCurrency(atual.ticketMedio)}</span>
                <Variacao atual={atual.ticketMedio} anterior={anterior.ticketMedio} />
              </div>
            </div>
            <div className="flex justify-between text-xs text-slate-400 pt-1">
              <span>Mês anterior</span>
              <span>{anterior.atendimentos} atend. · {formatCurrency(anterior.receita)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <p className="text-sm font-medium text-slate-500">Plano mensal</p>
          </div>
          <p className="text-3xl font-bold text-slate-800">{formatCurrency(atual.mrr)}</p>
          <p className="text-xs text-slate-400 mt-1">Receita fixa garantida</p>
          <div className="mt-3 pt-3 border-t border-slate-50 space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Assinantes ativos</span>
              <span className="font-semibold text-slate-700">{atual.assinantes}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Valor por assinante</span>
              <span className="font-semibold text-slate-700">{formatCurrency(ticketMedioPlano)}</span>
            </div>
            <div className="flex justify-between text-xs text-slate-400 pt-1">
              <span>Cálculo</span>
              <span>{formatCurrency(ticketMedioPlano)} × {atual.assinantes} = {formatCurrency(atual.mrr)}</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-500 rounded-2xl shadow-sm p-6 text-white">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-blue-200" />
            <p className="text-sm font-medium text-blue-100">Total do mês</p>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(atual.total)}</p>
          <div className="mt-1">
            <Variacao atual={atual.total} anterior={anterior.total} />
          </div>
          <div className="mt-3 pt-3 border-t border-blue-400 space-y-1.5">
            <div className="flex justify-between text-xs text-blue-100">
              <span>Avulso</span>
              <span className="font-semibold text-white">
                {formatCurrency(atual.receita)} ({atual.total ? Math.round((atual.receita / atual.total) * 100) : 0}%)
              </span>
            </div>
            <div className="flex justify-between text-xs text-blue-100">
              <span>Recorrente</span>
              <span className="font-semibold text-white">
                {formatCurrency(atual.mrr)} ({atual.total ? Math.round((atual.mrr / atual.total) * 100) : 0}%)
              </span>
            </div>
            <div className="flex justify-between text-xs text-blue-200 pt-1">
              <span>Mês anterior</span>
              <span>{formatCurrency(anterior.total)}</span>
            </div>
          </div>
        </div>
      </div>

      <RevenueChart data={receitaMensal} mesSelecionado={mes} />
    </div>
  )
}