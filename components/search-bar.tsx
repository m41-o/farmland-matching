'use client'

import { Search, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"

// 都道府県一覧
const prefectures = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
]

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // フォームの状態管理
  // URL パラメータがあればそれを初期値に、なければ空文字
  const [prefecture, setPrefecture] = useState("")
  const [city, setCity] = useState("")
  const [keyword, setKeyword] = useState("")

  // コンポーネントマウント時に URL パラメータを読み込む
  useEffect(() => {
    setPrefecture(searchParams.get('prefecture') || '')
    setCity(searchParams.get('city') || '')
    setKeyword(searchParams.get('keyword') || '')
  }, [searchParams])

  /**
   * 検索ハンドラー
   * 検索条件をクエリパラメータとして /search にリダイレクト
   * 空の条件はパラメータに含めない
   */
  const handleSearch = () => {
    // URL パラメータを構築
    const params = new URLSearchParams()
    
    // 空でないパラメータのみ追加
    if (prefecture) params.append('prefecture', prefecture)
    if (city) params.append('city', city)
    if (keyword) params.append('keyword', keyword)

    // パラメータがある場合は付加、ない場合は /search のみ
    const queryString = params.toString()
    const searchUrl = queryString ? `/search?${queryString}` : '/search'
    
    router.push(searchUrl)
  }

  /**
   * Enterキー検索対応
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <section className="py-8 bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="bg-secondary rounded-xl p-4 md:p-6">
          <div className="flex flex-col md:flex-row gap-3">
            {/* 都道府県選択 */}
            <div className="flex-1">
              <Select value={prefecture} onValueChange={setPrefecture}>
                <SelectTrigger className="w-full bg-card border-border">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="都道府県を選択" />
                </SelectTrigger>
                <SelectContent>
                  {prefectures.map((pref) => (
                    <SelectItem key={pref} value={pref}>
                      {pref}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 市区町村入力 */}
            <div className="flex-1">
              <Input
                placeholder="市区町村を入力"
                className="bg-card border-border"
                value={city}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCity(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>

            {/* キーワード入力 */}
            <div className="flex-1">
              <Input
                placeholder="キーワード（例：水田、ハウス）"
                className="bg-card border-border"
                value={keyword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>

            {/* 検索ボタン */}
            <Button onClick={handleSearch} className="px-8">
              <Search className="h-4 w-4 mr-2" />
              検索する
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
