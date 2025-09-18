import PageHeader from '@/components/PageHeader'
import PropertyTaxCalculator from '@/components/PropertyTaxCalculator'

export default function PropertyTaxPage() {
  return (
    <div>
      <PageHeader
        title="Калькулятор налога на недвижимость"
        description="Рассчитайте размер налога на недвижимость с учетом типа объекта, региона, льгот и периода владения"
      />
      <PropertyTaxCalculator />
    </div>
  )
}
