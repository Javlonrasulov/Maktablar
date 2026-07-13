import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GlassCard } from '@/design-system'
import { useTheme } from '@/hooks/useTheme'
import type { School, SchoolStatus } from '@/services/types'

const statusColor: Record<SchoolStatus, string> = {
  normal: '#34d399',
  shortage: '#fbbf24',
  overload: '#fb923c',
  problem: '#f87171',
}

const DEFAULT_CENTER: [number, number] = [40.158, 65.375]
const DEFAULT_ZOOM = 12

function pinIcon(status: SchoolStatus) {
  const color = statusColor[status]
  return L.divIcon({
    className: '',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    html: `<span style="display:block;width:18px;height:18px;border-radius:999px;background:${color};box-shadow:0 0 0 4px ${color}33,0 8px 18px rgba(0,0,0,.45);border:2px solid rgba(255,255,255,.7)"></span>`,
  })
}

function MapViewSync({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [map, center, zoom])
  return null
}

interface DistrictMapProps {
  schools: School[]
  height?: number
  title?: string
  center?: [number, number]
  zoom?: number
  showLegend?: boolean
  showDetailsLink?: boolean
}

export function DistrictMap({
  schools,
  height = 420,
  title,
  center,
  zoom,
  showLegend = true,
  showDetailsLink = true,
}: DistrictMapProps) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const isLight = theme === 'light'

  const mapCenter =
    center ??
    (schools.length === 1 ? ([schools[0].lat, schools[0].lng] as [number, number]) : DEFAULT_CENTER)
  const mapZoom = zoom ?? (schools.length === 1 ? 14 : DEFAULT_ZOOM)

  return (
    <GlassCard className="overflow-hidden p-0" hover={false}>
      {title ? (
        <div className="border-b border-line px-5 py-4">
          <h3 className="font-display text-base">{title}</h3>
        </div>
      ) : null}
      <div style={{ height }} className="relative w-full">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={false}
          className="h-full w-full rounded-[22px]"
          style={{ background: isLight ? '#e2e8f0' : '#0b1220' }}
        >
          <MapViewSync center={mapCenter} zoom={mapZoom} />
          <TileLayer
            key={theme}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url={
              isLight
                ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
                : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            }
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
                  {showDetailsLink ? (
                    <Link to={`/schools/${school.id}`} className="text-sky-600 underline">
                      {t('common.details')}
                    </Link>
                  ) : null}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {showLegend ? (
        <div className="flex flex-wrap gap-3 border-t border-line px-5 py-3 text-xs text-text-secondary">
          {(Object.keys(statusColor) as SchoolStatus[]).map((status) => (
            <span key={status} className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: statusColor[status] }} />
              {t(`status.${status}`)}
            </span>
          ))}
        </div>
      ) : null}
    </GlassCard>
  )
}
