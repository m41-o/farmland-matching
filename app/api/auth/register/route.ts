import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'
import bcrypt from 'bcryptjs'
// スキーマバリデーションとは、受け取ったデータがあらかじめ定義したルール（スキーマ）に正しく従っているか自動的に検証する手法です。
// 例として、ユーザー登録フォームで入力された情報（メールアドレスやパスワードなど）が期待する形式や制約を守っているかチェックする際に使われます。
// Zodなどのライブラリは、これをTypeScriptで型安全かつ簡潔に記述・実行するためのツールです。
// 公式: https://zod.dev/

import { z } from 'zod'

// バリデーションスキーマ（フロントエンドで既に厳密なチェックを行っているため、バックエンドは最小限の確認のみ）
const userSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
  name: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  role: z.enum(['PROVIDER', 'SEEKER']),
});

// ユーザー登録APIエンドポイント。
// ユーザーからPOSTで送信されたemail, password, name, phone, roleをJSON形式で受け取り、
// バリデーション→重複チェック→パスワードハッシュ化→新規ユーザー作成までを行う。
// 成功時は作成ユーザー情報の一部を返し、バリデーション失敗や重複時はエラーレスポンスを返します。
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Zodでリクエストボディをバリデーション
    const validationResult = userSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("バックエンドZodバリデーションエラー:", validationResult.error.issues);
      return NextResponse.json(
        {
          error: "バリデーションエラー",
          details: validationResult.error.issues
        },
        { status: 400 }
      );
    }
    
   // バリデーションが成功した場合、validatedData.dataから値を取得
   const { email, password, name, phone, role } = validationResult.data; // ここを修正

   // メールアドレスの重複チェック
   const existingUser = await prisma.user.findUnique({
     where: { email },
   });

   if (existingUser) {
     return NextResponse.json({ error: 'このメールアドレスは既に登録されています' }, { status: 409 });
   }

   // パスワードのハッシュ化
   const passwordHash = await bcrypt.hash(password, 10); // 10はソルトラウンド数

   // ユーザーの作成
   const newUser = await prisma.user.create({
     data: {
       email,
       passwordHash, // ハッシュ化されたパスワードを保存
       name,
       phone,
       role,
     },
   });

   // 成功レスポンス
   return NextResponse.json({ message: 'ユーザー登録が完了しました', user: newUser }, { status: 201 });
 } catch (error) {
   console.error('ユーザー登録エラー:', error);
   return NextResponse.json(
     { error: 'サーバーエラーが発生しました' },
     { status: 500 }
   );
 }
}
