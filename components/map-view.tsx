'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
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
  // クライアント側で Leaflet MarkerCluster CSS を動的に読み込み
  useEffect(() => {
    try {
      // CSS ファイルを動的に読み込み
      const link1 = document.createElement('link')
      link1.rel = 'stylesheet'
      link1.href = 'https://unpkg.com/leaflet.markercluster@1.5.1/dist/MarkerCluster.css'
      document.head.appendChild(link1)

      const link2 = document.createElement('link')
      link2.rel = 'stylesheet'
      link2.href = 'https://unpkg.com/leaflet.markercluster@1.5.1/dist/MarkerCluster.Default.css'
      document.head.appendChild(link2)

      return () => {
        // クリーンアップ（マウント解除時に削除）
        if (document.head.contains(link1)) document.head.removeChild(link1)
        if (document.head.contains(link2)) document.head.removeChild(link2)
      }
    } catch (error) {
      console.error('Failed to load MarkerCluster CSS:', error)
    }
  }, [])

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
