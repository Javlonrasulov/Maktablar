import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export type GlassSelectOption = {
  value: string
  label: string
}

type GlassSelectProps = {
  label?: string
  value: string
  options: GlassSelectOption[]
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  disabled?: boolean
  id?: string
}

export function GlassSelect({
  label,
  value,
  options,
  onChange,
  className,
  placeholder,
  disabled,
  id,
}: GlassSelectProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const autoId = useId()
  const triggerId = id ?? autoId
  const listId = `${triggerId}-list`

  const selected = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  )

  useEffect(() => {
    if (!open) return
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className={cn('flex w-full flex-col gap-2 text-left', className)} ref={rootRef}>
      {label ? (
        <span className="text-sm text-text-secondary" id={`${triggerId}-label`}>
          {label}
        </span>
      ) : null}

      <div className="relative">
        <button
          type="button"
          id={triggerId}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-labelledby={label ? `${triggerId}-label` : undefined}
          className={cn(
            'flex h-11 w-full items-center justify-between gap-2 rounded-[22px] border border-line bg-fill px-4 text-left text-sm text-text-primary',
            'backdrop-blur-xl outline-none transition',
            'hover:bg-fill-strong focus:border-accent/50 focus:bg-fill-strong focus:shadow-[0_0_0_3px_rgba(56,189,248,0.15)]',
            open && 'border-accent/50 bg-fill-strong shadow-[0_0_0_3px_rgba(56,189,248,0.15)]',
            disabled && 'cursor-not-allowed opacity-50',
          )}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={cn('truncate', !selected && 'text-text-muted')}>
            {selected?.label ?? placeholder ?? ''}
          </span>
          <ChevronDown
            size={16}
            strokeWidth={1.75}
            className={cn('shrink-0 text-text-muted transition-transform', open && 'rotate-180')}
            aria-hidden
          />
        </button>

        <AnimatePresence>
          {open ? (
            <motion.ul
              id={listId}
              role="listbox"
              aria-labelledby={label ? `${triggerId}-label` : triggerId}
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="glass-strong absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-64 overflow-y-auto rounded-[18px] p-1.5"
            >
              {options.map((option) => {
                const isSelected = option.value === value
                return (
                  <li key={option.value} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      className={cn(
                        'flex w-full items-center justify-between gap-3 rounded-[14px] px-3 py-2 text-left text-sm transition-colors',
                        isSelected
                          ? 'bg-accent text-white'
                          : 'text-text-secondary hover:bg-fill hover:text-text-primary',
                      )}
                      onClick={() => {
                        onChange(option.value)
                        setOpen(false)
                      }}
                    >
                      <span className="truncate">{option.label}</span>
                      {isSelected ? <Check size={14} className="shrink-0 opacity-90" /> : null}
                    </button>
                  </li>
                )
              })}
            </motion.ul>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}
