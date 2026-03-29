import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'bg-blue-500 text-white hover:bg-blue-600 active:scale-95': variant === 'primary',
          'bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-95': variant === 'secondary',
          'text-slate-600 hover:bg-slate-100 active:scale-95': variant === 'ghost',
          'bg-red-50 text-red-600 hover:bg-red-100 active:scale-95': variant === 'danger',
        },
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-sm': size === 'md',
          'px-6 py-3 text-base': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
