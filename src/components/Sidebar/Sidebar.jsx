import { AlertCircle, Flame, Activity } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent } from '@/components/ui/card'
import CitySelector from './CitySelector'
import HeatDeltaCard from './HeatDeltaCard'
import CurrentConditions from './CurrentConditions'
import UnitToggle from './UnitToggle'
import TemperatureTimeSeries from '../Charts/TemperatureTimeSeries'
import HourlyHeatmap from '../Charts/HourlyHeatmap'
import { useAppStore } from '@/store/useAppStore'
import { useZoneWeather } from '@/hooks/useZoneWeather'

export default function Sidebar() {
  const selectedCity = useAppStore(s => s.selectedCity)
  const { zoneData, isLoading, isError, delta } = useZoneWeather(selectedCity)

  return (
    <aside
      className="flex flex-col h-full overflow-hidden"
      style={{
        background: 'var(--color-bg-panel)',
        borderRight: '1px solid var(--color-divider)',
        width: 340,
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        className="flex-shrink-0 px-4 py-4"
        style={{ borderBottom: '1px solid var(--color-divider)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="rounded-lg p-1.5 animate-glow-pulse"
              style={{ background: 'var(--color-urban-glow)' }}
            >
              <Flame size={16} style={{ color: 'var(--color-urban)' }} />
            </div>
            <div>
              <h1
                className="text-sm font-extrabold leading-none tracking-tight"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Urban Heat Island
              </h1>
              <p
                className="text-[10px] mt-0.5"
                style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}
              >
                EXPLORER v1.0
              </p>
            </div>
          </div>
          <UnitToggle />
        </div>
        <CitySelector />
      </div>

      {/* Scrollable content */}
      <ScrollArea className="flex-1">
        <div className="px-4 py-4 space-y-4">

          {isError && (
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs"
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#fca5a5',
              }}
            >
              <AlertCircle size={13} />
              <span>Failed to load weather data. Check your connection.</span>
            </div>
          )}

          <HeatDeltaCard delta={delta} isLoading={isLoading} />
          <CurrentConditions zoneData={zoneData} isLoading={isLoading} />

          <Card style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-divider)' }}>
            <CardContent className="p-4">
              <TemperatureTimeSeries zoneData={zoneData} isLoading={isLoading} />
            </CardContent>
          </Card>

          <Card style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-divider)' }}>
            <CardContent className="p-4">
              <HourlyHeatmap zoneData={zoneData} isLoading={isLoading} />
            </CardContent>
          </Card>

          {selectedCity && !isLoading && !isError && (
            <div
              className="flex items-center gap-2 rounded-lg px-3 py-2"
              style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-divider)' }}
            >
              <Activity size={11} style={{ color: '#22c55e' }} />
              <span
                className="text-[10px]"
                style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}
              >
                Live — Open-Meteo API · 10m cache
              </span>
              <span
                className="w-1.5 h-1.5 rounded-full ml-auto"
                style={{ background: '#22c55e', boxShadow: '0 0 6px #22c55e' }}
              />
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  )
}
