import { twMerge } from 'tailwind-merge'
import { clsx } from 'clsx'
import { NavLink } from 'react-router-dom'

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'subtle' | 'dark'
  size?: 'sm' | 'md' | 'lg' | 'pill'
}

export function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-2xl text-sm font-medium transition-colors focus-visible:outline-none active:translate-y-px disabled:opacity-50 disabled:pointer-events-none'
  const variants: Record<string, string> = {
    primary: 'bg-ink text-white hover:bg-ink/90',
    ghost: 'bg-white text-ink border hover:bg-soft',
    subtle: 'bg-bubble text-ink hover:bg-bubble/70',
    dark: 'bg-black text-white hover:bg-black/90',
  }
  const sizes: Record<string, string> = {
    sm: 'h-9 px-3',
    md: 'h-11 px-4',
    lg: 'h-12 px-5',
    pill: 'rounded-full h-8 px-3 text-xs',
  }
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('rounded-2xl border bg-white shadow-glass', className)}>{children}</div>
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-2xl border bg-white px-4 py-3 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-brand-400',
        className
      )}
      {...props}
    />
  )
}

export function TabBar({ items }: { items: Array<{ to: string; label: string; icon?: React.ReactNode }> }) {
  return (
    <nav className="fixed bottom-0 left-1/2 z-10 w-full max-w-[480px] -translate-x-1/2 px-4 pb-[max(env(safe-area-inset-bottom),1.5rem)]">
      <div className="mx-4 flex justify-between rounded-2xl border bg-white/80 p-3 shadow-md backdrop-blur-md">
        {items.map((t) => (
          <NavLink key={t.to} to={t.to} className={({ isActive }) => (isActive ? 'text-brand-600' : 'text-gray-600')}>
            {({ isActive }) => (
              <div className="flex flex-col items-center gap-1 text-[11px]">
                <div className={cn('grid h-6 w-6 place-items-center rounded-full border', isActive ? 'bg-brand-100 border-brand-400' : 'border-gray-300')}>
                  {t.icon}
                </div>
                <span className={cn(isActive ? 'text-brand-600' : 'text-gray-600')}>{t.label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export function Chip({ label, selected, onClick, className }: { label: string; selected?: boolean; onClick?: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs',
        selected ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-gray-300 bg-white text-gray-700',
        className
      )}
    >
      {label}
    </button>
  )
}

export function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn('relative h-6 w-11 rounded-full transition-colors', checked ? 'bg-blue-600' : 'bg-gray-300')}
    >
      <span
        className={cn(
          'absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all',
          checked ? 'right-0.5 left-auto' : 'left-0.5 right-auto'
        )}
      />
    </button>
  )
}

export function SegmentedControl({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="inline-flex items-center rounded-full border bg-white p-1 text-xs">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            'rounded-full px-3 py-1',
            value === opt ? 'bg-black text-white' : 'text-gray-700'
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

export function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-gray-800 shadow-sm', className)}>
      {children}
    </span>
  )
}


