'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navigationItems } from '@/utils/navigation'

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              Финансовый калькулятор
            </h1>
          </div>
          <div className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-200 ${
                  pathname === item.href
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="md:hidden">
            <select
              value={pathname}
              onChange={(e) => window.location.href = e.target.value}
              className="text-sm font-medium bg-transparent border-none outline-none text-gray-600"
            >
              {navigationItems.map((item) => (
                <option key={item.name} value={item.href}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  )
}
