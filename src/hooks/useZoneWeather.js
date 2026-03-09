import { useQueries } from '@tanstack/react-query'
import { fetchZoneWeather } from '@/utils/openMeteo'
import { getZoneCoords } from '@/utils/zoneCoords'

export function useZoneWeather(city) {
  const zones = city ? getZoneCoords(city.lat, city.lng) : []

  const results = useQueries({
    queries: zones.map(zone => ({
      queryKey: ['weather', zone.lat.toFixed(4), zone.lng.toFixed(4)],
      queryFn: () => fetchZoneWeather(zone.lat, zone.lng),
      staleTime: 10 * 60 * 1000,
      enabled: !!city,
    })),
  })

  const isLoading = results.some(r => r.isLoading)
  const isError = results.some(r => r.isError)

  const zoneData = zones.map((zone, i) => ({
    ...zone,
    ...results[i]?.data,
    status: results[i]?.status,
  }))

  const urbanTemp = zoneData[0]?.current?.temperature ?? null
  const ruralTemp = zoneData[3]?.current?.temperature ?? null
  const delta = urbanTemp != null && ruralTemp != null ? urbanTemp - ruralTemp : null

  return { zoneData, isLoading, isError, delta }
}
