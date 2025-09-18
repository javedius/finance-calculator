import { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import InsuranceContributionsCalculator from '@/components/InsuranceContributionsCalculator'
import Breadcrumbs from '@/components/Breadcrumbs'
import StructuredData from '@/components/StructuredData'
import RelatedCalculators, { relatedCalculators } from '@/components/RelatedCalculators'

export const metadata: Metadata = {
  title: 'Страховые взносы калькулятор 2025 - Расчет взносов ИП и самозанятых',
  description: 'Бесплатный калькулятор страховых взносов 2025. Расчет взносов в ПФР, ФСС, ФФОМС для ИП, самозанятых и работодателей. Актуальные ставки и лимиты взносов.',
  keywords: [
    'страховые взносы калькулятор',
    'взносы ИП 2025',
    'взносы самозанятых',
    'ПФР взносы',
    'ФСС взносы',
    'ФФОМС взносы',
    'страховые взносы работодателей',
    'расчет взносов онлайн',
    'лимиты взносов 2025',
    'ставки взносов'
  ],
  openGraph: {
    title: 'Страховые взносы калькулятор 2025 - Расчет взносов ИП и самозанятых',
    description: 'Бесплатный калькулятор страховых взносов 2025. Расчет взносов в ПФР, ФСС, ФФОМС для ИП, самозанятых и работодателей.',
    type: 'website',
  },
  alternates: {
    canonical: '/insurance-contributions',
  },
}

const insuranceStructuredData = {
  '@type': 'SoftwareApplication',
  name: 'Калькулятор страховых взносов',
  description: 'Расчет страховых взносов для ИП, самозанятых и работодателей',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'RUB',
  },
  featureList: [
    'Взносы в ПФР',
    'Взносы в ФСС',
    'Взносы в ФФОМС',
    'Расчет для ИП',
    'Расчет для самозанятых',
    'Актуальные ставки 2025'
  ],
  screenshot: 'https://finkalk.ru/insurance-screenshot.jpg',
}

export default function InsuranceContributionsPage() {
  const breadcrumbItems = [
    { name: 'Страховые взносы', href: '/insurance-contributions' }
  ]

  return (
    <div>
      <StructuredData type="SoftwareApplication" data={insuranceStructuredData} />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Страховые взносы калькулятор 2025"
        description="Расчет страховых взносов для ИП и самозанятых с учетом сотрудников"
        icon="🛡️"
      />
      <InsuranceContributionsCalculator />
      <RelatedCalculators 
        currentPage="insurance" 
        calculators={relatedCalculators.ndfl} 
      />
    </div>
  )
}
