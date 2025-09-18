import { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import LandTaxCalculator from '@/components/LandTaxCalculator'
import Breadcrumbs from '@/components/Breadcrumbs'
import StructuredData from '@/components/StructuredData'
import RelatedCalculators, { relatedCalculators } from '@/components/RelatedCalculators'

export const metadata: Metadata = {
  title: 'Земельный налог калькулятор 2025 - Расчет налога на землю',
  description: 'Бесплатный калькулятор земельного налога 2025. Расчет налога на земельный участок с учетом категории, площади, кадастровой стоимости. Льготы и региональные ставки.',
  keywords: [
    'земельный налог калькулятор',
    'налог на землю',
    'земельный участок налог',
    'кадастровая стоимость земли',
    'категория земель',
    'льготы по земельному налогу',
    'земельный налог 2025',
    'региональные ставки',
    'площадь участка',
    'налог на дачу'
  ],
  openGraph: {
    title: 'Земельный налог калькулятор 2025 - Расчет налога на землю',
    description: 'Бесплатный калькулятор земельного налога 2025. Расчет налога на земельный участок с учетом категории, площади, кадастровой стоимости.',
    type: 'website',
  },
  alternates: {
    canonical: '/land-tax',
  },
}

const landStructuredData = {
  '@type': 'SoftwareApplication',
  name: 'Калькулятор земельного налога',
  description: 'Расчет налога с учетом категории и площади участка',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'RUB',
  },
  featureList: [
    'Категории земель',
    'Кадастровая стоимость',
    'Площадь участка',
    'Региональные ставки',
    'Учет льгот',
    'Налоговые вычеты'
  ],
  screenshot: 'https://finance-calculator.ru/land-screenshot.jpg',
}

export default function LandTaxPage() {
  const breadcrumbItems = [
    { name: 'Налоги', href: '/taxes' },
    { name: 'Земельный налог', href: '/land-tax' }
  ]

  return (
    <div>
      <StructuredData type="SoftwareApplication" data={landStructuredData} />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Земельный налог калькулятор 2025"
        description="Расчет налога с учетом категории и площади участка"
        icon="🏞️"
      />
      <LandTaxCalculator />
      <RelatedCalculators 
        currentPage="land" 
        calculators={relatedCalculators.ndfl} 
      />
    </div>
  )
}
