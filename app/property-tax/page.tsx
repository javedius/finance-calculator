import { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import PropertyTaxCalculator from '@/components/PropertyTaxCalculator'
import Breadcrumbs from '@/components/Breadcrumbs'
import StructuredData from '@/components/StructuredData'
import RelatedCalculators, { relatedCalculators } from '@/components/RelatedCalculators'

export const metadata: Metadata = {
  title: 'Налог на имущество калькулятор 2025 - Расчет налога на недвижимость',
  description: 'Бесплатный калькулятор налога на имущество 2025. Расчет налога на недвижимость с учетом типа объекта, региона, льгот. Квартиры, дома, коммерческая недвижимость.',
  keywords: [
    'налог на имущество калькулятор',
    'налог на недвижимость',
    'расчет налога на квартиру',
    'налог на дом',
    'коммерческая недвижимость',
    'льготы по налогу на имущество',
    'кадастровая стоимость',
    'инвентаризационная стоимость',
    'налог на имущество 2025',
    'региональные льготы'
  ],
  openGraph: {
    title: 'Налог на имущество калькулятор 2025 - Расчет налога на недвижимость',
    description: 'Бесплатный калькулятор налога на имущество 2025. Расчет налога на недвижимость с учетом типа объекта, региона, льгот.',
    type: 'website',
  },
  alternates: {
    canonical: '/property-tax',
  },
}

const propertyStructuredData = {
  '@type': 'SoftwareApplication',
  name: 'Калькулятор налога на имущество',
  description: 'Расчет налога на недвижимость с учетом типа объекта, региона, льгот',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'RUB',
  },
  featureList: [
    'Расчет для квартир',
    'Расчет для домов',
    'Коммерческая недвижимость',
    'Учет льгот',
    'Региональные особенности',
    'Кадастровая стоимость'
  ],
  screenshot: 'https://finance-calculator.ru/property-screenshot.jpg',
}

export default function PropertyTaxPage() {
  const breadcrumbItems = [
    { name: 'Налог на имущество', href: '/property-tax' }
  ]

  return (
    <div>
      <StructuredData type="SoftwareApplication" data={propertyStructuredData} />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Налог на имущество калькулятор 2025"
        description="Рассчитайте размер налога на недвижимость с учетом типа объекта, региона, льгот и периода владения"
        icon="🏠"
      />
      <PropertyTaxCalculator />
      <RelatedCalculators 
        currentPage="property" 
        calculators={relatedCalculators.ndfl} 
      />
    </div>
  )
}
