import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/app/lib/auth'
import { prisma } from '@/app/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// バリデーションスキーマ
const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, '現在のパスワードを入力してください'),
  newPassword: z.string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .regex(/[A-Z]/, '大文字を1文字以上含めてください')
    .regex(/[a-z]/, '小文字を1文字以上含めてください')
    .regex(/[0-9]/, '数字を1文字以上含めてください'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: '確認用パスワードが一致しません',
  path: ['confirmPassword'],
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
    const validation = changePasswordSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'バリデーションエラー',
          details: validation.error.issues 
        },
        { status: 400 }
      )
    }

    const { currentPassword, newPassword } = validation.data

    // ユーザー取得
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません' },
        { status: 404 }
      )
    }

    // 現在のパスワード確認
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    )

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '現在のパスワードが正しくありません' },
        { status: 400 }
      )
    }

    // 新しいパスワードでハッシング
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // パスワード更新
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        passwordHash: hashedPassword,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'パスワードが更新されました',
    })
  } catch (error) {
    console.error('パスワード変更エラー:', error)
    return NextResponse.json(
      { error: 'パスワード変更に失敗しました' },
      { status: 500 }
    )
  }
}
