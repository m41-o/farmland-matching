import { NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'
import { auth } from '../../lib/auth'
import { z } from 'zod'

/**
 * お気に入りAPI
 * 
 * このファイルでは、お気に入り機能の主要なAPI（一覧取得と追加）を提供します。
 * - GET: ログインユーザーのお気に入り農地一覧を取得
 * - POST: 農地をお気に入りに追加
 */

// お気に入り追加時のバリデーションスキーマ
// farmlandIdは必須で、空文字でないことを確認
const favoriteSchema = z.object({
  farmlandId: z.string().min(1, '農地IDを指定してください'),
})

/**
 * GET /api/favorites
 * 
 * ログインユーザーのお気に入り農地一覧を取得します。
 * 認証が必要なエンドポイントです。
 * 
 * @returns お気に入り農地の配列（農地情報を含む）
 */
export async function GET() {
  try {
    // 認証チェック: ログインしていない場合は401エラー
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      )
    }

    // ユーザーのお気に入り一覧を取得
    // include: farmland を指定することで、お気に入りに紐づく農地情報も一緒に取得
    // orderBy: createdAt の降順で、最近追加したものが先頭に来るようソート
    const favorites = await prisma.favorite.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        // 農地の詳細情報を含める
        farmland: {
          // 提供者情報も含める
          include: {
            provider: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // 新しい順
      },
    })

    // お気に入りから農地情報を抽出して返す
    // これにより、フロントエンドでは直接農地データとして扱える
    const farmlands = favorites.map((fav) => ({
      ...fav.farmland,
      favoriteId: fav.id, // お気に入りID（削除時に使用）
      favoritedAt: fav.createdAt, // お気に入り登録日時
    }))

    return NextResponse.json({
      data: farmlands,
      total: farmlands.length,
    })
  } catch (error) {
    console.error('お気に入り取得エラー:', error)
    return NextResponse.json(
      { error: 'お気に入りの取得に失敗しました' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/favorites
 * 
 * 農地をお気に入りに追加します。
 * 認証が必要なエンドポイントです。
 * 同じ農地を重複して追加しようとした場合はエラーを返します。
 * 
 * @body { farmlandId: string } - お気に入りに追加する農地のID
 * @returns 作成されたお気に入りレコード
 */
export async function POST(request: Request) {
  try {
    // 認証チェック
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      )
    }

    // リクエストボディを取得してバリデーション
    const body = await request.json()
    const validatedData = favoriteSchema.safeParse(body)
    
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'バリデーションエラー', details: validatedData.error.issues },
        { status: 400 }
      )
    }

    const { farmlandId } = validatedData.data

    // 農地が存在するかチェック
    const farmland = await prisma.farmland.findUnique({
      where: { id: farmlandId },
    })

    if (!farmland) {
      return NextResponse.json(
        { error: '指定された農地が見つかりません' },
        { status: 404 }
      )
    }

    // 既にお気に入りに追加されているかチェック
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        // ユニーク制約（userId_farmlandId）を使って検索
        userId_farmlandId: {
          userId: session.user.id,
          farmlandId,
        },
      },
    })

    if (existingFavorite) {
      return NextResponse.json(
        { error: 'この農地は既にお気に入りに追加されています' },
        { status: 409 } // 409 Conflict: リソースの競合
      )
    }

    // お気に入りを作成
    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        farmlandId,
      },
      include: {
        farmland: true,
      },
    })

    return NextResponse.json(
      {
        message: 'お気に入りに追加しました',
        favorite,
      },
      { status: 201 } // 201 Created: リソースが正常に作成された
    )
  } catch (error) {
    console.error('お気に入り追加エラー:', error)
    return NextResponse.json(
      { error: 'お気に入りの追加に失敗しました' },
      { status: 500 }
    )
  }
}
