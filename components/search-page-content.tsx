'use client'

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { FilterPanel } from "@/components/filter-panel"
import { MapView } from "@/components/map-view"
import { ListingCard } from "@/components/listing-card"
import { Button } from "@/components/ui/button"
import { Map, List, SlidersHorizontal, X } from "lucide-react"
import { listings as dummyListings } from "@/app/types/farmland"

/**
 * 検索用簡易型（getSearchListings() で返される型）
 */
export interface SearchListing {
  id: string // IDはサーバーから返される文字列
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

/**
 * SearchPageContent コンポーネント
 * 農地検索ページのメインコンテンツ
 * マップビューとリストビュー、フィルターパネルを統合
 */
export function SearchPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // データ取得用のstate
  const [mockListings, setMockListings] = useState<SearchListing[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // フィルタ条件用のstate（URL パラメータから初期化）
  const [filters, setFilters] = useState({
    prefecture: searchParams.get('prefecture') || '',
    city: searchParams.get('city') || '',
    keyword: searchParams.get('keyword') || '',
    minArea: parseInt(searchParams.get('minArea') || '0'),
    maxArea: parseInt(searchParams.get('maxArea') || '5000'),
    minPrice: parseInt(searchParams.get('minPrice') || '0'),
    maxPrice: parseInt(searchParams.get('maxPrice') || '100000'),
    features: (searchParams.get('facilities') || '').split(',').filter(Boolean),
  })

  // API クエリパラメータを構築する関数
  const buildQueryParams = (filterData: typeof filters) => {
    const params = new URLSearchParams()
    
    if (filterData.prefecture) params.append('prefecture', filterData.prefecture)
    if (filterData.city) params.append('city', filterData.city)
    if (filterData.keyword) params.append('keyword', filterData.keyword)
    if (filterData.minArea !== 0) params.append('minArea', filterData.minArea.toString())
    if (filterData.maxArea !== 5000) params.append('maxArea', filterData.maxArea.toString())
    if (filterData.minPrice !== 0) params.append('minPrice', filterData.minPrice.toString())
    if (filterData.maxPrice !== 100000) params.append('maxPrice', filterData.maxPrice.toString())
    if (filterData.features.length > 0) params.append('facilities', filterData.features.join(','))
    
    params.append('limit', '100')
    
    return params.toString()
  }

  // フィルタが変更されたときにページネーションを反映し、URL を更新
  const updateFilters = (newFilters: typeof filters) => {
    setFilters(newFilters)
    
    // URL を更新
    const queryString = buildQueryParams(newFilters)
    const newUrl = queryString ? `/search?${queryString}` : '/search'
    router.push(newUrl, { scroll: false })
  }

  // ページロード時およびフィルタ変更時にデータを取得
  useEffect(() => {
    async function loadListings() {
      try {
        // ダミーデータを先に変換
        const fallbackListings = dummyListings.map((listing) => ({
          id: listing.id,
          title: listing.title,
          location: listing.location,
          prefecture: listing.prefecture,
          city: listing.city,
          area: listing.area,
          price: listing.price,
          image: listing.images[0],
          lat: listing.lat,
          lng: listing.lng,
          features: {
            shed: listing.features.shed.available,
            toilet: listing.features.toilet.available,
            water: listing.features.water.available,
            electricity: listing.features.electricity.available,
            signal5g: listing.features.communication.signal5g,
            signal4g: listing.features.communication.signal4g,
            parking: listing.features.access.parking,
          },
          description: listing.description.split("\n")[0],
        }))

        // API クエリを構築
        const queryString = buildQueryParams(filters)
        const apiUrl = `/api/farmland?${queryString}`
        
        const response = await fetch(apiUrl)
        console.log('APIレスポンスステータス:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('取得したデータ:', data)
          
          const dbListings = data.data.map((farmland: Record<string, any>) => ({
            id: farmland.id,
            title: farmland.name || '農地',
            location: `${farmland.prefecture}${farmland.city}${farmland.address}`,
            prefecture: farmland.prefecture,
            city: farmland.city,
            area: farmland.area,
            price: farmland.price || 0,
            image: farmland.images?.[0] || '/placeholder.svg',
            lat: farmland.latitude || 36.8,
            lng: farmland.longitude || 137.7,
            // DB に保存された facilities から設備情報を取得
            features: {
              shed: farmland.facilities?.shed || false,
              toilet: farmland.facilities?.toilet || false,
              water: farmland.facilities?.water || false,
              electricity: farmland.facilities?.electricity || false,
              signal5g: farmland.facilities?.signal5g || false,
              signal4g: farmland.facilities?.signal4g || false,
              parking: farmland.facilities?.parking || false,
            },
            description: farmland.description || '農地',
          }))
          
          console.log('結合後のリスティング:', dbListings)
          setMockListings(dbListings)
        } else {
          console.error('APIエラーステータス:', response.status)
          // APIエラー時はダミーデータのみ
          setMockListings(fallbackListings)
        }
      } catch (error) {
        console.error('データ取得エラー:', error)
        // エラー時もダミーデータを使用
        const fallbackListings = dummyListings.map((listing) => ({
          id: listing.id,
          title: listing.title,
          location: listing.location,
          prefecture: listing.prefecture,
          city: listing.city,
          area: listing.area,
          price: listing.price,
          image: listing.images[0],
          lat: listing.lat,
          lng: listing.lng,
          features: {
            shed: listing.features.shed.available,
            toilet: listing.features.toilet.available,
            water: listing.features.water.available,
            electricity: listing.features.electricity.available,
            signal5g: listing.features.communication.signal5g,
            signal4g: listing.features.communication.signal4g,
            parking: listing.features.access.parking,
          },
          description: listing.description.split("\n")[0],
        }))
        setMockListings(fallbackListings)
      } finally {
        setIsLoading(false)
      }
    }

    loadListings()
  }, [filters])

  // ステート管理
  const [viewMode, setViewMode] = useState<"map" | "list">("map")
  const [selectedListing, setSelectedListing] = useState<SearchListing | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  /**
   * フィルター適用ハンドラー
   * フィルタパネルから呼ばれる
   * URL パラメータと filters state を更新
   */
  const handleFilter = (filterUpdate: {
    minArea: number
    maxArea: number
    minPrice: number
    maxPrice: number
    features: string[]
  }) => {
    const newFilters = {
      ...filters,
      minArea: filterUpdate.minArea,
      maxArea: filterUpdate.maxArea,
      minPrice: filterUpdate.minPrice,
      maxPrice: filterUpdate.maxPrice,
      features: filterUpdate.features,
    }
    
    updateFilters(newFilters)
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col lg:flex-row">
      {/* モバイル用フィルタートグル */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <span className="text-sm text-muted-foreground">{mockListings.length}件の農地</span>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "map" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("map")}
          >
            <Map className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(true)}>
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* モバイル用フィルターオーバーレイ */}
      {isFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-semibold">絞り込み条件</h2>
            <Button variant="ghost" size="sm" onClick={() => setIsFilterOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="overflow-y-auto h-[calc(100%-60px)] p-4">
            <FilterPanel
              onFilter={(filterData) => {
                handleFilter(filterData)
                setIsFilterOpen(false)
              }}
              initialFilters={{
                minArea: filters.minArea,
                maxArea: filters.maxArea,
                minPrice: filters.minPrice,
                maxPrice: filters.maxPrice,
                features: filters.features,
              }}
            />
          </div>
        </div>
      )}

      {/* デスクトップ用フィルターパネル */}
      <aside className="hidden lg:block w-80 border-r border-border overflow-y-auto bg-card">
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground">絞り込み条件</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {mockListings.length}件の農地が見つかりました
          </p>
        </div>
        <div className="p-4">
          <FilterPanel 
            onFilter={handleFilter}
            initialFilters={{
              minArea: filters.minArea,
              maxArea: filters.maxArea,
              minPrice: filters.minPrice,
              maxPrice: filters.maxPrice,
              features: filters.features,
            }}
          />
        </div>
      </aside>

      {/* メインコンテンツエリア */}
      <div className="flex-1 relative">
        {/* マップビュー（デスクトップは常に表示、モバイルは条件付き） */}
        <div className={`${viewMode === "map" ? "block" : "hidden"} lg:block h-full`}>
          <MapView
            farmlands={mockListings as any}
            selectedFarmland={selectedListing as any}
            onSelectFarmland={setSelectedListing as any}
          />
        </div>

        {/* リストビュー（モバイルのみ） */}
        <div className={`${viewMode === "list" ? "block" : "hidden"} lg:hidden h-full overflow-y-auto p-4`}>
          <div className="space-y-4">
            {mockListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                isSelected={selectedListing?.id === listing.id}
                onClick={() => setSelectedListing(listing)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
