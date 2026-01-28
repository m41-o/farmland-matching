import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'
import { z } from 'zod'

// バリデーションスキーマ
const updateProfileSchema = z.object({
  name: z.string().min(1, '名前を入力してください').optional(),
  phone: z.string().optional(),
  profileImage: z.string().optional(), // Base64画像
})

export async function PUT(request: NextRequest) {
  try {
    // 認証確認
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'ログインが必要です' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // バリデーション
    const validation = updateProfileSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'バリデーションエラー',
          details: validation.error.issues 
        },
        { status: 400 }
      )
    }

    const { name, phone, profileImage } = validation.data

    // ユーザー更新
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(profileImage !== undefined && { profileImage }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        profileImage: true,
      },
    })

    return NextResponse.json({
      success: true,
      user: updatedUser,
    })
  } catch (error) {
    console.error('プロフィール更新エラー:', error)
    return NextResponse.json(
      { error: 'プロフィール更新に失敗しました' },
      { status: 500 }
    )
  }
}
