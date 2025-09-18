import { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import UtilSborCalculator from '@/components/UtilSborCalculator'
import Breadcrumbs from '@/components/Breadcrumbs'
import StructuredData from '@/components/StructuredData'
import RelatedCalculators, { relatedCalculators } from '@/components/RelatedCalculators'

export const metadata: Metadata = {
  title: 'Утилизационный сбор калькулятор 2025 - Расчет утильсбора',
  description: 'Бесплатный калькулятор утилизационного сбора 2025. Расчет утильсбора для автомобилей, мотоциклов, спецтехники. Ставки утилизационного сбора.',
  keywords: [
    'утилизационный сбор калькулятор',
    'утильсбор автомобиль',
    'утильсбор мотоцикл',
    'утилизационный сбор 2025',
    'ставки утильсбора',
    'утильсбор спецтехника',
    'утилизационный сбор онлайн',
    'расчет утильсбора',
    'утильсбор калькулятор',
    'утилизационный сбор РФ'
  ],
  openGraph: {
    title: 'Утилизационный сбор калькулятор 2025 - Расчет утильсбора',
    description: 'Бесплатный калькулятор утилизационного сбора 2025. Расчет утильсбора для автомобилей, мотоциклов, спецтехники.',
    type: 'website',
  },
  alternates: {
    canonical: '/util-sbor',
  },
}

const utilSborStructuredData = {
  '@type': 'SoftwareApplication',
  name: 'Калькулятор утилизационного сбора',
  description: 'Расчет утилизационного сбора для автомобилей и спецтехники',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'RUB',
  },
  featureList: [
    'Автомобили',
    'Мотоциклы',
    'Спецтехника',
    'Ставки утильсбора',
    'Утилизационный сбор',
    'Утильсбор 2025'
  ],
  screenshot: 'https://finance-calculator.ru/util-sbor-screenshot.jpg',
}

export default function UtilSborPage() {
  const breadcrumbItems = [
    { name: 'Утилизационный сбор', href: '/util-sbor' }
  ]

  return (
    <div>
      <StructuredData type="SoftwareApplication" data={utilSborStructuredData} />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Утилизационный сбор калькулятор 2025"
        description="Расчет утилизационного сбора для автомобилей и спецтехники"
        icon="♻️"
      />
      <UtilSborCalculator />
      <RelatedCalculators 
        currentPage="util-sbor" 
        calculators={[
          {
            name: 'Транспортный налог',
            href: '/transport-tax',
            description: 'Расчет налога на автомобиль',
            icon: '🚗'
          },
          {
            name: 'Таможенный калькулятор',
            href: '/customs',
            description: 'Расчет растаможки автомобиля',
            icon: '🚗'
          },
          {
            name: 'Конвертер валют',
            href: '/currency-converter',
            description: 'Курсы валют онлайн',
            icon: '💱'
          }
        ]} 
      />
    </div>
  )
}