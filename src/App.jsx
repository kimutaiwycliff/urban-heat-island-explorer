import Sidebar from '@/components/Sidebar/Sidebar'
import HeatMap from '@/components/Map/HeatMap'

export default function App() {
  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: 'var(--color-bg-base)' }}>
      <Sidebar />
      <main className="flex-1 relative overflow-hidden">
        <HeatMap />
      </main>
    </div>
  )
}
