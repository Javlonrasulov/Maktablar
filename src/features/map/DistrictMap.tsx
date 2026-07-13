import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GlassCard } from '@/design-system'
import type { School, SchoolStatus } from '@/services/types'

const statusColor: Record<SchoolStatus, string> = {
  normal: '#34d399',
  shortage: '#fbbf24',
  overload: '#fb923c',
  problem: '#f87171',
}

function pinIcon(status: SchoolStatus) {
  const color = statusColor[status]
  return L.divIcon({
    className: '',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    html: `<span style="display:block;width:18px;height:18px;border-radius:999px;background:${color};box-shadow:0 0 0 4px ${color}33,0 8px 18px rgba(0,0,0,.45);border:2px solid rgba(255,255,255,.7)"></span>`,
  })
}

interface DistrictMapProps {
  schools: School[]
  height?: number
  title?: string
}

export function DistrictMap({ schools, height = 420, title }: DistrictMapProps) {
  const { t } = useTranslation()

  return (
    <GlassCard className="overflow-hidden p-0">
      {title ? (
        <div className="border-b border-white/10 px-5 py-4">
          <h3 className="font-display text-base">{title}</h3>
        </div>
      ) : null}
      <div style={{ height }} className="relative w-full">
        <MapContainer
          center={[40.158, 65.375]}
          zoom={12}
          scrollWheelZoom={false}
          className="h-full w-full rounded-[22px]"
          style={{ background: '#0b1220' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          {schools.map((school) => (
            <Marker key={school.id} position={[school.lat, school.lng]} icon={pinIcon(school.status)}>
              <Popup className="navbahor-popup">
                <div className="min-w-[180px] space-y-1 text-sm">
                  <p className="font-semibold">{school.name}</p>
                  <p>
                    {t('common.director')}: {school.director}
                  </p>
                  <p>
                    {t('common.status')}: {t(`status.${school.status}`)}
                  </p>
                  <p>
                    {t('common.teachers')}: {school.teachersCount}
                  </p>
                  <Link to={`/schools/${school.id}`} className="text-sky-600 underline">
                    {t('common.details')}
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="flex flex-wrap gap-3 border-t border-white/10 px-5 py-3 text-xs text-text-secondary">
        {(Object.keys(statusColor) as SchoolStatus[]).map((status) => (
          <span key={status} className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: statusColor[status] }} />
            {t(`status.${status}`)}
          </span>
        ))}
      </div>
    </GlassCard>
  )
}
