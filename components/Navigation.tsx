'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { 
  navigationItems, 
  getNavigationByCategories, 
  getMainCalculators 
} from '@/utils/navigation'

export default function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  
  const categories = getNavigationByCategories()
  const mainCalculators = getMainCalculators()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleDropdown = (category: string) => {
    setActiveDropdown(activeDropdown === category ? null : category)
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Логотип */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                Финансовый калькулятор
              </h1>
            </Link>
          </div>

          {/* Десктопная навигация */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Главная страница */}
            <Link
              href="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                pathname === '/'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span>🏠</span>
              <span>Главная</span>
            </Link>

            {/* Основные калькуляторы */}
            <div className="flex space-x-4">
              {mainCalculators.slice(0, 3).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    pathname === item.href
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Выпадающее меню "Еще" */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('more')}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
              >
                <span>📋</span>
                <span>Еще</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === 'more' && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    {mainCalculators.slice(3).map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Планшетная навигация (средний экран) */}
          <div className="hidden md:flex lg:hidden items-center space-x-4">
            {/* Первые 2 калькулятора */}
            {mainCalculators.slice(0, 2).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-1 px-2 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  pathname === item.href
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                <span className="hidden sm:inline">{item.name}</span>
              </Link>
            ))}

            {/* Выпадающее меню для остальных */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown('more')}
                className="flex items-center space-x-1 px-2 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
              >
                <span>📋</span>
                <span className="hidden sm:inline">Еще</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {activeDropdown === 'more' && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    {mainCalculators.slice(2).map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <span className="text-lg">{item.icon}</span>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Мобильная навигация */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Мобильное меню */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Главная страница */}
              <Link
                href="/"
                className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium ${
                  pathname === '/'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div>
                  <div>Главная</div>
                  <div className="text-xs text-gray-500">Обзор всех калькуляторов</div>
                </div>
              </Link>
              
              {Object.entries(categories).map(([category, items]) => (
                <div key={category}>
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {category}
                  </div>
                  {items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium ${
                        pathname === item.href
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <div>
                        <div>{item.name}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Overlay для закрытия выпадающих меню */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </nav>
  )
}