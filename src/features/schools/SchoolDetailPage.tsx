import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { ArrowLeft } from 'lucide-react'
import { GlassButton, GlassCard, PageSkeleton } from '@/design-system'
import { DistrictMap } from '@/features/map/DistrictMap'
import { formatHours } from '@/lib/utils'
import { fetchSchool, fetchSchoolTeachers } from '@/services/mockApi'
import {
  formatAssignmentLine,
  formatVacancyLabel,
  parseClassesList,
  parseSubjectsList,
  parseVacancies,
  VACANCY_OTHER,
} from '@/services/schoolStore'

export function SchoolDetailPage() {
  const { id = '' } = useParams()
  const { t } = useTranslation()
  const { data, isLoading } = useQuery({
    queryKey: ['school', id],
    queryFn: () => fetchSchool(id),
  })
  const { data: teachers = [], isLoading: teachersLoading } = useQuery({
    queryKey: ['school-teachers', id],
    queryFn: () => fetchSchoolTeachers(id),
    enabled: Boolean(id),
  })

  if (isLoading || teachersLoading) return <PageSkeleton />
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

  const subjects = parseSubjectsList(data.subjectsList)
  const classes = parseClassesList(data.classesList)
  const vacancies = parseVacancies(data.vacancies)

  return (
    <div className="flex flex-col gap-6 pb-4">
      <div>
        <Link to="/schools" className="inline-flex">
          <GlassButton size="sm" icon={<ArrowLeft size={16} strokeWidth={1.75} />}>
            {t('common.back')}
          </GlassButton>
        </Link>
      </div>

      <GlassCard>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-text-muted">{t('schools.panel')}</p>
            <h1 className="mt-1 font-display text-2xl font-semibold md:text-3xl">{data.name}</h1>
            <p className="mt-2 text-sm text-text-secondary">
              {t('common.director')}: {data.director} · {data.phone}
            </p>
            <p className="mt-1 text-sm text-text-muted">{data.address}</p>
          </div>
          <span className="rounded-[14px] bg-fill px-3 py-1.5 text-xs ring-1 ring-line">
            {t(`status.${data.status}`)}
          </span>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Metric label={t('common.teachers')} value={data.teachersCount} />
          <Metric label={t('common.students')} value={data.studentsCount} />
          <Metric label={t('common.subjects')} value={data.subjectsCount || subjects.length} />
          <Metric label={t('common.vacancy')} value={formatHours(data.vacantHours, t('common.hours'))} />
        </div>
      </GlassCard>

      <DistrictMap
        schools={[data]}
        height={360}
        title={t('schools.location')}
        center={[data.lat, data.lng]}
        zoom={14}
        showDetailsLink={false}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <h2 className="mb-3 font-display text-base">{t('schools.sections.subjects')}</h2>
          {subjects.length === 0 ? (
            <p className="text-sm text-text-muted">{t('common.noResults')}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {subjects.map((name) => (
                <span key={name} className="rounded-[12px] bg-fill px-3 py-1.5 text-sm ring-1 ring-line">
                  {name}
                </span>
              ))}
            </div>
          )}
        </GlassCard>

        <GlassCard>
          <h2 className="mb-3 font-display text-base">{t('schools.sections.classes')}</h2>
          {classes.length === 0 ? (
            <p className="text-sm text-text-muted">{t('common.noResults')}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {classes.map((name) => (
                <span key={name} className="rounded-[12px] bg-fill px-3 py-1.5 text-sm ring-1 ring-line">
                  {name}
                </span>
              ))}
            </div>
          )}
        </GlassCard>

        <GlassCard>
          <h2 className="mb-3 font-display text-base">{t('schools.sections.vacancies')}</h2>
          {vacancies.length === 0 ? (
            <p className="text-sm text-text-muted">{t('common.noResults')}</p>
          ) : (
            <ul className="space-y-2">
              {vacancies.map((item) => (
                <li key={item.id} className="rounded-[14px] bg-fill px-3 py-2 text-sm">
                  <p className="font-medium">
                    {formatVacancyLabel(item, t('schoolWorkspace.vacancyOther'))}
                  </p>
                  <p className="text-xs text-text-muted">
                    {formatHours(item.hours, t('common.hours'))}
                    {item.subject === VACANCY_OTHER ? ` · ${t('schoolWorkspace.vacancyOther')}` : ''}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </div>

      <GlassCard>
        <h2 className="mb-3 font-display text-base">{t('schools.sections.teachers')}</h2>
        {teachers.length === 0 ? (
          <p className="text-sm text-text-muted">{t('common.noResults')}</p>
        ) : (
          <ul className="space-y-3">
            {teachers.map((teacher) => (
              <li key={teacher.id} className="rounded-[16px] bg-fill px-3 py-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium">{teacher.fullName}</p>
                    <p className="text-xs text-text-muted">
                      {teacher.specialty} · {teacher.phone} ·{' '}
                      {formatHours(teacher.weeklyHours, t('common.hours'))}
                    </p>
                  </div>
                  <Link to={`/teachers/${teacher.id}`} className="text-xs text-accent hover:underline">
                    {t('common.details')}
                  </Link>
                </div>
                {teacher.assignments?.length ? (
                  <ul className="mt-2 space-y-1 border-t border-line pt-2">
                    {teacher.assignments.map((item) => (
                      <li key={item.id} className="text-sm text-text-secondary">
                        {formatAssignmentLine(item, t('common.hours'))}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </GlassCard>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[18px] bg-fill p-3">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="mt-1 font-display text-xl font-semibold">{value}</p>
    </div>
  )
}
