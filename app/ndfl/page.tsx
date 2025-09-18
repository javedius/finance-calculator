import { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import TaxCalculator from '@/components/TaxCalculator'
import StructuredData from '@/components/StructuredData'
import Breadcrumbs from '@/components/Breadcrumbs'
import RelatedCalculators, { relatedCalculators } from '@/components/RelatedCalculators'

export const metadata: Metadata = {
  title: 'НДФЛ калькулятор 2025 - Расчет подоходного налога онлайн',
  description: 'Бесплатный калькулятор НДФЛ 2025. Рассчитайте подоходный налог по прогрессивной шкале. Налоговые вычеты, стандартные и социальные вычеты. Актуальные ставки РФ.',
  keywords: [
    'НДФЛ калькулятор',
    'подоходный налог',
    'налог на доходы физических лиц',
    'прогрессивная шкала налогообложения',
    'налоговые вычеты',
    'стандартный налоговый вычет',
    'социальный налоговый вычет',
    'расчет НДФЛ онлайн',
    'налог 13 процентов',
    'налог 15 процентов'
  ],
  openGraph: {
    title: 'НДФЛ калькулятор 2025 - Расчет подоходного налога онлайн',
    description: 'Бесплатный калькулятор НДФЛ 2025. Рассчитайте подоходный налог по прогрессивной шкале. Налоговые вычеты, стандартные и социальные вычеты.',
    type: 'website',
  },
  alternates: {
    canonical: '/ndfl',
  },
}

const ndflStructuredData = {
  '@type': 'SoftwareApplication',
  name: 'НДФЛ калькулятор',
  description: 'Калькулятор для расчета подоходного налога по прогрессивной шкале налогообложения',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'RUB',
  },
  featureList: [
    'Расчет НДФЛ по прогрессивной шкале',
    'Учет налоговых вычетов',
    'Стандартные вычеты на детей',
    'Социальные налоговые вычеты',
    'Актуальные ставки 2025 года'
  ],
  screenshot: 'https://finance-calculator.ru/ndfl-screenshot.jpg',
}

export default function NDFLPage() {
  const breadcrumbItems = [
    { name: 'НДФЛ калькулятор', href: '/ndfl' }
  ]

  return (
    <div>
      <StructuredData type="SoftwareApplication" data={ndflStructuredData} />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="НДФЛ калькулятор 2025"
        description="Расчет подоходного налога по прогрессивной шкале налогообложения в Российской Федерации"
        icon="💰"
      />
      <TaxCalculator />
      <RelatedCalculators 
        currentPage="ndfl" 
        calculators={relatedCalculators.ndfl} 
      />
    </div>
  )
}
