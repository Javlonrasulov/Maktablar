import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'
import { forwardRef, useId, useState, type InputHTMLAttributes } from 'react'
import { useTranslation } from 'react-i18next'

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  function GlassInput({ label, className, id, type, ...props }, ref) {
    const { t } = useTranslation()
    const generatedId = useId()
    const inputId = id ?? generatedId
    const [visible, setVisible] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword && visible ? 'text' : type

    return (
      <label className="flex w-full flex-col gap-2 text-left" htmlFor={inputId}>
        {label ? <span className="text-sm text-text-secondary">{label}</span> : null}
        <span className="relative block">
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={cn(
              'h-11 w-full rounded-[22px] border border-line bg-fill px-4 text-sm text-text-primary',
              'placeholder:text-text-muted backdrop-blur-xl outline-none transition',
              'focus:border-accent/50 focus:bg-fill-strong focus:shadow-[0_0_0_3px_rgba(56,189,248,0.15)]',
              isPassword && 'pr-11',
              className,
            )}
            {...props}
          />
          {isPassword ? (
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition hover:text-text-primary"
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? t('auth.hidePassword') : t('auth.showPassword')}
            >
              {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          ) : null}
        </span>
      </label>
    )
  },
)
