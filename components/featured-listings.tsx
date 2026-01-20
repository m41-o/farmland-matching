'use client'

import { MapPin, Maximize, Droplets, Wifi, Home, Bath } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { listings, type Listing } from "@/app/types/farmland"

// アイコンマッピング
const featureIcons: Record<string, typeof Droplets> = {
  "水利あり": Droplets,
  "小屋あり": Home,
  "4G良好": Wifi,
  "5G良好": Wifi,
  "トイレあり": Bath,
  "駐車場あり": MapPin,
  "電気あり": Wifi,
}

/**
 * リスティングから表示するタグを抽出
 * 設備情報に基づいて、最大3つのタグを返す
 */
function getFeatureTags(listing: Listing): string[] {
  const tags: string[] = []

  // 水利の有無
  if (listing.features.water.available) tags.push("水利あり")

  // 小屋の有無
  if (listing.features.shed.available) tags.push("小屋あり")

  // 通信環境（5Gを優先）
  if (listing.features.communication.signal5g) tags.push("5G良好")
  else if (listing.features.communication.signal4g) tags.push("4G良好")

  // トイレの有無
  if (listing.features.toilet.available) tags.push("トイレあり")

  // 駐車場の有無
  if (listing.features.access.parking) tags.push("駐車場あり")

  // 電気の有無
  if (listing.features.electricity.available) tags.push("電気あり")

  // 最大3つまで
  return tags.slice(0, 3)
}

export function FeaturedListings() {
  // 新着農地を取得（最大3件）
  const featuredListings = listings.filter((l) => l.isNew).slice(0, 3)

  return (
    <section className="py-16 md:py-24 bg-secondary/50">
      <div className="container mx-auto px-4">
        {/* ヘッダー */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">おすすめの農地</h2>
            <p className="mt-2 text-muted-foreground">新着・人気の農地をピックアップ</p>
          </div>
          <Button variant="outline" asChild className="hidden sm:flex bg-transparent">
            <Link href="/search">すべて見る</Link>
          </Button>
        </div>

        {/* リスティンググリッド */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredListings.map((listing) => (
            <Link
              key={listing.id}
              href={`/farmland/${listing.id}`}
              className="group bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-lg transition-all"
            >
              {/* 画像領域 */}
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={listing.images[0] || "/placeholder.svg"}
                  alt={listing.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* NEWバッジ */}
                {listing.isNew && (
                  <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                    NEW
                  </Badge>
                )}
              </div>

              {/* 情報領域 */}
              <div className="p-4">
                {/* タイトル */}
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {listing.title}
                </h3>

                {/* 所在地 */}
                <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {listing.prefecture}
                  {listing.city}
                </div>

                {/* 面積 */}
                <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <Maximize className="h-4 w-4" />
                  {listing.area.toLocaleString()}㎡
                </div>

                {/* 設備タグ */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {getFeatureTags(listing).map((feature) => {
                    const Icon = featureIcons[feature] || Home
                    return (
                      <Badge key={feature} variant="secondary" className="text-xs gap-1">
                        <Icon className="h-3 w-3" />
                        {feature}
                      </Badge>
                    )
                  })}
                </div>

                {/* 価格 */}
                <div className="mt-4 pt-3 border-t border-border">
                  <span className="text-lg font-bold text-primary">
                    月額 {listing.price.toLocaleString()}円
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* モバイル用「すべて見る」ボタン */}
        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" asChild>
            <Link href="/search">すべて見る</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
