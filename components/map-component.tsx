'use client'

import { useEffect, useState, useMemo, useCallback, React } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { SearchListing } from '@/components/search-page-content'
import { ListingPopup } from '@/components/listing-popup'

interface MapComponentProps {
  farmlands: SearchListing[]
  selectedFarmland: SearchListing | null
  onSelectFarmland: (farmland: SearchListing | null) => void
}

// SVGアイコンをメモ化（キャッシング）
const iconCache = new Map<boolean, L.DivIcon>()

const createMarkerIcon = (isSelected: boolean) => {
  if (iconCache.has(isSelected)) {
    return iconCache.get(isSelected)!
  }
  
  const color = isSelected ? '#16a34a' : '#22c55e'
  const icon = L.divIcon({
    html: `<div style="padding: 0; margin: 0;">
      <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
        <path d="M16 0C9.37 0 4 5.37 4 12c0 8 12 28 12 28s12-20 12-28c0-6.63-5.37-12-12-12z" fill="${color}" stroke="white" stroke-width="1"/>
        <circle cx="16" cy="12" r="4" fill="white"/>
      </svg>
    </div>`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    className: 'marker-pin'
  })
  
  iconCache.set(isSelected, icon)
  return icon
}

// ピン表示用のカスタムコンポーネント（React.memoでメモ化）
const PinMarker = React.memo(({ listing, isSelected, onSelect }: { listing: SearchListing; isSelected: boolean; onSelect: () => void }) => {
  const icon = useMemo(() => createMarkerIcon(isSelected), [isSelected])
  
  return (
    <Marker
      position={[listing.lat, listing.lng]}
      icon={icon}
      eventHandlers={{ click: onSelect }}
    />
  )
})

// ポップアップ位置管理コンポーネント
function PopupPositioner({ selectedFarmland, onClose }: { selectedFarmland: SearchListing | null; onClose: () => void }) {
  const map = useMap()
  const [style, setStyle] = useState<React.CSSProperties>({ display: 'none' })

  useEffect(() => {
    if (selectedFarmland) {
      // 右下に固定表示
      setStyle({
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        display: 'block',
        zIndex: 9999
      })
    } else {
      setStyle({ display: 'none' })
    }
  }, [selectedFarmland])

  if (!selectedFarmland) return null

  return (
    <div style={style} className="pointer-events-auto">
      <ListingPopup listing={selectedFarmland} onClose={onClose} />
    </div>
  )
}

export function MapComponent({ farmlands, selectedFarmland, onSelectFarmland }: MapComponentProps) {
  // 日本の中心座標
  const japanCenter: [number, number] = [36.8, 137.7]
  const zoomLevel = 5

  const handleSelectListing = useCallback((listing: SearchListing) => {
    onSelectFarmland(selectedFarmland?.id === listing.id ? null : listing)
  }, [selectedFarmland, onSelectFarmland])

  // マーカーをメモ化（不要な再レンダリング防止）
  const memoizedMarkers = useMemo(
    () =>
      farmlands.map((listing) => (
        <PinMarker
          key={listing.id}
          listing={listing}
          isSelected={selectedFarmland?.id === listing.id}
          onSelect={() => handleSelectListing(listing)}
        />
      )),
    [farmlands, selectedFarmland, handleSelectListing]
  )

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={japanCenter}
        zoom={zoomLevel}
        style={{ height: '100%', width: '100%' }}
        className="leaflet-container"
      >
        {/* OpenStreetMap タイル */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* マーカー表示（シンプルだが最適化済み） */}
        {memoizedMarkers}

        {/* ポップアップ位置管理 */}
        <PopupPositioner
          selectedFarmland={selectedFarmland}
          onClose={() => onSelectFarmland(null)}
        />
      </MapContainer>
    </div>
  )
}
