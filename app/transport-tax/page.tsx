import PageHeader from '@/components/PageHeader'
import TransportTaxCalculator from '@/components/TransportTaxCalculator'

export default function TransportTaxPage() {
  return (
    <div>
      <PageHeader
        title="Калькулятор транспортного налога"
        description="Рассчитайте размер транспортного налога в зависимости от типа транспортного средства и мощности двигателя"
      />
      <TransportTaxCalculator />
    </div>
  )
}
