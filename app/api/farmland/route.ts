import { NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'
import { auth } from '../../lib/auth'
import { z } from 'zod'

// 農地登録のバリデーションスキーマ
const farmlandSchema = z.object({
  name: z.string().optional().nullable(),
  prefecture: z.string().min(2, '都道府県を入力してください'),
  city: z.string().min(2, '市区町村を入力してください'),
  address: z.string().min(3, '住所を入力してください'),
  area: z.number().positive('面積は0より大きい値を入力してください'),
  price: z.number().optional().nullable(),
  availableFrom: z.string().min(1, '利用可能開始日を入力してください'),
  availableTo: z.string().optional().nullable(), // nullを許可
  description: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(), // nullを許可
  longitude: z.number().optional().nullable(), // nullを許可
  images: z.array(z.string()).optional().nullable(),
  // 設備情報：各項目が真偽値であることを検証
  facilities: z.object({
    shed: z.boolean().optional(),
    toilet: z.boolean().optional(),
    water: z.boolean().optional(),
    electricity: z.boolean().optional(),
    signal5g: z.boolean().optional(),
    signal4g: z.boolean().optional(),
    parking: z.boolean().optional(),
  }).optional().nullable(),
})

/**
 * Zodのobjectスキーマ定義文法について解説します。
 * 
 * const farmlandSchema = z.object({
 *   name: z.string().optional(),
 *   prefecture: z.string().min(2, '都道府県を入力してください'),
 *   city: z.string().min(2, '市区町村を入力してください'),
 *   address: z.string().min(3, '住所を入力してください'),
 *   area: z.number().positive('面積は0より大きい値を入力してください'),
 *   price: z.number().optional(),
 *   availableFrom: z.string().datetime('有効な日時を入力してください'),
 *   availableTo: z.string().datetime().optional(),
 *   description: z.string().optional(),
 *   latitude: z.number().optional(),
 *   longitude: z.number().optional(),
 *   images: z.array(z.string().url()).optional(),
 * })
 * 
 * - z.object({ ... }) ：オブジェクト型のバリデーションスキーマを作成。
 * - z.string() ：string型。min(n, msg)で最小文字数＆エラーメッセージ指定。
 * - z.number() ：number型。positive(msg)で0より大きいか判定し、エラー文言を指定。
 * - .optional() ：そのフィールドが省略可能（undefined許容）であることを示します。
 * - z.array(z.string().url()) ：URL形式の文字列配列。
 * - .datetime() ：日付時刻のフォーマット（ISO8601文字列等）検証。
 *  
 * このスキーマは入力値が期待通りか検証し、safeParseでエラーメッセージ詳細も取得できます。
 */

/**
 * GET関数は、Next.jsのAPI RouteでHTTP GETリクエストを処理するasync関数です。
 * 
 * 文法解説:
 * 
 * export async function GET() { ... }
 * - export: この関数を他のファイルやNext.jsで使えるようエクスポートします。
 * - async: 非同期処理（Promise対応）。awaitが使えます。
 * - function GET(): GET HTTPメソッドにマッピングされるAPI関数です。
 * 
 * try { ... } catch (error) { ... }
 * - エラーが発生しうる非同期処理をtryで囲み、catchで例外を補足します。
 * 
 * const farmlands = await prisma.farmland.findMany({...})
 * - prisma.farmland.findMany(): Prisma ORMでfarmlandテーブルの複数レコードを取得します。
 * - include: 関連するprovider（農地の提供者）情報も連携して取得。
 * - select: providerからid, name, emailのみ取得。
 * - where: statusが'PUBLIC'（一般公開のみ）。
 * - orderBy: 作成日の降順で並び替え。
 * 
 * return NextResponse.json(farmlands)
 * - Next.jsのAPIレスポンスとしてJSON形式でfarmlandsデータを返します。
 * 
 * catch内:
 * - エラー発生時、console.errorでログを出し、JSON形式でエラーメッセージと500番（サーバーエラー）ステータスを返します。
 */
export async function GET(request: Request) {
  try {
    // クエリパラメータを取得
    const { searchParams } = new URL(request.url)
    
    // フィルタパラメータ
    const prefecture = searchParams.get('prefecture')
    const city = searchParams.get('city')
    const minArea = searchParams.get('minArea')
    const maxArea = searchParams.get('maxArea')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const keyword = searchParams.get('keyword')
    // 設備フィルタはカンマ区切り文字列で受け取る（例: "shed,water,electricity"）
    const facilitiesParam = searchParams.get('facilities')
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '10'

    // ページネーションの計算
    const pageNum = Math.max(1, parseInt(page))
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)))
    const skip = (pageNum - 1) * limitNum

    // 設備フィルタ条件を構築
    // facilitiesParam が "shed,water" なら、AND条件で複数の設備を検索
    const facilitiesConditions = facilitiesParam
      ? facilitiesParam.split(',').map((facility) => ({
          [`facilities.${facility.trim()}`]: true,
        }))
      : []

    // キーワード条件を構築
    // 農地の説明(description)と名前(name)の両方から検索
    const keywordCondition = keyword
      ? {
          OR: [
            { description: { contains: keyword } },
            { name: { contains: keyword } },
          ],
        }
      : {}

    // Where 条件を構築
    const where = {
      status: 'PUBLIC' as const,
      ...(prefecture && { prefecture: { contains: prefecture } }),
      ...(city && { city: { contains: city } }),
      ...(minArea && { area: { gte: parseFloat(minArea) } }),
      ...(maxArea && { area: { lte: parseFloat(maxArea) } }),
      ...(minPrice && { price: { gte: parseInt(minPrice) } }),
      ...(maxPrice && { price: { lte: parseInt(maxPrice) } }),
      // 複数の設備条件がある場合は AND ですべてマッチするもののみ
      ...(facilitiesConditions.length > 0 && {
        AND: facilitiesConditions,
      }),
      // キーワード検索条件
      ...keywordCondition,
    }

    // 総数とデータを並列取得
    // orderByを削除することでメモリ使用量を削減
    // 代わりにIDでソートして安定した結果を保証
    const [farmlands, total] = await Promise.all([
      prisma.farmland.findMany({
        where,
        orderBy: {
          id: 'desc'  // createdAtの代わりにidでソート（インデックス効率化）
        },
        skip,
        take: limitNum,
      }),
      prisma.farmland.count({ where })
    ])

    return NextResponse.json({
      data: farmlands,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      }
    })
  } catch (error) {
    console.error('農地一覧取得エラー:', error)
    // エラー詳細をクライアントにも返す（デバッグ用）
    const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました'
    return NextResponse.json(
      { 
        error: '農地一覧の取得に失敗しました',
        details: errorMessage // 開発環境でのみ有用
      }, 
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    // 認証チェック
    const session = await auth()
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // バリデーション
    const validatedData = farmlandSchema.safeParse(body)
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'バリデーションエラー', details: validatedData.error.issues },
        { status: 400 }
      )
    }

    const {
      name,
      prefecture,
      city,
      address,
      area,
      price,
      availableFrom,
      availableTo,
      description,
      latitude,
      longitude,
      images,
      facilities,
    } = validatedData.data

    // 農地を作成
    const farmland = await prisma.farmland.create({
      data: {
        name: name || null,
        prefecture,
        city,
        address,
        area,
        price: price || null,
        availableFrom: new Date(availableFrom),
        availableTo: availableTo ? new Date(availableTo) : null,
        description: description || null,
        latitude: latitude || null,
        longitude: longitude || null,
        images: images || [],
        facilities: facilities || {},
        providerId: session.user.id,
        status: 'PUBLIC',
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json(
      {
        message: '農地を登録しました',
        farmland,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('農地登録エラー:', error)
    return NextResponse.json(
      { error: '農地の登録に失敗しました' },
      { status: 500 }
    )
  }
}