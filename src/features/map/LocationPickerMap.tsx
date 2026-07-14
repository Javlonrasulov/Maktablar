import { useCallback, useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { useTranslation } from 'react-i18next'
import { Expand, Layers, Minimize2, Mountain, Satellite } from 'lucide-react'
import { GlassCard } from '@/design-system'
import { useTheme } from '@/hooks/useTheme'

const DEFAULT_CENTER: [number, number] = [40.158, 65.375]
const DEFAULT_ZOOM = 13

type MapBaseLayer = 'streets' | 'satellite' | 'terrain'

const pinIcon = L.divIcon({
  className: 'location-picker-pin',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  html: `<span style="
    display:block;
    width:28px;
    height:28px;
    border-radius:50% 50% 50% 0;
    transform:rotate(-45deg);
    background:#38bdf8;
    border:2px solid #fff;
    box-shadow:0 2px 8px rgba(15,23,42,.35);
  "></span>`,
})

function MapClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

function MapViewSync({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [map, center, zoom])
  return null
}

function MapResizeSync({ active }: { active: boolean }) {
  const map = useMap()
  useEffect(() => {
    const id = window.setTimeout(() => map.invalidateSize(), 80)
    return () => window.clearTimeout(id)
  }, [map, active])
  return null
}

function ScrollZoomSync({ enabled }: { enabled: boolean }) {
  const map = useMap()
  useEffect(() => {
    if (enabled) map.scrollWheelZoom.enable()
    else map.scrollWheelZoom.disable()
  }, [map, enabled])
  return null
}

function BaseTileLayer({ layer, isLight }: { layer: MapBaseLayer; isLight: boolean }) {
  if (layer === 'satellite') {
    return (
      <TileLayer
        key="satellite"
        attribution="Tiles &copy; Esri"
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        maxZoom={19}
      />
    )
  }

  if (layer === 'terrain') {
    return (
      <TileLayer
        key="terrain"
        attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
        url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
        maxZoom={17}
      />
    )
  }

  return (
    <TileLayer
      key={`streets-${isLight ? 'light' : 'dark'}`}
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
      url={
        isLight
          ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      }
      maxZoom={20}
    />
  )
}

interface LocationPickerMapProps {
  lat: number
  lng: number
  onChange: (lat: number, lng: number) => void
  height?: number
  title?: string
}

export function LocationPickerMap({
  lat,
  lng,
  onChange,
  height = 420,
  title,
}: LocationPickerMapProps) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const isLight = theme === 'light'
  const shellRef = useRef<HTMLDivElement>(null)
  const layersRef = useRef<HTMLDivElement>(null)
  const cssFullscreenRef = useRef(false)
  const [baseLayer, setBaseLayer] = useState<MapBaseLayer>('streets')
  const [layersOpen, setLayersOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const hasPoint = Number.isFinite(lat) && Number.isFinite(lng) && !(lat === 0 && lng === 0)
  const center: [number, number] = hasPoint ? [lat, lng] : DEFAULT_CENTER
  const zoom = hasPoint ? 14 : DEFAULT_ZOOM

  useEffect(() => {
    const onFsChange = () => {
      const el = shellRef.current
      const native = Boolean(el && document.fullscreenElement === el)
      if (native) cssFullscreenRef.current = false
      setIsFullscreen(native || cssFullscreenRef.current)
    }
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  useEffect(() => {
    if (!layersOpen) return
    const onPointer = (event: MouseEvent) => {
      const target = event.target as Node
      if (layersRef.current && !layersRef.current.contains(target)) setLayersOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    return () => document.removeEventListener('mousedown', onPointer)
  }, [layersOpen])

  useEffect(() => {
    if (!isFullscreen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (document.fullscreenElement) return
      cssFullscreenRef.current = false
      setIsFullscreen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isFullscreen])

  const toggleFullscreen = useCallback(async () => {
    const el = shellRef.current
    if (!el) return
    try {
      if (document.fullscreenElement === el) {
        await document.exitFullscreen()
        return
      }
      if (cssFullscreenRef.current) {
        cssFullscreenRef.current = false
        setIsFullscreen(false)
        return
      }
      await el.requestFullscreen()
    } catch {
      cssFullscreenRef.current = !cssFullscreenRef.current
      setIsFullscreen(cssFullscreenRef.current)
    }
  }, [])

  const layerOptions: { id: MapBaseLayer; label: string; icon: typeof Layers }[] = [
    { id: 'streets', label: t('map.layers.streets'), icon: Layers },
    { id: 'satellite', label: t('map.layers.satellite'), icon: Satellite },
    { id: 'terrain', label: t('map.layers.terrain'), icon: Mountain },
  ]

  return (
    <div
      ref={shellRef}
      className={
        isFullscreen
          ? 'fixed inset-0 z-[1000] flex h-screen w-screen flex-col bg-bg-base'
          : undefined
      }
    >
      <GlassCard
        className={
          isFullscreen
            ? 'flex h-full min-h-0 flex-1 flex-col overflow-hidden rounded-none p-0'
            : 'overflow-hidden p-0'
        }
        hover={false}
        asMotion={!isFullscreen}
      >
        {title && !isFullscreen ? (
          <div className="border-b border-line px-5 py-4">
            <h3 className="font-display text-base">{title}</h3>
            <p className="mt-1 text-sm text-text-muted">{t('schoolWorkspace.locationHint')}</p>
          </div>
        ) : null}
        <div
          style={isFullscreen ? undefined : { height }}
          className={`relative w-full ${isFullscreen ? 'min-h-0 flex-1' : ''}`}
        >
          <MapContainer
            center={center}
            zoom={zoom}
            scrollWheelZoom={false}
            className={`h-full w-full ${isFullscreen ? 'rounded-none' : 'rounded-[22px]'}`}
            style={{ background: isLight ? '#e2e8f0' : '#0b1220' }}
          >
            <MapViewSync center={center} zoom={zoom} />
            <MapResizeSync active={isFullscreen} />
            <ScrollZoomSync enabled />
            <BaseTileLayer layer={baseLayer} isLight={isLight} />
            <MapClickHandler onPick={onChange} />
            {hasPoint ? <Marker position={[lat, lng]} icon={pinIcon} /> : null}
          </MapContainer>

          <div className="pointer-events-none absolute right-3 top-3 z-[500] flex flex-col items-end gap-2">
            <div ref={layersRef} className="pointer-events-auto relative">
              <button
                type="button"
                onClick={() => setLayersOpen((open) => !open)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-glass-border bg-glass-strong text-text-primary shadow-float backdrop-blur-md transition hover:bg-fill-strong"
                title={t('map.layersTitle')}
                aria-expanded={layersOpen}
                aria-label={t('map.layersTitle')}
              >
                <Layers size={18} />
              </button>
              {layersOpen ? (
                <div className="absolute right-0 top-12 min-w-[190px] overflow-hidden rounded-xl border border-glass-border bg-glass-strong p-1 shadow-float backdrop-blur-md">
                  {layerOptions.map(({ id, label, icon: Icon }) => {
                    const active = baseLayer === id
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          setBaseLayer(id)
                          setLayersOpen(false)
                        }}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                          active
                            ? 'bg-accent-soft text-accent'
                            : 'text-text-primary hover:bg-fill'
                        }`}
                      >
                        <Icon size={16} className="shrink-0 opacity-80" />
                        <span className="font-medium">{label}</span>
                      </button>
                    )
                  })}
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-xl border border-glass-border bg-glass-strong text-text-primary shadow-float backdrop-blur-md transition hover:bg-fill-strong"
              title={isFullscreen ? t('map.exitFullscreen') : t('map.fullscreen')}
              aria-label={isFullscreen ? t('map.exitFullscreen') : t('map.fullscreen')}
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Expand size={18} />}
            </button>
          </div>
        </div>
        {!isFullscreen ? (
          <div className="border-t border-line px-5 py-3 text-xs text-text-muted">
            {t('schoolWorkspace.locationCoords', {
              lat: hasPoint ? lat.toFixed(5) : '—',
              lng: hasPoint ? lng.toFixed(5) : '—',
            })}
          </div>
        ) : null}
      </GlassCard>
    </div>
  )
}
