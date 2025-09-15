export interface NavigationItem {
  name: string
  href: string
  description?: string
}

export const navigationItems: NavigationItem[] = [
  {
    name: 'Калькулятор налогов',
    href: '/',
    description: 'Расчет НДФЛ по прогрессивной шкале'
  },
  {
    name: 'Ипотечный калькулятор',
    href: '/mortgage',
    description: 'Расчет ипотечных платежей'
  },
  {
    name: 'О проекте',
    href: '/about',
    description: 'Информация о калькуляторе'
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
