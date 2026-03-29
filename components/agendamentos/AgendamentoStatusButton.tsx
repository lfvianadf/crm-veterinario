'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { agendamentosService } from '@/services/agendamentos'
import { servicosService } from '@/services/servicos'
import { Agendamento, Servico } from '@/types'
import { ModalRetorno } from './ModalRetorno'

export function AgendamentoStatusButton({
  agendamento,
}: {
  agendamento: Agendamento
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [servicos, setServicos] = useState<Servico[]>([])

  if (agendamento.status !== 'agendado') return null

  const abrirModal = async () => {
    const svcs = await servicosService.getAll()
    setServicos(svcs)
    setShowModal(true)
  }

  const cancelar = async () => {
    setLoading(true)
    try {
      await agendamentosService.updateStatus(agendamento.id, 'cancelado')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={abrirModal}
          disabled={loading}
          className="text-xs px-3 py-1.5 rounded-xl font-medium bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors disabled:opacity-50"
        >
          Concluir
        </button>
        <button
          onClick={cancelar}
          disabled={loading}
          className="text-xs px-3 py-1.5 rounded-xl font-medium bg-red-50 text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>

      {showModal && (
        <ModalRetorno
          agendamento={agendamento}
          servicos={servicos}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}