import PageHeader from '@/components/PageHeader'
import TaxCalculator from '@/components/TaxCalculator'

export default function Home() {
  return (
    <div>
      <PageHeader
        title="Калькулятор налогов"
        description="Введите ваш месячный доход для расчета НДФЛ по прогрессивной шкале налогообложения в Российской Федерации"
      />
      <TaxCalculator />
    </div>
  )
}
