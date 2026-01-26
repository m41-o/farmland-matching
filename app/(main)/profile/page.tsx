import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Plus, MapPin, Heart } from "lucide-react"
import { redirect } from "next/navigation"
// 認証とデータベースアクセス用のインポート
import { auth } from "@/app/lib/auth"
import { prisma } from "@/app/lib/prisma"

export default async function ProfilePage() {
  // サーバーサイドで認証情報を取得
  // auth()はNextAuthの関数で、現在のセッション情報を返します
  const session = await auth()
  
  // 未ログインの場合はログインページへリダイレクト
  if (!session?.user?.id) {
    redirect("/login")
  }

  // データベースからユーザー情報を取得
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
    },
  })

  // ユーザーが見つからない場合（通常は発生しない）
  if (!user) {
    redirect("/login")
  }

  // ユーザーが出品した農地一覧を取得
  // where: providerId でフィルタリングし、公開中の農地のみ取得
  const listedFarmlands = await prisma.farmland.findMany({
    where: {
      providerId: session.user.id,
    },
    select: {
      id: true,
      name: true,
      prefecture: true,
      city: true,
      area: true,
      price: true,
    },
    orderBy: {
      createdAt: "desc", // 新しい順
    },
  })

  // ユーザーのお気に入り農地一覧を取得
  // include: farmland で農地の詳細情報も一緒に取得
  const favoriteRecords = await prisma.favorite.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      farmland: {
        select: {
          id: true,
          name: true,
          prefecture: true,
          city: true,
          area: true,
          price: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc", // 新しい順
    },
  })

  // お気に入りから農地情報を抽出
  const favorites = favoriteRecords.map((fav) => fav.farmland)

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12">
          {/* プロフィールヘッダー */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {user.name || "ユーザー"}
            </h1>
            <p className="text-muted-foreground">{user.email}</p>
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
                              {/* 名前がない場合は都道府県名で表示 */}
                              {farmland.name || `${farmland.prefecture}の農地`}
                            </h3>
                            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {farmland.prefecture} {farmland.city}
                              </div>
                              <div>{farmland.area.toLocaleString()}㎡</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">
                              {/* 価格がない場合は「応相談」と表示 */}
                              {farmland.price
                                ? `月額 ${farmland.price.toLocaleString()}円`
                                : "応相談"}
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
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                <h2 className="text-xl font-semibold text-foreground">
                  お気に入り（{favorites.length}件）
                </h2>
              </div>

              {favorites.length > 0 ? (
                <div className="space-y-3">
                  {favorites.map((farmland) => (
                    <Card key={farmland.id} className="p-4 hover:border-primary/50 transition-colors">
                      <Link href={`/farmland/${farmland.id}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground hover:text-primary transition-colors">
                              {/* 名前がない場合は都道府県名で表示 */}
                              {farmland.name || `${farmland.prefecture}の農地`}
                            </h3>
                            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {farmland.prefecture} {farmland.city}
                              </div>
                              <div>{farmland.area.toLocaleString()}㎡</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">
                              {/* 価格がない場合は「応相談」と表示 */}
                              {farmland.price
                                ? `月額 ${farmland.price.toLocaleString()}円`
                                : "応相談"}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    お気に入りの農地はまだありません
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/search">農地を探す</Link>
                  </Button>
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
