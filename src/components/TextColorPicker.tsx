import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import {
  DEFAULT_TEXT_COLOR,
  getTextColorOption,
  TEXT_COLOR_OPTIONS,
  type TextColorId,
} from '@/constants/textColors'
import { GlassButton } from '@/design-system'
import { useTheme } from '@/hooks/useTheme'
import { useUiPreferences } from '@/hooks/useUiPreferences'
import { cn } from '@/lib/utils'

const LABEL_KEYS: Record<TextColorId, string> = {
  default: 'common.textColorDefault',
  black: 'common.textColorBlack',
  slate: 'common.textColorSlate',
  navy: 'common.textColorNavy',
  charcoal: 'common.textColorCharcoal',
  zinc: 'common.textColorZinc',
  indigo: 'common.textColorIndigo',
  blue: 'common.textColorBlue',
  teal: 'common.textColorTeal',
  violet: 'common.textColorViolet',
}

function ColorOptionsList({
  textColor,
  onSelect,
  compact,
}: {
  textColor: TextColorId
  onSelect: (id: TextColorId) => void
  compact?: boolean
}) {
  const { t } = useTranslation()

  return (
    <div className={cn('flex flex-col gap-1', compact && 'max-h-[min(50vh,280px)] overflow-y-auto')}>
      {TEXT_COLOR_OPTIONS.map((opt) => {
        const selected = textColor === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            role="option"
            aria-selected={selected}
            title={t(LABEL_KEYS[opt.id])}
            className={cn(
              'flex w-full items-center gap-2.5 rounded-[14px] border border-transparent px-2.5 py-2 text-left text-xs font-medium transition-colors',
              selected
                ? 'border-accent/35 bg-accent/10 text-accent'
                : 'text-text-secondary hover:bg-fill hover:text-text-primary',
            )}
            onClick={() => onSelect(opt.id)}
          >
            <span
              className="h-[18px] w-[18px] shrink-0 rounded-full border border-line shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)]"
              style={{ background: opt.swatch }}
            />
            <span className="min-w-0 flex-1">{t(LABEL_KEYS[opt.id])}</span>
            {selected ? <Check size={14} className="shrink-0 text-accent" /> : null}
          </button>
        )
      })}
    </div>
  )
}

interface TextColorPickerProps {
  /** Drawer / sidebar ichida absolute popup o‘rniga oddiy ro‘yxat */
  variant?: 'popover' | 'inline'
}

export function TextColorPicker({ variant = 'popover' }: TextColorPickerProps) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { textColor, setTextColor } = useUiPreferences()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open || variant !== 'popover') return
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
  }, [open, variant])

  const option = getTextColorOption(textColor)
  const letterColor =
    textColor === DEFAULT_TEXT_COLOR
      ? undefined
      : theme === 'dark'
        ? option.dark ?? undefined
        : option.light ?? undefined

  if (variant === 'inline') {
    return (
      <div ref={rootRef}>
        <GlassButton
          variant="ghost"
          size="sm"
          className={cn(
            'w-full justify-between',
            (textColor !== DEFAULT_TEXT_COLOR || open) && 'bg-accent/10 ring-1 ring-accent/35',
          )}
          aria-label={t('common.textColor')}
          aria-expanded={open}
          aria-controls="text-color-inline-list"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="flex items-center gap-2">
            <span
              className="text-[15px] font-extrabold leading-none tracking-tight text-text-secondary"
              style={letterColor ? { color: letterColor } : undefined}
              aria-hidden
            >
              A
            </span>
            <span className="text-sm text-text-secondary">{t('common.textColor')}</span>
          </span>
          <ChevronDown
            size={16}
            className={cn('shrink-0 text-text-muted transition-transform', open && 'rotate-180')}
          />
        </GlassButton>

        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              id="text-color-inline-list"
              role="listbox"
              aria-label={t('common.textColor')}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-2">
                <ColorOptionsList
                  textColor={textColor}
                  onSelect={(id) => {
                    setTextColor(id)
                    setOpen(false)
                  }}
                  compact
                />
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="relative shrink-0" ref={rootRef}>
      <GlassButton
        variant="ghost"
        size="sm"
        className={cn(
          'h-9 w-9 min-w-9 shrink-0 px-0',
          (textColor !== DEFAULT_TEXT_COLOR || open) && 'bg-accent/10 ring-1 ring-accent/35',
        )}
        aria-label={t('common.textColor')}
        title={t('common.textColor')}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span
          className="text-[15px] font-extrabold leading-none tracking-tight text-text-secondary"
          style={letterColor ? { color: letterColor } : undefined}
          aria-hidden
        >
          A
        </span>
      </GlassButton>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="listbox"
            aria-label={t('common.textColor')}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="glass-strong absolute right-0 top-[calc(100%+8px)] z-[90] w-[min(17rem,calc(100vw-24px))] overflow-hidden rounded-[18px] p-3 shadow-[var(--theme-shadow-float)]"
          >
            <p className="mb-2.5 px-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-text-muted">
              {t('common.textColor')}
            </p>
            <ColorOptionsList
              textColor={textColor}
              onSelect={(id) => {
                setTextColor(id)
                setOpen(false)
              }}
              compact
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
