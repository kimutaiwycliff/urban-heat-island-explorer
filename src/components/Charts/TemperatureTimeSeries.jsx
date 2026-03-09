import { useMemo } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { ZONE_COLORS, ZONE_NAMES } from '@/data/cities'
import { convertTemp } from '@/utils/temperature'
import { useAppStore } from '@/store/useAppStore'

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs shadow-xl"
      style={{
        background: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-divider-bright)',
        fontFamily: 'var(--font-mono)',
      }}
    >
      <p className="mb-1.5 font-bold" style={{ color: 'var(--color-text-secondary)' }}>{label}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: 'var(--color-text-secondary)' }}>{p.name}:</span>
          <span style={{ color: p.color, fontWeight: 700 }}>
            {p.value != null ? `${p.value.toFixed(1)}°${unit}` : '—'}
          </span>
        </div>
      ))}
    </div>
  )
}

const CustomLegend = ({ payload }) => (
  <div className="flex items-center justify-center gap-4 mt-2 flex-wrap">
    {payload?.map(p => (
      <div key={p.value} className="flex items-center gap-1.5">
        <span className="w-4 h-0.5 rounded inline-block" style={{ background: p.color }} />
        <span className="text-[10px]" style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}>
          {p.value}
        </span>
      </div>
    ))}
  </div>
)

export default function TemperatureTimeSeries({ zoneData, isLoading }) {
  const unit = useAppStore(s => s.unit)

  const chartData = useMemo(() => {
    if (!zoneData?.length) return []
    const urban = zoneData[0]?.hourly
    const inner = zoneData[1]?.hourly
    const outer = zoneData[2]?.hourly
    const rural = zoneData[3]?.hourly
    if (!urban?.times?.length) return []

    const result = []
    for (let i = 0; i < urban.times.length; i += 3) {
      try {
        const date = parseISO(urban.times[i])
        result.push({
          shortTime: format(date, 'MMM d'),
          [ZONE_NAMES[0]]: urban.temperatures[i] != null ? convertTemp(urban.temperatures[i], unit) : null,
          [ZONE_NAMES[1]]: inner?.temperatures[i] != null ? convertTemp(inner.temperatures[i], unit) : null,
          [ZONE_NAMES[2]]: outer?.temperatures[i] != null ? convertTemp(outer.temperatures[i], unit) : null,
          [ZONE_NAMES[3]]: rural?.temperatures[i] != null ? convertTemp(rural.temperatures[i], unit) : null,
        })
      } catch { /* skip */ }
    }
    return result
  }, [zoneData, unit])

  if (isLoading) {
    return <div className="h-48 rounded-lg animate-pulse" style={{ background: 'var(--color-bg-elevated)' }} />
  }

  if (!chartData.length) {
    return (
      <div
        className="h-48 rounded-lg flex items-center justify-center text-sm"
        style={{ background: 'var(--color-bg-card)', color: 'var(--color-text-muted)' }}
      >
        Select a city to load chart data
      </div>
    )
  }

  const allValues = chartData.flatMap(d =>
    [d[ZONE_NAMES[0]], d[ZONE_NAMES[3]]].filter(v => v != null)
  )
  const yMin = allValues.length ? Math.floor(Math.min(...allValues)) - 2 : 0
  const yMax = allValues.length ? Math.ceil(Math.max(...allValues)) + 2 : 40

  return (
    <div>
      <h3
        className="text-[11px] font-semibold uppercase tracking-widest mb-3"
        style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}
      >
        7-Day Temperature History
      </h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-divider)" strokeOpacity={0.5} />
          <XAxis
            dataKey="shortTime"
            tick={{ fill: 'var(--color-text-muted)', fontSize: 9, fontFamily: 'var(--font-mono)' }}
            tickLine={false}
            axisLine={{ stroke: 'var(--color-divider)' }}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[yMin, yMax]}
            tick={{ fill: 'var(--color-text-muted)', fontSize: 9, fontFamily: 'var(--font-mono)' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => `${v}°`}
          />
          <Tooltip
            content={<CustomTooltip unit={unit} />}
            cursor={{ stroke: 'var(--color-divider-bright)', strokeWidth: 1, strokeDasharray: '4 2' }}
          />
          <Legend content={<CustomLegend />} />
          {[0, 1, 2, 3].map(i => (
            <Line
              key={i}
              type="monotone"
              dataKey={ZONE_NAMES[i]}
              stroke={ZONE_COLORS[i]}
              strokeWidth={i === 0 || i === 3 ? 2 : 1}
              dot={false}
              strokeDasharray={i === 1 || i === 2 ? '4 2' : undefined}
              activeDot={{ r: 3, fill: ZONE_COLORS[i] }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
