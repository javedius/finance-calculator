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
    href: '/ndfl',
    description: 'Расчет НДФЛ по прогрессивной шкале',
    icon: '💰',
    category: 'Налоги'
  },
  {
    name: 'Страховые взносы',
    href: '/insurance-contributions',
    description: 'Расчет взносов для ИП и самозанятых',
    icon: '🛡️',
    category: 'Налоги'
  },
  {
    name: 'Пенсия и накопления',
    href: '/pension-savings',
    description: 'Расчет будущих накоплений и пенсионных выплат',
    icon: '💰',
    category: 'Финансы'
  },
  {
    name: 'Кредиты и займы',
    href: '/loans-credits',
    description: 'Расчет переплат, процентов и досрочного погашения',
    icon: '💳',
    category: 'Кредиты'
  },
  {
    name: 'Ипотека',
    href: '/mortgage',
    description: 'Расчет ипотечных платежей',
    icon: '🏠',
    category: 'Кредиты'
  },
  {
    name: 'Штрафы и пени',
    href: '/fines-penalties',
    description: 'Расчет штрафов за просрочки налогов, ГИБДД, коммунальных платежей',
    icon: '⚠️',
    category: 'Налоги'
  },
  {
    name: 'Налог на землю',
    href: '/land-tax',
    description: 'Расчет налога с учетом категории и площади участка',
    icon: '🏞️',
    category: 'Налоги'
  },
  {
    name: 'Коммунальные платежи',
    href: '/utilities',
    description: 'Расчет расходов на электричество, воду, отопление, газ и вывоз мусора',
    icon: '🏠',
    category: 'ЖКХ'
  },
  {
    name: 'Доходность инвестиций',
    href: '/investment-returns',
    description: 'Расчет прибыли с учетом процентной ставки и налога на прибыль',
    icon: '📈',
    category: 'Инвестиции'
  },
  {
    name: 'Окупаемость проекта',
    href: '/payback-period',
    description: 'Расчет сроков окупаемости вложений с учетом дисконтирования',
    icon: '⏱️',
    category: 'Инвестиции'
  },
  {
    name: 'Экономия от энергосбережения',
    href: '/energy-savings',
    description: 'Расчет экономии на электроэнергии, отоплении или солнечных панелях',
    icon: '⚡',
    category: 'Энергетика'
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
