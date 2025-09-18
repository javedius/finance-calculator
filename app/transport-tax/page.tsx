import { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import TransportTaxCalculator from '@/components/TransportTaxCalculator'
import Breadcrumbs from '@/components/Breadcrumbs'
import StructuredData from '@/components/StructuredData'
import RelatedCalculators, { relatedCalculators } from '@/components/RelatedCalculators'

export const metadata: Metadata = {
  title: 'Транспортный налог калькулятор 2024 - Расчет налога на автомобиль',
  description: 'Бесплатный калькулятор транспортного налога 2024. Расчет налога на автомобиль, мотоцикл, автобус по мощности двигателя. Региональные ставки и льготы.',
  keywords: [
    'транспортный налог калькулятор',
    'налог на автомобиль',
    'налог на мотоцикл',
    'транспортный налог 2024',
    'мощность двигателя',
    'региональные ставки',
    'льготы по транспортному налогу',
    'налог на автобус',
    'грузовой автомобиль',
    'легковой автомобиль'
  ],
  openGraph: {
    title: 'Транспортный налог калькулятор 2024 - Расчет налога на автомобиль',
    description: 'Бесплатный калькулятор транспортного налога 2024. Расчет налога на автомобиль, мотоцикл, автобус по мощности двигателя.',
    type: 'website',
  },
  alternates: {
    canonical: '/transport-tax',
  },
}

const transportStructuredData = {
  '@type': 'SoftwareApplication',
  name: 'Калькулятор транспортного налога',
  description: 'Расчет транспортного налога в зависимости от типа ТС и мощности двигателя',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'RUB',
  },
  featureList: [
    'Легковые автомобили',
    'Мотоциклы',
    'Автобусы',
    'Грузовые автомобили',
    'Региональные ставки',
    'Учет льгот'
  ],
  screenshot: 'https://finance-calculator.ru/transport-screenshot.jpg',
}

export default function TransportTaxPage() {
  const breadcrumbItems = [
    { name: 'Налоги', href: '/taxes' },
    { name: 'Транспортный налог', href: '/transport-tax' }
  ]

  return (
    <div>
      <StructuredData type="SoftwareApplication" data={transportStructuredData} />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Транспортный налог калькулятор 2024"
        description="Рассчитайте размер транспортного налога в зависимости от типа транспортного средства и мощности двигателя"
        icon="🚗"
      />
      <TransportTaxCalculator />
      <RelatedCalculators 
        currentPage="transport" 
        calculators={relatedCalculators.ndfl} 
      />
    </div>
  )
}
