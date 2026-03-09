import { Wind, Droplets, Thermometer } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ZONE_COLORS, ZONE_NAMES } from '@/data/cities'
import { formatTemp, getWeatherDescription } from '@/utils/temperature'
import { useAppStore } from '@/store/useAppStore'

function ZoneCard({ zone, zoneIdx, isLoading }) {
  const unit = useAppStore(s => s.unit)
  const color = ZONE_COLORS[zoneIdx]
  const current = zone?.current

  return (
    <Card
      className="relative overflow-hidden transition-all duration-300"
      style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-divider)',
        borderLeft: `3px solid ${color}`,
      }}
    >
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: color, boxShadow: `0 0 6px ${color}` }}
            />
            <span
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color, fontFamily: 'var(--font-mono)' }}
            >
              {ZONE_NAMES[zoneIdx]}
            </span>
          </div>
          {!isLoading && current?.weatherCode != null && (
            <Badge
              variant="secondary"
              className="text-[9px] px-1.5 py-0 h-auto leading-4 rounded"
              style={{ background: `${color}18`, color: 'var(--color-text-secondary)', border: 'none' }}
            >
              {getWeatherDescription(current.weatherCode)}
            </Badge>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-1.5">
            <div className="h-6 w-20 rounded animate-pulse" style={{ background: 'var(--color-bg-elevated)' }} />
            <div className="h-3 w-32 rounded animate-pulse" style={{ background: 'var(--color-bg-elevated)' }} />
          </div>
        ) : (
          <>
            <div
              className="text-2xl font-black leading-none mb-2"
              style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}
            >
              {formatTemp(current?.temperature, unit)}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1">
                <Droplets size={10} style={{ color: 'var(--color-text-muted)' }} />
                <span className="text-[10px]" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  {current?.humidity != null ? `${current.humidity}%` : '—'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Wind size={10} style={{ color: 'var(--color-text-muted)' }} />
                <span className="text-[10px]" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  {current?.windSpeed != null ? `${current.windSpeed} km/h` : '—'}
                </span>
              </div>
              {current?.apparentTemp != null && (
                <div className="flex items-center gap-1">
                  <Thermometer size={10} style={{ color: 'var(--color-text-muted)' }} />
                  <span className="text-[10px]" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
                    {formatTemp(current.apparentTemp, unit)}
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default function CurrentConditions({ zoneData, isLoading }) {
  return (
    <div className="space-y-2">
      <h3
        className="text-[11px] font-semibold uppercase tracking-widest"
        style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}
      >
        Zone Conditions
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {[0, 1, 2, 3].map(i => (
          <ZoneCard key={i} zone={zoneData?.[i]} zoneIdx={i} isLoading={isLoading} />
        ))}
      </div>
    </div>
  )
}
