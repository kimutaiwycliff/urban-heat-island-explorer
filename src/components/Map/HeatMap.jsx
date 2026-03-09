import { useRef, useState, useCallback, useEffect } from 'react'
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { ZONE_COLORS, ZONE_NAMES } from '@/data/cities'
import { formatTemp } from '@/utils/temperature'
import { useAppStore } from '@/store/useAppStore'
import { useZoneWeather } from '@/hooks/useZoneWeather'

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
const ZONE_SIZES = [22, 16, 14, 12]

export default function HeatMap() {
  const mapRef = useRef(null)
  const selectedCity = useAppStore(s => s.selectedCity)
  const unit = useAppStore(s => s.unit)
  const { zoneData } = useZoneWeather(selectedCity)

  const [popup, setPopup] = useState(null)
  const [viewState, setViewState] = useState({
    longitude: -74.006,
    latitude: 40.7128,
    zoom: 9,
  })

  const flyToCity = useCallback((city) => {
    mapRef.current?.flyTo({
      center: [city.lng, city.lat],
      zoom: 9,
      duration: 1400,
      essential: true,
    })
  }, [])

  useEffect(() => {
    if (selectedCity) flyToCity(selectedCity)
  }, [selectedCity, flyToCity])

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={e => setViewState(e.viewState)}
        mapStyle={MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
      >
        <NavigationControl position="bottom-right" showCompass={false} />

        {zoneData.map((zone, i) => {
          const color = ZONE_COLORS[i]
          const size = ZONE_SIZES[i]
          return (
            <Marker
              key={`${zone.zone}-${i}`}
              longitude={zone.lng}
              latitude={zone.lat}
              anchor="center"
            >
              <button
                onClick={() => setPopup(popup?.zoneIdx === i ? null : { ...zone, zoneIdx: i })}
                style={{ width: size + 16, height: size + 16 }}
                className="relative flex items-center justify-center cursor-pointer bg-transparent border-0 p-0"
                aria-label={`${zone.zone} marker`}
              >
                <span
                  className="absolute inset-0 rounded-full animate-glow-pulse"
                  style={{ background: `radial-gradient(circle, ${color}40 0%, transparent 70%)` }}
                />
                <span
                  className="rounded-full z-10"
                  style={{
                    width: size,
                    height: size,
                    background: color,
                    boxShadow: `0 0 12px ${color}cc, 0 0 24px ${color}44`,
                  }}
                />
              </button>
            </Marker>
          )
        })}

        {popup && (
          <Popup
            longitude={popup.lng}
            latitude={popup.lat}
            anchor="bottom"
            onClose={() => setPopup(null)}
            offset={16}
          >
            <div className="space-y-1">
              <div
                className="font-bold text-[11px] uppercase tracking-wider mb-2"
                style={{ color: ZONE_COLORS[popup.zoneIdx], fontFamily: 'var(--font-mono)' }}
              >
                {ZONE_NAMES[popup.zoneIdx]}
              </div>
              {[
                ['Temp', formatTemp(popup.current?.temperature, unit)],
                ['Humidity', popup.current?.humidity != null ? `${popup.current.humidity}%` : '—'],
                ['Wind', popup.current?.windSpeed != null ? `${popup.current.windSpeed} km/h` : '—'],
              ].map(([label, value]) => (
                <div key={label} style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)' }}>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{label}: </span>
                  {value}
                </div>
              ))}
            </div>
          </Popup>
        )}
      </Map>

      {/* Zone legend */}
      <div
        className="absolute bottom-4 left-4 rounded-lg p-3 space-y-1.5"
        style={{
          background: 'rgba(13,15,28,0.88)',
          border: '1px solid var(--color-divider-bright)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {ZONE_NAMES.map((name, i) => (
          <div key={name} className="flex items-center gap-2">
            <span
              className="rounded-full flex-shrink-0"
              style={{ width: 8, height: 8, background: ZONE_COLORS[i], boxShadow: `0 0 6px ${ZONE_COLORS[i]}` }}
            />
            <span
              className="text-[11px] font-medium"
              style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}
            >
              {name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
