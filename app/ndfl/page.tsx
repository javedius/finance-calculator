import PageHeader from '@/components/PageHeader'
import TaxCalculator from '@/components/TaxCalculator'

export default function NDFLPage() {
  return (
    <div>
      <PageHeader
        title="НДФЛ"
        description="Расчет НДФЛ по прогрессивной шкале налогообложения в Российской Федерации"
        icon="💰"
      />
      <TaxCalculator />
    </div>
  )
}
