import { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import MortgageCalculator from '@/components/MortgageCalculator'
import StructuredData from '@/components/StructuredData'
import Breadcrumbs from '@/components/Breadcrumbs'
import RelatedCalculators, { relatedCalculators } from '@/components/RelatedCalculators'

export const metadata: Metadata = {
  title: 'Ипотечный калькулятор 2024 - Расчет платежей по ипотеке онлайн',
  description: 'Бесплатный ипотечный калькулятор 2024. Рассчитайте ежемесячные платежи, переплату, досрочные погашения. Все банки России. Аннуитетные и дифференцированные платежи.',
  keywords: [
    'ипотечный калькулятор',
    'расчет ипотеки',
    'ипотечный платеж',
    'досрочное погашение ипотеки',
    'переплата по ипотеке',
    'аннуитетный платеж',
    'дифференцированный платеж',
    'ипотечный кредит',
    'ставка по ипотеке',
    'ипотека онлайн калькулятор'
  ],
  openGraph: {
    title: 'Ипотечный калькулятор 2024 - Расчет платежей по ипотеке онлайн',
    description: 'Бесплатный ипотечный калькулятор 2024. Рассчитайте ежемесячные платежи, переплату, досрочные погашения. Все банки России.',
    type: 'website',
  },
  alternates: {
    canonical: '/mortgage',
  },
}

const mortgageStructuredData = {
  '@type': 'SoftwareApplication',
  name: 'Ипотечный калькулятор',
  description: 'Калькулятор для расчета ежемесячных платежей по ипотеке с учетом досрочных погашений',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'RUB',
  },
  featureList: [
    'Расчет ежемесячных платежей',
    'Досрочные погашения',
    'Аннуитетные платежи',
    'Дифференцированные платежи',
    'Расчет переплаты',
    'График платежей'
  ],
  screenshot: 'https://finance-calculator.ru/mortgage-screenshot.jpg',
}

export default function MortgagePage() {
  const breadcrumbItems = [
    { name: 'Кредиты', href: '/loans' },
    { name: 'Ипотечный калькулятор', href: '/mortgage' }
  ]

  return (
    <div>
      <StructuredData type="SoftwareApplication" data={mortgageStructuredData} />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Ипотечный калькулятор 2024"
        description="Рассчитайте ежемесячные платежи по ипотеке с учетом досрочных погашений"
      />
      <MortgageCalculator />
      <RelatedCalculators 
        currentPage="mortgage" 
        calculators={relatedCalculators.mortgage} 
      />
    </div>
  )
}
