import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Plus, MapPin, Clock } from "lucide-react"

export default async function ProfilePage() {
  // TODO: 実際のユーザーデータを取得
  const userName = "ユーザー名"
  const userEmail = "user@example.com"
  
  // サンプル出品中の農地
  const listedFarmlands = [
    {
      id: "1",
      title: "日当たり良好な水田",
      location: "長野県松本市",
      area: 1200,
      price: 8000,
    },
  ]
  
  // サンプルお気に入り
  const favorites = [
    {
      id: "2",
      title: "南向きで日当たり抜群の水田",
      location: "長野県松本市梓川梶1234-5",
      area: 1200,
      price: 8000,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          {/* プロフィールヘッダー */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {userName}
            </h1>
            <p className="text-muted-foreground">{userEmail}</p>
          </div>

          {/* タブナビゲーション */}
          <Tabs defaultValue="listed" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="listed">出品中の農地</TabsTrigger>
              <TabsTrigger value="favorites">お気に入り</TabsTrigger>
            </TabsList>

            {/* 出品中の農地タブ */}
            <TabsContent value="listed" className="mt-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">出品中の農地</h2>
                <Button asChild size="sm">
                  <Link href="/farmland/new" className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    新規登録
                  </Link>
                </Button>
              </div>

              {listedFarmlands.length > 0 ? (
                <div className="space-y-3">
                  {listedFarmlands.map((farmland) => (
                    <Card key={farmland.id} className="p-4 hover:border-primary/50 transition-colors">
                      <Link href={`/farmland/${farmland.id}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                              {farmland.title}
                            </h3>
                            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {farmland.location}
                              </div>
                              <div>{farmland.area.toLocaleString()}㎡</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">
                              月額 {farmland.price.toLocaleString()}円
                            </p>
                          </div>
                        </div>
                      </Link>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    まだ農地を登録していません
                  </p>
                  <Button asChild>
                    <Link href="/farmland/new" className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      農地を登録する
                    </Link>
                  </Button>
                </Card>
              )}
            </TabsContent>

            {/* お気に入りタブ */}
            <TabsContent value="favorites" className="mt-6 space-y-4">
              <h2 className="text-xl font-semibold text-foreground mb-4">お気に入り</h2>

              {favorites.length > 0 ? (
                <div className="space-y-3">
                  {favorites.map((farmland) => (
                    <Card key={farmland.id} className="p-4 hover:border-primary/50 transition-colors">
                      <Link href={`/farmland/${farmland.id}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                              {farmland.title}
                            </h3>
                            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {farmland.location}
                              </div>
                              <div>{farmland.area.toLocaleString()}㎡</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">
                              月額 {farmland.price.toLocaleString()}円
                            </p>
                          </div>
                        </div>
                      </Link>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">
                    お気に入りの農地はまだありません
                  </p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
