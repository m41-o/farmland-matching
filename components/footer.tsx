import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-foreground mb-4">農地マッチング</h3>
            <p className="text-sm text-muted-foreground">日本の農地を、次世代へつなぐ</p>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-3">サービス</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">農地を探す</Link></li>
              <li><Link href="/farmland/new" className="hover:text-primary transition-colors">農地を登録</Link></li>
              <li><a href="/#guide" className="hover:text-primary transition-colors">就農ガイド</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-3">会社</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">利用規約</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">プライバシーポリシー</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">お問い合わせ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-foreground mb-3">フォロー</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Facebook</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Instagram</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; 2026 農地マッチング. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
