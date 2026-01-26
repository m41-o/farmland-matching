"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  MapPin,
  Maximize,
  Home,
  Droplets,
  Zap,
  Wifi,
  Bath,
  ArrowLeft,
  Share2,
  CheckCircle2,
  XCircle,
  Building2,
  Lock,
  Unlock,
  Ruler,
  Wrench,
  Signal,
  Truck,
  Trees,
  Home as House,
  Tractor,
  Landmark,
  GraduationCap,
  Coins,
  FileText,
  ClipboardCheck,
  CheckCircle,
  Circle,
  ArrowRight,
  Loader,
} from "lucide-react"
import Link from "next/link"
// お気に入りボタンコンポーネントをインポート
import { FavoriteButton } from "@/components/favorite-button"

interface Farmland {
  id: string
  name: string | null
  prefecture: string
  city: string
  address: string
  area: number
  price: number | null
  description: string | null
  latitude: number | null
  longitude: number | null
  availableFrom: string
  availableTo: string | null
  images: string[]
  status: string
  createdAt: string
  updatedAt: string
  provider: {
    id: string
    name: string | null
    email: string
  }
}

interface DetailPageContentProps {
  id: string
}

const rentalSteps = [
  { id: 1, label: "現地確認", description: "農地の下見と環境チェック", completed: false, current: true },
  { id: 2, label: "営農計画作成", description: "栽培計画・収支計画の作成", completed: false, current: false },
  { id: 3, label: "書類提出", description: "農業委員会への申請書類提出", completed: false, current: false },
  { id: 4, label: "許可待ち", description: "審査結果の通知（約1ヶ月）", completed: false, current: false },
]

function SignalStrength({ strength, type }: { strength: number; type: "4G" | "5G" }) {
  const bars = [1, 2, 3, 4]
  return (
    <div className="flex items-center gap-1">
      <span className="text-xs font-medium text-muted-foreground mr-1">{type}</span>
      <div className="flex items-end gap-0.5">
        {bars.map((bar) => (
          <div
            key={bar}
            className={`w-1 rounded-sm ${bar <= strength ? "bg-primary" : "bg-muted"}`}
            style={{ height: `${bar * 4 + 4}px` }}
          />
        ))}
      </div>
    </div>
  )
}

export function DetailPageContent({ id }: DetailPageContentProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [farmland, setFarmland] = useState<Farmland | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // 拡大表示する画像のためのstate
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const progressPercent = ((currentStep - 1) / (rentalSteps.length - 1)) * 100

  useEffect(() => {
    const fetchFarmland = async () => {
      try {
        const response = await fetch(`/api/farmland/${id}`)
        if (!response.ok) {
          throw new Error("農地情報の取得に失敗しました")
        }
        const data = await response.json()
        setFarmland(data)
      } catch (err) {
        console.error("Error fetching farmland:", err)
        setError("農地情報の取得に失敗しました")
      } finally {
        setIsLoading(false)
      }
    }

    fetchFarmland()
  }, [id])

  if (isLoading) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error || !farmland) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-bold text-foreground mb-2">農地が見つかりません</h2>
            <p className="text-muted-foreground mb-4">{error || "指定されたIDの農地は存在しないか、削除された可能性があります。"}</p>
            <Button asChild>
              <Link href="/">農地を検索する</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="bg-background">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-4">
        <Button variant="ghost" asChild className="gap-2">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            検索結果に戻る
          </Link>
        </Button>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Image */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-xl overflow-hidden bg-muted h-96">
              {farmland.images && farmland.images.length > 0 ? (
                <>
                  <div className="md:row-span-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setSelectedImage(farmland.images[0])}>
                    <img
                      src={farmland.images[0]}
                      alt={farmland.name || "農地"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="hidden md:grid grid-cols-2 gap-2">
                    {farmland.images.slice(1, 4).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`農地 ${index + 2}`}
                        className="w-full h-40 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setSelectedImage(image)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  画像なし
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">農地情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground">所在地</p>
                  <p className="font-medium text-foreground">
                    {farmland.prefecture} {farmland.city} {farmland.address}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">面積</p>
                  <p className="font-medium text-foreground">{farmland.area.toLocaleString()} ㎡</p>
                </div>
                <div>
                  <p className="text-muted-foreground">利用可能期間</p>
                  <p className="font-medium text-foreground">
                    {new Date(farmland.availableFrom).toLocaleDateString("ja-JP")}
                    {farmland.availableTo && ` ～ ${new Date(farmland.availableTo).toLocaleDateString("ja-JP")}`}
                  </p>
                </div>
                {farmland.latitude && farmland.longitude && (
                  <div>
                    <p className="text-muted-foreground">座標</p>
                    <p className="font-medium text-foreground">
                      {farmland.latitude.toFixed(4)}, {farmland.longitude.toFixed(4)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Basic Info */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  {farmland.name || `${farmland.prefecture}の農地`}
                </h1>
                <div className="flex gap-2">
                  {/* お気に入りボタン: 実際にAPI連携して動作 */}
                  <FavoriteButton farmlandId={id} />
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {farmland.prefecture} {farmland.city}
                </div>
                <div className="flex items-center gap-2">
                  <Maximize className="h-5 w-5" />
                  {farmland.area.toLocaleString()} ㎡
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">
                  {farmland.price ? `月額 ${farmland.price.toLocaleString()}円` : "応相談"}
                </span>
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  <Truck className="h-3 w-3 mr-1" />
                  農地情報
                </Badge>
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>農地の説明</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                  {farmland.description || "説明はありません"}
                </p>
              </CardContent>
            </Card>

            {/* Basic Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>基本情報</CardTitle>
                <CardDescription>この農地の基本的な情報です</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-border bg-secondary">
                    <div className="flex items-center gap-3 mb-2">
                      <Maximize className="h-5 w-5 text-primary" />
                      <span className="font-medium text-foreground">面積</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{farmland.area.toLocaleString()} ㎡</p>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-secondary">
                    <div className="flex items-center gap-3 mb-2">
                      <Coins className="h-5 w-5 text-primary" />
                      <span className="font-medium text-foreground">賃料</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {farmland.price ? `${farmland.price.toLocaleString()}円/月` : "応相談"}
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-secondary">
                    <div className="flex items-center gap-3 mb-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      <span className="font-medium text-foreground">提供者</span>
                    </div>
                    <p className="text-foreground">{farmland.provider.name || farmland.provider.email}</p>
                  </div>

                  <div className="p-4 rounded-lg border border-border bg-secondary">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="font-medium text-foreground">所在地</span>
                    </div>
                    <p className="text-foreground">
                      {farmland.prefecture} {farmland.city}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Tracker */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                  この農地を借りるまでの進捗
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={progressPercent} className="h-2" />
                <div className="space-y-3">
                  {rentalSteps.map((step) => (
                    <div
                      key={step.id}
                      className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                        step.id === currentStep
                          ? "bg-primary/10 border border-primary/20"
                          : step.id < currentStep
                            ? "bg-muted/50"
                            : ""
                      }`}
                    >
                      <div className="mt-0.5">
                        {step.id < currentStep ? (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        ) : step.id === currentStep ? (
                          <Circle className="h-5 w-5 text-primary fill-primary/20" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`font-medium ${step.id <= currentStep ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {step.label}
                        </p>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">農地情報</CardTitle>
                <CardDescription>提供者：{farmland.provider.name || farmland.provider.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full gap-2" asChild>
                  <Link href={`/farmland/${farmland.id}/application`}>
                    <FileText className="h-4 w-4" />
                    申請手続きを始める
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" className="w-full gap-2 bg-transparent">
                  <Building2 className="h-4 w-4" />
                  提供者に問い合わせ
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Zoom Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] p-0">
          {selectedImage && (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <img
                src={selectedImage}
                alt="拡大画像"
                className="max-w-full max-h-[85vh] object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
