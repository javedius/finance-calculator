import { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import CurrencyConverter from '@/components/CurrencyConverter'
import Breadcrumbs from '@/components/Breadcrumbs'
import StructuredData from '@/components/StructuredData'
import RelatedCalculators, { relatedCalculators } from '@/components/RelatedCalculators'

export const metadata: Metadata = {
  title: 'Конвертер валют онлайн - Курсы валют в реальном времени 2025',
  description: 'Бесплатный конвертер валют с актуальными курсами ЦБ РФ. USD, EUR, CNY и другие валюты. История курсов, графики изменения. Онлайн конвертация валют в реальном времени.',
  keywords: [
    'конвертер валют',
    'курсы валют онлайн',
    'конвертация валют',
    'курс доллара',
    'курс евро',
    'курс юаня',
    'ЦБ РФ курсы',
    'валютный калькулятор',
    'обмен валют онлайн',
    'курсы валют 2025'
  ],
  openGraph: {
    title: 'Конвертер валют онлайн - Курсы валют в реальном времени 2025',
    description: 'Бесплатный конвертер валют с актуальными курсами ЦБ РФ. USD, EUR, CNY и другие валюты. История курсов, графики изменения.',
    type: 'website',
  },
  alternates: {
    canonical: '/currency-converter',
  },
}

const currencyStructuredData = {
  '@type': 'SoftwareApplication',
  name: 'Конвертер валют',
  description: 'Онлайн конвертер валют с актуальными курсами ЦБ РФ',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'RUB',
  },
  featureList: [
    'Актуальные курсы валют',
    'История курсов',
    'Графики изменения',
    'Множество валют',
    'Курсы ЦБ РФ',
    'Реальное время'
  ],
  screenshot: 'https://finance-calculator.ru/currency-screenshot.jpg',
}

export default function CurrencyConverterPage() {
  const breadcrumbItems = [
    { name: 'Инструменты', href: '/tools' },
    { name: 'Конвертер валют', href: '/currency-converter' }
  ]

  return (
    <div>
      <StructuredData type="SoftwareApplication" data={currencyStructuredData} />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Конвертер валют онлайн"
        description="Конвертируйте валюты по актуальным курсам в реальном времени с просмотром истории"
        icon="💱"
      />
      <CurrencyConverter />
      <RelatedCalculators 
        currentPage="currency" 
        calculators={[
          {
            name: 'НДФЛ калькулятор',
            href: '/ndfl',
            description: 'Расчет подоходного налога',
            icon: '💰'
          },
          {
            name: 'Ипотечный калькулятор',
            href: '/mortgage',
            description: 'Расчет ипотечных платежей',
            icon: '🏠'
          },
          {
            name: 'Кредитный калькулятор',
            href: '/loans-credits',
            description: 'Расчет кредитов и займов',
            icon: '💳'
          }
        ]} 
      />
    </div>
  )
}
