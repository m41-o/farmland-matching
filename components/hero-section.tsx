import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface HeroSectionProps {
  backgroundImage?: string
}

export function HeroSection({ 
  backgroundImage = '/images/farmland-hero.png' 
}: HeroSectionProps = {}) {
  // デフォルトグラデーション
  const defaultGradient = `linear-gradient(135deg, rgba(52, 168, 83, 0.85) 0%, rgba(34, 139, 70, 0.85) 50%, rgba(25, 100, 50, 0.9) 100%)`

  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${backgroundImage}'), ${defaultGradient}`,
        }}
      >
      </div>

      <div className="relative container mx-auto px-4 py-24 md:py-32 lg:py-40">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight text-balance">
            日本の農地を、
            <br />
            次世代へつなぐ
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/90 leading-relaxed text-pretty">
            全国の農地情報を集約し、新規就農者と地域をつなぐマッチングプラットフォーム。
            あなたの農業ライフを、ここから始めましょう。
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild className="font-medium">
              <Link href="/">
                農地を探す
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" className="font-medium bg-white/90 text-foreground hover:bg-white">
              就農ガイドを見る
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
