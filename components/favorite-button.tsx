"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Heart, Loader2 } from "lucide-react"

/**
 * お気に入りボタンコンポーネントのProps
 * 
 * @property farmlandId - 対象の農地ID（必須）
 * @property variant - ボタンの見た目（"icon": アイコンのみ、"default": テキスト付き）
 * @property size - ボタンのサイズ（"sm", "default", "lg"）
 * @property className - 追加のCSSクラス
 */
interface FavoriteButtonProps {
  farmlandId: string
  variant?: "icon" | "default"
  size?: "sm" | "default" | "lg"
  className?: string
}

/**
 * お気に入りボタンコンポーネント
 * 
 * 農地をお気に入りに追加/削除するためのボタンです。
 * - 初期表示時にお気に入り状態を取得
 * - クリックでトグル（追加 ↔ 削除）
 * - 未ログイン時はログインページへリダイレクト
 * - 処理中はローディング表示
 * 
 * 使用例:
 * <FavoriteButton farmlandId="abc123" />
 * <FavoriteButton farmlandId="abc123" variant="default" />
 */
export function FavoriteButton({
  farmlandId,
  variant = "icon",
  size = "default",
  className = "",
}: FavoriteButtonProps) {
  // お気に入り状態を管理するstate
  const [isFavorite, setIsFavorite] = useState(false)
  // 初期読み込み中かどうか
  const [isLoading, setIsLoading] = useState(true)
  // 追加/削除処理中かどうか
  const [isProcessing, setIsProcessing] = useState(false)

  const router = useRouter()

  /**
   * お気に入り状態を取得する関数
   * コンポーネントのマウント時に実行
   */
  const checkFavoriteStatus = useCallback(async () => {
    try {
      // APIからお気に入り状態を取得
      const response = await fetch(`/api/favorites/${farmlandId}`)
      
      if (response.ok) {
        const data = await response.json()
        setIsFavorite(data.isFavorite)
      }
    } catch (error) {
      // エラーが発生してもお気に入りではないとして扱う
      console.error("お気に入り状態の取得に失敗:", error)
    } finally {
      setIsLoading(false)
    }
  }, [farmlandId])

  // コンポーネントマウント時にお気に入り状態をチェック
  useEffect(() => {
    checkFavoriteStatus()
  }, [checkFavoriteStatus])

  /**
   * お気に入りをトグルする関数
   * お気に入り済み → 削除、未登録 → 追加
   */
  const toggleFavorite = async () => {
    // 処理中は重複リクエストを防ぐ
    if (isProcessing) return

    setIsProcessing(true)

    try {
      if (isFavorite) {
        // お気に入りから削除
        const response = await fetch(`/api/favorites/${farmlandId}`, {
          method: "DELETE",
        })

        if (response.status === 401) {
          // 未ログイン → ログインページへリダイレクト
          router.push("/login")
          return
        }

        if (response.ok) {
          setIsFavorite(false)
        }
      } else {
        // お気に入りに追加
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ farmlandId }),
        })

        if (response.status === 401) {
          // 未ログイン → ログインページへリダイレクト
          router.push("/login")
          return
        }

        if (response.ok) {
          setIsFavorite(true)
        }
      }
    } catch (error) {
      console.error("お気に入り操作に失敗:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  // ローディング中はスピナーを表示
  if (isLoading) {
    return (
      <Button
        variant="outline"
        size={variant === "icon" ? "icon" : size}
        disabled
        className={className}
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        {variant === "default" && <span className="ml-2">読み込み中</span>}
      </Button>
    )
  }

  // アイコンのみのボタン
  if (variant === "icon") {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={toggleFavorite}
        disabled={isProcessing}
        className={className}
        // アクセシビリティ: スクリーンリーダー用のラベル
        aria-label={isFavorite ? "お気に入りから削除" : "お気に入りに追加"}
      >
        {isProcessing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Heart
            className={`h-4 w-4 transition-colors ${
              isFavorite
                ? "fill-red-500 text-red-500" // お気に入り済み: 赤く塗りつぶし
                : "text-muted-foreground"      // 未登録: グレーのアウトライン
            }`}
          />
        )}
      </Button>
    )
  }

  // テキスト付きボタン
  return (
    <Button
      variant={isFavorite ? "default" : "outline"}
      size={size}
      onClick={toggleFavorite}
      disabled={isProcessing}
      className={className}
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <Heart
          className={`h-4 w-4 mr-2 ${
            isFavorite ? "fill-current" : ""
          }`}
        />
      )}
      {isFavorite ? "お気に入り済み" : "お気に入りに追加"}
    </Button>
  )
}
