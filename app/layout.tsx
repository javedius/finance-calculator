import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['cyrillic', 'latin'] })

export const metadata = {
  title: 'Финансовый калькулятор',
  description: 'Калькулятор налогов и финансовых расчетов',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
