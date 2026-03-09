import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/useAppStore'

export default function UnitToggle() {
  const { unit, toggleUnit } = useAppStore()

  return (
    <div
      className="flex rounded-lg p-0.5"
      style={{ background: 'var(--color-bg-elevated)', border: '1px solid var(--color-divider-bright)' }}
    >
      {['C', 'F'].map(u => (
        <Button
          key={u}
          variant="ghost"
          size="xs"
          onClick={toggleUnit}
          className="rounded-md px-2.5 py-1 text-xs font-bold transition-all duration-200 h-auto"
          style={{
            fontFamily: 'var(--font-mono)',
            background: unit === u ? 'var(--color-urban)' : 'transparent',
            color: unit === u ? '#fff' : 'var(--color-text-secondary)',
            boxShadow: unit === u ? '0 0 10px var(--color-urban-glow)' : 'none',
          }}
        >
          °{u}
        </Button>
      ))}
    </div>
  )
}
