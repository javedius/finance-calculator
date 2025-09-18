import PageHeader from '@/components/PageHeader'
import LoansCreditsCalculator from '@/components/LoansCreditsCalculator'

export default function LoansCreditsPage() {
  return (
    <div>
      <PageHeader
        title="Кредиты и займы"
        description="Расчет переплат, процентов и досрочного погашения кредитов"
        icon="💳"
      />
      <LoansCreditsCalculator />
    </div>
  )
}
