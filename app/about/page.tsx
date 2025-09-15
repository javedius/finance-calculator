import PageHeader from '@/components/PageHeader'
import Card from '@/components/Card'

export default function About() {
  return (
    <div>
      <PageHeader
        title="О проекте"
        description="Информация о финансовом калькуляторе"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Возможности</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Расчет НДФЛ по прогрессивной шкале</li>
            <li>• Актуальные ставки налогообложения 2024 года</li>
            <li>• Детализация расчета по налоговым ставкам</li>
            <li>• Простой и понятный интерфейс</li>
            <li>• Адаптивный дизайн</li>
          </ul>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Технологии</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Next.js 14 с App Router</li>
            <li>• TypeScript для типобезопасности</li>
            <li>• Tailwind CSS для стилизации</li>
            <li>• Переиспользуемые компоненты</li>
            <li>• Модульная архитектура</li>
          </ul>
        </Card>

        <Card className="md:col-span-2">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Прогрессивная шкала НДФЛ</h2>
          <p className="text-gray-600 mb-4">
            С 1 января 2024 года в России действует прогрессивная шкала налогообложения доходов физических лиц. 
            Ставка налога зависит от размера годового дохода:
          </p>
          <ul className="space-y-2 text-gray-600">
            <li>• <strong>13%</strong> - для доходов до 2,5 млн рублей в год</li>
            <li>• <strong>15%</strong> - для доходов от 2,5 до 5 млн рублей в год</li>
            <li>• <strong>18%</strong> - для доходов от 5 до 20 млн рублей в год</li>
            <li>• <strong>20%</strong> - для доходов от 20 до 50 млн рублей в год</li>
            <li>• <strong>22%</strong> - для доходов свыше 50 млн рублей в год</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
