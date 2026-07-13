import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { PageSkeleton, GlassCard } from '@/design-system'
import { fetchDashboard } from '@/services/mockApi'
import { KpiGrid } from './KpiGrid'
import { DashboardCharts } from './DashboardCharts'
import { AiInsightsPanel } from '@/features/ai-insights/AiInsightsPanel'
import { DistrictMap } from '@/features/map/DistrictMap'

export function DashboardPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
  })

  if (isLoading || !data) return <PageSkeleton />

  return (
    <div className="space-y-6 pb-4">
      <header className="space-y-2">
        <h1 className="font-display text-2xl font-semibold md:text-3xl">{t('dashboard.title')}</h1>
        <p className="max-w-2xl text-sm text-text-secondary md:text-base">{t('dashboard.subtitle')}</p>
      </header>

      <KpiGrid kpis={data.kpis} />

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <DistrictMap schools={data.schools} title={t('dashboard.mapTitle')} />
        <div className="space-y-4">
          <AiInsightsPanel insights={data.insights} />
          <GlassCard>
            <h3 className="mb-3 font-display text-base">{t('dashboard.notificationsTitle')}</h3>
            <ul className="space-y-2">
              {data.notifications.slice(0, 4).map((n) => (
                <li key={n.id} className="rounded-[16px] bg-white/5 px-3 py-2 text-sm text-text-secondary">
                  {t(n.messageKey, { school: n.schoolNumber })}
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </div>

      <DashboardCharts charts={data.charts} />

      <div className="flex justify-end">
        <Link to="/reports" className="text-sm text-accent hover:underline">
          {t('common.viewAll')} →
        </Link>
      </div>
    </div>
  )
}
