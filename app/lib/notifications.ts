/**
 * 通知ユーティリティ
 * Sonner を使用したトースト通知の集約管理
 */

import { toast } from 'sonner'

/**
 * 通知タイプの定義
 * 各操作に対応する通知メッセージを管理
 */
export const toastNotify = {
  /**
   * ログイン成功時の通知
   * ユーザーがログインに成功したことをお知らせ
   */
  loginSuccess: () => {
    toast.success('ログインしました', {
      description: 'ホームページへ移動しています...',
    })
  },

  /**
   * ログイン失敗時の通知
   * メールアドレスまたはパスワードが正しくない場合
   */
  loginError: () => {
    toast.error('ログインに失敗しました', {
      description: 'メールアドレスまたはパスワードが正しくありません',
    })
  },

  /**
   * ユーザー登録成功時の通知
   * 新規ユーザーの登録が完了したことをお知らせ
   */
  registerSuccess: () => {
    toast.success('ユーザー登録が完了しました', {
      description: 'ログインページへ移動しています...',
    })
  },

  /**
   * ユーザー登録失敗時の通知
   * 登録処理に失敗した場合
   */
  registerError: () => {
    toast.error('ユーザー登録に失敗しました', {
      description: '時間を置いて再度お試しください',
    })
  },

  /**
   * メールアドレスが既に登録されている場合の通知
   */
  emailAlreadyExists: () => {
    toast.error('このメールアドレスは既に登録されています', {
      description: 'ログインするか、別のメールアドレスで登録してください',
    })
  },

  /**
   * 農地登録開始時の通知
   * 登録処理が開始されたことを通知（ローディング表示）
   */
  registrationStart: () => {
    return toast.loading('農地を登録中...', {
      description: '少々お待ちください',
    })
  },

  /**
   * 農地登録成功時の通知
   * 新規農地の登録が完了したことをお知らせ
   */
  registrationSuccess: (toastId?: any) => {
    if (toastId) {
      toast.dismiss(toastId)
    }
    toast.success('農地を登録しました', {
      description: 'ホームページへ移動しています...',
    })
  },

  /**
   * 農地登録失敗時の通知
   * 農地登録処理に失敗した場合
   */
  registrationError: (toastId?: any) => {
    if (toastId) {
      toast.dismiss(toastId)
    }
    toast.error('農地の登録に失敗しました', {
      description: '時間を置いて再度お試しください',
    })
  },

  /**
   * 農地登録失敗時の通知
   * 農地登録処理に失敗した場合
   */
  farmlandRegistrationError: () => {
    toast.error('農地の登録に失敗しました', {
      description: '時間を置いて再度お試しください',
    })
  },

  /**
   * 農地削除成功時の通知
   */
  farmlandDeleteSuccess: () => {
    toast.success('農地を削除しました', {
      description: 'マイページから確認できます',
    })
  },

  /**
   * 農地削除失敗時の通知
   */
  farmlandDeleteError: () => {
    toast.error('農地の削除に失敗しました', {
      description: '時間を置いて再度お試しください',
    })
  },

  /**
   * お気に入り追加成功時の通知
   */
  favoriteAdded: () => {
    toast.success('お気に入りに追加しました', {
      description: 'プロフィールから確認できます',
    })
  },

  /**
   * お気に入り削除成功時の通知
   */
  favoriteRemoved: () => {
    toast.success('お気に入りから削除しました')
  },

  /**
   * 問い合わせ送信成功時の通知
   */
  inquirySent: () => {
    toast.success('問い合わせを送信しました', {
      description: '農地提供者からのご返答をお待ちください',
    })
  },

  /**
   * 問い合わせ送信失敗時の通知
   */
  inquiryError: () => {
    toast.error('問い合わせの送信に失敗しました', {
      description: '時間を置いて再度お試しください',
    })
  },

  /**
   * プロフィール更新成功時の通知
   */
  profileUpdateSuccess: () => {
    toast.success('プロフィールを更新しました')
  },

  /**
   * プロフィール更新失敗時の通知
   */
  profileUpdateError: () => {
    toast.error('プロフィールの更新に失敗しました', {
      description: '時間を置いて再度お試しください',
    })
  },

  /**
   * パスワード変更成功時の通知
   */
  passwordChangeSuccess: () => {
    toast.success('パスワードを変更しました')
  },

  /**
   * パスワード変更失敗時の通知
   */
  passwordChangeError: () => {
    toast.error('パスワードの変更に失敗しました', {
      description: '時間を置いて再度お試しください',
    })
  },

  /**
   * ログアウト時の通知
   */
  logoutSuccess: () => {
    toast.success('ログアウトしました')
  },

  /**
   * コピー成功時の通知
   * クリップボードにコピーされたことをお知らせ
   */
  copiedToClipboard: () => {
    toast.success('クリップボードにコピーしました')
  },

  /**
   * 一般的なエラーメッセージの通知
   * 予期しないエラーが発生した場合
   */
  generalError: (message?: string) => {
    toast.error('エラーが発生しました', {
      description: message || '時間を置いて再度お試しください',
    })
  },

  /**
   * 情報通知
   * 重要な情報をユーザーに伝える場合
   */
  info: (title: string, description?: string) => {
    toast.info(title, {
      description: description,
    })
  },

  /**
   * 警告通知
   * 注意が必要な操作の場合
   */
  warning: (title: string, description?: string) => {
    toast.warning(title, {
      description: description,
    })
  },

  /**
   * 成功通知（汎用）
   * 一般的な成功メッセージ
   */
  success: (title: string, description?: string) => {
    toast.success(title, {
      description: description,
    })
  },
}

/**
 * 別名アクセス用の notify オブジェクト
 * toastNotify と同じ機能を別名で提供
 */
export const notify = {
  /**
   * エラー通知
   */
  error: (title: string, description?: string) => {
    toast.error(title, {
      description: description,
    })
  },

  /**
   * 成功通知
   */
  success: (title: string, description?: string) => {
    toast.success(title, {
      description: description,
    })
  },

  /**
   * 情報通知
   */
  info: (title: string, description?: string) => {
    toast.info(title, {
      description: description,
    })
  },

  /**
   * 警告通知
   */
  warning: (title: string, description?: string) => {
    toast.warning(title, {
      description: description,
    })
  },
}
