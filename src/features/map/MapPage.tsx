import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { PageSkeleton } from '@/design-system'
import { fetchSchools } from '@/services/mockApi'
import { DistrictMap } from '@/features/map/DistrictMap'

export function MapPage() {
  const { t } = useTranslation()
  const { data = [], isLoading } = useQuery({ queryKey: ['schools'], queryFn: fetchSchools })

  if (isLoading) return <PageSkeleton />

  return (
    <div className="space-y-6 pb-4">
      <header className="space-y-2">
        <h1 className="font-display text-2xl font-semibold md:text-3xl">{t('map.title')}</h1>
        <p className="text-sm text-text-secondary">{t('map.subtitle')}</p>
      </header>
      <DistrictMap schools={data} height={560} />
    </div>
  )
}
