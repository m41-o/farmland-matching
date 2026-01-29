'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { toastNotify } from '@/lib/notifications'

// バリデーションスキーマ
const loginSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  
  // 登録完了メッセージ
  const registered = searchParams.get('registered') === 'true'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setServerError(null)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      console.log('signIn result:', result) // デバッグ用

      // エラーがある場合（okがtrueでもerrorフィールドをチェック）
      if (result?.error || !result?.ok) {
        setServerError('メールアドレスまたはパスワードが正しくありません')
        toastNotify.loginError()
        setIsLoading(false)
        return
      }

      // ログイン成功通知
      toastNotify.loginSuccess()
      
      console.log('ログイン成功、リダイレクト開始...')
      
      // リダイレクト
      setTimeout(() => {
        router.push('/')
      }, 1000)
      
    } catch (error) {
      console.error('ログインエラー詳細:', error)
      setServerError('ネットワークエラーが発生しました')
      toastNotify.generalError('ネットワークエラーが発生しました')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* ヘッダー */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            ログイン
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            農地マッチングサービスにログインしてください
          </p>
        </div>

        {/* 登録完了メッセージ */}
        {registered && (
          <div className="rounded-md bg-green-50 p-4 border border-green-200">
            <p className="text-sm text-green-700">
              ユーザー登録が完了しました。ログインしてください。
            </p>
          </div>
        )}

        {/* フォーム */}
        <form className="mt-8 space-y-6 bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit(onSubmit)}>
          {/* サーバーエラー表示 */}
          {serverError && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          )}

          {/* メールアドレス */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              メールアドレス
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="user@example.com"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* パスワード */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              パスワード
            </label>
            <input
              {...register('password')}
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          {/* ログインボタン */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'ログイン中...' : 'ログイン'}
          </button>

          {/* 登録リンク */}
          <div className="text-center">
            <span className="text-sm text-gray-600">
              アカウントがない場合は{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-500 font-medium">
                登録
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}