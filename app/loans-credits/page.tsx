import { Metadata } from 'next'
import PageHeader from '@/components/PageHeader'
import LoansCreditsCalculator from '@/components/LoansCreditsCalculator'
import Breadcrumbs from '@/components/Breadcrumbs'
import StructuredData from '@/components/StructuredData'
import RelatedCalculators, { relatedCalculators } from '@/components/RelatedCalculators'

export const metadata: Metadata = {
  title: 'Кредитный калькулятор 2025 - Расчет потребительских кредитов онлайн',
  description: 'Бесплатный кредитный калькулятор 2025. Расчет переплат, процентов, досрочного погашения. Потребительские кредиты, автокредиты, рефинансирование. Все банки России.',
  keywords: [
    'кредитный калькулятор',
    'расчет кредита онлайн',
    'переплата по кредиту',
    'досрочное погашение',
    'потребительский кредит',
    'автокредит калькулятор',
    'рефинансирование кредита',
    'процентная ставка',
    'аннуитетный платеж',
    'дифференцированный платеж'
  ],
  openGraph: {
    title: 'Кредитный калькулятор 2025 - Расчет потребительских кредитов онлайн',
    description: 'Бесплатный кредитный калькулятор 2025. Расчет переплат, процентов, досрочного погашения. Потребительские кредиты, автокредиты.',
    type: 'website',
  },
  alternates: {
    canonical: '/loans-credits',
  },
}

const loansStructuredData = {
  '@type': 'SoftwareApplication',
  name: 'Кредитный калькулятор',
  description: 'Расчет переплат, процентов и досрочного погашения кредитов',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'RUB',
  },
  featureList: [
    'Расчет переплаты',
    'Досрочное погашение',
    'Аннуитетные платежи',
    'Дифференцированные платежи',
    'Потребительские кредиты',
    'Автокредиты'
  ],
  screenshot: 'https://finkalk.ru/loans-screenshot.jpg',
}

export default function LoansCreditsPage() {
  const breadcrumbItems = [
    { name: 'Кредитный калькулятор', href: '/loans-credits' }
  ]

  return (
    <div>
      <StructuredData type="SoftwareApplication" data={loansStructuredData} />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHeader
        title="Кредитный калькулятор 2025"
        description="Расчет переплат, процентов и досрочного погашения кредитов"
        icon="💳"
      />
      <LoansCreditsCalculator />
      <RelatedCalculators 
        currentPage="loans" 
        calculators={relatedCalculators.loans} 
      />
    </div>
  )
}
