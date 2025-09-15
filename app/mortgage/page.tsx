import PageHeader from '@/components/PageHeader'
import MortgageCalculator from '@/components/MortgageCalculator'

export default function MortgagePage() {
  return (
    <div>
      <PageHeader
        title="Ипотечный калькулятор"
        description="Рассчитайте ежемесячные платежи по ипотеке с учетом досрочных погашений"
      />
      <MortgageCalculator />
    </div>
  )
}
