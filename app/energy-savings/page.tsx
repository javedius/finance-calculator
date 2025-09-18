import PageHeader from '@/components/PageHeader'
import EnergySavingsCalculator from '@/components/EnergySavingsCalculator'

export default function EnergySavingsPage() {
  return (
    <div>
      <PageHeader
        title="Экономия от энергосбережения"
        description="Расчет экономии на электроэнергии, отоплении или солнечных панелях"
        icon="⚡"
      />
      <EnergySavingsCalculator />
    </div>
  )
}
