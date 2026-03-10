import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar/Sidebar'
import HeatMap from '@/components/Map/HeatMap'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Open sidebar by default on larger screens
  useEffect(() => {
    setSidebarOpen(window.innerWidth >= 768)
  }, [])

  return (
    <div className="flex h-screen w-screen overflow-hidden" style={{ background: 'var(--color-bg-base)' }}>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 relative overflow-hidden">
        <HeatMap />

        {/* Mobile: show panel button when sidebar is closed */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold md:hidden"
            style={{
              background: 'rgba(13,15,28,0.88)',
              border: '1px solid var(--color-divider-bright)',
              color: 'var(--color-text-primary)',
              backdropFilter: 'blur(8px)',
              fontFamily: 'var(--font-display)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--color-urban)' }}>
              <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/>
            </svg>
            Data Panel
          </button>
        )}
      </main>
    </div>
  )
}
