"use client"

import { Badge } from "@/components/ui/badge"
import { MapPin, Maximize, Home, Droplets, Zap, Wifi, Car, Bath } from "lucide-react"

/**
 * 検索用簡易型
 */
interface SearchListing {
  id: string
  title: string
  location: string
  prefecture: string
  city: string
  area: number
  price: number
  image: string
  lat: number
  lng: number
  features: {
    shed: boolean
    toilet: boolean
    water: boolean
    electricity: boolean
    signal5g: boolean
    signal4g: boolean
    parking: boolean
  }
  description: string
}

interface ListingCardProps {
  listing: SearchListing
  isSelected?: boolean
  onClick?: () => void
}

const featureConfig = {
  shed: { label: "小屋", icon: Home },
  toilet: { label: "トイレ", icon: Bath },
  water: { label: "水利", icon: Droplets },
  electricity: { label: "電気", icon: Zap },
  signal5g: { label: "5G", icon: Wifi },
  signal4g: { label: "4G", icon: Wifi },
  parking: { label: "駐車場", icon: Car },
}

export function ListingCard({ listing, isSelected = false, onClick }: ListingCardProps) {
  // 設備情報から有効な設備を抽出
  const activeFeatures: (keyof typeof featureConfig)[] = (
    Object.keys(listing.features) as (keyof typeof featureConfig)[]
  ).filter((key) => listing.features[key as keyof SearchListing['features']] === true)

  return (
    <div
      className={`
        bg-card rounded-xl border overflow-hidden cursor-pointer transition-all
        ${isSelected ? "border-primary shadow-lg" : "border-border hover:border-primary/50"}
      `}
      onClick={onClick}
    >
      <div className="flex">
        {/* 画像 */}
        <div className="w-32 h-32 flex-shrink-0 bg-muted">
          <img
            src={listing.image || "/placeholder.svg"}
            alt={listing.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 情報 */}
        <div className="flex-1 p-3">
          <h3 className="font-semibold text-foreground line-clamp-1">{listing.title}</h3>

          <div className="mt-1 space-y-0.5">
            {/* 所在地 */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span className="truncate">
                {listing.prefecture} {listing.city}
              </span>
            </div>

            {/* 面積 */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Maximize className="h-3 w-3" />
              {listing.area.toLocaleString()} ㎡
            </div>
          </div>

          {/* 設備タグ */}
          <div className="mt-2 flex flex-wrap gap-1">
            {activeFeatures.slice(0, 3).map((feature) => {
              const config = featureConfig[feature]
              const Icon = config.icon
              return (
                <Badge key={feature} variant="secondary" className="text-[10px] px-1.5 py-0 gap-0.5">
                  <Icon className="h-2.5 w-2.5" />
                  {config.label}
                </Badge>
              )
            })}
            {activeFeatures.length > 3 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                +{activeFeatures.length - 3}
              </Badge>
            )}
          </div>

          {/* 価格 */}
          <div className="mt-2">
            <span className="text-sm font-bold text-primary">
              月額 {listing.price.toLocaleString()}円
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
