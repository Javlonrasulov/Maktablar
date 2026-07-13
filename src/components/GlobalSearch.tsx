import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { GlassInput, GlassModal } from '@/design-system'
import { globalSearch } from '@/services/mockApi'

interface GlobalSearchProps {
  open: boolean
  onClose: () => void
}

export function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')

  const { data, isFetching } = useQuery({
    queryKey: ['search', query],
    queryFn: () => globalSearch(query),
    enabled: open && query.trim().length > 0,
  })

  const hasResults = useMemo(
    () =>
      (data?.schools.length ?? 0) +
        (data?.teachers.length ?? 0) +
        (data?.subjects.length ?? 0) >
      0,
    [data],
  )

  return (
    <GlassModal open={open} onClose={onClose} title={t('search.title')} className="max-w-2xl">
      <GlassInput
        autoFocus
        placeholder={t('search.hint')}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="mt-4 max-h-[50vh] space-y-4 overflow-auto">
        {isFetching ? <p className="text-sm text-text-muted">{t('common.loading')}</p> : null}
        {!isFetching && query && !hasResults ? (
          <p className="text-sm text-text-muted">{t('common.noResults')}</p>
        ) : null}

        {data?.schools.length ? (
          <section>
            <h3 className="mb-2 text-xs uppercase tracking-wider text-text-muted">{t('search.schools')}</h3>
            <div className="space-y-1">
              {data.schools.map((s) => (
                <Link
                  key={s.id}
                  to={`/schools/${s.id}`}
                  onClick={onClose}
                  className="block rounded-[16px] px-3 py-2 hover:bg-white/5"
                >
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-text-muted">{s.director} · {s.phone}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {data?.teachers.length ? (
          <section>
            <h3 className="mb-2 text-xs uppercase tracking-wider text-text-muted">{t('search.teachers')}</h3>
            <div className="space-y-1">
              {data.teachers.map((teacher) => (
                <Link
                  key={teacher.id}
                  to={`/teachers/${teacher.id}`}
                  onClick={onClose}
                  className="block rounded-[16px] px-3 py-2 hover:bg-white/5"
                >
                  <p className="text-sm font-medium">{teacher.fullName}</p>
                  <p className="text-xs text-text-muted">
                    {teacher.specialty} · {teacher.schoolName}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {data?.subjects.length ? (
          <section>
            <h3 className="mb-2 text-xs uppercase tracking-wider text-text-muted">{t('search.subjects')}</h3>
            <div className="space-y-1">
              {data.subjects.map((subject) => (
                <Link
                  key={subject.id}
                  to="/subjects"
                  onClick={onClose}
                  className="block rounded-[16px] px-3 py-2 hover:bg-white/5"
                >
                  <p className="text-sm font-medium">{subject.name}</p>
                  <p className="text-xs text-text-muted">
                    {subject.teachersCount} · {subject.totalHours}h
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </GlassModal>
  )
}
