import { useTranslation } from 'react-i18next'
import { Check, Moon, Sun } from 'lucide-react'
import { GlassButton } from '@/design-system'
import { languages, setAppLanguage, type AppLanguage } from '@/i18n'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/utils'
import { FontSizeControl } from './FontSizeControl'
import { TextColorPicker } from './TextColorPicker'

/** Mobile menu drawer ichidagi ko‘rinish / til sozlamalari */
export function MobilePrefsPanel() {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const current = i18n.language

  return (
    <div className="mt-5 space-y-5 border-t border-line pt-4">
      <p className="px-1 text-[10px] font-bold uppercase tracking-[0.08em] text-text-muted">
        {t('common.preferences')}
      </p>

      <GlassButton
        variant="ghost"
        size="sm"
        className="w-full justify-start"
        icon={theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        onClick={toggleTheme}
        aria-label={t('common.theme')}
      >
        {theme === 'dark' ? t('common.themeLight') : t('common.themeDark')}
      </GlassButton>

      <TextColorPicker variant="inline" />

      <div>
        <p className="mb-2 px-1 text-xs text-text-secondary">{t('common.language')}</p>
        <div className="flex flex-col gap-1" role="listbox" aria-label={t('common.language')}>
          {languages.map((lang) => {
            const selected = lang.code === current
            return (
              <button
                key={lang.code}
                type="button"
                role="option"
                aria-selected={selected}
                className={cn(
                  'flex w-full items-center justify-between gap-3 rounded-[14px] px-3 py-2.5 text-left text-sm transition-colors',
                  selected
                    ? 'bg-accent/15 text-accent'
                    : 'text-text-secondary hover:bg-fill hover:text-text-primary',
                )}
                onClick={() => setAppLanguage(lang.code as AppLanguage)}
              >
                <span className="min-w-0">
                  <span className="font-medium">{lang.short}</span>
                  <span className="ml-2 text-text-muted">{lang.label}</span>
                </span>
                {selected ? <Check size={16} className="shrink-0" /> : null}
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 px-1 text-xs text-text-secondary">A+</p>
        <FontSizeControl className="w-full justify-between" />
      </div>
    </div>
  )
}
