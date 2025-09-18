import PageHeader from '@/components/PageHeader'
import UtilitiesCalculator from '@/components/UtilitiesCalculator'

export default function UtilitiesPage() {
  return (
    <div>
      <PageHeader
        title="Коммунальные платежи"
        description="Расчет расходов на электричество, воду, отопление, газ и вывоз мусора"
        icon="🏠"
      />
      <UtilitiesCalculator />
    </div>
  )
}
