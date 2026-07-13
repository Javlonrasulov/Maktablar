import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  FileBarChart,
  GraduationCap,
  Users,
  Briefcase,
} from 'lucide-react'
import { GlassButton, GlassCard, PageSkeleton } from '@/design-system'
import { fetchSchool } from '@/services/mockApi'

const sections = [
  { key: 'teachers', icon: Users },
  { key: 'subjects', icon: BookOpen },
  { key: 'classes', icon: GraduationCap },
  { key: 'workloads', icon: ClipboardList },
  { key: 'vacancies', icon: Briefcase },
  { key: 'schedule', icon: CalendarDays },
  { key: 'reports', icon: FileBarChart },
] as const

export function SchoolDetailPage() {
  const { id = '' } = useParams()
  const { t } = useTranslation()
  const { data, isLoading } = useQuery({
    queryKey: ['school', id],
    queryFn: () => fetchSchool(id),
  })

  if (isLoading) return <PageSkeleton />
  if (!data) {
    return (
      <div className="space-y-4">
        <p>{t('common.noResults')}</p>
        <Link to="/schools">
          <GlassButton>{t('common.back')}</GlassButton>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-4">
      <Link to="/schools" className="text-sm text-accent hover:underline">
        ← {t('common.back')}
      </Link>

      <GlassCard>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-text-muted">{t('schools.panel')}</p>
            <h1 className="mt-1 font-display text-2xl font-semibold md:text-3xl">{data.name}</h1>
            <p className="mt-2 text-sm text-text-secondary">
              {t('common.director')}: {data.director} · {data.phone}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['director', 'operator', 'admin'] as const).map((role) => (
              <span key={role} className="rounded-full bg-white/5 px-3 py-1.5 text-xs ring-1 ring-white/10">
                {t(`schools.roles.${role}`)}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Metric label={t('common.teachers')} value={data.teachersCount} />
          <Metric label={t('common.students')} value={data.studentsCount} />
          <Metric label={t('common.subjects')} value={data.subjectsCount} />
          <Metric label={t('schools.weeklyLoad')} value={`${data.weeklyHours}h`} />
        </div>
      </GlassCard>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <GlassCard key={section.key} className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <Icon size={20} strokeWidth={1.6} />
              </div>
              <div>
                <p className="font-medium">{t(`schools.sections.${section.key}`)}</p>
                <p className="text-xs text-text-muted">{t(`status.${data.status}`)}</p>
              </div>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[18px] bg-white/5 p-3">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="mt-1 font-display text-xl font-semibold">{value}</p>
    </div>
  )
}
