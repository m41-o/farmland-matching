import { ApplicationWizard } from "@/components/application-wizard"

export default async function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <main className="bg-muted/30">
      <ApplicationWizard landId={id} />
    </main>
  )
}
