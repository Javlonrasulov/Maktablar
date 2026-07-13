import ReactECharts from 'echarts-for-react'
import type { EChartsOption } from 'echarts'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { GlassCard } from '@/design-system'
import type { ChartBundle } from '@/services/types'

const textStyle = { color: '#9aa8bc' }
const axisLine = { lineStyle: { color: 'rgba(255,255,255,0.12)' } }

function ChartShell({ title, option, height = 280 }: { title: string; option: EChartsOption; height?: number }) {
  return (
    <GlassCard className="min-w-0">
      <h3 className="mb-3 font-display text-base text-text-primary">{title}</h3>
      <ReactECharts option={option} style={{ height }} opts={{ renderer: 'canvas' }} />
    </GlassCard>
  )
}

export function DashboardCharts({ charts }: { charts: ChartBundle }) {
  const { t } = useTranslation()

  const line = useMemo<EChartsOption>(
    () => ({
      textStyle,
      grid: { left: 40, right: 16, top: 24, bottom: 28 },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: charts.monthlyHours.map((d) => d.month), axisLine },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } }, axisLine },
      series: [
        {
          type: 'line',
          smooth: true,
          data: charts.monthlyHours.map((d) => d.hours),
          areaStyle: { color: 'rgba(56,189,248,0.15)' },
          lineStyle: { color: '#38bdf8', width: 3 },
          itemStyle: { color: '#67e8f9' },
          animationDuration: 1200,
        },
      ],
    }),
    [charts.monthlyHours],
  )

  const area = useMemo<EChartsOption>(
    () => ({
      textStyle,
      grid: { left: 40, right: 16, top: 24, bottom: 28 },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: charts.teachersTrend.map((d) => d.month), axisLine },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } } },
      series: [
        {
          type: 'line',
          smooth: true,
          data: charts.teachersTrend.map((d) => d.count),
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(52,211,153,0.45)' },
                { offset: 1, color: 'rgba(52,211,153,0.02)' },
              ],
            },
          },
          lineStyle: { color: '#34d399' },
          itemStyle: { color: '#6ee7b7' },
          animationDuration: 1200,
        },
      ],
    }),
    [charts.teachersTrend],
  )

  const donut = useMemo<EChartsOption>(
    () => ({
      textStyle,
      tooltip: { trigger: 'item' },
      series: [
        {
          type: 'pie',
          radius: ['48%', '72%'],
          data: charts.statusDonut.map((d) => ({
            name: t(`status.${d.name}`),
            value: d.value,
          })),
          label: { color: '#9aa8bc' },
          animationType: 'scale',
          color: ['#34d399', '#fbbf24', '#fb923c', '#f87171'],
        },
      ],
    }),
    [charts.statusDonut, t],
  )

  const bar = useMemo<EChartsOption>(
    () => ({
      textStyle,
      grid: { left: 48, right: 12, top: 20, bottom: 40 },
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: charts.subjectBars.map((d) => d.subject),
        axisLabel: { rotate: 28, color: '#9aa8bc' },
        axisLine,
      },
      yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } } },
      series: [
        {
          type: 'bar',
          data: charts.subjectBars.map((d) => d.hours),
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
                { offset: 1, color: '#6366f1' },
              ],
            },
          },
          animationDelay: (idx: number) => idx * 80,
        },
      ],
    }),
    [charts.subjectBars],
  )

  const radar = useMemo<EChartsOption>(
    () => ({
      textStyle,
      radar: {
        indicator: charts.radarMetrics.map((m) => ({ name: m.metric, max: 100 })),
        axisName: { color: '#9aa8bc' },
        splitArea: { areaStyle: { color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.05)'] } },
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: charts.radarMetrics.map((m) => m.value),
              areaStyle: { color: 'rgba(56,189,248,0.25)' },
              lineStyle: { color: '#38bdf8' },
              itemStyle: { color: '#67e8f9' },
            },
          ],
        },
      ],
    }),
    [charts.radarMetrics],
  )

  const treemap = useMemo<EChartsOption>(
    () => ({
      textStyle,
      tooltip: {},
      series: [
        {
          type: 'treemap',
          data: charts.treemap,
          roam: false,
          breadcrumb: { show: false },
          label: { color: '#f4f7fb' },
          itemStyle: { borderColor: '#0b1220', borderWidth: 2, gapWidth: 2 },
          levels: [
            {
              color: ['#0ea5e9', '#38bdf8', '#22d3ee', '#67e8f9', '#6366f1', '#818cf8'],
            },
          ],
        },
      ],
    }),
    [charts.treemap],
  )

  const heatmap = useMemo<EChartsOption>(() => {
    const days = ['Du', 'Se', 'Cho', 'Pa', 'Ju', 'Sha', 'Ya']
    const weeks = ['W1', 'W2', 'W3', 'W4', 'W5']
    const data: [number, number, number][] = []
    charts.heatmap.forEach((row, y) => row.forEach((v, x) => data.push([x, y, v])))
    return {
      textStyle,
      tooltip: { position: 'top' },
      grid: { left: 40, right: 16, top: 16, bottom: 28 },
      xAxis: { type: 'category', data: days, axisLine },
      yAxis: { type: 'category', data: weeks, axisLine },
      visualMap: {
        min: 0,
        max: 40,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        textStyle,
        inRange: { color: ['#0b1220', '#0ea5e9', '#67e8f9'] },
      },
      series: [
        {
          type: 'heatmap',
          data,
          emphasis: { itemStyle: { shadowBlur: 10, shadowColor: 'rgba(56,189,248,0.5)' } },
        },
      ],
    }
  }, [charts.heatmap])

  const sankey = useMemo<EChartsOption>(
    () => ({
      textStyle,
      series: [
        {
          type: 'sankey',
          data: charts.sankey.nodes,
          links: charts.sankey.links,
          lineStyle: { color: 'gradient', opacity: 0.35 },
          itemStyle: { borderWidth: 0 },
          label: { color: '#9aa8bc' },
          emphasis: { focus: 'adjacency' },
        },
      ],
    }),
    [charts.sankey],
  )

  return (
    <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
      <ChartShell title={t('dashboard.charts.line')} option={line} />
      <ChartShell title={t('dashboard.charts.area')} option={area} />
      <ChartShell title={t('dashboard.charts.donut')} option={donut} />
      <ChartShell title={t('dashboard.charts.bar')} option={bar} />
      <ChartShell title={t('dashboard.charts.radar')} option={radar} />
      <ChartShell title={t('dashboard.charts.treemap')} option={treemap} height={300} />
      <ChartShell title={t('dashboard.charts.heatmap')} option={heatmap} height={320} />
      <ChartShell title={t('dashboard.charts.sankey')} option={sankey} height={320} />
    </div>
  )
}
