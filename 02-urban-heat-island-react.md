# Project Prompt: Urban Heat Island Explorer — Build Order #2

> **Stack:** React + MapLibre GL JS (via react-map-gl) + Open-Meteo API + Recharts
> **Hosting:** Vercel
> **Difficulty:** Beginner–Intermediate | Free API (no key required) | No auth needed
> **Package Manager:** Use `bun` (preferred) or `pnpm` as an alternative to npm. All commands in this guide use `bun`. Swap `bun add` → `pnpm add` and `bunx` → `pnpm dlx` if you prefer pnpm.

---

## Project Vision

Build an interactive data dashboard that visualizes Urban Heat Island (UHI) effects — the phenomenon where cities are measurably hotter than surrounding rural areas. Users pick a city, explore temperature differences between urban core and suburban/rural rings on a map, view historical temperature time-series charts, and compare multiple cities side-by-side. All data comes from the free Open-Meteo API (no API key, no rate limits for reasonable usage). This project showcases data fetching, map visualization, and charting — the trifecta of GIS dashboard work.

---

## What You're Building (Feature List)

### Core MVP (build these first)
1. **City Selector** — Searchable dropdown (or autocomplete) to pick a city from a hardcoded list of 20–30 major global cities
2. **Temperature Map** — MapLibre GL map showing the selected city with colored point/circle markers for: city center, inner suburbs (radius ~5km), outer suburbs (~15km), rural reference (~30km)
3. **Current Conditions Panel** — Sidebar showing current temperature, humidity, wind speed, and weather code for each zone fetched from Open-Meteo
4. **Heat Differential Card** — Prominently display the delta: "Urban core is X.X°C warmer than rural reference"
5. **7-Day Historical Chart** — Recharts `LineChart` showing temperature over the past 7 days for urban vs rural — two lines, clearly labeled

### Enhanced Features (build after MVP works)
6. **Hourly Heatmap** — A day/hour heatmap grid (like a GitHub contribution chart) showing temperature patterns — hottest during peak afternoon hours
7. **City Comparison Mode** — Add up to 3 cities and compare their UHI deltas in a grouped bar chart
8. **Animated Temperature Ring** — Circle layers on the map that pulse or use a graduated color ramp from hottest (red, city center) to coolest (blue, rural)
9. **Unit Toggle** — °C / °F switch that converts all displayed values reactively
10. **Date Range Picker** — Let users pick a historical date range (Open-Meteo provides historical data going back years)
11. **Wind Rose** — Small SVG wind direction/speed visualization for the selected city
12. **Mobile-Responsive Layout** — Collapsible sidebar, stacked charts on small screens

---

## Tech Stack Details

| Tool | Purpose | Install |
|------|---------|---------|
| React 18 + Vite | App framework | `bun create vite -- --template react` |
| react-map-gl | MapLibre GL React wrapper | `bun add react-map-gl maplibre-gl` |
| Open-Meteo SDK (optional) | Typed API client | `bun add openmeteo` |
| Recharts | Charts (line, bar, area) | `bun add recharts` |
| @tanstack/react-query | Data fetching + caching | `bun add @tanstack/react-query` |
| date-fns | Date formatting + manipulation | `bun add date-fns` |
| Tailwind CSS | Utility-first styling | `bun add -D tailwindcss` |

---

## Open-Meteo API Reference

**No API key required.** Base URL: `https://api.open-meteo.com/v1/forecast`

### Example request for current + historical data:
```
GET https://api.open-meteo.com/v1/forecast
  ?latitude=40.7128
  &longitude=-74.0060
  &current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code
  &hourly=temperature_2m
  &daily=temperature_2m_max,temperature_2m_min
  &past_days=7
  &timezone=auto
```

### Key parameters:
- `latitude`, `longitude` — coordinates of each zone (city center, suburbs, rural)
- `current` — comma-separated current variables
- `hourly` — hourly variables for the time series
- `daily` — daily aggregates
- `past_days=7` — include last 7 days of historical data
- `timezone=auto` — returns data in local time

### Zone Strategy:
For each city, define 4 coordinate pairs representing:
- **Zone 0 (Urban Core):** City center lat/lng
- **Zone 1 (Inner Suburb):** Offset ~0.05° in each direction
- **Zone 2 (Outer Suburb):** Offset ~0.15°
- **Zone 3 (Rural):** Offset ~0.30° (rural reference, usually farmland/forest)

Make 4 parallel API calls (one per zone) using `Promise.all`.

---

## City Data (hardcode this list)

```js
export const CITIES = [
  { id: 'nyc',     name: 'New York City',  lat: 40.7128,  lng: -74.0060 },
  { id: 'london',  name: 'London',          lat: 51.5074,  lng: -0.1278  },
  { id: 'tokyo',   name: 'Tokyo',           lat: 35.6762,  lng: 139.6503 },
  { id: 'paris',   name: 'Paris',           lat: 48.8566,  lng: 2.3522   },
  { id: 'dubai',   name: 'Dubai',           lat: 25.2048,  lng: 55.2708  },
  { id: 'sydney',  name: 'Sydney',          lat: -33.8688, lng: 151.2093 },
  { id: 'nairobi', name: 'Nairobi',         lat: -1.2921,  lng: 36.8219  },
  { id: 'chicago', name: 'Chicago',         lat: 41.8781,  lng: -87.6298 },
  { id: 'berlin',  name: 'Berlin',          lat: 52.5200,  lng: 13.4050  },
  { id: 'mumbai',  name: 'Mumbai',          lat: 19.0760,  lng: 72.8777  },
  // add 10–20 more cities
]
```

---

## File & Folder Structure

```
urban-heat-island/
├── src/
│   ├── main.jsx
│   ├── App.jsx                        # Root layout: sidebar + map
│   ├── components/
│   │   ├── Map/
│   │   │   ├── HeatMap.jsx            # react-map-gl map with zone markers
│   │   │   ├── ZoneMarker.jsx         # Colored circle for each zone
│   │   │   └── CityBoundary.jsx       # Optional: GeoJSON polygon outline
│   │   ├── Sidebar/
│   │   │   ├── Sidebar.jsx            # Container, collapsible on mobile
│   │   │   ├── CitySelector.jsx       # Searchable dropdown
│   │   │   ├── CurrentConditions.jsx  # Temperature cards for each zone
│   │   │   ├── HeatDeltaCard.jsx      # Big UHI delta display
│   │   │   └── UnitToggle.jsx         # °C / °F toggle
│   │   ├── Charts/
│   │   │   ├── TemperatureTimeSeries.jsx  # Recharts LineChart (7-day)
│   │   │   ├── HourlyHeatmap.jsx          # Grid heatmap
│   │   │   └── CityComparisonBar.jsx      # Grouped bar chart
│   │   └── shared/
│   │       ├── LoadingSpinner.jsx
│   │       └── ErrorMessage.jsx
│   ├── hooks/
│   │   ├── useZoneWeather.js           # React Query hook for 4-zone fetch
│   │   └── useTemperatureUnit.js       # °C/°F conversion context
│   ├── data/
│   │   └── cities.js                   # City list with coordinates
│   ├── utils/
│   │   ├── openMeteo.js                # API fetch functions
│   │   ├── zoneCoords.js               # Generate zone coordinates from city center
│   │   └── temperature.js              # Unit conversion helpers
│   └── styles/
│       └── index.css
├── index.html
├── vite.config.js
└── tailwind.config.js
```

---

## Step-by-Step Build Instructions

### Phase 1: Setup + Static Map
1. Scaffold: `bun create vite urban-heat-island -- --template react`
2. Install all dependencies (see table above)
3. Configure Tailwind: `bunx tailwindcss init -p`, add to `index.css`
4. Build the app shell in `App.jsx`: a fixed left sidebar (320px) + full-height map area on the right
5. Add `HeatMap.jsx`: mount a `react-map-gl` `<Map>` component with a Carto Light basemap style. Use `mapLib` prop pointing to `maplibre-gl`
6. Hardcode a `viewState` for New York City to start. Confirm map renders.

### Phase 2: City Selection + Zone Coordinates
7. Build `CitySelector.jsx` with a `<select>` or a searchable combobox (use the `cities.js` list)
8. Store selected city in React state (or Zustand if you choose a state manager)
9. Build `zoneCoords.js`: given a city's center `{lat, lng}`, return an array of 4 zone objects with offset coordinates and zone labels:
```js
export function getZoneCoords(lat, lng) {
  return [
    { zone: 'Urban Core',    lat: lat,         lng: lng         },
    { zone: 'Inner Suburb',  lat: lat + 0.05,  lng: lng + 0.05  },
    { zone: 'Outer Suburb',  lat: lat + 0.15,  lng: lng + 0.15  },
    { zone: 'Rural',         lat: lat + 0.30,  lng: lng + 0.30  },
  ]
}
```
10. When city changes, fly the map to the new center using `mapRef.current.flyTo({ center: [lng, lat], zoom: 10 })`

### Phase 3: API Integration
11. Build `openMeteo.js` — a `fetchZoneWeather(lat, lng)` async function that hits the Open-Meteo API and returns structured data: `{ current, hourly, daily }`
12. Build `useZoneWeather.js` React Query hook:
```js
export function useZoneWeather(city) {
  const zones = getZoneCoords(city.lat, city.lng)
  return useQueries({
    queries: zones.map(zone => ({
      queryKey: ['weather', zone.lat, zone.lng],
      queryFn: () => fetchZoneWeather(zone.lat, zone.lng),
      staleTime: 10 * 60 * 1000, // 10 min cache
    }))
  })
}
```
13. Add loading and error states to the sidebar

### Phase 4: Map Markers + Sidebar Cards
14. In `HeatMap.jsx`, render 4 `<Marker>` components from react-map-gl at each zone's coordinates — color them on a red-to-blue gradient: red=urban, blue=rural
15. On marker click, show a small popup with zone name and current temperature
16. Build `CurrentConditions.jsx` — render 4 cards in a row or column, each showing: zone name, temperature, humidity, wind speed. Use a color-coded left border to match map markers.
17. Build `HeatDeltaCard.jsx` — calculate `urbanTemp - ruralTemp` and display it prominently: `"Urban core is 3.4°C warmer than rural reference"`. Use conditional coloring (red if > 2°C, yellow if 1–2°C, green if < 1°C)

### Phase 5: Charts
18. Build `TemperatureTimeSeries.jsx` — a Recharts `LineChart` with:
   - X-axis: date labels (last 7 days) from `date-fns format()`
   - Y-axis: temperature in selected unit
   - Two `<Line>` entries: Urban Core (red) and Rural (blue)
   - `<Tooltip>` showing all 4 zones on hover
   - `<Legend>` at the bottom
19. Populate with the `hourly.temperature_2m` arrays from the API responses, sliced to the last 7 days × 24 hours
20. Add `HourlyHeatmap.jsx` — a 7-row × 24-column grid. Each cell = a `<div>` colored by temperature. Use a CSS `background` interpolated between blue (cold) and red (hot) based on the min/max range.

### Phase 6: Polish + Extras
21. Add `UnitToggle.jsx` — a toggle button that switches a React context between `'C'` and `'F'`. Build a `convertTemp(value, unit)` utility. Apply everywhere temperatures appear.
22. Add `CityComparisonBar.jsx` — a multi-select to pick up to 3 cities, fetch their UHI deltas, and show a grouped bar chart
23. Add responsive layout: below `768px`, collapse the sidebar to a bottom sheet or drawer
24. Add loading skeleton cards while API data is fetching
25. Deploy to Vercel: `bunx vercel` or push to GitHub and connect Vercel

---

## Key React Patterns to Use

- **React Query (`useQueries`)** for parallel API calls with built-in caching, loading, and error states — do NOT use raw `useEffect` + `useState` for API calls
- **React Context** for unit preference (°C/°F) shared across all components
- **`useRef` + `mapRef`** to imperatively control the MapLibre map (flyTo, setPaintProperty)
- **Memoization** — `useMemo` for expensive data transformations (chart data prep from hourly arrays)
- **Component composition** — keep each chart/card dumb and pass data via props

---

## Color Palette (UHI Theme)

```js
export const ZONE_COLORS = {
  urban:       '#ef4444', // red-500
  innerSuburb: '#f97316', // orange-500
  outerSuburb: '#eab308', // yellow-500
  rural:       '#3b82f6', // blue-500
}
```

---

## MapLibre Circle Layer (Alternative to Markers)

Instead of `<Marker>` components, you can add GeoJSON source + circle layer for the zones:
```js
map.addSource('zones', {
  type: 'geojson',
  data: {
    type: 'FeatureCollection',
    features: zones.map((z, i) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [z.lng, z.lat] },
      properties: { zone: z.zone, temp: weatherData[i]?.current.temperature_2m }
    }))
  }
})
map.addLayer({
  id: 'zone-circles',
  type: 'circle',
  source: 'zones',
  paint: {
    'circle-radius': 20,
    'circle-color': ['match', ['get', 'zone'],
      'Urban Core', '#ef4444',
      'Inner Suburb', '#f97316',
      'Outer Suburb', '#eab308',
      '#3b82f6' // default rural
    ],
    'circle-opacity': 0.75
  }
})
```

---

## Stretch Goals

- Fetch actual city boundary polygons from OpenStreetMap Nominatim API and draw them as a fill layer
- Add a "heat anomaly" view that compares the selected date against the 30-year climate average (Open-Meteo provides climate data)
- Export chart as PNG using `html2canvas`
- Add PWA support (service worker + manifest) so the last-loaded city works offline

---

## Portfolio Presentation Tips

- Add a hero screenshot to your README showing the split map+chart view
- Record a short Loom or GIF showing city switching and the UHI delta updating
- In your portfolio description: "Fetches live weather data from 4 geographic zones per city in parallel, computes Urban Heat Island temperature deltas, and visualizes trends with interactive time-series charts"
- This project demonstrates: async data fetching, React Query, Recharts, MapLibre GL — extremely in-demand skills

---

## Completion Checklist

- [ ] Map renders with at least 4 zone markers for the selected city
- [ ] City selector switches the map view and re-fetches data
- [ ] Current conditions panel shows real API data for all 4 zones
- [ ] UHI delta card calculates and displays correctly
- [ ] 7-day temperature line chart renders with urban vs rural lines
- [ ] °C / °F toggle works everywhere
- [ ] Loading and error states handled gracefully
- [ ] Responsive on mobile
- [ ] Deployed to Vercel with public URL
- [ ] README with screenshot and API explanation
