import PageHeader from '@/components/PageHeader'
import CustomsCalculator from '@/components/CustomsCalculator'

export default function CustomsPage() {
  return (
    <div>
      <PageHeader
        title="Калькулятор растаможки"
        description="Рассчитайте полную стоимость растаможки автомобиля с учетом пошлин, НДС, акциза и утильсбора"
      />
      <CustomsCalculator />
    </div>
  )
}
