import { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import Card from '@/components/Card'
import Breadcrumbs from '@/components/Breadcrumbs'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'О проекте - Финансовый калькулятор | Бесплатные онлайн расчеты',
  description: 'Финансовый калькулятор - бесплатные онлайн расчеты налогов, ипотеки, кредитов. Актуальные ставки 2024 года. Прогрессивная шкала НДФЛ, страховые взносы, налоги на имущество.',
  keywords: [
    'о финансовом калькуляторе',
    'бесплатные расчеты онлайн',
    'налоговые калькуляторы',
    'ипотечные калькуляторы',
    'кредитные калькуляторы',
    'прогрессивная шкала НДФЛ',
    'страховые взносы 2024',
    'налоги на имущество',
    'онлайн расчеты РФ'
  ],
  openGraph: {
    title: 'О проекте - Финансовый калькулятор | Бесплатные онлайн расчеты',
    description: 'Финансовый калькулятор - бесплатные онлайн расчеты налогов, ипотеки, кредитов. Актуальные ставки 2024 года.',
    type: 'website',
  },
  alternates: {
    canonical: '/about',
  },
}

const aboutStructuredData = {
  '@type': 'AboutPage',
  name: 'О финансовом калькуляторе',
  description: 'Информация о проекте финансового калькулятора для расчета налогов, ипотеки и кредитов',
  mainEntity: {
    '@type': 'WebApplication',
    name: 'Финансовый калькулятор',
    description: 'Бесплатные онлайн калькуляторы для финансовых расчетов',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'RUB',
    },
    featureList: [
      'Расчет НДФЛ по прогрессивной шкале',
      'Ипотечные калькуляторы',
      'Кредитные калькуляторы',
      'Страховые взносы',
      'Налоги на имущество',
      'Актуальные ставки 2024 года'
    ],
  },
}

export default function About() {
  const breadcrumbItems = [
    { name: 'О проекте', href: '/about' }
  ]

  return (
    <div>
      <StructuredData type="WebApplication" data={aboutStructuredData} />
      <Breadcrumbs items={breadcrumbItems} />
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
