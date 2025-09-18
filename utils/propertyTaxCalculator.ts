// Калькулятор налога на недвижимость в РФ с учетом регионов, льгот и периода владения

export interface PropertyType {
  id: string
  name: string
  description: string
}

export interface Region {
  id: string
  name: string
  rates: {
    [propertyTypeId: string]: number
  }
}

export interface Benefit {
  id: string
  name: string
  discount: number
  description: string
  maxAmount?: number // Максимальная сумма льготы в рублях
}

export interface PropertyTaxCalculation {
  propertyType: string
  region: string
  cadastralValue: number
  ownershipStartDate: Date
  ownershipEndDate: Date
  ownershipDays: number
  ownershipProportion: number
  baseRate: number
  appliedBenefits: string[]
  totalDiscount: number
  discountAmount: number
  baseTax: number
  finalTax: number
  calculationSteps: {
    step: string
    value: number | string
    description: string
  }[]
}

export const PROPERTY_TYPES: PropertyType[] = [
  {
    id: 'apartment',
    name: 'Квартира',
    description: 'Жилое помещение в многоквартирном доме'
  },
  {
    id: 'house',
    name: 'Жилой дом',
    description: 'Индивидуальный жилой дом'
  },
  {
    id: 'new_apartment',
    name: 'Квартира в новостройке',
    description: 'Квартира в новом многоквартирном доме'
  },
  {
    id: 'commercial',
    name: 'Коммерческая недвижимость',
    description: 'Офисы, магазины, склады и другая коммерческая недвижимость'
  }
]

export const REGIONS: Region[] = [
  {
    id: 'moscow',
    name: 'Москва',
    rates: {
      apartment: 0.1,
      house: 0.1,
      new_apartment: 0.1,
      commercial: 2.0
    }
  },
  {
    id: 'spb',
    name: 'Санкт-Петербург',
    rates: {
      apartment: 0.1,
      house: 0.1,
      new_apartment: 0.1,
      commercial: 2.0
    }
  },
  {
    id: 'moscow_region',
    name: 'Московская область',
    rates: {
      apartment: 0.1,
      house: 0.1,
      new_apartment: 0.1,
      commercial: 2.0
    }
  },
  {
    id: 'krasnodar',
    name: 'Краснодарский край',
    rates: {
      apartment: 0.1,
      house: 0.1,
      new_apartment: 0.1,
      commercial: 2.0
    }
  },
  {
    id: 'sverdlovsk',
    name: 'Свердловская область',
    rates: {
      apartment: 0.1,
      house: 0.1,
      new_apartment: 0.1,
      commercial: 2.0
    }
  },
  {
    id: 'other',
    name: 'Другие регионы',
    rates: {
      apartment: 0.1,
      house: 0.1,
      new_apartment: 0.1,
      commercial: 2.0
    }
  }
]

export const BENEFITS: Benefit[] = [
  {
    id: 'pensioner',
    name: 'Пенсионер',
    discount: 0.5,
    description: '50% скидка для пенсионеров',
    maxAmount: 1000000 // 1 млн рублей
  },
  {
    id: 'disabled',
    name: 'Инвалид',
    discount: 1.0,
    description: 'Полное освобождение от налога',
    maxAmount: 2000000 // 2 млн рублей
  },
  {
    id: 'large_family',
    name: 'Многодетная семья',
    discount: 0.5,
    description: '50% скидка для многодетных семей',
    maxAmount: 1000000 // 1 млн рублей
  },
  {
    id: 'veteran',
    name: 'Ветеран',
    discount: 1.0,
    description: 'Полное освобождение от налога',
    maxAmount: 2000000 // 2 млн рублей
  },
  {
    id: 'hero',
    name: 'Герой России/СССР',
    discount: 1.0,
    description: 'Полное освобождение от налога',
    maxAmount: 2000000 // 2 млн рублей
  },
  {
    id: 'chernobyl',
    name: 'Ликвидатор аварии на ЧАЭС',
    discount: 1.0,
    description: 'Полное освобождение от налога',
    maxAmount: 2000000 // 2 млн рублей
  },
  {
    id: 'military',
    name: 'Военнослужащий',
    discount: 0.5,
    description: '50% скидка для военнослужащих',
    maxAmount: 1000000 // 1 млн рублей
  }
]

export function calculatePropertyTax(
  propertyTypeId: string,
  regionId: string,
  cadastralValue: number,
  ownershipStartDate: Date,
  ownershipEndDate: Date,
  selectedBenefits: string[]
): PropertyTaxCalculation | null {
  if (cadastralValue <= 0) {
    return null
  }

  // Находим тип недвижимости
  const propertyType = PROPERTY_TYPES.find(type => type.id === propertyTypeId)
  if (!propertyType) {
    return null
  }

  // Находим регион
  const region = REGIONS.find(r => r.id === regionId)
  if (!region) {
    return null
  }

  // Получаем ставку налога
  const baseRate = region.rates[propertyTypeId]
  if (baseRate === undefined) {
    return null
  }

  // Рассчитываем период владения
  const ownershipDays = Math.ceil((ownershipEndDate.getTime() - ownershipStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  const daysInYear = 365
  const ownershipProportion = Math.min(ownershipDays / daysInYear, 1)

  // Рассчитываем базовый налог
  const baseTax = cadastralValue * baseRate * ownershipProportion

  // Определяем льготы
  let totalDiscount = 0
  let discountAmount = 0
  const appliedBenefits: string[] = []

  if (selectedBenefits.length > 0) {
    // Находим максимальную льготу
    const benefitDiscounts = selectedBenefits.map(benefitId => {
      const benefit = BENEFITS.find(b => b.id === benefitId)
      if (benefit) {
        appliedBenefits.push(benefit.name)
        return benefit.discount
      }
      return 0
    })
    
    totalDiscount = Math.max(...benefitDiscounts)
    
    if (totalDiscount > 0) {
      // Находим максимальную сумму льготы среди выбранных
      const maxBenefitAmount = selectedBenefits.reduce((max, benefitId) => {
        const benefit = BENEFITS.find(b => b.id === benefitId)
        if (benefit && benefit.maxAmount) {
          return Math.max(max, benefit.maxAmount)
        }
        return max
      }, 0)
      
      // Рассчитываем размер льготы
      const potentialDiscount = baseTax * totalDiscount
      discountAmount = maxBenefitAmount > 0 ? Math.min(potentialDiscount, maxBenefitAmount) : potentialDiscount
    }
  }

  // Рассчитываем итоговый налог
  const finalTax = Math.max(0, baseTax - discountAmount)

  // Создаем детализацию расчета
  const calculationSteps = [
    {
      step: 'Кадастровая стоимость',
      value: formatCurrency(cadastralValue),
      description: 'Стоимость объекта по кадастру'
    },
    {
      step: 'Ставка налога',
      value: `${(baseRate * 100).toFixed(1)}%`,
      description: `Ставка для ${propertyType.name} в ${region.name}`
    },
    {
      step: 'Период владения',
      value: `${ownershipDays} дней`,
      description: `С ${formatDate(ownershipStartDate)} по ${formatDate(ownershipEndDate)}`
    },
    {
      step: 'Пропорция года',
      value: `${(ownershipProportion * 100).toFixed(1)}%`,
      description: `${ownershipDays} дней из 365 дней в году`
    },
    {
      step: 'Базовый налог',
      value: formatCurrency(baseTax),
      description: `${formatCurrency(cadastralValue)} × ${(baseRate * 100).toFixed(1)}% × ${(ownershipProportion * 100).toFixed(1)}%`
    }
  ]

  if (appliedBenefits.length > 0) {
    calculationSteps.push({
      step: 'Применяемые льготы',
      value: appliedBenefits.join(', '),
      description: `Скидка: ${(totalDiscount * 100).toFixed(0)}%`
    })
    calculationSteps.push({
      step: 'Размер льготы',
      value: formatCurrency(discountAmount),
      description: `Экономия от льгот`
    })
  }

  calculationSteps.push({
    step: 'Итоговый налог',
    value: formatCurrency(finalTax),
    description: appliedBenefits.length > 0 
      ? `${formatCurrency(baseTax)} - ${formatCurrency(discountAmount)}`
      : 'Без льгот'
  })

  return {
    propertyType: propertyType.name,
    region: region.name,
    cadastralValue,
    ownershipStartDate,
    ownershipEndDate,
    ownershipDays,
    ownershipProportion,
    baseRate,
    appliedBenefits,
    totalDiscount,
    discountAmount,
    baseTax,
    finalTax,
    calculationSteps
  }
}

export function formatCurrency(amount: number): string {
  // Округляем до целых рублей
  const roundedAmount = Math.round(amount)
  
  // Форматируем с разделителями тысяч
  const formatted = roundedAmount.toLocaleString('ru-RU', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
  
  return `${formatted} ₽`
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Функция для получения всех типов недвижимости
export function getPropertyTypes() {
  return PROPERTY_TYPES
}

// Функция для получения всех регионов
export function getRegions() {
  return REGIONS
}

// Функция для получения всех льгот
export function getBenefits() {
  return BENEFITS
}

// Функция для получения ставки по типу недвижимости и региону
export function getRateByPropertyTypeAndRegion(propertyTypeId: string, regionId: string): number {
  const region = REGIONS.find(r => r.id === regionId)
  if (!region) return 0
  
  return region.rates[propertyTypeId] || 0
}
