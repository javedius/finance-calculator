import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import StructuredData, { calculatorStructuredData, faqStructuredData } from '@/components/StructuredData'
import PerformanceOptimizer from '@/components/PerformanceOptimizer'
import { GoogleAnalytics, YandexMetrica } from '@/components/Analytics'

const inter = Inter({ subsets: ['cyrillic', 'latin'] })

export const metadata = {
  title: {
    default: 'Финансовый калькулятор - Онлайн расчеты налогов и кредитов',
    template: '%s | Финансовый калькулятор'
  },
  description: 'Бесплатные онлайн калькуляторы для расчета налогов, ипотеки, кредитов, пенсионных накоплений. Точные расчеты по актуальным ставкам РФ. НДФЛ, страховые взносы, транспортный налог.',
  keywords: [
    'финансовый калькулятор',
    'налоговый калькулятор',
    'ипотечный калькулятор',
    'кредитный калькулятор',
    'НДФЛ калькулятор',
    'страховые взносы',
    'пенсионные накопления',
    'транспортный налог',
    'налог на имущество',
    'финансовые расчеты онлайн'
  ],
  authors: [{ name: 'Финансовый калькулятор' }],
  creator: 'Финансовый калькулятор',
  publisher: 'Финансовый калькулятор',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://finance-calculator.ru'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://finance-calculator.ru',
    siteName: 'Финансовый калькулятор',
    title: 'Финансовый калькулятор - Онлайн расчеты налогов и кредитов',
    description: 'Бесплатные онлайн калькуляторы для расчета налогов, ипотеки, кредитов, пенсионных накоплений. Точные расчеты по актуальным ставкам РФ.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Финансовый калькулятор - Онлайн расчеты',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Финансовый калькулятор - Онлайн расчеты налогов и кредитов',
    description: 'Бесплатные онлайн калькуляторы для расчета налогов, ипотеки, кредитов, пенсионных накоплений.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <StructuredData type="WebApplication" data={calculatorStructuredData} />
        <StructuredData type="FAQPage" data={faqStructuredData} />
      </head>
      <body className={inter.className}>
        <PerformanceOptimizer />
        <GoogleAnalytics measurementId="G-XXXXXXXXXX" />
        <YandexMetrica counterId="XXXXXXXXXX" />
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="container mx-auto px-4 py-4 sm:py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
