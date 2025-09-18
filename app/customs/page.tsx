import { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import CustomsCalculator from '@/components/CustomsCalculator'
import Breadcrumbs from '@/components/Breadcrumbs'
import StructuredData from '@/components/StructuredData'
import RelatedCalculators, { relatedCalculators } from '@/components/RelatedCalculators'

export const metadata: Metadata = {
  title: 'Таможенный калькулятор 2025 - Расчет растаможки автомобиля',
  description: 'Бесплатный калькулятор растаможки 2025. Расчет полной стоимости растаможки автомобиля с учетом пошлин, НДС, акциза, утильсбора. Таможенные пошлины ЕАЭС.',
  keywords: [
    'таможенный калькулятор',
    'растаможка автомобиля',
    'таможенные пошлины',
    'НДС при растаможке',
    'акциз на автомобиль',
    'утилизационный сбор',
    'растаможка 2025',
    'таможенные пошлины ЕАЭС',
    'стоимость растаможки',
    'импорт автомобиля'
  ],
  openGraph: {
    title: 'Таможенный калькулятор 2025 - Расчет растаможки автомобиля',
    description: 'Бесплатный калькулятор растаможки 2025. Расчет полной стоимости растаможки автомобиля с учетом пошлин, НДС, акциза, утильсбора.',
    type: 'website',
  },
  alternates: {
    canonical: '/customs',
  },
}

const customsStructuredData = {
  '@type': 'SoftwareApplication',
  name: 'Таможенный калькулятор',
  description: 'Расчет полной стоимости растаможки автомобиля с учетом пошлин, НДС, акциза и утильсбора',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'RUB',
  },
  featureList: [
    'Таможенные пошлины',
    'НДС при растаможке',
    'Акциз на автомобиль',
    'Утилизационный сбор',
    'Пошлины ЕАЭС',
    'Полная стоимость'
  ],
  screenshot: 'https://finance-calculator.ru/customs-screenshot.jpg',
}

export default function CustomsPage() {
  const breadcrumbItems = [
    { name: 'Инструменты', href: '/tools' },
    { name: 'Таможенный калькулятор', href: '/customs' }
  ]

  return (
    <div>
      <StructuredData type="SoftwareApplication" data={customsStructuredData} />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Таможенный калькулятор 2025"
        description="Рассчитайте полную стоимость растаможки автомобиля с учетом пошлин, НДС, акциза и утильсбора"
        icon="🚗"
      />
      <CustomsCalculator />
      <RelatedCalculators 
        currentPage="customs" 
        calculators={[
          {
            name: 'Транспортный налог',
            href: '/transport-tax',
            description: 'Расчет налога на автомобиль',
            icon: '🚗'
          },
          {
            name: 'Утилизационный сбор',
            href: '/util-sbor',
            description: 'Расчет утилизационного сбора',
            icon: '♻️'
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
