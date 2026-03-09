import { Thermometer, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { getDeltaColor } from '@/utils/temperature'
import { useAppStore } from '@/store/useAppStore'

export default function HeatDeltaCard({ delta, isLoading }) {
  const unit = useAppStore(s => s.unit)

  const displayDelta = delta != null
    ? unit === 'F' ? delta * 9 / 5 : delta
    : null

  const color = getDeltaColor(delta)

  return (
    <Card
      className="relative overflow-hidden"
      style={{
        background: 'var(--color-bg-card)',
        border: `1px solid ${color}44`,
        boxShadow: `0 0 20px ${color}18`,
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}15 0%, transparent 70%)` }}
      />

      <CardContent className="p-4 relative">
        <div className="flex items-center gap-2 mb-3">
          <div className="rounded-lg p-1.5" style={{ background: `${color}22` }}>
            <Thermometer size={14} style={{ color }} />
          </div>
          <span
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)' }}
          >
            UHI Delta
          </span>
        </div>

        {isLoading ? (
          <div className="h-12 rounded animate-pulse" style={{ background: 'var(--color-bg-elevated)' }} />
        ) : displayDelta != null ? (
          <div>
            <div className="flex items-end gap-2">
              <span
                className="text-4xl font-black leading-none"
                style={{ color, fontFamily: 'var(--font-mono)' }}
              >
                {displayDelta >= 0 ? '+' : ''}{displayDelta.toFixed(1)}°{unit}
              </span>
              <TrendingUp size={18} style={{ color, marginBottom: 4 }} />
            </div>
            <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              Urban core is{' '}
              <span style={{ color }} className="font-semibold">
                {Math.abs(displayDelta).toFixed(1)}°{unit} {displayDelta >= 0 ? 'warmer' : 'cooler'}
              </span>{' '}
              than rural reference
            </p>
          </div>
        ) : (
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Select a city to view delta
          </p>
        )}
      </CardContent>
    </Card>
  )
}
