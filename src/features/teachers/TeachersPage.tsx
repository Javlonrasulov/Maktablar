import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { GlassCard, GlassInput, PageSkeleton } from '@/design-system'
import { fetchTeachers } from '@/services/mockApi'

export function TeachersPage() {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const { data = [], isLoading } = useQuery({ queryKey: ['teachers'], queryFn: fetchTeachers })

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return data
    return data.filter(
      (teacher) =>
        teacher.fullName.toLowerCase().includes(q) ||
        teacher.phone.includes(q) ||
        teacher.specialty.toLowerCase().includes(q) ||
        teacher.subjects.some((s) => s.toLowerCase().includes(q)),
    )
  }, [data, query])

  if (isLoading) return <PageSkeleton />

  return (
    <div className="space-y-6 pb-4">
      <header className="space-y-2">
        <h1 className="font-display text-2xl font-semibold md:text-3xl">{t('teachers.title')}</h1>
        <p className="text-sm text-text-secondary">{t('teachers.subtitle')}</p>
      </header>

      <GlassInput
        placeholder={t('teachers.search')}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((teacher) => (
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
                <Row label={t('teachers.weeklyHours')} value={`${teacher.weeklyHours}h`} />
              </dl>
            </GlassCard>
          </Link>
        ))}
      </div>
    </div>
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
