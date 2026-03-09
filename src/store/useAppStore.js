import { create } from 'zustand'
import { CITIES } from '@/data/cities'

export const useAppStore = create((set) => ({
  selectedCity: CITIES[0], // default: New York City
  unit: 'C',

  setCity: (city) => set({ selectedCity: city }),
  toggleUnit: () => set((state) => ({ unit: state.unit === 'C' ? 'F' : 'C' })),
}))
