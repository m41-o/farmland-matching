"use client"

import Link from "next/link"
import Image from "next/image"
import { Menu, X, Search, PlusCircle, FileText, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useSession, signOut } from "next-auth/react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session } = useSession()

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/" })
  }

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/17607-300x300.png"
              alt="農地マッチング ロゴ"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="font-semibold text-lg text-foreground">農地マッチング</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              ホーム
            </Link>
            <Link
              href="/search"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <Search className="h-4 w-4" />
              農地を探す
            </Link>
            <Link
              href="/farmland/new"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              農地を登録する
            </Link>
            <Link
              href="/application"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <FileText className="h-4 w-4" />
              申請手続き
            </Link>
            <Link
              href="#guide"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              就農ガイド
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {session?.user ? (
              <>
                <span className="text-sm text-muted-foreground">{session.user.email}</span>
                <Button variant="ghost" size="sm" asChild className="flex items-center gap-1">
                  <Link href="/profile">
                    <User className="h-4 w-4" />
                    マイページ
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  ログアウト
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">ログイン</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">新規登録</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2" 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            aria-label="メニューを開く"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-3">
              <Link href="/" className="text-sm font-medium py-2 text-foreground">
                ホーム
              </Link>
              <Link href="/search" className="text-sm font-medium py-2 text-muted-foreground flex items-center gap-2">
                <Search className="h-4 w-4" />
                農地を探す
              </Link>
              <Link href="/farmland/new" className="text-sm font-medium py-2 text-muted-foreground flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                農地を登録する
              </Link>
              <Link href="/application" className="text-sm font-medium py-2 text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                申請手続き
              </Link>
              <Link href="#guide" className="text-sm font-medium py-2 text-muted-foreground">
                就農ガイド
              </Link>
              <div className="flex gap-2 pt-2">
                {session?.user ? (
                  <>
                    <span className="text-xs text-muted-foreground py-2 flex-1">{session.user.email}</span>
                    <Button variant="ghost" size="sm" className="flex-1" asChild>
                      <Link href="/profile" className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        マイページ
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1" onClick={handleLogout}>
                      ログアウト
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" className="flex-1" asChild>
                      <Link href="/login">ログイン</Link>
                    </Button>
                    <Button size="sm" className="flex-1" asChild>
                      <Link href="/register">新規登録</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
