'use client'

import dynamic from 'next/dynamic'
import type { SearchListing } from '@/components/search-page-content'

interface MapViewProps {
  farmlands: SearchListing[]
  selectedFarmland: SearchListing | null
  onSelectFarmland: (farmland: SearchListing | null) => void
}

// Leaflet コンポーネントを動的インポート（クライアント専用）
const DynamicMap = dynamic(
  () => import('./map-component').then(mod => ({ default: mod.MapComponent })),
  {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center bg-blue-100">地図を読み込み中...</div>,
  }
) as React.ComponentType<MapViewProps>

export function MapView({ farmlands, selectedFarmland, onSelectFarmland }: MapViewProps) {
  return (
    <div className="relative w-full h-full">
      <DynamicMap
        farmlands={farmlands}
        selectedFarmland={selectedFarmland}
        onSelectFarmland={onSelectFarmland}
      />
    </div>
  )
}
