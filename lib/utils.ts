import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
}

export function daysSince(date: string): number {
  const now = new Date()
  const past = new Date(date)
  const diff = now.getTime() - past.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function daysUntil(date: string): number {
  const now = new Date()
  const future = new Date(date)
  const diff = future.getTime() - now.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}
