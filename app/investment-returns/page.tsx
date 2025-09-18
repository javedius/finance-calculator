import PageHeader from '@/components/PageHeader'
import InvestmentReturnsCalculator from '@/components/InvestmentReturnsCalculator'

export default function InvestmentReturnsPage() {
  return (
    <div>
      <PageHeader
        title="Доходность инвестиций"
        description="Расчет прибыли с учетом процентной ставки и налога на прибыль"
        icon="📈"
      />
      <InvestmentReturnsCalculator />
    </div>
  )
}
