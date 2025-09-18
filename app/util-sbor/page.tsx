import PageHeader from '@/components/PageHeader'
import UtilSborCalculator from '@/components/UtilSborCalculator'

export default function UtilSborPage() {
  return (
    <div>
      <PageHeader
        title="Калькулятор утильсбора"
        description="Рассчитайте размер утильсбора для вашего автомобиля с учетом всех коэффициентов"
      />
      <UtilSborCalculator />
    </div>
  )
}
