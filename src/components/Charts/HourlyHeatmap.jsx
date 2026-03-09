import { useMemo } from 'react'
import { parseISO, format } from 'date-fns'
import { convertTemp } from '@/utils/temperature'
import { useAppStore } from '@/store/useAppStore'

function interpolateColor(value, min, max) {
  if (value == null || max === min) return '#1e2340'
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)))
  if (t < 0.5) {
    const t2 = t * 2
    return `rgb(${Math.round(t2 * 234)},${Math.round(212 + t2 * (179 - 212))},${Math.round(255 + t2 * (8 - 255))})`
  }
  const t2 = (t - 0.5) * 2
  return `rgb(${Math.round(234 + t2 * 21)},${Math.round(179 + t2 * (87 - 179))},${Math.round(8 + t2 * 43)})`
}

export default function HourlyHeatmap({ zoneData, isLoading }) {
  const unit = useAppStore(s => s.unit)

  const { grid, days, min, max } = useMemo(() => {
    const urban = zoneData?.[0]?.hourly
    if (!urban?.times?.length) return { grid: [], days: [], min: 0, max: 40 }

    const dayMap = {}
    const allTemps = []

    urban.times.forEach((timeStr, i) => {
      try {
        const date = parseISO(timeStr)
        const dayKey = format(date, 'MMM d')
        const hour = date.getHours()
        if (!dayMap[dayKey]) dayMap[dayKey] = new Array(24).fill(null)
        const temp = urban.temperatures[i]
        if (temp != null) {
          const converted = convertTemp(temp, unit)
          dayMap[dayKey][hour] = converted
          allTemps.push(converted)
        }
      } catch { /* skip */ }
    })

    const days = Object.keys(dayMap)
    const grid = days.map(d => dayMap[d])
    const min = allTemps.length ? Math.min(...allTemps) : 0
    const max = allTemps.length ? Math.max(...allTemps) : 40
    return { grid, days, min, max }
  }, [zoneData, unit])

  if (isLoading) {
    return <div className="h-28 rounded-lg animate-pulse" style={{ background: 'var(--color-bg-elevated)' }} />
  }

  if (!grid.length) return null

  const HOURS = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div>
      <h3
        className="text-[11px] font-semibold uppercase tracking-widest mb-2"
        style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}
      >
        Urban Hourly Heat Grid
      </h3>

      <div className="overflow-x-auto">
        <div style={{ minWidth: 300 }}>
          {/* Hour labels */}
          <div className="flex" style={{ paddingLeft: 52 }}>
            {[0, 6, 12, 18, 23].map(h => (
              <div
                key={h}
                className="text-[9px] flex-shrink-0"
                style={{
                  width: `${(h === 23 ? 1 : h === 18 ? 5 : 6) / 24 * 100}%`,
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-mono)',
                  textAlign: h === 23 ? 'right' : 'left',
                }}
              >
                {h === 0 ? '12am' : h === 12 ? '12pm' : `${h > 12 ? h - 12 : h}${h >= 12 ? 'p' : 'a'}`}
              </div>
            ))}
          </div>

          {/* Grid rows */}
          {grid.map((row, di) => (
            <div key={days[di]} className="flex items-center mb-0.5">
              <span
                className="text-[10px] flex-shrink-0 text-right pr-2"
                style={{ width: 52, color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}
              >
                {days[di]}
              </span>
              <div className="flex flex-1 gap-px">
                {HOURS.map(h => {
                  const val = row[h]
                  return (
                    <div
                      key={h}
                      className="flex-1 rounded-[2px]"
                      style={{
                        height: 16,
                        background: val != null ? interpolateColor(val, min, max) : 'var(--color-divider)',
                        minWidth: 0,
                      }}
                      title={val != null ? `${format(new Date(2000, 0, 1, h), 'ha')}: ${val.toFixed(1)}°${unit}` : ''}
                    />
                  )
                })}
              </div>
            </div>
          ))}

          {/* Legend */}
          <div className="flex items-center gap-2 mt-2" style={{ paddingLeft: 52 }}>
            <span className="text-[9px]" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
              {min.toFixed(0)}°{unit}
            </span>
            <div
              className="flex-1 h-1.5 rounded"
              style={{ background: 'linear-gradient(to right, rgb(0,212,255), rgb(234,179,8), rgb(255,87,51))' }}
            />
            <span className="text-[9px]" style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
              {max.toFixed(0)}°{unit}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
