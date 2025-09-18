import { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import EnergySavingsCalculator from '@/components/EnergySavingsCalculator'
import Breadcrumbs from '@/components/Breadcrumbs'
import StructuredData from '@/components/StructuredData'
import RelatedCalculators, { relatedCalculators } from '@/components/RelatedCalculators'

export const metadata: Metadata = {
  title: 'Энергосбережение калькулятор 2025 - Расчет экономии на энергии',
  description: 'Бесплатный калькулятор энергосбережения 2025. Расчет экономии на электроэнергии, отоплении, солнечных панелях. Энергоэффективность дома и офиса.',
  keywords: [
    'энергосбережение калькулятор',
    'экономия электроэнергии',
    'солнечные панели',
    'энергоэффективность',
    'отопление расчет',
    'электричество экономия',
    'энергосберегающие технологии',
    'зеленая энергия',
    'энергоаудит',
    'энергосбережение 2025'
  ],
  openGraph: {
    title: 'Энергосбережение калькулятор 2025 - Расчет экономии на энергии',
    description: 'Бесплатный калькулятор энергосбережения 2025. Расчет экономии на электроэнергии, отоплении, солнечных панелях.',
    type: 'website',
  },
  alternates: {
    canonical: '/energy-savings',
  },
}

const energySavingsStructuredData = {
  '@type': 'SoftwareApplication',
  name: 'Калькулятор энергосбережения',
  description: 'Расчет экономии на электроэнергии, отоплении или солнечных панелях',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'RUB',
  },
  featureList: [
    'Экономия электроэнергии',
    'Солнечные панели',
    'Энергоэффективность',
    'Отопление',
    'Энергоаудит',
    'Зеленая энергия'
  ],
  screenshot: 'https://finkalk.ru/energy-savings-screenshot.jpg',
}

export default function EnergySavingsPage() {
  const breadcrumbItems = [
    { name: 'Энергосбережение', href: '/energy-savings' }
  ]

  return (
    <div>
      <StructuredData type="SoftwareApplication" data={energySavingsStructuredData} />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Энергосбережение калькулятор 2025"
        description="Расчет экономии на электроэнергии, отоплении или солнечных панелях"
        icon="⚡"
      />
      <EnergySavingsCalculator />
      <RelatedCalculators 
        currentPage="energy" 
        calculators={relatedCalculators.ndfl} 
      />
    </div>
  )
}