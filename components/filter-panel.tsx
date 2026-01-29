"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Home, Droplets, Zap, Wifi, Car, Bath } from "lucide-react"

interface FilterPanelProps {
  onFilter: (filters: {
    minArea: number
    maxArea: number
    minPrice: number
    maxPrice: number
    features: string[]
  }) => void
  // URL パラメータから渡された初期フィルタ値
  initialFilters?: {
    minArea: number
    maxArea: number
    minPrice: number
    maxPrice: number
    features: string[]
  }
}

const infrastructureOptions = [
  { id: "shed", label: "小屋あり", icon: Home },
  { id: "toilet", label: "トイレあり", icon: Bath },
  { id: "water", label: "水利あり", icon: Droplets },
  { id: "electricity", label: "電気あり", icon: Zap },
  { id: "signal5g", label: "5G電波良好", icon: Wifi },
  { id: "signal4g", label: "4G電波良好", icon: Wifi },
  { id: "parking", label: "駐車場あり", icon: Car },
]

export function FilterPanel({ onFilter, initialFilters }: FilterPanelProps) {
  // 初期フィルタ値が渡されていればそれを使用、なければデフォルト値を使用
  const [areaRange, setAreaRange] = useState([
    initialFilters?.minArea ?? 0,
    initialFilters?.maxArea ?? 10000, // 上限を10000に拡大
  ])
  const [priceRange, setPriceRange] = useState([
    initialFilters?.minPrice ?? 0,
    initialFilters?.maxPrice ?? 500000, // 上限を500000に拡大
  ])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    initialFilters?.features ?? []
  )

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId) ? prev.filter((f) => f !== featureId) : [...prev, featureId],
    )
  }

  const handleApplyFilter = () => {
    onFilter({
      minArea: areaRange[0],
      maxArea: areaRange[1],
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      features: selectedFeatures,
    })
  }

  const handleReset = () => {
    setAreaRange([0, 5000])
    setPriceRange([0, 100000])
    setSelectedFeatures([])
    onFilter({
      minArea: 0,
      maxArea: 5000,
      minPrice: 0,
      maxPrice: 100000,
      features: [],
    })
  }

  return (
    <div className="space-y-6">
      {/* Area Filter */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">面積（㎡）</h3>
        <Slider 
          value={areaRange} 
          onValueChange={setAreaRange} 
          min={0} 
          max={10000}
          step={100} 
          className="mb-2"
        />
        <div className="flex gap-2 mt-2">
          <input
            type="number"
            value={areaRange[0]}
            onChange={(e) => setAreaRange([Math.min(Number(e.target.value), areaRange[1]), areaRange[1]])}
            className="flex-1 px-2 py-1 border border-input rounded text-sm bg-background"
            placeholder="最小値"
            min={0}
            max={5000}
          />
          <span className="self-center text-muted-foreground">〜</span>
          <input
            type="number"
            value={areaRange[1]}
            onChange={(e) => setAreaRange([areaRange[0], Math.max(Number(e.target.value), areaRange[0])])}
            className="flex-1 px-2 py-1 border border-input rounded text-sm bg-background"
            placeholder="最大値"
            min={0}
            max={10000}
          />
        </div>
        <div className="flex justify-between text-sm text-muted-foreground mt-1">
          <span>{areaRange[0].toLocaleString()}㎡</span>
          <span>{areaRange[1].toLocaleString()}㎡</span>
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">月額賃料（円）</h3>
        <Slider 
          value={priceRange} 
          onValueChange={setPriceRange} 
          min={0} 
          max={500000}
          step={5000} 
          className="mb-2"
        />
        <div className="flex gap-2 mt-2">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Math.min(Number(e.target.value), priceRange[1]), priceRange[1]])}
            className="flex-1 px-2 py-1 border border-input rounded text-sm bg-background"
            placeholder="最小値"
            min={0}
            max={100000}
          />
          <span className="self-center text-muted-foreground">〜</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0])])}
            className="flex-1 px-2 py-1 border border-input rounded text-sm bg-background"
            placeholder="最大値"
            min={0}
            max={500000}
          />
        </div>
        <div className="flex justify-between text-sm text-muted-foreground mt-1">
          <span>{priceRange[0].toLocaleString()}円</span>
          <span>{priceRange[1].toLocaleString()}円</span>
        </div>
      </div>

      {/* Infrastructure Filter */}
      <div>
        <h3 className="text-sm font-medium text-foreground mb-3">インフラ・設備</h3>
        <div className="space-y-3">
          {infrastructureOptions.map((option) => (
            <div key={option.id} className="flex items-center gap-3">
              <Checkbox
                id={option.id}
                checked={selectedFeatures.includes(option.id)}
                onCheckedChange={() => handleFeatureToggle(option.id)}
              />
              <Label htmlFor={option.id} className="flex items-center gap-2 text-sm cursor-pointer">
                <option.icon className="h-4 w-4 text-muted-foreground" />
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4">
        <Button variant="outline" onClick={handleReset} className="flex-1 bg-transparent">
          リセット
        </Button>
        <Button onClick={handleApplyFilter} className="flex-1">
          絞り込む
        </Button>
      </div>
    </div>
  )
}
