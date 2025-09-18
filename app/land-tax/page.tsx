import PageHeader from '@/components/PageHeader'
import LandTaxCalculator from '@/components/LandTaxCalculator'

export default function LandTaxPage() {
  return (
    <div>
      <PageHeader
        title="Налог на землю"
        description="Расчет налога с учетом категории и площади участка"
        icon="🏞️"
      />
      <LandTaxCalculator />
    </div>
  )
}
