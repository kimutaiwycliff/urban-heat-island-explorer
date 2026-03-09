export function celsiusToFahrenheit(c) {
  return (c * 9) / 5 + 32
}

export function convertTemp(value, unit) {
  if (value == null) return null
  return unit === 'F' ? celsiusToFahrenheit(value) : value
}

export function formatTemp(value, unit, decimals = 1) {
  if (value == null) return '—'
  const converted = convertTemp(value, unit)
  return `${converted.toFixed(decimals)}°${unit}`
}

export function getWeatherDescription(code) {
  if (code == null) return 'Unknown'
  if (code === 0) return 'Clear sky'
  if (code <= 3) return 'Partly cloudy'
  if (code <= 9) return 'Fog / rime'
  if (code <= 19) return 'Drizzle'
  if (code <= 29) return 'Rain'
  if (code <= 39) return 'Snow'
  if (code <= 49) return 'Fog'
  if (code <= 59) return 'Drizzle'
  if (code <= 69) return 'Rain'
  if (code <= 79) return 'Snow'
  if (code <= 84) return 'Rain showers'
  if (code <= 94) return 'Thunderstorm'
  return 'Heavy thunderstorm'
}

export function getDeltaColor(delta) {
  if (delta == null) return '#7a82b0'
  if (delta >= 3) return '#ff5733'
  if (delta >= 2) return '#f97316'
  if (delta >= 1) return '#eab308'
  return '#22c55e'
}
