const BASE_URL = 'https://api.open-meteo.com/v1/forecast'

export async function fetchZoneWeather(lat, lng) {
  const params = new URLSearchParams({
    latitude: lat.toFixed(4),
    longitude: lng.toFixed(4),
    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature',
    hourly: 'temperature_2m',
    daily: 'temperature_2m_max,temperature_2m_min',
    past_days: '7',
    forecast_days: '1',
    timezone: 'auto',
  })

  const res = await fetch(`${BASE_URL}?${params}`)
  if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`)
  const data = await res.json()

  return {
    current: {
      temperature: data.current?.temperature_2m ?? null,
      apparentTemp: data.current?.apparent_temperature ?? null,
      humidity: data.current?.relative_humidity_2m ?? null,
      windSpeed: data.current?.wind_speed_10m ?? null,
      weatherCode: data.current?.weather_code ?? null,
      time: data.current?.time ?? null,
    },
    hourly: {
      times: data.hourly?.time ?? [],
      temperatures: data.hourly?.temperature_2m ?? [],
    },
    daily: {
      times: data.daily?.time ?? [],
      maxTemps: data.daily?.temperature_2m_max ?? [],
      minTemps: data.daily?.temperature_2m_min ?? [],
    },
  }
}
