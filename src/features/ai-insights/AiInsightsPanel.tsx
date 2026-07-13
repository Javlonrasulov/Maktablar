import { AlertCircle, AlertTriangle, Info, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { GlassCard } from '@/design-system'
import type { AiInsight } from '@/services/types'

const icons = {
  critical: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const tones = {
  critical: 'text-danger bg-danger/10 ring-danger/20',
  warning: 'text-warning bg-warning/10 ring-warning/20',
  info: 'text-accent bg-accent/10 ring-accent/20',
}

export function AiInsightsPanel({ insights }: { insights: AiInsight[] }) {
  const { t } = useTranslation()

  return (
    <GlassCard>
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="text-accent" size={18} />
        <h3 className="font-display text-base">{t('dashboard.aiTitle')}</h3>
      </div>
      <ul className="space-y-3">
        {insights.map((item) => {
          const Icon = icons[item.severity]
          return (
            <li key={item.id} className="rounded-[18px] border border-white/10 bg-white/5 p-3">
              <div className="mb-2 flex items-center gap-2">
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-xl ring-1 ${tones[item.severity]}`}>
                  <Icon size={16} />
                </span>
                <p className="text-sm font-medium">{t(item.titleKey)}</p>
              </div>
              <p className="text-sm text-text-secondary">{t(item.detailKey, item.params)}</p>
            </li>
          )
        })}
      </ul>
    </GlassCard>
  )
}
