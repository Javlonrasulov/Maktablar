import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import ReactECharts from 'echarts-for-react'
import { GlassCard, PageSkeleton } from '@/design-system'
import { fetchSubjects } from '@/services/mockApi'

export function SubjectsPage() {
  const { t } = useTranslation()
  const { data = [], isLoading } = useQuery({ queryKey: ['subjects'], queryFn: fetchSubjects })

  if (isLoading) return <PageSkeleton />

  const chart = {
    textStyle: { color: '#9aa8bc' },
    tooltip: { trigger: 'axis' as const },
    legend: { textStyle: { color: '#9aa8bc' } },
    grid: { left: 40, right: 16, top: 40, bottom: 48 },
    xAxis: {
      type: 'category' as const,
      data: data.map((s) => s.name),
      axisLabel: { rotate: 25, color: '#9aa8bc' },
    },
    yAxis: { type: 'value' as const, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } } },
    series: [
      {
        name: t('subjectsPage.totalHours'),
        type: 'bar' as const,
        data: data.map((s) => s.totalHours),
        itemStyle: { color: '#38bdf8', borderRadius: [8, 8, 0, 0] },
      },
      {
        name: t('subjectsPage.vacancy'),
        type: 'bar' as const,
        data: data.map((s) => s.vacantHours),
        itemStyle: { color: '#fbbf24', borderRadius: [8, 8, 0, 0] },
      },
    ],
  }

  return (
    <div className="space-y-6 pb-4">
      <header className="space-y-2">
        <h1 className="font-display text-2xl font-semibold md:text-3xl">{t('subjectsPage.title')}</h1>
        <p className="text-sm text-text-secondary">{t('subjectsPage.subtitle')}</p>
      </header>

      <GlassCard>
        <ReactECharts option={chart} style={{ height: 320 }} />
      </GlassCard>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.map((subject) => (
          <GlassCard key={subject.id}>
            <h2 className="font-display text-lg font-semibold">{subject.name}</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <Row label={t('subjectsPage.teachers')} value={String(subject.teachersCount)} />
              <Row label={t('subjectsPage.totalHours')} value={`${subject.totalHours}h`} />
              <Row label={t('subjectsPage.vacancy')} value={`${subject.vacantHours}h`} />
              <Row label={t('subjectsPage.overload')} value={`${subject.overloadHours}h`} />
              <Row label={t('subjectsPage.topSchool')} value={subject.topSchool} />
            </dl>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-white/5 py-1.5">
      <dt className="text-text-muted">{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}
