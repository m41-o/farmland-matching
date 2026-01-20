import { Search, FileText, Sprout } from "lucide-react"

const steps = [
  {
    number: "1",
    title: "探す",
    description: "全国の農地情報から、条件に合った農地を検索。インフラ情報も一目で確認できます。",
    icon: Search,
  },
  {
    number: "2",
    title: "申請",
    description: "気になる農地が見つかったら、オンラインで簡単に申請。農地法の手続きもサポートします。",
    icon: FileText,
  },
  {
    number: "3",
    title: "開始",
    description: "契約完了後、いよいよ農業スタート。地域の支援制度もご案内します。",
    icon: Sprout,
  },
]

export function ThreeStepsGuide() {
  return (
    <section id="guide" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">3ステップ就農ガイド</h2>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            農地法の複雑な手続きを、シンプルな3ステップに。 初めての方でも安心して農業を始められます。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="relative bg-card rounded-xl p-6 md:p-8 border border-border hover:border-primary/50 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-primary">STEP</span>
                    <span className="text-3xl font-bold text-primary">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
