import PageHeader from '@/components/PageHeader'
import PensionSavingsCalculator from '@/components/PensionSavingsCalculator'

export default function PensionSavingsPage() {
  return (
    <div>
      <PageHeader
        title="Пенсия и накопления"
        description="Расчет будущих накоплений и пенсионных выплат с учетом инвестиций"
        icon="💰"
      />
      <PensionSavingsCalculator />
    </div>
  )
}
