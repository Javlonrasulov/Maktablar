import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { AnimatedCounter, GlassCard, PageSkeleton } from '@/design-system'
import { fetchTeachers, workloadBands } from '@/services/mockApi'

export function WorkloadPage() {
  const { t } = useTranslation()
  const { data = [], isLoading } = useQuery({ queryKey: ['teachers'], queryFn: fetchTeachers })

  const bands = useMemo(() => workloadBands(data), [data])

  if (isLoading) return <PageSkeleton />

  const sections = [
    { key: 'under18' as const, items: bands.under18 },
    { key: 'h18' as const, items: bands.h18 },
    { key: 'h24' as const, items: bands.h24 },
    { key: 'h30' as const, items: bands.h30 },
    { key: 'over40' as const, items: bands.over40 },
  ]

  return (
    <div className="space-y-6 pb-4">
      <header className="space-y-2">
        <h1 className="font-display text-2xl font-semibold md:text-3xl">{t('workload.title')}</h1>
        <p className="text-sm text-text-secondary">{t('workload.subtitle')}</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {sections.map((section) => (
          <GlassCard key={section.key}>
            <p className="text-xs text-text-muted">{t(`workload.${section.key}`)}</p>
            <AnimatedCounter
              value={section.items.length}
              className="mt-2 block font-display text-3xl font-semibold"
            />
          </GlassCard>
        ))}
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <GlassCard key={`list-${section.key}`}>
            <h2 className="mb-3 font-display text-base">{t(`workload.${section.key}`)}</h2>
            {section.items.length === 0 ? (
              <p className="text-sm text-text-muted">{t('common.noResults')}</p>
            ) : (
              <ul className="space-y-2">
                {section.items.map((teacher) => (
                  <li key={teacher.id}>
                    <Link
                      to={`/teachers/${teacher.id}`}
                      className="flex items-center justify-between rounded-[16px] bg-white/5 px-3 py-2 text-sm hover:bg-white/8"
                    >
                      <span>{teacher.fullName}</span>
                      <span className="text-accent">{teacher.weeklyHours}h</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
