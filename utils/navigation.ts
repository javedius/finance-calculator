export interface NavigationItem {
  name: string
  href: string
  description?: string
  icon?: string
  category?: string
}

export const navigationItems: NavigationItem[] = [
  {
    name: 'НДФЛ',
    href: '/',
    description: 'Расчет НДФЛ по прогрессивной шкале',
    icon: '💰',
    category: 'Налоги'
  },
  {
    name: 'Ипотека',
    href: '/mortgage',
    description: 'Расчет ипотечных платежей',
    icon: '🏠',
    category: 'Кредиты'
  },
  {
    name: 'Утильсбор',
    href: '/util-sbor',
    description: 'Расчет утильсбора автомобилей',
    icon: '🚗',
    category: 'Автомобили'
  },
  {
    name: 'Растаможка',
    href: '/customs',
    description: 'Расчет растаможки с утильсбором',
    icon: '📦',
    category: 'Автомобили'
  },
  {
    name: 'Транспортный налог',
    href: '/transport-tax',
    description: 'Расчет транспортного налога',
    icon: '🚙',
    category: 'Налоги'
  },
  {
    name: 'Налог на недвижимость',
    href: '/property-tax',
    description: 'Расчет налога на недвижимость',
    icon: '🏘️',
    category: 'Налоги'
  },
  {
    name: 'Конвертер валют',
    href: '/currency-converter',
    description: 'Конвертация валют по актуальным курсам',
    icon: '💱',
    category: 'Финансы'
  },
  {
    name: 'О проекте',
    href: '/about',
    description: 'Информация о калькуляторе',
    icon: 'ℹ️',
    category: 'Информация'
  }
]

// Функция для добавления новых страниц
export function addNavigationItem(item: NavigationItem) {
  navigationItems.push(item)
}

// Функция для получения всех страниц
export function getAllPages() {
  return navigationItems
}

// Функция для группировки по категориям
export function getNavigationByCategories() {
  const categories: { [key: string]: NavigationItem[] } = {}
  
  navigationItems.forEach(item => {
    const category = item.category || 'Другие'
    if (!categories[category]) {
      categories[category] = []
    }
    categories[category].push(item)
  })
  
  return categories
}

// Функция для получения основных калькуляторов (без "О проекте")
export function getMainCalculators() {
  return navigationItems.filter(item => item.category !== 'Информация')
}
