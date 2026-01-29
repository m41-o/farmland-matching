'use client'

import { useState, useEffect } from "react"
import { MapPin, Maximize, Droplets, Wifi, Home, Bath } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

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
 * データベースから取得した農地情報の型
 */
interface FarmlandFromDB {
  id: string
  name: string | null
  prefecture: string
  city: string
  area: number
  price: number | null
  images: string[]
  facilities?: Record<string, boolean>
  description: string | null
}

/**
 * 表示用農地情報の型
 */
interface FarmlandDisplay {
  id: string
  title: string
  prefecture: string
  city: string
  area: number
  price: number
  image: string
  facilities: Record<string, boolean>
}

/**
 * リスティングから表示するタグを抽出
 * 設備情報に基づいて、最大3つのタグを返す
 */
function getFeatureTags(facilities: Record<string, boolean>): string[] {
  const tags: string[] = []

  // 水利の有無
  if (facilities?.water) tags.push("水利あり")

  // 小屋の有無
  if (facilities?.shed) tags.push("小屋あり")

  // 通信環境（5Gを優先）
  if (facilities?.signal5g) tags.push("5G良好")
  else if (facilities?.signal4g) tags.push("4G良好")

  // トイレの有無
  if (facilities?.toilet) tags.push("トイレあり")

  // 駐車場の有無
  if (facilities?.parking) tags.push("駐車場あり")

  // 電気の有無
  if (facilities?.electricity) tags.push("電気あり")

  // 最大3つまで
  return tags.slice(0, 3)
}

export function FeaturedListings() {
  const [featuredListings, setFeaturedListings] = useState<FarmlandDisplay[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadFeaturedListings() {
      try {
        // API から最新の農地を取得（最大3件）
        const response = await fetch('/api/farmland?limit=3')
        
        if (response.ok) {
          const data = await response.json()
          
          // データを変換
          const transformed: FarmlandDisplay[] = data.data.map((farmland: FarmlandFromDB) => ({
            id: farmland.id,
            title: farmland.name || '農地',
            prefecture: farmland.prefecture,
            city: farmland.city,
            area: farmland.area,
            price: farmland.price || 0,
            image: farmland.images?.[0] || '/placeholder.svg',
            facilities: farmland.facilities || {},
          }))
          
          setFeaturedListings(transformed)
        }
      } catch (error) {
        console.error('おすすめ農地の取得に失敗:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFeaturedListings()
  }, [])

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
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">読み込み中...</p>
          </div>
        ) : featuredListings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">まだ農地が登録されていません</p>
            <Button asChild className="mt-4">
              <Link href="/farmland/new">最初の農地を登録する</Link>
            </Button>
          </div>
        ) : (
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
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
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
                    {getFeatureTags(listing.facilities).map((feature) => {
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
        )}

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
