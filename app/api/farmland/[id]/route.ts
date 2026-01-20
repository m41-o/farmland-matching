import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

/**
 * 特定の農地情報を取得するAPI
 * GET /api/farmland/{id}
 * 
 * パラメータ:
 * - id: 農地のID（URLパスから自動的に取得）
 * 
 * レスポンス:
 * - 成功時（200）: 農地の詳細情報
 * - 見つからない場合（404）: エラーメッセージ
 * - エラー時（500）: サーバーエラーメッセージ
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 15以降の動的パラメータは Promise で返されるため、await が必要
    const { id } = await params

    // 農地をIDから取得
    // findUnique: 主キー（id）で1件だけ取得する Prisma メソッド
    const farmland = await prisma.farmland.findUnique({
      where: { 
        id: id  // idはString型（UUID）なので、そのまま使う
      },
      include: {
        // provider: 農地を提供したユーザー情報を含める
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    // 農地が見つからない場合は404エラーを返す
    if (!farmland) {
      return NextResponse.json(
        { error: '農地が見つかりません' },
        { status: 404 }
      )
    }

    // 公開状態でない場合はエラー（非公開の農地は他ユーザーから見えないようにする）
    if (farmland.status !== 'PUBLIC') {
      return NextResponse.json(
        { error: 'この農地は公開されていません' },
        { status: 403 }
      )
    }

    // 農地情報を返す
    return NextResponse.json(farmland)
  } catch (error) {
    console.error('農地情報取得エラー:', error)
    return NextResponse.json(
      { error: '農地情報の取得に失敗しました' },
      { status: 500 }
    )
  }
}
