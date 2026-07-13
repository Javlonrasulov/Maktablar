import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { Activity, BarChart3, PieChart, Plus } from 'lucide-react'
import {
  GlassButton,
  GlassCard,
  GlassInput,
  GlassModal,
  PageSkeleton,
} from '@/design-system'
import { formatHours } from '@/lib/utils'
import { createSubject, fetchSubjects } from '@/services/mockApi'

type ChartView = 'bar' | 'pie' | 'wave'

const textStyle = { color: '#9aa8bc' }
const axisLine = { lineStyle: { color: 'rgba(255,255,255,0.12)' } }

const subjectSchema = z.object({
  name: z.string().min(2),
})

type SubjectFormValues = z.infer<typeof subjectSchema>

export function SubjectsPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [chartView, setChartView] = useState<ChartView>('bar')
  const [modalOpen, setModalOpen] = useState(false)

  const { data = [], isLoading } = useQuery({ queryKey: ['subjects'], queryFn: fetchSubjects })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubjectFormValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: { name: '' },
  })

  const createMutation = useMutation({
    mutationFn: (values: SubjectFormValues) => createSubject(values.name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      reset()
      setModalOpen(false)
    },
  })

  const chartOption = useMemo<EChartsOption>(() => {
    const names = data.map((s) => s.name)
    const hours = data.map((s) => s.totalHours)
    const vacant = data.map((s) => s.vacantHours)

    if (chartView === 'pie') {
      return {
        textStyle,
        tooltip: { trigger: 'item' },
        legend: {
          bottom: 0,
          textStyle,
          type: 'scroll',
        },
        series: [
          {
            type: 'pie',
            radius: ['48%', '72%'],
            center: ['50%', '46%'],
            data: data.map((s) => ({ name: s.name, value: s.totalHours })),
            label: { color: '#9aa8bc' },
            animationType: 'scale',
            color: ['#38bdf8', '#67e8f9', '#34d399', '#fbbf24', '#fb923c', '#a78bfa', '#f472b6', '#818cf8'],
          },
        ],
      }
    }

    if (chartView === 'wave') {
      return {
        textStyle,
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(15, 23, 42, 0.88)',
          borderWidth: 0,
          padding: [10, 14],
          textStyle: { color: '#e2e8f0', fontSize: 12 },
          axisPointer: {
            type: 'line',
            lineStyle: { color: 'rgba(56,189,248,0.35)', width: 1.5, type: 'dashed' },
          },
        },
        legend: {
          top: 0,
          right: 0,
          icon: 'roundRect',
          itemWidth: 14,
          itemHeight: 6,
          itemGap: 16,
          textStyle: { ...textStyle, fontSize: 12 },
        },
        grid: { left: 52, right: 52, top: 44, bottom: 36 },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: names,
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: {
            color: '#9aa8bc',
            fontSize: 11,
            hideOverlap: true,
            formatter: (value: string) => (value.length > 10 ? `${value.slice(0, 9)}…` : value),
          },
        },
        yAxis: [
          {
            type: 'value',
            name: t('subjectsPage.totalHours'),
            nameTextStyle: { color: '#9aa8bc', fontSize: 11, padding: [0, 0, 0, 8] },
            splitLine: { lineStyle: { color: 'rgba(148,163,184,0.12)', type: 'dashed' } },
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { color: '#9aa8bc', fontSize: 11 },
          },
          {
            type: 'value',
            name: t('subjectsPage.vacancy'),
            nameTextStyle: { color: '#9aa8bc', fontSize: 11, padding: [0, 8, 0, 0] },
            splitLine: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { color: '#9aa8bc', fontSize: 11 },
          },
        ],
        series: [
          {
            name: t('subjectsPage.totalHours'),
            type: 'line',
            smooth: 0.45,
            symbol: 'circle',
            symbolSize: 8,
            showSymbol: false,
            yAxisIndex: 0,
            data: hours,
            lineStyle: {
              width: 3.5,
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  { offset: 0, color: '#38bdf8' },
                  { offset: 0.55, color: '#22d3ee' },
                  { offset: 1, color: '#818cf8' },
                ],
              },
              shadowColor: 'rgba(56,189,248,0.45)',
              shadowBlur: 12,
              shadowOffsetY: 4,
            },
            itemStyle: {
              color: '#67e8f9',
              borderColor: '#fff',
              borderWidth: 2,
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(56,189,248,0.28)' },
                  { offset: 0.55, color: 'rgba(34,211,238,0.1)' },
                  { offset: 1, color: 'rgba(129,140,248,0.02)' },
                ],
              },
            },
            emphasis: {
              focus: 'series',
              scale: true,
              itemStyle: { shadowBlur: 16, shadowColor: 'rgba(56,189,248,0.6)' },
            },
            animationDuration: 1400,
            animationEasing: 'cubicOut',
          },
          {
            name: t('subjectsPage.vacancy'),
            type: 'line',
            smooth: 0.45,
            symbol: 'circle',
            symbolSize: 7,
            showSymbol: true,
            yAxisIndex: 1,
            data: vacant,
            lineStyle: {
              width: 2.5,
              type: [6, 4],
              color: '#f59e0b',
              shadowColor: 'rgba(245,158,11,0.35)',
              shadowBlur: 8,
            },
            itemStyle: {
              color: '#fbbf24',
              borderColor: '#fff',
              borderWidth: 2,
            },
            emphasis: {
              focus: 'series',
              scale: true,
            },
            animationDuration: 1400,
            animationEasing: 'cubicOut',
          },
        ],
      }
    }

    return {
      textStyle,
      tooltip: { trigger: 'axis' },
      legend: { textStyle, top: 0 },
      grid: { left: 48, right: 16, top: 40, bottom: 48 },
      xAxis: {
        type: 'category',
        data: names,
        axisLabel: { rotate: 25, color: '#9aa8bc' },
        axisLine,
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      },
      series: [
        {
          name: t('subjectsPage.totalHours'),
          type: 'bar',
          data: hours,
          itemStyle: {
            borderRadius: [10, 10, 4, 4],
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#38bdf8' },
                { offset: 1, color: '#0284c7' },
              ],
            },
          },
          animationDelay: (idx: number) => idx * 80,
        },
        {
          name: t('subjectsPage.vacancy'),
          type: 'bar',
          data: vacant,
          itemStyle: {
            borderRadius: [10, 10, 4, 4],
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#fbbf24' },
                { offset: 1, color: '#d97706' },
              ],
            },
          },
          animationDelay: (idx: number) => idx * 80 + 40,
        },
      ],
    }
  }, [chartView, data, t])

  const onSubmit = handleSubmit((values) => {
    createMutation.mutate(values)
  })

  const closeModal = () => {
    setModalOpen(false)
    reset()
  }

  if (isLoading) return <PageSkeleton />

  const chartToggle = (
    <div className="flex shrink-0 items-center gap-1 rounded-[22px] border border-line bg-fill p-1">
      {(
        [
          { id: 'bar' as const, icon: BarChart3, label: t('subjectsPage.chartBar') },
          { id: 'pie' as const, icon: PieChart, label: t('subjectsPage.chartPie') },
          { id: 'wave' as const, icon: Activity, label: t('subjectsPage.chartWave') },
        ] as const
      ).map(({ id, icon: Icon, label }) => (
        <GlassButton
          key={id}
          size="sm"
          variant={chartView === id ? 'primary' : 'ghost'}
          className="!min-w-0 px-2.5"
          icon={<Icon size={16} strokeWidth={1.75} />}
          aria-label={label}
          aria-pressed={chartView === id}
          title={label}
          onClick={() => setChartView(id)}
        />
      ))}
    </div>
  )

  return (
    <div className="space-y-6 pb-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-semibold md:text-3xl">{t('subjectsPage.title')}</h1>
          <p className="text-sm text-text-secondary">{t('subjectsPage.subtitle')}</p>
        </div>
        <GlassButton
          variant="primary"
          icon={<Plus size={18} strokeWidth={1.75} />}
          onClick={() => setModalOpen(true)}
        >
          {t('subjectsPage.addSubject')}
        </GlassButton>
      </header>

      <GlassCard className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-base text-text-primary">{t('subjectsPage.chartTitle')}</h3>
          {chartToggle}
        </div>
        <ReactECharts option={chartOption} style={{ height: 320 }} opts={{ renderer: 'canvas' }} notMerge />
      </GlassCard>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {data.map((subject) => (
          <GlassCard key={subject.id}>
            <h2 className="font-display text-lg font-semibold">{subject.name}</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <Row label={t('subjectsPage.teachers')} value={String(subject.teachersCount)} />
              <Row label={t('subjectsPage.totalHours')} value={formatHours(subject.totalHours, t('common.hours'))} />
              <Row label={t('subjectsPage.vacancy')} value={formatHours(subject.vacantHours, t('common.hours'))} />
              <Row label={t('subjectsPage.overload')} value={formatHours(subject.overloadHours, t('common.hours'))} />
              <Row label={t('subjectsPage.topSchool')} value={subject.topSchool} />
            </dl>
          </GlassCard>
        ))}
      </div>

      <GlassModal open={modalOpen} onClose={closeModal} title={t('subjectsPage.addSubject')}>
        <form className="space-y-4" onSubmit={onSubmit}>
          <GlassInput
            label={t('subjectsPage.subjectName')}
            placeholder={t('subjectsPage.subjectNamePlaceholder')}
            autoFocus
            {...register('name')}
          />
          {errors.name ? <p className="text-xs text-danger">{t('validation.required')}</p> : null}

          <div className="flex flex-wrap justify-end gap-2 pt-2">
            <GlassButton type="button" variant="ghost" onClick={closeModal}>
              {t('common.cancel')}
            </GlassButton>
            <GlassButton type="submit" variant="primary" disabled={createMutation.isPending}>
              {t('common.save')}
            </GlassButton>
          </div>
        </form>
      </GlassModal>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-line py-1.5">
      <dt className="text-text-muted">{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}
