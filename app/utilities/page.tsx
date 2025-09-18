import { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import UtilitiesCalculator from '@/components/UtilitiesCalculator'
import Breadcrumbs from '@/components/Breadcrumbs'
import StructuredData from '@/components/StructuredData'
import RelatedCalculators, { relatedCalculators } from '@/components/RelatedCalculators'

export const metadata: Metadata = {
  title: 'Коммунальные услуги калькулятор 2024 - Расчет ЖКХ платежей',
  description: 'Бесплатный калькулятор коммунальных услуг 2024. Расчет расходов на электричество, воду, отопление, газ, вывоз мусора. Тарифы ЖКХ по регионам России.',
  keywords: [
    'коммунальные услуги калькулятор',
    'расчет ЖКХ',
    'коммунальные платежи',
    'электричество расчет',
    'вода расчет',
    'отопление расчет',
    'газ расчет',
    'вывоз мусора',
    'тарифы ЖКХ 2024',
    'коммунальные услуги онлайн'
  ],
  openGraph: {
    title: 'Коммунальные услуги калькулятор 2024 - Расчет ЖКХ платежей',
    description: 'Бесплатный калькулятор коммунальных услуг 2024. Расчет расходов на электричество, воду, отопление, газ, вывоз мусора.',
    type: 'website',
  },
  alternates: {
    canonical: '/utilities',
  },
}

const utilitiesStructuredData = {
  '@type': 'SoftwareApplication',
  name: 'Калькулятор коммунальных услуг',
  description: 'Расчет расходов на электричество, воду, отопление, газ и вывоз мусора',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'RUB',
  },
  featureList: [
    'Электричество',
    'Водоснабжение',
    'Отопление',
    'Газоснабжение',
    'Вывоз мусора',
    'Региональные тарифы'
  ],
  screenshot: 'https://finance-calculator.ru/utilities-screenshot.jpg',
}

export default function UtilitiesPage() {
  const breadcrumbItems = [
    { name: 'ЖКХ', href: '/housing' },
    { name: 'Коммунальные услуги', href: '/utilities' }
  ]

  return (
    <div>
      <StructuredData type="SoftwareApplication" data={utilitiesStructuredData} />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Коммунальные услуги калькулятор 2024"
        description="Расчет расходов на электричество, воду, отопление, газ и вывоз мусора"
        icon="⚡"
      />
      <UtilitiesCalculator />
      <RelatedCalculators 
        currentPage="utilities" 
        calculators={[
          {
            name: 'Налог на имущество',
            href: '/property-tax',
            description: 'Расчет налога на недвижимость',
            icon: '🏠'
          },
          {
            name: 'Ипотечный калькулятор',
            href: '/mortgage',
            description: 'Расчет ипотечных платежей',
            icon: '🏠'
          },
          {
            name: 'Транспортный налог',
            href: '/transport-tax',
            description: 'Расчет налога на автомобиль',
            icon: '🚗'
          }
        ]} 
      />
    </div>
  )
}
