'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Check, X } from 'lucide-react'

// パスワード要件をシンプルに
const registerSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  password: z.string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .regex(/[A-Z]/, '大文字を1文字以上含めてください')
    .regex(/[a-z]/, '小文字を1文字以上含めてください')
    .regex(/[0-9]/, '数字を1文字以上含めてください'),
  confirmPassword: z.string(),
  name: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(['PROVIDER', 'SEEKER']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'パスワードが一致しません',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    // resolver: zodResolver(registerSchema), // ← これを削除します
    defaultValues: {
      role: 'SEEKER',
    },
  })

  const role = watch('role')

  const onSubmit = async (data: RegisterFormData) => {
    const allData = {
      ...data,
      password: password,
      confirmPassword: confirmPassword,
    };

    const validation = registerSchema.safeParse(allData);

    if (!validation.success) {
      console.error("Zod バリデーションエラー詳細:", validation.error.issues); // ここで詳細をコンソールに出力
      const firstError = validation.error.issues[0];
      // エラーパスに応じて、より具体的なメッセージを生成
      if (firstError.path && firstError.path.length > 0) {
        const fieldName = firstError.path[0];
        let displayFieldName = "";
        switch (fieldName) {
          case "email":
            displayFieldName = "メールアドレス";
            break;
          case "password":
            displayFieldName = "パスワード";
            break;
          case "confirmPassword":
            displayFieldName = "確認用パスワード";
            break;
          case "name":
            displayFieldName = "名前";
            break;
          case "phone":
            displayFieldName = "電話番号";
            break;
          case "role":
            displayFieldName = "役割";
            break;
          default:
            displayFieldName = "入力項目";
        }
        setServerError(`${displayFieldName}：${firstError.message}`);
      } else {
        setServerError(firstError.message || '入力内容に誤りがあります');
      }
      return;
    }

    // パスワード一致の最終確認（念のため。Zodで処理されるはずですが安全策として）
    if (password !== confirmPassword) {
      setServerError('パスワードが一致していません');
      return;
    }
    
    setIsLoading(true);
    setServerError(null);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: allData.email,
          password: password,
          name: allData.name || null,
          phone: allData.phone || null,
          role: allData.role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(result.error || 'ユーザー登録に失敗しました');
        return;
      }

      router.push('/login?registered=true');
    } catch (error) {
      setServerError('ネットワークエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">ユーザー登録</h2>
          <p className="mt-2 text-sm text-gray-600">農地マッチングサービスに登録しましょう</p>
        </div>

        <form className="space-y-6 bg-white p-6 rounded-lg shadow-md" onSubmit={handleSubmit(onSubmit)}>
          {serverError && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          )}

          {/* ロール選択 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">あなたの役割</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="radio" value="PROVIDER" {...register('role')} className="h-4 w-4" />
                <span className="ml-2 text-sm">農地を提供したい</span>
              </label>
              <label className="flex items-center">
                <input type="radio" value="SEEKER" {...register('role')} className="h-4 w-4" defaultChecked />
                <span className="ml-2 text-sm">農地を探している</span>
              </label>
            </div>
          </div>

          {/* メール */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
            <input {...register('email')} type="email" placeholder="user@example.com" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
          </div>

          {/* パスワード */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            {password && (
              <div className="mt-3 p-3 bg-gray-50 rounded text-sm space-y-1">
                <p className="font-semibold text-gray-700">要件:</p>
                <div className={`flex items-center gap-2 ${password.length >= 8 ? 'text-green-700' : 'text-red-700'}`}>
                  {password.length >= 8 ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  8文字以上
                </div>
                <div className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? 'text-green-700' : 'text-red-700'}`}>
                  {/[A-Z]/.test(password) ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  大文字を含む (A-Z)
                </div>
                <div className={`flex items-center gap-2 ${/[a-z]/.test(password) ? 'text-green-700' : 'text-red-700'}`}>
                  {/[a-z]/.test(password) ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  小文字を含む (a-z)
                </div>
                <div className={`flex items-center gap-2 ${/[0-9]/.test(password) ? 'text-green-700' : 'text-red-700'}`}>
                  {/[0-9]/.test(password) ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                  数字を含む (0-9)
                </div>
              </div>
            )}
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
          </div>

          {/* パスワード確認 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">パスワード（確認）</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
            {confirmPassword && password && (
              <div className="mt-2">
                {password === confirmPassword ? (
                  <div className="flex items-center gap-2 text-green-700 text-sm">
                    <Check className="h-4 w-4" />
                    ✅ パスワードが一致しています
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-700 text-sm">
                    <X className="h-4 w-4" />
                    ❌ パスワードが一致していません
                  </div>
                )}
              </div>
            )}
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
          </div>

          {/* 名前 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">名前（任意）</label>
            <input {...register('name')} type="text" placeholder="山田太郎"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
          </div>

          {/* 電話 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">電話番号（任意）</label>
            <input {...register('phone')} type="tel" placeholder="090-1234-5678"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
          </div>

          {/* ボタン */}
          <button type="submit" disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
            {isLoading ? '登録中...' : 'ユーザー登録'}
          </button>

          <div className="text-center text-sm">
            <span className="text-gray-600">既にアカウントがある場合は</span>
            <Link href="/login" className="text-blue-600 hover:text-blue-500 ml-1">ログイン</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
