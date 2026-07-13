import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  Clock3,
  Flame,
  Gauge,
  Scale,
  Users,
  X,
} from 'lucide-react'
import {
  AnimatedCounter,
  GlassButton,
  GlassCard,
  PageSkeleton,
} from '@/design-system'
import { cn, formatHours, hoursHeatColor } from '@/lib/utils'
import { fetchTeachers, workloadBands } from '@/services/mockApi'
import type { Teacher } from '@/services/types'
import { useTheme } from '@/hooks/useTheme'

type BandKey = 'under18' | 'h18' | 'h24' | 'h30' | 'over40'

const BAND_META: { key: BandKey; tone: number; icon: typeof Gauge }[] = [
  { key: 'under18', tone: 0.08, icon: Gauge },
  { key: 'h18', tone: 0.28, icon: Scale },
  { key: 'h24', tone: 0.48, icon: Clock3 },
  { key: 'h30', tone: 0.72, icon: Flame },
  { key: 'over40', tone: 0.95, icon: AlertTriangle },
]

export function WorkloadPage() {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [activeBand, setActiveBand] = useState<BandKey | null>(null)

  const { data = [], isLoading } = useQuery({ queryKey: ['teachers'], queryFn: fetchTeachers })

  const bands = useMemo(() => workloadBands(data), [data])

  const sections = useMemo(
    () =>
      BAND_META.map((meta) => ({
        ...meta,
        items: bands[meta.key],
        color: hoursHeatColor(meta.tone),
      })),
    [bands],
  )

  const stats = useMemo(() => {
    if (!data.length) return { total: 0, avg: 0, max: 0 }
    const sum = data.reduce((acc, teacher) => acc + teacher.weeklyHours, 0)
    return {
      total: data.length,
      avg: Math.round(sum / data.length),
      max: Math.max(...data.map((teacher) => teacher.weeklyHours)),
    }
  }, [data])

  const visibleSections = useMemo(
    () => (activeBand ? sections.filter((s) => s.key === activeBand) : sections),
    [sections, activeBand],
  )

  const chartOption = useMemo<EChartsOption>(() => {
    const muted = theme === 'dark' ? '#9aa8bc' : '#64748b'
    const split = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.06)'
    return {
      textStyle: { color: muted },
      grid: { left: 8, right: 28, top: 8, bottom: 8, containLabel: true },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: split } },
        axisLabel: { color: muted },
      },
      yAxis: {
        type: 'category',
        data: sections.map((s) => t(`workload.${s.key}`)),
        axisLabel: { color: muted, width: 110, overflow: 'truncate' },
        axisTick: { show: false },
        axisLine: { show: false },
      },
      series: [
        {
          type: 'bar',
          data: sections.map((s) => ({
            value: s.items.length,
            itemStyle: {
              color: s.color,
              borderRadius: [0, 10, 10, 0],
              opacity: activeBand && activeBand !== s.key ? 0.28 : 1,
            },
          })),
          barWidth: 18,
          animationDuration: 700,
        },
      ],
    }
  }, [sections, t, theme, activeBand])

  const toggleBand = (key: BandKey) => {
    setActiveBand((prev) => (prev === key ? null : key))
  }

  if (isLoading) return <PageSkeleton />

  return (
    <div className="space-y-6 pb-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-semibold md:text-3xl">{t('workload.title')}</h1>
          <p className="text-sm text-text-secondary">{t('workload.subtitle')}</p>
        </div>
        {activeBand ? (
          <GlassButton
            size="sm"
            variant="ghost"
            icon={<X size={16} strokeWidth={1.75} />}
            onClick={() => setActiveBand(null)}
          >
            {t('common.all')}
          </GlassButton>
        ) : null}
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {sections.map((section) => {
          const Icon = section.icon
          const active = activeBand === section.key
          const dimmed = activeBand !== null && !active
          return (
            <button
              key={section.key}
              type="button"
              aria-pressed={active}
              onClick={() => toggleBand(section.key)}
              className={cn(
                'group relative overflow-hidden rounded-[22px] p-5 text-left transition-all duration-300 md:p-6',
                'glass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50',
                active
                  ? 'shadow-[var(--theme-active-glow)] -translate-y-0.5'
                  : 'hover:-translate-y-1 hover:shadow-[var(--theme-shadow-float)]',
                dimmed && 'opacity-55',
              )}
              style={
                active
                  ? {
                      boxShadow: `0 0 0 1.5px ${section.color}, 0 12px 32px color-mix(in srgb, ${section.color} 28%, transparent)`,
                    }
                  : undefined
              }
            >
              <div
                className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full blur-2xl transition"
                style={{
                  backgroundColor: `color-mix(in srgb, ${section.color} ${active ? 28 : 14}%, transparent)`,
                }}
              />
              <div className="mb-4 flex items-center justify-between">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-2xl ring-1"
                  style={{
                    color: section.color,
                    backgroundColor: `color-mix(in srgb, ${section.color} 14%, transparent)`,
                    boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${section.color} 28%, transparent)`,
                  }}
                >
                  <Icon size={18} strokeWidth={1.6} />
                </div>
                {active ? (
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                    style={{
                      color: section.color,
                      backgroundColor: `color-mix(in srgb, ${section.color} 14%, transparent)`,
                    }}
                  >
                    {t('common.filter')}
                  </span>
                ) : null}
              </div>
              <p className="mb-2 text-xs text-text-secondary">{t(`workload.${section.key}`)}</p>
              <AnimatedCounter
                value={section.items.length}
                className="font-display text-2xl font-semibold text-text-primary md:text-3xl"
              />
            </button>
          )
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <GlassCard className="min-w-0">
          <h3 className="mb-3 font-display text-base">{t('workload.distribution')}</h3>
          <ReactECharts
            option={chartOption}
            style={{ height: 260 }}
            opts={{ renderer: 'canvas' }}
            onEvents={{
              click: (params: { dataIndex?: number }) => {
                const idx = params.dataIndex
                if (typeof idx === 'number' && sections[idx]) {
                  toggleBand(sections[idx].key)
                }
              },
            }}
          />
        </GlassCard>

        <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
          <StatTile
            icon={Users}
            label={t('workload.totalTeachers')}
            value={stats.total}
          />
          <StatTile
            icon={Clock3}
            label={t('workload.avgHours')}
            value={stats.avg}
            suffix={` ${t('common.hours')}`}
          />
          <StatTile
            icon={Flame}
            label={t('workload.maxHours')}
            value={stats.max}
            suffix={` ${t('common.hours')}`}
          />
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {visibleSections.map((section) => (
            <motion.div
              key={section.key}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
            >
              <GlassCard>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: section.color }}
                    />
                    <h2 className="font-display text-base">{t(`workload.${section.key}`)}</h2>
                  </div>
                  <span className="text-xs text-text-muted">
                    {t('workload.teachersCount', { count: section.items.length })}
                  </span>
                </div>

                {section.items.length === 0 ? (
                  <p className="text-sm text-text-muted">{t('common.noResults')}</p>
                ) : (
                  <ul className="space-y-2">
                    {section.items
                      .slice()
                      .sort((a, b) => b.weeklyHours - a.weeklyHours)
                      .map((teacher) => (
                        <TeacherRow key={teacher.id} teacher={teacher} color={section.color} />
                      ))}
                  </ul>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

function StatTile({
  icon: Icon,
  label,
  value,
  suffix = '',
}: {
  icon: typeof Users
  label: string
  value: number
  suffix?: string
}) {
  return (
    <GlassCard className="group relative overflow-hidden">
      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-accent/10 blur-2xl transition group-hover:bg-accent/20" />
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-2xl bg-accent/10 text-accent ring-1 ring-accent/20">
        <Icon size={16} strokeWidth={1.6} />
      </div>
      <p className="mb-1 text-xs text-text-secondary">{label}</p>
      <AnimatedCounter
        value={value}
        suffix={suffix}
        className="font-display text-xl font-semibold text-text-primary md:text-2xl"
      />
    </GlassCard>
  )
}

function TeacherRow({ teacher, color }: { teacher: Teacher; color: string }) {
  const { t } = useTranslation()

  return (
    <li>
      <Link
        to={`/teachers/${teacher.id}`}
        className="flex items-center justify-between gap-3 rounded-[16px] bg-fill px-3 py-2.5 text-sm transition-colors hover:bg-fill-strong"
      >
        <div className="min-w-0">
          <p className="truncate font-medium text-text-primary">{teacher.fullName}</p>
          <p className="truncate text-xs text-text-muted">
            {teacher.schoolName}
            {teacher.specialty ? ` · ${teacher.specialty}` : ''}
          </p>
        </div>
        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums"
          style={{
            color,
            backgroundColor: `color-mix(in srgb, ${color} 16%, transparent)`,
            boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${color} 35%, transparent)`,
          }}
        >
          {formatHours(teacher.weeklyHours, t('common.hours'))}
        </span>
      </Link>
    </li>
  )
}
