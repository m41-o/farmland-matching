'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FAQItem {
  question: string
  answer: string
}

const faqItems: FAQItem[] = [
  {
    question: '農地の登録方法は？',
    answer: '右上のメニューから「農地を登録」を選択し、必要な情報（面積、価格、設備など）を入力するだけで簡単に登録できます。',
  },
  {
    question: '登録料や利用料はかかりますか？',
    answer: '基本的な農地検索・登録は完全無料です。プレミアム機能については別途ご相談ください。',
  },
  {
    question: '農地を借りるまでの流れは？',
    answer: '①農地を検索して気になる農地を見つける → ②「詳細を見る」で情報を確認 → ③「応募する」ボタンで申請 → ④出品者との連絡・交渉',
  },
  {
    question: '農地が見つかりません',
    answer: 'フィルター条件を調整してみてください。面積や価格、設備条件を変更すると、より多くの農地が表示されます。',
  },
  {
    question: '自分の農地を削除したい場合は？',
    answer: 'マイページの「出品中の農地」から削除したい農地を選択し、「削除」ボタンをクリックしてください。',
  },
  {
    question: '農地の詳細情報を編集できますか？',
    answer: 'はい、マイページから登録済みの農地を選択し、編集画面で情報を修正できます。',
  },
]

export function FAQSection() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">よくある質問</h2>
          <p className="mt-2 text-muted-foreground">農地マッチングについてのご質問にお答えします</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-3">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-colors"
            >
              <Button
                variant="ghost"
                className="w-full justify-between h-auto px-6 py-4 text-left"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                <span className="font-semibold text-foreground">{item.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform ${
                    expandedIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </Button>

              {expandedIndex === index && (
                <div className="px-6 py-4 bg-card/50 border-t border-border">
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
