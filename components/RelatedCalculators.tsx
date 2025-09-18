import Link from 'next/link'
import Card from './Card'

interface RelatedCalculator {
  name: string
  href: string
  description: string
  icon: string
}

interface RelatedCalculatorsProps {
  currentPage: string
  calculators: RelatedCalculator[]
}

export default function RelatedCalculators({ currentPage, calculators }: RelatedCalculatorsProps) {
  return (
    <section className="mt-12 bg-gray-50 rounded-xl p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Связанные калькуляторы
      </h2>
      <p className="text-gray-600 mb-6">
        Возможно, вас также заинтересуют другие финансовые калькуляторы:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {calculators.map((calculator) => (
          <Link
            key={calculator.name}
            href={calculator.href}
            className="group"
          >
            <Card className="p-4 hover:shadow-md transition-all duration-200 group-hover:scale-105 bg-white border border-gray-200">
              <div className="flex items-start space-x-3">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                  {calculator.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 mb-1">
                    {calculator.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {calculator.description}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}

// Предустановленные группы связанных калькуляторов
export const relatedCalculators = {
  ndfl: [
    {
      name: 'Страховые взносы',
      href: '/insurance-contributions',
      description: 'Расчет взносов в ПФР, ФСС, ФФОМС',
      icon: '🛡️'
    },
    {
      name: 'Транспортный налог',
      href: '/transport-tax',
      description: 'Налог на автомобиль и другие ТС',
      icon: '🚗'
    },
    {
      name: 'Налог на имущество',
      href: '/property-tax',
      description: 'Налог на недвижимость',
      icon: '🏠'
    }
  ],
  mortgage: [
    {
      name: 'Кредитный калькулятор',
      href: '/loans-credits',
      description: 'Расчет потребительских кредитов',
      icon: '💳'
    },
    {
      name: 'Налог на имущество',
      href: '/property-tax',
      description: 'Налог на недвижимость',
      icon: '🏠'
    },
    {
      name: 'Коммунальные услуги',
      href: '/utilities',
      description: 'Расчет коммунальных платежей',
      icon: '⚡'
    }
  ],
  loans: [
    {
      name: 'Ипотечный калькулятор',
      href: '/mortgage',
      description: 'Расчет ипотечных платежей',
      icon: '🏠'
    },
    {
      name: 'Страховые взносы',
      href: '/insurance-contributions',
      description: 'Расчет взносов в ПФР, ФСС, ФФОМС',
      icon: '🛡️'
    },
    {
      name: 'Пенсионные накопления',
      href: '/pension-savings',
      description: 'Расчет пенсионных накоплений',
      icon: '👴'
    }
  ]
}
