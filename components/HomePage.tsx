'use client'

import Link from 'next/link'
import Card from './Card'
import SEOContent from './SEOContent'
import { getNavigationByCategories } from '@/utils/navigation'

export default function HomePage() {
  const categories = getNavigationByCategories()

  return (
    <div className="space-y-8">
      {/* Главный заголовок */}
      <div className="text-center py-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-900">
          Финансовый калькулятор
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Все финансовые расчеты в одном месте
        </p>
      </div>


      {/* Популярные калькуляторы */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-center text-gray-900 mb-6">
          Популярные калькуляторы
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'НДФЛ', href: '/ndfl', icon: '💰', color: 'bg-green-500' },
            { name: 'Ипотека', href: '/mortgage', icon: '🏠', color: 'bg-blue-500' },
            { name: 'Страховые взносы', href: '/insurance-contributions', icon: '🛡️', color: 'bg-purple-500' },
            { name: 'Кредиты', href: '/loans-credits', icon: '💳', color: 'bg-orange-500' }
          ].map((calculator) => (
            <Link
              key={calculator.name}
              href={calculator.href}
              className="group"
            >
              <Card className="text-center hover:shadow-lg transition-all duration-300 group-hover:scale-105 bg-white">
                <div className={`w-12 h-12 ${calculator.color} rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl text-white">{calculator.icon}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">
                  {calculator.name}
                </h3>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Все калькуляторы */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-center text-gray-900">
          Все калькуляторы
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.values(categories).flat().filter(item => item.category !== 'Информация').map((calculator) => (
            <Link
              key={calculator.name}
              href={calculator.href}
              className="group"
            >
              <Card className="p-3 hover:shadow-md transition-all duration-200 group-hover:scale-105 bg-white border border-gray-100">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                    {calculator.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 truncate">
                      {calculator.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {calculator.description}
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Преимущества */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-white rounded-xl border border-gray-100">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Точные расчеты</h3>
          <p className="text-sm text-gray-600">
            Актуальные ставки и формулы РФ
          </p>
        </div>
        
        <div className="text-center p-4 bg-white rounded-xl border border-gray-100">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Быстро и просто</h3>
          <p className="text-sm text-gray-600">
            Результат за несколько секунд
          </p>
        </div>
        
        <div className="text-center p-4 bg-white rounded-xl border border-gray-100">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Безопасно</h3>
          <p className="text-sm text-gray-600">
            Данные не покидают ваш браузер
          </p>
        </div>
      </div>

      {/* SEO контент */}
      <SEOContent />
    </div>
  )
}
