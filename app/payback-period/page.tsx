import PageHeader from '@/components/PageHeader'
import PaybackPeriodCalculator from '@/components/PaybackPeriodCalculator'

export default function PaybackPeriodPage() {
  return (
    <div>
      <PageHeader
        title="Окупаемость проекта"
        description="Расчет сроков окупаемости вложений с учетом дисконтирования"
        icon="⏱️"
      />
      <PaybackPeriodCalculator />
    </div>
  )
}
