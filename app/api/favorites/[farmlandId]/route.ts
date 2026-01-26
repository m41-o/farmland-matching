import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { auth } from '../../../lib/auth'

/**
 * 個別農地のお気に入りAPI
 * 
 * このファイルでは、特定の農地に対するお気に入り操作を提供します。
 * - GET: 特定の農地がお気に入りに登録されているかチェック
 * - DELETE: 特定の農地をお気に入りから削除
 * 
 * URLパラメータ:
 * - farmlandId: 対象の農地ID
 */

// Next.js App Router の動的ルートパラメータの型定義
interface RouteParams {
  params: Promise<{
    farmlandId: string
  }>
}

/**
 * GET /api/favorites/[farmlandId]
 * 
 * 指定された農地がログインユーザーのお気に入りに登録されているかをチェックします。
 * フロントエンドでお気に入りボタンの状態（塗りつぶし or アウトライン）を決定するために使用。
 * 
 * @param params.farmlandId - チェックする農地のID
 * @returns { isFavorite: boolean, favoriteId?: string }
 */
export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    // Next.js 15以降では params が Promise になっているため await が必要
    const { farmlandId } = await params

    // 認証チェック
    const session = await auth()
    if (!session?.user?.id) {
      // 未ログインの場合は、お気に入りではないと返す
      return NextResponse.json({ isFavorite: false })
    }

    // お気に入りが存在するかチェック
    const favorite = await prisma.favorite.findUnique({
      where: {
        // ユニーク制約を使って効率的に検索
        userId_farmlandId: {
          userId: session.user.id,
          farmlandId,
        },
      },
    })

    return NextResponse.json({
      isFavorite: !!favorite, // favoriteが存在すればtrue
      favoriteId: favorite?.id, // 削除時に使用するID
    })
  } catch (error) {
    console.error('お気に入りチェックエラー:', error)
    return NextResponse.json(
      { error: 'お気に入りの確認に失敗しました' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/favorites/[farmlandId]
 * 
 * 指定された農地をお気に入りから削除します。
 * 認証が必要なエンドポイントです。
 * 
 * @param params.farmlandId - 削除する農地のID
 * @returns 削除成功メッセージ
 */
export async function DELETE(
  request: Request,
  { params }: RouteParams
) {
  try {
    const { farmlandId } = await params

    // 認証チェック
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      )
    }

    // お気に入りが存在するかチェック
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_farmlandId: {
          userId: session.user.id,
          farmlandId,
        },
      },
    })

    if (!favorite) {
      return NextResponse.json(
        { error: 'この農地はお気に入りに登録されていません' },
        { status: 404 }
      )
    }

    // お気に入りを削除
    await prisma.favorite.delete({
      where: {
        id: favorite.id,
      },
    })

    return NextResponse.json({
      message: 'お気に入りから削除しました',
    })
  } catch (error) {
    console.error('お気に入り削除エラー:', error)
    return NextResponse.json(
      { error: 'お気に入りの削除に失敗しました' },
      { status: 500 }
    )
  }
}
