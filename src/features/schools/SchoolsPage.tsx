import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Building2, LayoutGrid, List, Phone, Plus, User } from 'lucide-react'
import {
  GlassButton,
  GlassCard,
  GlassDrawer,
  GlassInput,
  GlassTable,
  PageSkeleton,
} from '@/design-system'
import { DistrictMap } from '@/features/map/DistrictMap'
import { AddSchoolModal } from '@/features/schools/AddSchoolModal'
import { useAuth } from '@/hooks/useAuth'
import { formatHours } from '@/lib/utils'
import { fetchSchools } from '@/services/mockApi'
import type { School, SchoolStatus } from '@/services/types'

type ViewMode = 'card' | 'list'

const PAGE_SIZE = 20

const columnHelper = createColumnHelper<School>()

export function SchoolsPage() {
  const { t } = useTranslation()
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<SchoolStatus | 'all'>('all')
  const [page, setPage] = useState(1)
  const [filterOpen, setFilterOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  const [addOpen, setAddOpen] = useState(false)

  const { data = [], isLoading } = useQuery({ queryKey: ['schools'], queryFn: fetchSchools })

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return data.filter((s) => {
      const matchQ =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.director.toLowerCase().includes(q) ||
        s.phone.includes(q)
      const matchS = status === 'all' || s.status === status
      return matchQ && matchS
    })
  }, [data, query, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: () => t('nav.schools'),
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
      columnHelper.accessor('director', {
        header: () => t('common.director'),
      }),
      columnHelper.accessor('phone', {
        header: () => t('common.phone'),
      }),
      columnHelper.accessor('teachersCount', {
        header: () => t('common.teachers'),
      }),
      columnHelper.accessor('studentsCount', {
        header: () => t('common.students'),
      }),
      columnHelper.accessor('subjectsCount', {
        header: () => t('common.subjects'),
      }),
      columnHelper.accessor('weeklyHours', {
        header: () => t('schools.weeklyLoad'),
        cell: (info) => formatHours(info.getValue(), t('common.hours')),
      }),
    ],
    [t],
  )

  const table = useReactTable({
    data: pageItems,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) return <PageSkeleton />

  const filters = (
    <div className="space-y-3">
      <p className="text-sm text-text-secondary">{t('schools.filterStatus')}</p>
      <div className="flex flex-wrap gap-2">
        {(['all', 'normal', 'shortage', 'overload', 'problem'] as const).map((s) => (
          <GlassButton
            key={s}
            size="sm"
            variant={status === s ? 'primary' : 'glass'}
            onClick={() => {
              setStatus(s)
              setPage(1)
              setFilterOpen(false)
            }}
          >
            {s === 'all' ? t('common.all') : t(`status.${s}`)}
          </GlassButton>
        ))}
      </div>
    </div>
  )

  const viewToggle = (
    <div className="flex shrink-0 items-center gap-1 rounded-[22px] border border-line bg-fill p-1">
      <GlassButton
        size="sm"
        variant={viewMode === 'card' ? 'primary' : 'ghost'}
        className="!min-w-0 px-2.5"
        icon={<LayoutGrid size={16} strokeWidth={1.75} />}
        aria-label={t('schools.viewCard')}
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
        aria-label={t('schools.viewList')}
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
          <h1 className="font-display text-2xl font-semibold md:text-3xl">{t('schools.title')}</h1>
          <p className="text-sm text-text-secondary md:text-base">{t('schools.subtitle')}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {isAdmin ? (
            <GlassButton variant="primary" icon={<Plus size={16} />} onClick={() => setAddOpen(true)}>
              {t('schools.add')}
            </GlassButton>
          ) : null}
          {viewToggle}
        </div>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <GlassInput
            placeholder={t('schools.search')}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <GlassButton className="md:hidden" onClick={() => setFilterOpen(true)}>
          {t('common.filter')}
        </GlassButton>
        <div className="hidden md:block">{filters}</div>
      </div>

      {viewMode === 'card' ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {pageItems.map((school) => (
            <Link key={school.id} to={`/schools/${school.id}`}>
              <GlassCard className="h-full">
                <div className="mb-4 flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                    <Building2 size={22} strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-display text-lg font-semibold">{school.name}</h2>
                    <span className="mt-1 inline-flex rounded-full bg-fill px-2 py-0.5 text-xs text-text-secondary ring-1 ring-line">
                      {t(`status.${school.status}`)}
                    </span>
                    {!school.profileComplete ? (
                      <span className="mt-1 ml-1 inline-flex rounded-full bg-warning/10 px-2 py-0.5 text-xs text-warning ring-1 ring-warning/20">
                        {t('schools.incomplete')}
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="space-y-2 text-sm text-text-secondary">
                  <p className="flex items-center gap-2">
                    <User size={14} /> {school.director}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={14} /> {school.phone}
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-[16px] bg-fill p-3">
                    <p className="text-xs text-text-muted">{t('common.teachers')}</p>
                    <p className="font-semibold">{school.teachersCount}</p>
                  </div>
                  <div className="rounded-[16px] bg-fill p-3">
                    <p className="text-xs text-text-muted">{t('common.students')}</p>
                    <p className="font-semibold">{school.studentsCount}</p>
                  </div>
                  <div className="rounded-[16px] bg-fill p-3">
                    <p className="text-xs text-text-muted">{t('common.subjects')}</p>
                    <p className="font-semibold">{school.subjectsCount}</p>
                  </div>
                  <div className="rounded-[16px] bg-fill p-3">
                    <p className="text-xs text-text-muted">{t('schools.weeklyLoad')}</p>
                    <p className="font-semibold">{formatHours(school.weeklyHours, t('common.hours'))}</p>
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      ) : (
        <GlassTable table={table} onRowClick={(row) => navigate(`/schools/${row.id}`)} />
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

      <DistrictMap schools={filtered} height={420} title={t('schools.mapTitle')} />

      <GlassDrawer open={filterOpen} onClose={() => setFilterOpen(false)} title={t('common.filter')}>
        {filters}
      </GlassDrawer>

      <AddSchoolModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}
