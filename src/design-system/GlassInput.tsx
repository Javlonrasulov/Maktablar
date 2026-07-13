import { cn } from '@/lib/utils'
import { forwardRef, type InputHTMLAttributes } from 'react'

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  function GlassInput({ label, className, id, ...props }, ref) {
    return (
      <label className="flex w-full flex-col gap-2 text-left">
        {label ? <span className="text-sm text-text-secondary">{label}</span> : null}
        <input
          ref={ref}
          id={id}
          className={cn(
            'h-11 w-full rounded-[22px] border border-line bg-fill px-4 text-sm text-text-primary',
            'placeholder:text-text-muted backdrop-blur-xl outline-none transition',
            'focus:border-accent/50 focus:bg-fill-strong focus:shadow-[0_0_0_3px_rgba(56,189,248,0.15)]',
            className,
          )}
          {...props}
        />
      </label>
    )
  },
)
