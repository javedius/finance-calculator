import { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import PaybackPeriodCalculator from '@/components/PaybackPeriodCalculator'
import Breadcrumbs from '@/components/Breadcrumbs'
import StructuredData from '@/components/StructuredData'
import RelatedCalculators, { relatedCalculators } from '@/components/RelatedCalculators'

export const metadata: Metadata = {
  title: 'Срок окупаемости калькулятор 2025 - Расчет периода окупаемости',
  description: 'Бесплатный калькулятор срока окупаемости 2025. Расчет периода окупаемости инвестиций, проектов, оборудования. NPV, IRR, дисконтирование.',
  keywords: [
    'срок окупаемости калькулятор',
    'период окупаемости',
    'окупаемость инвестиций',
    'NPV расчет',
    'IRR расчет',
    'дисконтирование',
    'инвестиционный проект',
    'окупаемость оборудования',
    'срок окупаемости 2025',
    'финансовый анализ'
  ],
  openGraph: {
    title: 'Срок окупаемости калькулятор 2025 - Расчет периода окупаемости',
    description: 'Бесплатный калькулятор срока окупаемости 2025. Расчет периода окупаемости инвестиций, проектов, оборудования.',
    type: 'website',
  },
  alternates: {
    canonical: '/payback-period',
  },
}

const paybackStructuredData = {
  '@type': 'SoftwareApplication',
  name: 'Калькулятор срока окупаемости',
  description: 'Расчет периода окупаемости инвестиций и проектов',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'RUB',
  },
  featureList: [
    'NPV расчет',
    'IRR расчет',
    'Дисконтирование',
    'Инвестиционные проекты',
    'Окупаемость оборудования',
    'Финансовый анализ'
  ],
  screenshot: 'https://finance-calculator.ru/payback-screenshot.jpg',
}

export default function PaybackPeriodPage() {
  const breadcrumbItems = [
    { name: 'Срок окупаемости', href: '/payback-period' }
  ]

  return (
    <div>
      <StructuredData type="SoftwareApplication" data={paybackStructuredData} />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Срок окупаемости калькулятор 2025"
        description="Расчет периода окупаемости инвестиций и проектов"
        icon="📊"
      />
      <PaybackPeriodCalculator />
      <RelatedCalculators 
        currentPage="payback" 
        calculators={relatedCalculators.loans} 
      />
    </div>
  )
}