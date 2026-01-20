import { DetailPageContent } from "@/components/detail-page-content"

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <main>
      <DetailPageContent id={id} />
    </main>
  )
}
