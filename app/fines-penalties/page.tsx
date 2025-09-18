import { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import FinesPenaltiesCalculator from '@/components/FinesPenaltiesCalculator'
import Breadcrumbs from '@/components/Breadcrumbs'
import StructuredData from '@/components/StructuredData'
import RelatedCalculators, { relatedCalculators } from '@/components/RelatedCalculators'

export const metadata: Metadata = {
  title: 'Штрафы и пени калькулятор 2024 - Расчет штрафов онлайн',
  description: 'Бесплатный калькулятор штрафов и пеней 2024. Расчет штрафов за просрочки налогов, ГИБДД, коммунальных платежей. Пени и неустойки.',
  keywords: [
    'штрафы и пени калькулятор',
    'расчет штрафов',
    'пени за просрочку',
    'штрафы ГИБДД',
    'налоговые штрафы',
    'коммунальные штрафы',
    'неустойка расчет',
    'штрафы 2024',
    'пени онлайн',
    'штрафы калькулятор'
  ],
  openGraph: {
    title: 'Штрафы и пени калькулятор 2024 - Расчет штрафов онлайн',
    description: 'Бесплатный калькулятор штрафов и пеней 2024. Расчет штрафов за просрочки налогов, ГИБДД, коммунальных платежей.',
    type: 'website',
  },
  alternates: {
    canonical: '/fines-penalties',
  },
}

const finesStructuredData = {
  '@type': 'SoftwareApplication',
  name: 'Калькулятор штрафов и пеней',
  description: 'Расчет штрафов за просрочки налогов, ГИБДД, коммунальных платежей',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'RUB',
  },
  featureList: [
    'Штрафы ГИБДД',
    'Налоговые штрафы',
    'Коммунальные штрафы',
    'Пени за просрочку',
    'Неустойка',
    'Штрафы 2024'
  ],
  screenshot: 'https://finance-calculator.ru/fines-screenshot.jpg',
}

export default function FinesPenaltiesPage() {
  const breadcrumbItems = [
    { name: 'Штрафы', href: '/fines' },
    { name: 'Штрафы и пени', href: '/fines-penalties' }
  ]

  return (
    <div>
      <StructuredData type="SoftwareApplication" data={finesStructuredData} />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Штрафы и пени калькулятор 2024"
        description="Расчет штрафов за просрочки налогов, ГИБДД, коммунальных платежей"
        icon="⚠️"
      />
      <FinesPenaltiesCalculator />
      <RelatedCalculators 
        currentPage="fines" 
        calculators={relatedCalculators.ndfl} 
      />
    </div>
  )
}