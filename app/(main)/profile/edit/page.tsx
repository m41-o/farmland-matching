'use client'

import { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, Upload, Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { toastNotify, notify } from '@/lib/notifications'
import { useRouter } from 'next/navigation'

export default function ProfileEditPage() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // プロフィール編集フォーム
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
  })
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)

  // セッション変更時に初期値を更新
  useEffect(() => {
    if (session?.user) {
      setProfileData({
        name: session.user.name || '',
        phone: (session.user as any).phone || '',
      })
    }
  }, [session?.user])

  // パスワード変更フォーム
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [isLoadingPassword, setIsLoadingPassword] = useState(false)

  // 画像アップロードハンドラー
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      notify.warning('ファイルサイズ制限', '5MB以下の画像をアップロードしてください')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setProfileImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  // プロフィール保存
  const handleSaveProfile = async () => {
    console.log('保存開始:', profileData, profileImage) // デバッグ
    setIsLoadingProfile(true)
    const toastId = toastNotify.profileUpdateStart()

    try {
      const payload = {
        name: profileData.name || undefined,
        phone: profileData.phone || undefined,
        profileImage: profileImage || undefined,
      }
      
      console.log('送信データ:', payload) // デバッグ

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      console.log('APIレスポンス:', response.status) // デバッグ

      if (!response.ok) {
        const error = await response.json()
        console.error('APIエラー:', error) // デバッグ
        throw new Error(error.error || 'プロフィール更新に失敗しました')
      }

      const result = await response.json()
      console.log('APIレスポンスボディ:', result) // デバッグ
      
      // セッション更新
      await update({
        ...session,
        user: result.user,
      })

      toastNotify.profileUpdateSuccess(toastId)
    } catch (error: any) {
      console.error('エラー詳細:', error) // デバッグ
      toastNotify.profileUpdateError(toastId)
      console.error('プロフィール更新エラー:', error)
    } finally {
      setIsLoadingProfile(false)
    }
  }

  // パスワード変更
  const handleChangePassword = async () => {
    if (!passwordData.newPassword || !passwordData.currentPassword) {
      notify.warning('入力エラー', 'すべてのフィールドを入力してください')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      notify.error('パスワード不一致', '新しいパスワードが一致しません')
      return
    }

    setIsLoadingPassword(true)
    const toastId = notify.loading('パスワードを変更中...')

    try {
      const response = await fetch('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'パスワード変更に失敗しました')
      }

      notify.updateLoading(toastId, 'パスワードを変更しました')
      
      // フォームリセット
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error: any) {
      notify.updateLoading(toastId, error.message, 'error')
      console.error('パスワード変更エラー:', error)
    } finally {
      setIsLoadingPassword(false)
    }
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">ログインが必要です</p>
          <Button asChild>
            <Link href="/login">ログインページへ</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary/30 py-8">
      <div className="container mx-auto max-w-2xl px-4">
        {/* ヘッダー */}
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/profile">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">プロフィール編集</h1>
            <p className="text-muted-foreground mt-1">ユーザー情報の管理</p>
          </div>
        </div>

        {/* タブ */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">プロフィール</TabsTrigger>
            <TabsTrigger value="password">パスワード</TabsTrigger>
          </TabsList>

          {/* プロフィール編集タブ */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>プロフィール画像</CardTitle>
                <CardDescription>プロフィール画像をアップロード</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-muted">
                    {profileImage ? (
                      <img src={profileImage} alt="プロフィール" className="w-full h-full object-cover" />
                    ) : session.user.image ? (
                      <img src={session.user.image} alt="プロフィール" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Upload className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <Button 
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      画像をアップロード
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      5MB以下のJPG、PNG、GIF
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>基本情報</CardTitle>
                <CardDescription>ユーザー情報を編集</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">メールアドレス</Label>
                  <Input
                    id="email"
                    type="email"
                    value={session.user.email || ''}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    メールアドレスは変更できません
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">名前</Label>
                  <Input
                    id="name"
                    placeholder="ユーザー名"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">電話番号</Label>
                  <Input
                    id="phone"
                    placeholder="090-1234-5678"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>

                <Button 
                  onClick={handleSaveProfile} 
                  disabled={isLoadingProfile}
                  className="w-full"
                >
                  {isLoadingProfile ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    '保存'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* パスワード変更タブ */}
          <TabsContent value="password">
            <Card>
              <CardHeader>
                <CardTitle>パスワードの変更</CardTitle>
                <CardDescription>アカウントのセキュリティを強化</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">現在のパスワード</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPasswords.current ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    >
                      {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">新しいパスワード</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showPasswords.new ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    >
                      {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    大文字、小文字、数字を含む8文字以上
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">新しいパスワード（確認）</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showPasswords.confirm ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    >
                      {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  onClick={handleChangePassword} 
                  disabled={isLoadingPassword}
                  className="w-full"
                >
                  {isLoadingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      変更中...
                    </>
                  ) : (
                    'パスワードを変更'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
