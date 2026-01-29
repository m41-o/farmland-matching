"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toastNotify } from "@/lib/notifications"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Home,
  Bath,
  Droplets,
  Wifi,
  Signal,
  Truck,
  Lock,
  Unlock,
  Wrench,
  Upload,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react"

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

export function LandRegistrationForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    // Basic info
    name: "",
    prefecture: "",
    city: "",
    address: "",
    area: "",
    price: "",
    description: "",
    availableFrom: "",
    availableTo: "",
    latitude: "",
    longitude: "",
    images: [] as string[],
    // Shed
    hasShed: false,
    shedHasLock: false,
    shedSize: "",
    shedHasTools: false,
    shedToolList: "",
    // Toilet
    hasToilet: false,
    toiletType: "",
    nearestToiletDistance: "",
    // Water
    hasWater: false,
    waterType: "",
    // Communication
    has4G: false,
    signal4GStrength: "",
    has5G: false,
    hasWifi: false,
    // Access
    lightTruckAccessible: false,
    roadWidth: "",
    parkingSpaces: "",
  })

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    const toastId = toastNotify.registrationStart()
    
    try {
      // バリデーション：必須フィールドの確認
      if (!formData.prefecture || !formData.city || !formData.address || !formData.area || !formData.availableFrom) {
        toastNotify.generalError("必須項目を入力してください")
        setIsSubmitting(false)
        return
      }

      const payload = {
        name: formData.name || null,
        prefecture: formData.prefecture,
        city: formData.city,
        address: formData.address,
        area: formData.area ? parseFloat(formData.area) : 0,
        price: formData.price ? parseInt(formData.price) : null,
        description: formData.description || null,
        availableFrom: formData.availableFrom,
        availableTo: formData.availableTo || null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        images: formData.images.length > 0 ? formData.images : [],
      }

      console.log("送信データ:", payload) // デバッグ用

      const response = await fetch("/api/farmland", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error("APIエラー:", error) // デバッグ用
        // バリデーションエラーの詳細を表示
        if (error.details) {
          const messages = error.details.map((d: any) => `${d.path.join('.')}: ${d.message}`).join('\n')
          throw new Error(`バリデーションエラー:\n${messages}`)
        }
        throw new Error(error.error || "登録に失敗しました")
      }

      // 成功通知
      toastNotify.registrationSuccess(toastId)
      router.push("/")
    } catch (error: any) {
      console.error("エラー詳細:", error) // デバッグ用
      toastNotify.registrationError(toastId)
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalSteps = 4

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">農地を登録する</h1>
        <p className="text-muted-foreground mt-2">農地の情報を入力して、新規就農希望者とマッチングしましょう</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                s === step
                  ? "bg-primary text-primary-foreground"
                  : s < step
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {s < step ? <CheckCircle2 className="h-5 w-5" /> : s}
            </div>
            {s < 4 && <div className={`w-12 h-1 mx-1 rounded ${s < step ? "bg-primary/50" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 1 && "基本情報"}
            {step === 2 && "小屋・トイレ"}
            {step === 3 && "水利・通信環境"}
            {step === 4 && "アクセス・確認"}
          </CardTitle>
          <CardDescription>
            {step === 1 && "農地の所在地と基本的な情報を入力してください"}
            {step === 2 && "設備の有無とその詳細を選択してください"}
            {step === 3 && "水利環境と通信状況を入力してください"}
            {step === 4 && "車両アクセスの情報を入力し、内容を確認してください"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">農地名（任意）</Label>
                <Input
                  id="name"
                  placeholder="例: 梓川の日当たり良好な田"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prefecture">都道府県 *</Label>
                  <Select value={formData.prefecture} onValueChange={(v) => updateFormData("prefecture", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="選択してください" />
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
                <div className="space-y-2">
                  <Label htmlFor="city">市区町村 *</Label>
                  <Input
                    id="city"
                    placeholder="例: 松本市"
                    value={formData.city}
                    onChange={(e) => updateFormData("city", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">住所・地番 *</Label>
                <Input
                  id="address"
                  placeholder="例: 梓川梓1234-5"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="area">面積（㎡）*</Label>
                  <Input
                    id="area"
                    type="number"
                    placeholder="例: 1200"
                    value={formData.area}
                    onChange={(e) => updateFormData("area", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">希望賃料（月額・円）</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="例: 8000"
                    value={formData.price}
                    onChange={(e) => updateFormData("price", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="availableFrom">利用可能開始日 *</Label>
                  <Input
                    id="availableFrom"
                    type="datetime-local"
                    value={formData.availableFrom}
                    onChange={(e) => updateFormData("availableFrom", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availableTo">利用可能終了日</Label>
                  <Input
                    id="availableTo"
                    type="datetime-local"
                    value={formData.availableTo}
                    onChange={(e) => updateFormData("availableTo", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">農地の説明</Label>
                <Textarea
                  id="description"
                  placeholder="農地の特徴や栽培に適した作物などを記載してください"
                  rows={4}
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                />
              </div>

              {/* Image Upload Section */}
              <div className="space-y-2">
                <Label htmlFor="images" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  農地の画像をアップロード
                </Label>
                <div 
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    e.currentTarget.style.borderColor = 'var(--primary)'
                    e.currentTarget.style.backgroundColor = 'rgba(var(--primary), 0.05)'
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    e.currentTarget.style.borderColor = ''
                    e.currentTarget.style.backgroundColor = ''
                  }}
                  onDrop={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    e.currentTarget.style.borderColor = ''
                    e.currentTarget.style.backgroundColor = ''
                    
                    const files = Array.from(e.dataTransfer?.files || []).filter((file) =>
                      file.type.startsWith('image/')
                    )
                    
                    const promises = files.map((file) => {
                      return new Promise<string>((resolve) => {
                        // 画像を圧縮してから Base64 に変換
                        const canvas = document.createElement('canvas')
                        const ctx = canvas.getContext('2d')!
                        const img = new Image()
                        
                        img.onload = () => {
                          // 最大幅1200px、アスペクト比を保持
                          let width = img.width
                          let height = img.height
                          
                          if (width > 1200) {
                            height = (height * 1200) / width
                            width = 1200
                          }
                          
                          canvas.width = width
                          canvas.height = height
                          ctx.drawImage(img, 0, 0, width, height)
                          
                          // JPEG品質70%で圧縮
                          resolve(canvas.toDataURL('image/jpeg', 0.7))
                        }
                        
                        img.src = URL.createObjectURL(file)
                      })
                    })
                    Promise.all(promises).then((images) => {
                      updateFormData("images", [...formData.images, ...images])
                    })
                  }}
                >
                  <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || [])
                      const promises = files.map((file) => {
                        return new Promise<string>((resolve) => {
                          // 画像を圧縮してから Base64 に変換
                          const canvas = document.createElement('canvas')
                          const ctx = canvas.getContext('2d')!
                          const img = new Image()
                          
                          img.onload = () => {
                            // 最大幅1200px、アスペクト比を保持
                            let width = img.width
                            let height = img.height
                            
                            if (width > 1200) {
                              height = (height * 1200) / width
                              width = 1200
                            }
                            
                            canvas.width = width
                            canvas.height = height
                            ctx.drawImage(img, 0, 0, width, height)
                            
                            // JPEG品質70%で圧縮
                            resolve(canvas.toDataURL('image/jpeg', 0.7))
                          }
                          
                          img.src = URL.createObjectURL(file)
                        })
                      })
                      Promise.all(promises).then((images) => {
                        updateFormData("images", [...formData.images, ...images])
                      })
                    }}
                  />
                  <label htmlFor="images" className="cursor-pointer block">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        クリックして画像を選択、または<br />
                        ドラッグ&ドロップで追加
                      </span>
                    </div>
                  </label>
                </div>

                {/* Uploaded Images Preview */}
                {formData.images.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">
                      アップロード済み画像：{formData.images.length}枚
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`農地画像 ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              updateFormData(
                                "images",
                                formData.images.filter((_, i) => i !== index)
                              )
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Step 2: Shed & Toilet */}
          {step === 2 && (
            <>
              {/* Shed Section */}
              <div className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center gap-3">
                  <Home className="h-5 w-5 text-primary" />
                  <Label className="text-base font-medium">小屋</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasShed"
                    checked={formData.hasShed}
                    onCheckedChange={(v) => updateFormData("hasShed", v)}
                  />
                  <Label htmlFor="hasShed" className="font-normal">
                    小屋あり
                  </Label>
                </div>
                {formData.hasShed && (
                  <div className="pl-6 space-y-4 border-l-2 border-primary/20 ml-2">
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="shedHasLock"
                          checked={formData.shedHasLock}
                          onCheckedChange={(v) => updateFormData("shedHasLock", v)}
                        />
                        <Label htmlFor="shedHasLock" className="font-normal flex items-center gap-1">
                          {formData.shedHasLock ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                          鍵付き
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="shedHasTools"
                          checked={formData.shedHasTools}
                          onCheckedChange={(v) => updateFormData("shedHasTools", v)}
                        />
                        <Label htmlFor="shedHasTools" className="font-normal flex items-center gap-1">
                          <Wrench className="h-4 w-4" />
                          農具あり
                        </Label>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="shedSize">広さ</Label>
                        <Input
                          id="shedSize"
                          placeholder="例: 約6畳（10㎡）"
                          value={formData.shedSize}
                          onChange={(e) => updateFormData("shedSize", e.target.value)}
                        />
                      </div>
                      {formData.shedHasTools && (
                        <div className="space-y-2">
                          <Label htmlFor="shedToolList">備品リスト</Label>
                          <Input
                            id="shedToolList"
                            placeholder="例: 鍬、スコップ、一輪車"
                            value={formData.shedToolList}
                            onChange={(e) => updateFormData("shedToolList", e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Toilet Section */}
              <div className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center gap-3">
                  <Bath className="h-5 w-5 text-primary" />
                  <Label className="text-base font-medium">トイレ</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasToilet"
                    checked={formData.hasToilet}
                    onCheckedChange={(v) => updateFormData("hasToilet", v)}
                  />
                  <Label htmlFor="hasToilet" className="font-normal">
                    トイレあり
                  </Label>
                </div>
                {formData.hasToilet ? (
                  <div className="pl-6 space-y-4 border-l-2 border-primary/20 ml-2">
                    <div className="space-y-2">
                      <Label>トイレの種類</Label>
                      <RadioGroup value={formData.toiletType} onValueChange={(v) => updateFormData("toiletType", v)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="簡易トイレ" id="toilet-simple" />
                          <Label htmlFor="toilet-simple" className="font-normal">
                            簡易トイレ
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="水洗トイレ" id="toilet-flush" />
                          <Label htmlFor="toilet-flush" className="font-normal">
                            水洗トイレ
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="nearestToiletDistance">最寄りの公衆トイレまでの距離</Label>
                    <Input
                      id="nearestToiletDistance"
                      placeholder="例: 500m（徒歩7分）"
                      value={formData.nearestToiletDistance}
                      onChange={(e) => updateFormData("nearestToiletDistance", e.target.value)}
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {/* Step 3: Water & Communication */}
          {step === 3 && (
            <>
              {/* Water Section */}
              <div className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center gap-3">
                  <Droplets className="h-5 w-5 text-primary" />
                  <Label className="text-base font-medium">水利</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasWater"
                    checked={formData.hasWater}
                    onCheckedChange={(v) => updateFormData("hasWater", v)}
                  />
                  <Label htmlFor="hasWater" className="font-normal">
                    水利あり
                  </Label>
                </div>
                {formData.hasWater && (
                  <div className="pl-6 space-y-4 border-l-2 border-primary/20 ml-2">
                    <div className="space-y-2">
                      <Label>水源の種類</Label>
                      <RadioGroup value={formData.waterType} onValueChange={(v) => updateFormData("waterType", v)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="用水路引水" id="water-canal" />
                          <Label htmlFor="water-canal" className="font-normal">
                            用水路引水
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="井戸" id="water-well" />
                          <Label htmlFor="water-well" className="font-normal">
                            井戸
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="上水道" id="water-tap" />
                          <Label htmlFor="water-tap" className="font-normal">
                            上水道
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                )}
              </div>

              {/* Communication Section */}
              <div className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center gap-3">
                  <Signal className="h-5 w-5 text-primary" />
                  <Label className="text-base font-medium">通信環境</Label>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="has4G"
                        checked={formData.has4G}
                        onCheckedChange={(v) => updateFormData("has4G", v)}
                      />
                      <Label htmlFor="has4G" className="font-normal">
                        4G電波あり
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="has5G"
                        checked={formData.has5G}
                        onCheckedChange={(v) => updateFormData("has5G", v)}
                      />
                      <Label htmlFor="has5G" className="font-normal">
                        5G対応
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasWifi"
                        checked={formData.hasWifi}
                        onCheckedChange={(v) => updateFormData("hasWifi", v)}
                      />
                      <Label htmlFor="hasWifi" className="font-normal flex items-center gap-1">
                        <Wifi className="h-4 w-4" />
                        Wi-Fiあり
                      </Label>
                    </div>
                  </div>
                  {formData.has4G && (
                    <div className="space-y-2">
                      <Label>4G電波強度</Label>
                      <RadioGroup
                        value={formData.signal4GStrength}
                        onValueChange={(v) => updateFormData("signal4GStrength", v)}
                        className="flex gap-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="1" id="signal-1" />
                          <Label htmlFor="signal-1" className="font-normal">
                            弱
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="2" id="signal-2" />
                          <Label htmlFor="signal-2" className="font-normal">
                            やや弱
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="3" id="signal-3" />
                          <Label htmlFor="signal-3" className="font-normal">
                            良好
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="4" id="signal-4" />
                          <Label htmlFor="signal-4" className="font-normal">
                            非常に良好
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Step 4: Access & Confirmation */}
          {step === 4 && (
            <>
              {/* Access Section */}
              <div className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-primary" />
                  <Label className="text-base font-medium">車両アクセス</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="lightTruckAccessible"
                    checked={formData.lightTruckAccessible}
                    onCheckedChange={(v) => updateFormData("lightTruckAccessible", v)}
                  />
                  <Label htmlFor="lightTruckAccessible" className="font-normal">
                    軽トラック進入可能
                  </Label>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="roadWidth">前面道路の幅</Label>
                    <Input
                      id="roadWidth"
                      placeholder="例: 4m"
                      value={formData.roadWidth}
                      onChange={(e) => updateFormData("roadWidth", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parkingSpaces">駐車可能台数</Label>
                    <Input
                      id="parkingSpaces"
                      type="number"
                      placeholder="例: 2"
                      value={formData.parkingSpaces}
                      onChange={(e) => updateFormData("parkingSpaces", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 bg-secondary/50 rounded-lg space-y-4">
                <h3 className="font-medium text-foreground">登録内容の確認</h3>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">所在地：</span>
                    <span className="text-foreground ml-1">
                      {formData.prefecture} {formData.city} {formData.address}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">面積：</span>
                    <span className="text-foreground ml-1">{formData.area}㎡</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">希望賃料：</span>
                    <span className="text-foreground ml-1">{formData.price ? `月額${formData.price}円` : "応相談"}</span>
                  </div>
                </div>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  {formData.hasShed && <Badge variant="secondary">小屋あり</Badge>}
                  {formData.hasToilet && <Badge variant="secondary">トイレあり</Badge>}
                  {formData.hasWater && <Badge variant="secondary">水利あり</Badge>}
                  {formData.has4G && <Badge variant="secondary">4G</Badge>}
                  {formData.has5G && <Badge variant="secondary">5G</Badge>}
                  {formData.hasWifi && <Badge variant="secondary">Wi-Fi</Badge>}
                  {formData.lightTruckAccessible && <Badge variant="secondary">軽トラ可</Badge>}
                </div>
              </div>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              戻る
            </Button>
            {step < totalSteps ? (
              <Button onClick={() => setStep((s) => Math.min(totalSteps, s + 1))} className="gap-2">
                次へ
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                {isSubmitting ? "登録中..." : "登録する"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
