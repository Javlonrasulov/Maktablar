import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import ReactECharts from 'echarts-for-react'
import { GlassButton, GlassCard, PageSkeleton } from '@/design-system'
import { formatHours } from '@/lib/utils'
import { fetchTeacher } from '@/services/mockApi'

export function TeacherProfilePage() {
  const { id = '' } = useParams()
  const { t } = useTranslation()
  const { data, isLoading } = useQuery({
    queryKey: ['teacher', id],
    queryFn: () => fetchTeacher(id),
  })

  if (isLoading) return <PageSkeleton />
  if (!data) {
    return (
      <div className="space-y-4">
        <p>{t('common.noResults')}</p>
        <Link to="/teachers">
          <GlassButton>{t('common.back')}</GlassButton>
        </Link>
      </div>
    )
  }

  const yearly = {
    tooltip: { trigger: 'axis' },
    textStyle: { color: '#9aa8bc' },
    grid: { left: 36, right: 12, top: 20, bottom: 28 },
    xAxis: {
      type: 'category' as const,
      data: ['2021', '2022', '2023', '2024', '2025', '2026'],
      axisLine: { lineStyle: { color: 'rgba(255,255,255,0.12)' } },
    },
    yAxis: {
      type: 'value' as const,
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
    },
    series: [
      {
        type: 'bar' as const,
        data: [18, 20, 22, data.weeklyHours - 2, data.weeklyHours, data.weeklyHours],
        itemStyle: { color: '#38bdf8', borderRadius: [8, 8, 0, 0] },
      },
    ],
  }

  return (
    <div className="flex flex-col gap-6 pb-4">
      <div>
        <Link to="/teachers" className="inline-flex">
          <GlassButton size="sm" icon={<ArrowLeft size={16} strokeWidth={1.75} />}>
            {t('common.back')}
          </GlassButton>
        </Link>
      </div>

      <GlassCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-accent/40 to-indigo-500/30 font-display text-2xl font-semibold">
            {data.fullName
              .split(' ')
              .slice(0, 2)
              .map((p) => p[0])
              .join('')}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-text-muted">{t('teachers.profile')}</p>
            <h1 className="font-display text-2xl font-semibold">{data.fullName}</h1>
            <p className="mt-1 text-sm text-text-secondary">
              {data.specialty} · {data.category} · {data.experienceYears} y
            </p>
          </div>
        </div>
      </GlassCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <h2 className="mb-3 font-display text-base">{t('teachers.personal')}</h2>
          <dl className="space-y-2 text-sm">
            <Info label={t('common.phone')} value={data.phone} />
            <Info label={t('teachers.school')} value={data.schoolName} />
            <Info label={t('teachers.weeklyHours')} value={formatHours(data.weeklyHours, t('common.hours'))} />
            <Info label={t('common.status')} value={t(`status.${data.status}`)} />
          </dl>
        </GlassCard>

        <GlassCard>
          <h2 className="mb-3 font-display text-base">{t('teachers.subjects')}</h2>
          <div className="flex flex-wrap gap-2">
            {data.subjects.map((s) => (
              <span key={s} className="rounded-full bg-accent/10 px-3 py-1 text-sm text-accent ring-1 ring-accent/20">
                {s}
              </span>
            ))}
          </div>
          <h3 className="mb-2 mt-5 text-sm text-text-muted">{t('teachers.classes')}</h3>
          <div className="flex flex-wrap gap-2">
            {data.classes.map((c) => (
              <span key={c} className="rounded-[14px] bg-fill px-3 py-1 text-sm">
                {c}
              </span>
            ))}
          </div>
          <h3 className="mb-2 mt-5 text-sm text-text-muted">{t('teachers.schools')}</h3>
          <div className="flex flex-wrap gap-2">
            {data.schools.map((s) => (
              <span key={s} className="rounded-[14px] bg-fill px-3 py-1 text-sm">
                {s}
              </span>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard>
        <h2 className="mb-3 font-display text-base">{t('teachers.yearly')}</h2>
        <ReactECharts option={yearly} style={{ height: 260 }} />
      </GlassCard>

      <GlassCard>
        <h2 className="mb-2 font-display text-base">{t('teachers.history')}</h2>
        <ul className="space-y-2 text-sm text-text-secondary">
          <li>2024 — {data.schoolName}, {formatHours(data.weeklyHours - 2, t('common.hours'))}</li>
          <li>2023 — {data.schoolName}, {formatHours(Math.max(16, data.weeklyHours - 4), t('common.hours'))}</li>
          <li>2022 — {data.schools[0]}, {formatHours(Math.max(14, data.weeklyHours - 6), t('common.hours'))}</li>
        </ul>
      </GlassCard>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-line py-2">
      <dt className="text-text-muted">{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}
