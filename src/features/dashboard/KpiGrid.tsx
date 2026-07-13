import { Building2, Clock3, GraduationCap, Users, BookOpen, AlertTriangle, RefreshCw, Ban } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AnimatedCounter, GlassCard } from '@/design-system'
import type { DashboardKpis } from '@/services/types'

const kpiMeta = [
  { key: 'totalSchools', icon: Building2, field: 'totalSchools', numeric: true, hours: false },
  { key: 'totalTeachers', icon: Users, field: 'totalTeachers', numeric: true, hours: false },
  { key: 'totalStudents', icon: GraduationCap, field: 'totalStudents', numeric: true, hours: false },
  { key: 'totalWeeklyHours', icon: Clock3, field: 'totalWeeklyHours', numeric: true, hours: true },
  { key: 'vacantHours', icon: AlertTriangle, field: 'vacantHours', numeric: true, hours: true },
  { key: 'mostLoadedSubject', icon: BookOpen, field: 'mostLoadedSubject', numeric: false, hours: false },
  { key: 'leastLoadedSubject', icon: BookOpen, field: 'leastLoadedSubject', numeric: false, hours: false },
  { key: 'updatedToday', icon: RefreshCw, field: 'updatedToday', numeric: true, hours: false },
  { key: 'noDataSchools', icon: Ban, field: 'noDataSchools', numeric: true, hours: false },
] as const

export function KpiGrid({ kpis }: { kpis: DashboardKpis }) {
  const { t } = useTranslation()
  const hoursLabel = t('common.hours')

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5">
      {kpiMeta.map((item) => {
        const Icon = item.icon
        const value = kpis[item.field]
        return (
          <GlassCard key={item.key} className="group relative overflow-hidden">
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/10 blur-2xl transition group-hover:bg-accent/20" />
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/20">
                <Icon size={18} strokeWidth={1.6} />
              </div>
            </div>
            <p className="mb-2 text-xs text-text-secondary">{t(`dashboard.kpis.${item.key}`)}</p>
            {item.numeric ? (
              <AnimatedCounter
                value={value as number}
                suffix={item.hours ? ` ${hoursLabel}` : ''}
                className="font-display text-2xl font-semibold text-text-primary md:text-3xl"
              />
            ) : (
              <p className="font-display text-xl font-semibold text-text-primary md:text-2xl">{value as string}</p>
            )}
          </GlassCard>
        )
      })}
    </div>
  )
}
