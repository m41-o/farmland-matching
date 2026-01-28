import { toast } from 'sonner'

/**
 * 通知ユーティリティ
 * 全アプリケーション内での一貫した通知表示を管理
 */

export const notify = {
  /**
   * 成功通知
   */
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
    })
  },

  /**
   * エラー通知
   */
  error: (message: string, description?: string) => {
    toast.error(message, {
      description,
    })
  },

  /**
   * 情報通知
   */
  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
    })
  },

  /**
   * 警告通知
   */
  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
    })
  },

  /**
   * ローディング通知（非表示に更新可能）
   */
  loading: (message: string) => {
    return toast.loading(message)
  },

  /**
   * ローディング通知を更新
   */
  updateLoading: (toastId: string | number, message: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') {
      toast.success(message, {
        id: toastId,
      })
    } else {
      toast.error(message, {
        id: toastId,
      })
    }
  },
}

/**
 * よく使うシーンごとのショートカット関数
 */

export const toastNotify = {
  // ログイン関連
  loginSuccess: () => notify.success('ログイン完了！', 'ようこそ！'),
  loginError: () => notify.error('ログイン失敗', 'メールアドレスとパスワードをご確認ください'),
  
  // ログアウト関連
  logoutSuccess: () => notify.success('ログアウト完了', 'またのご利用をお待ちしています'),
  
  // 農地登録関連
  registrationStart: () => notify.loading('農地を登録中...'),
  registrationSuccess: (toastId: string | number) => notify.updateLoading(toastId, '農地登録完了！'),
  registrationError: (toastId: string | number) => notify.updateLoading(toastId, '農地登録に失敗しました', 'error'),
  
  // プロフィール更新関連
  profileUpdateStart: () => notify.loading('プロフィールを更新中...'),
  profileUpdateSuccess: (toastId: string | number) => notify.updateLoading(toastId, 'プロフィールを更新しました'),
  profileUpdateError: (toastId: string | number) => notify.updateLoading(toastId, 'プロフィール更新に失敗しました', 'error'),
  
  // 農地削除関連
  deleteStart: () => notify.loading('農地を削除中...'),
  deleteSuccess: (toastId: string | number) => notify.updateLoading(toastId, '農地を削除しました'),
  deleteError: (toastId: string | number) => notify.updateLoading(toastId, '削除に失敗しました', 'error'),
  
  // 問い合わせ関連
  applicationStart: () => notify.loading('応募申請を送信中...'),
  applicationSuccess: (toastId: string | number) => notify.updateLoading(toastId, '応募申請を送信しました！'),
  applicationError: (toastId: string | number) => notify.updateLoading(toastId, '応募申請の送信に失敗しました', 'error'),
  
  // お気に入り関連
  favoriteAdded: () => notify.success('お気に入りに追加しました ❤️'),
  favoriteRemoved: () => notify.success('お気に入りから削除しました'),
  
  // コピー関連
  copiedToClipboard: () => notify.success('コピーしました！'),
  
  // 一般的なエラー
  generalError: (message?: string) => notify.error('エラーが発生しました', message || '後でもう一度お試しください'),
}
