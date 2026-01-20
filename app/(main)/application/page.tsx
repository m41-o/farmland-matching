import { ApplicationWizard } from "@/components/application-wizard"

/**
 * 申請手続きページ
 * ユーザーが農地法3条許可申請を行うためのウィザード
 */
export default function ApplicationPage() {
  return (
    <main>
      <ApplicationWizard landId="new" />
    </main>
  )
}
