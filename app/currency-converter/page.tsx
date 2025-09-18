import PageHeader from '@/components/PageHeader'
import CurrencyConverter from '@/components/CurrencyConverter'

export default function CurrencyConverterPage() {
  return (
    <div>
      <PageHeader
        title="Конвертер валют"
        description="Конвертируйте валюты по актуальным курсам в реальном времени с просмотром истории"
      />
      <CurrencyConverter />
    </div>
  )
}
