import { useTranslation } from 'react-i18next'
import { DEFAULT_FONT_SIZE, useUiPreferences } from '@/hooks/useUiPreferences'
import { FONT_SIZES, normalizeFontSize, type FontSize } from '@/lib/uiPreferences'
import { cn } from '@/lib/utils'

const DOT_TITLES: Record<FontSize, string> = {
  sm: 'common.fontSizeSm',
  md: 'common.fontSizeMd',
  lg: 'common.fontSizeLg',
  xl: 'common.fontSizeXl',
}

export function FontSizeControl({ className }: { className?: string }) {
  const { t } = useTranslation()
  const { fontSize, setFontSize } = useUiPreferences()
  const activeSize = normalizeFontSize(fontSize)
  const currentIdx = FONT_SIZES.indexOf(activeSize)
  const safeIdx = currentIdx === -1 ? FONT_SIZES.indexOf(DEFAULT_FONT_SIZE) : currentIdx

  return (
    <div
      className={cn(
        'flex h-9 shrink-0 items-center gap-0.5 rounded-full border border-line bg-fill px-2',
        className,
      )}
    >
      <button
        type="button"
        className="flex h-7 w-7 items-center justify-center rounded-[10px] text-text-secondary transition-colors hover:bg-fill-strong disabled:cursor-not-allowed disabled:opacity-30"
        title={t('common.fontSizeDecrease')}
        aria-label={t('common.fontSizeDecrease')}
        disabled={safeIdx === 0}
        onClick={() => setFontSize(FONT_SIZES[safeIdx - 1]!)}
      >
        <span className="text-[11px] font-bold leading-none">A</span>
        <span className="ml-px text-[8px] font-bold leading-none">−</span>
      </button>

      <div className="flex items-center gap-0.5 px-1">
        {FONT_SIZES.map((size, i) => (
          <button
            key={size}
            type="button"
            title={t(DOT_TITLES[size])}
            aria-label={t(DOT_TITLES[size])}
            aria-pressed={activeSize === size}
            onClick={() => setFontSize(size)}
            className={cn(
              'rounded-full border-0 p-0 transition-transform hover:scale-110',
              activeSize === size ? 'bg-accent' : 'bg-line hover:bg-text-muted',
              i === 0 && 'h-1.5 w-1.5',
              i === 1 && 'h-2 w-2',
              i === 2 && 'h-2.5 w-2.5',
              i === 3 && 'h-3 w-3',
            )}
          />
        ))}
      </div>

      <button
        type="button"
        className="flex h-7 w-7 items-center justify-center rounded-[10px] text-text-secondary transition-colors hover:bg-fill-strong disabled:cursor-not-allowed disabled:opacity-30"
        title={t('common.fontSizeIncrease')}
        aria-label={t('common.fontSizeIncrease')}
        disabled={safeIdx === FONT_SIZES.length - 1}
        onClick={() => setFontSize(FONT_SIZES[safeIdx + 1]!)}
      >
        <span className="text-[15px] font-bold leading-none">A</span>
        <span className="ml-px text-[9px] font-bold leading-none">+</span>
      </button>
    </div>
  )
}
