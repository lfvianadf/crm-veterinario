'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { planoService } from '@/services/plano'

export function PlanoActions({ id, ativo }: { id: string; ativo: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const toggle = async () => {
    setLoading(true)
    try {
      await planoService.toggle(id, !ativo)
      router.refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-colors disabled:opacity-50 ${
        ativo
          ? 'bg-red-50 text-red-500 hover:bg-red-100'
          : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
      }`}
    >
      {loading ? '...' : ativo ? 'Desativar' : 'Ativar'}
    </button>
  )
}
