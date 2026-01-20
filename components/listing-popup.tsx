"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, MapPin, Maximize, Home, Droplets, Zap, Wifi, Car, Bath, ArrowRight } from "lucide-react"
import Link from "next/link"
import type { SearchListing } from "@/components/search-page-content"

interface ListingPopupProps {
  listing: SearchListing
  onClose: () => void
}

// フィーチャーアイコンマッピング
const featureIcons: Record<string, typeof Droplets> = {
  "小屋": Home,
  "水利": Droplets,
  "電気": Zap,
  "5G": Wifi,
  "4G": Wifi,
  "駐車場": Car,
  "トイレ": Bath,
}

// フィーチャータグを取得する関数
function getFeatureTags(listing: SearchListing) {
  const tags: string[] = []
  if (listing.features.shed) tags.push("小屋")
  if (listing.features.water) tags.push("水利")
  if (listing.features.electricity) tags.push("電気")
  if (listing.features.signal5g) tags.push("5G")
  else if (listing.features.signal4g) tags.push("4G")
  if (listing.features.parking) tags.push("駐車場")
  if (listing.features.toilet) tags.push("トイレ")
  return tags.slice(0, 5)
}

export function ListingPopup({ listing, onClose }: ListingPopupProps) {
  // フィーチャータグを取得
  const featureTags = getFeatureTags(listing)

  return (
    <div className="bg-card rounded-lg shadow-lg border border-border overflow-hidden z-[9999] w-80">
      {/* 画像 */}
      <div className="relative">
        <img
          src={listing.image || "/placeholder.svg"}
          alt={listing.title}
          className="w-full h-40 object-cover"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-background/80 hover:bg-background rounded-full"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* 情報 */}
      <div className="p-4">
        {/* タイトル */}
        <h3 className="font-semibold text-lg text-foreground">{listing.title}</h3>

        {/* 位置情報と面積 */}
        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{listing.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Maximize className="h-4 w-4" />
            {listing.area.toLocaleString()} ㎡
          </div>
        </div>

        {/* 設備タグ */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {featureTags.map((feature) => {
            const Icon = featureIcons[feature] || Home
            return (
              <Badge key={feature} variant="secondary" className="text-xs gap-1">
                <Icon className="h-3 w-3" />
                {feature}
              </Badge>
            )
          })}
        </div>

        {/* 説明 */}
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{listing.description}</p>

        {/* 価格と詳細リンク */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-xl font-bold text-primary">
            月額 {listing.price.toLocaleString()}円
          </span>
          <Link href={`/farmland/${listing.id}`}>
            <Button className="text-white">
              詳細を見る
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
