/**
 * Generate 4 zone coordinate pairs from a city center.
 * Offsets are along the northeast diagonal to simulate
 * progressively rural zones away from the city center.
 */
export function getZoneCoords(lat, lng) {
  return [
    { zone: 'Urban Core',   zoneIdx: 0, lat: lat,          lng: lng          },
    { zone: 'Inner Suburb', zoneIdx: 1, lat: lat + 0.05,   lng: lng + 0.05   },
    { zone: 'Outer Suburb', zoneIdx: 2, lat: lat + 0.15,   lng: lng + 0.15   },
    { zone: 'Rural',        zoneIdx: 3, lat: lat + 0.30,   lng: lng + 0.30   },
  ]
}
