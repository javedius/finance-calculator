import { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import PensionSavingsCalculator from '@/components/PensionSavingsCalculator'
import Breadcrumbs from '@/components/Breadcrumbs'
import StructuredData from '@/components/StructuredData'
import RelatedCalculators, { relatedCalculators } from '@/components/RelatedCalculators'

export const metadata: Metadata = {
  title: 'Пенсионные накопления калькулятор 2025 - Расчет будущей пенсии',
  description: 'Бесплатный калькулятор пенсионных накоплений 2025. Расчет будущей пенсии с учетом инвестиций, взносов, инфляции. Планирование пенсионных накоплений онлайн.',
  keywords: [
    'пенсионные накопления калькулятор',
    'расчет будущей пенсии',
    'пенсионные взносы',
    'накопительная пенсия',
    'страховая пенсия',
    'инвестиции для пенсии',
    'пенсионный фонд',
    'пенсионные накопления 2025',
    'планирование пенсии',
    'пенсионный калькулятор'
  ],
  openGraph: {
    title: 'Пенсионные накопления калькулятор 2025 - Расчет будущей пенсии',
    description: 'Бесплатный калькулятор пенсионных накоплений 2025. Расчет будущей пенсии с учетом инвестиций, взносов, инфляции.',
    type: 'website',
  },
  alternates: {
    canonical: '/pension-savings',
  },
}

const pensionStructuredData = {
  '@type': 'SoftwareApplication',
  name: 'Калькулятор пенсионных накоплений',
  description: 'Расчет будущих накоплений и пенсионных выплат с учетом инвестиций',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'RUB',
  },
  featureList: [
    'Расчет будущей пенсии',
    'Пенсионные взносы',
    'Инвестиционные доходы',
    'Учет инфляции',
    'Накопительная пенсия',
    'Страховая пенсия'
  ],
  screenshot: 'https://finkalk.ru/pension-screenshot.jpg',
}

export default function PensionSavingsPage() {
  const breadcrumbItems = [
    { name: 'Пенсионные накопления', href: '/pension-savings' }
  ]

  return (
    <div>
      <StructuredData type="SoftwareApplication" data={pensionStructuredData} />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Пенсионные накопления калькулятор 2025"
        description="Расчет будущих накоплений и пенсионных выплат с учетом инвестиций"
        icon="👴"
      />
      <PensionSavingsCalculator />
      <RelatedCalculators 
        currentPage="pension" 
        calculators={relatedCalculators.loans} 
      />
    </div>
  )
}
