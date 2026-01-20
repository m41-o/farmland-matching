import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchPageContent } from "@/components/search-page-content"

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <SearchPageContent />
      </main>
      <Footer />
    </div>
  )
}
