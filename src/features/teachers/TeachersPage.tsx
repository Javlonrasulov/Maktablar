import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { LayoutGrid, List } from 'lucide-react'
import {
  GlassButton,
  GlassCard,
  GlassInput,
  GlassSelect,
  GlassTable,
  PageSkeleton,
} from '@/design-system'
import { fetchTeachers } from '@/services/mockApi'
import {
  formatHours,
  hoursHeatColor,
  hoursHeatTone,
  hoursVsAveragePct,
} from '@/lib/utils'
import type { Teacher } from '@/services/types'

type ViewMode = 'card' | 'list'
type HoursSort = 'default' | 'desc' | 'asc'

const CARD_PAGE_SIZE = 20
const LIST_PAGE_SIZE = 20

const columnHelper = createColumnHelper<Teacher>()

export function TeachersPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [subject, setSubject] = useState<string | 'all'>('all')
  const [hoursSort, setHoursSort] = useState<HoursSort>('default')
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState<ViewMode>('card')

  const { data = [], isLoading } = useQuery({ queryKey: ['teachers'], queryFn: fetchTeachers })

  const subjects = useMemo(() => {
    const set = new Set<string>()
    data.forEach((teacher) => {
      teacher.subjects.forEach((s) => set.add(s))
      if (teacher.specialty) set.add(teacher.specialty)
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'uz'))
  }, [data])

  const hoursStats = useMemo(() => {
    if (!data.length) return { min: 0, max: 0, avg: 0 }
    const hours = data.map((teacher) => teacher.weeklyHours)
    const sum = hours.reduce((a, b) => a + b, 0)
    return {
      min: Math.min(...hours),
      max: Math.max(...hours),
      avg: sum / hours.length,
    }
  }, [data])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = data.filter((teacher) => {
      const matchQ =
        !q ||
        teacher.fullName.toLowerCase().includes(q) ||
        teacher.phone.includes(q) ||
        teacher.specialty.toLowerCase().includes(q) ||
        teacher.subjects.some((s) => s.toLowerCase().includes(q))
      const matchSubject =
        subject === 'all' ||
        teacher.subjects.includes(subject) ||
        teacher.specialty === subject
      return matchQ && matchSubject
    })

    if (hoursSort === 'desc') {
      return [...list].sort((a, b) => b.weeklyHours - a.weeklyHours)
    }
    if (hoursSort === 'asc') {
      return [...list].sort((a, b) => a.weeklyHours - b.weeklyHours)
    }
    return list
  }, [data, query, subject, hoursSort])

  const pageSize = viewMode === 'card' ? CARD_PAGE_SIZE : LIST_PAGE_SIZE
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const columns = useMemo(
    () => [
      columnHelper.accessor('fullName', {
        header: () => t('nav.teachers'),
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      }),
      columnHelper.accessor('status', {
        header: () => t('common.status'),
        cell: (info) => (
          <span className="inline-flex rounded-full bg-fill px-2 py-0.5 text-xs text-text-secondary ring-1 ring-line">
            {t(`status.${info.getValue()}`)}
          </span>
        ),
      }),
      columnHelper.accessor('phone', {
        header: () => t('common.phone'),
      }),
      columnHelper.accessor('specialty', {
        header: () => t('teachers.specialty'),
      }),
      columnHelper.accessor('category', {
        header: () => t('teachers.category'),
      }),
      columnHelper.accessor('experienceYears', {
        header: () => t('teachers.experience'),
      }),
      columnHelper.accessor('schoolName', {
        header: () => t('teachers.school'),
      }),
      columnHelper.accessor('subjects', {
        header: () => t('teachers.subject'),
        cell: (info) => info.getValue().join(', '),
      }),
      columnHelper.accessor('weeklyHours', {
        header: () => t('teachers.weeklyHours'),
        cell: (info) => (
          <HoursBadge
            hours={info.getValue()}
            min={hoursStats.min}
            max={hoursStats.max}
            avg={hoursStats.avg}
          />
        ),
      }),
    ],
    [t, hoursStats],
  )

  const table = useReactTable({
    data: pageItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) return <PageSkeleton />

  const viewToggle = (
    <div className="flex shrink-0 items-center gap-1 rounded-[22px] border border-line bg-fill p-1">
      <GlassButton
        size="sm"
        variant={viewMode === 'card' ? 'primary' : 'ghost'}
        className="!min-w-0 px-2.5"
        icon={<LayoutGrid size={16} strokeWidth={1.75} />}
        aria-label={t('teachers.viewCard')}
        aria-pressed={viewMode === 'card'}
        onClick={() => {
          setViewMode('card')
          setPage(1)
        }}
      />
      <GlassButton
        size="sm"
        variant={viewMode === 'list' ? 'primary' : 'ghost'}
        className="!min-w-0 px-2.5"
        icon={<List size={16} strokeWidth={1.75} />}
        aria-label={t('teachers.viewList')}
        aria-pressed={viewMode === 'list'}
        onClick={() => {
          setViewMode('list')
          setPage(1)
        }}
      />
    </div>
  )

  return (
    <div className="space-y-6 pb-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <h1 className="font-display text-2xl font-semibold md:text-3xl">{t('teachers.title')}</h1>
          <p className="text-sm text-text-secondary">{t('teachers.subtitle')}</p>
        </div>
        {viewToggle}
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <GlassInput
            label={t('nav.search')}
            placeholder={t('teachers.search')}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <div className="w-full shrink-0 sm:w-44">
          <GlassSelect
            label={t('teachers.filterSubject')}
            value={subject}
            onChange={(value) => {
              setSubject(value)
              setPage(1)
            }}
            options={[
              { value: 'all', label: t('common.all') },
              ...subjects.map((s) => ({ value: s, label: s })),
            ]}
          />
        </div>
        <div className="w-full shrink-0 sm:w-48">
          <GlassSelect
            label={t('teachers.filterHours')}
            value={hoursSort}
            onChange={(value) => {
              setHoursSort(value as HoursSort)
              setPage(1)
            }}
            options={[
              { value: 'default', label: t('common.all') },
              { value: 'desc', label: t('teachers.hoursDesc') },
              { value: 'asc', label: t('teachers.hoursAsc') },
            ]}
          />
        </div>
      </div>

      {viewMode === 'card' ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {pageItems.map((teacher) => (
            <Link key={teacher.id} to={`/teachers/${teacher.id}`}>
              <GlassCard className="h-full">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent/40 to-indigo-500/30 font-display text-lg font-semibold">
                    {teacher.fullName
                      .split(' ')
                      .slice(0, 2)
                      .map((p) => p[0])
                      .join('')}
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate font-display text-base font-semibold">{teacher.fullName}</h2>
                    <p className="text-xs text-text-muted">{t(`status.${teacher.status}`)}</p>
                  </div>
                </div>
                <dl className="space-y-1.5 text-sm text-text-secondary">
                  <Row label={t('common.phone')} value={teacher.phone} />
                  <Row label={t('teachers.specialty')} value={teacher.specialty} />
                  <Row label={t('teachers.category')} value={teacher.category} />
                  <Row label={t('teachers.experience')} value={`${teacher.experienceYears}`} />
                  <Row label={t('teachers.school')} value={teacher.schoolName} />
                  <Row label={t('teachers.subject')} value={teacher.subjects.join(', ')} />
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-text-muted">{t('teachers.weeklyHours')}</dt>
                    <dd>
                      <HoursBadge
                        hours={teacher.weeklyHours}
                        min={hoursStats.min}
                        max={hoursStats.max}
                        avg={hoursStats.avg}
                      />
                    </dd>
                  </div>
                </dl>
              </GlassCard>
            </Link>
          ))}
        </div>
      ) : (
        <GlassTable table={table} onRowClick={(row) => navigate(`/teachers/${row.id}`)} />
      )}

      <div className="flex items-center justify-center gap-3">
        <GlassButton size="sm" disabled={safePage <= 1} onClick={() => setPage((p) => p - 1)}>
          ←
        </GlassButton>
        <span className="text-sm text-text-secondary">
          {t('common.page')} {safePage} {t('common.of')} {totalPages}
        </span>
        <GlassButton
          size="sm"
          disabled={safePage >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          →
        </GlassButton>
      </div>
    </div>
  )
}

function HoursBadge({
  hours,
  min,
  max,
  avg,
}: {
  hours: number
  min: number
  max: number
  avg: number
}) {
  const { t } = useTranslation()
  const tone = hoursHeatTone(hours, min, max)
  const color = hoursHeatColor(tone)
  const pct = hoursVsAveragePct(hours, avg)
  const delta =
    pct > 0
      ? t('teachers.hoursMore', { pct })
      : pct < 0
        ? t('teachers.hoursLess', { pct: Math.abs(pct) })
        : t('teachers.hoursSame')

  return (
    <span
      className="inline-flex max-w-full flex-wrap items-center justify-end gap-x-1.5 gap-y-0.5 rounded-full px-2.5 py-1 text-right text-xs font-semibold tabular-nums"
      style={{
        color,
        backgroundColor: `color-mix(in srgb, ${color} 16%, transparent)`,
        boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${color} 35%, transparent)`,
      }}
    >
      <span>{formatHours(hours, t('common.hours'))}</span>
      <span className="font-medium opacity-90">· {delta}</span>
    </span>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-text-muted">{label}</dt>
      <dd className="text-right text-text-primary">{value}</dd>
    </div>
  )
}
