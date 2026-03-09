import { useState } from 'react'
import { Check, ChevronsUpDown, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command, CommandEmpty, CommandGroup,
  CommandInput, CommandItem, CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CITIES } from '@/data/cities'
import { useAppStore } from '@/store/useAppStore'
import { cn } from '@/lib/utils'

export default function CitySelector() {
  const [open, setOpen] = useState(false)
  const { selectedCity, setCity } = useAppStore()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal hover:bg-[var(--color-bg-elevated)]"
          style={{
            background: 'var(--color-bg-card)',
            borderColor: 'var(--color-divider-bright)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-display)',
          }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <MapPin size={14} style={{ color: 'var(--color-urban)', flexShrink: 0 }} />
            <span className="truncate">
              {selectedCity ? selectedCity.name : 'Select a city…'}
            </span>
          </div>
          <ChevronsUpDown size={14} className="ml-2 shrink-0" style={{ color: 'var(--color-text-muted)' }} />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[280px] p-0"
        style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-divider-bright)' }}
        align="start"
      >
        <Command style={{ background: 'transparent' }}>
          <CommandInput
            placeholder="Search cities…"
            style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)' }}
          />
          <CommandList>
            <CommandEmpty style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
              No cities found.
            </CommandEmpty>
            <CommandGroup>
              {CITIES.map(city => (
                <CommandItem
                  key={city.id}
                  value={city.name}
                  onSelect={() => { setCity(city); setOpen(false) }}
                  className="cursor-pointer"
                  style={{
                    color: selectedCity?.id === city.id ? 'var(--color-urban)' : 'var(--color-text-primary)',
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  <Check
                    size={14}
                    className={cn('mr-2', selectedCity?.id !== city.id && 'opacity-0')}
                    style={{ color: 'var(--color-urban)' }}
                  />
                  {city.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
