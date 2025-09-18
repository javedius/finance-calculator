import { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import InvestmentReturnsCalculator from '@/components/InvestmentReturnsCalculator'
import Breadcrumbs from '@/components/Breadcrumbs'
import StructuredData from '@/components/StructuredData'
import RelatedCalculators, { relatedCalculators } from '@/components/RelatedCalculators'

export const metadata: Metadata = {
  title: 'Доходность инвестиций калькулятор 2024 - Расчет прибыли от инвестиций',
  description: 'Бесплатный калькулятор доходности инвестиций 2024. Расчет прибыли с учетом процентной ставки, налога на прибыль, инфляции. Сложные проценты, реинвестирование.',
  keywords: [
    'доходность инвестиций калькулятор',
    'расчет прибыли от инвестиций',
    'сложные проценты',
    'реинвестирование',
    'налог на прибыль',
    'инвестиционный доход',
    'процентная ставка',
    'инфляция',
    'инвестиционный калькулятор',
    'доходность портфеля'
  ],
  openGraph: {
    title: 'Доходность инвестиций калькулятор 2024 - Расчет прибыли от инвестиций',
    description: 'Бесплатный калькулятор доходности инвестиций 2024. Расчет прибыли с учетом процентной ставки, налога на прибыль, инфляции.',
    type: 'website',
  },
  alternates: {
    canonical: '/investment-returns',
  },
}

const investmentStructuredData = {
  '@type': 'SoftwareApplication',
  name: 'Калькулятор доходности инвестиций',
  description: 'Расчет прибыли с учетом процентной ставки и налога на прибыль',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'RUB',
  },
  featureList: [
    'Сложные проценты',
    'Реинвестирование',
    'Налог на прибыль',
    'Учет инфляции',
    'Различные валюты',
    'График доходности'
  ],
  screenshot: 'https://finance-calculator.ru/investment-screenshot.jpg',
}

export default function InvestmentReturnsPage() {
  const breadcrumbItems = [
    { name: 'Инвестиции', href: '/investments' },
    { name: 'Доходность инвестиций', href: '/investment-returns' }
  ]

  return (
    <div>
      <StructuredData type="SoftwareApplication" data={investmentStructuredData} />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Доходность инвестиций калькулятор 2024"
        description="Расчет прибыли с учетом процентной ставки и налога на прибыль"
        icon="📈"
      />
      <InvestmentReturnsCalculator />
      <RelatedCalculators 
        currentPage="investment" 
        calculators={relatedCalculators.loans} 
      />
    </div>
  )
}
