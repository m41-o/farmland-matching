'use client'

import { HeroSection } from "@/components/hero-section"
import { SearchBar } from "@/components/search-bar"
import { ThreeStepsGuide } from "@/components/three-steps-guide"
import { FeaturedListings } from "@/components/featured-listings"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Search, Plus, FileText } from "lucide-react"

/**
 * ホームページ
 * 背景画像を変更する場合は、HeroSection に backgroundImage プロップを渡してください
 */
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <HeroSection />
        
        {/* サービスナビゲーション */}
        <section className="py-8 bg-secondary/30 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-4">
              {/* 農地を探す */}
              <Link href="/search">
                <div className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Search className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">農地を探す</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        全国の農地からあなたにぴったりの条件を探す
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              {/* 農地を登録する */}
              <Link href="/farmland/new">
                <div className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">農地を登録する</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        あなたの農地を新規就農者と繋ぐ
                      </p>
                    </div>
                  </div>
                </div>
              </Link>

              {/* 申請手続き */}
              <Link href="/application">
                <div className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">申請手続き</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        農地法3条許可申請をオンラインで完結
          </p>
        </div>
                  </div>
                </div>
              </Link>
            </div>
        </div>
        </section>

        <SearchBar />
        <ThreeStepsGuide />
        <FeaturedListings />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
