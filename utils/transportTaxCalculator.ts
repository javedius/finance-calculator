// Универсальный калькулятор транспортного налога в РФ с учетом регионов, возраста и льгот

export interface VehicleType {
  id: string
  name: string
  unit: string
  description: string
}

export interface Region {
  id: string
  name: string
  rates: {
    [vehicleTypeId: string]: {
      minHorsepower: number
      maxHorsepower: number | null
      ratePerHorsepower: number
      description: string
    }[]
  }
}

export interface AgeCoefficient {
  minAge: number
  maxAge: number | null
  coefficient: number
  description: string
}

export interface Benefit {
  id: string
  name: string
  coefficient: number
  description: string
}

export interface TransportTaxCalculation {
  vehicleType: string
  region: string
  horsepower: number
  yearOfManufacture: number
  vehicleAge: number
  baseRate: number
  ageCoefficient: number
  benefitCoefficient: number
  appliedBenefits: string[]
  annualTax: number
  monthlyTax: number
  calculationSteps: {
    step: string
    value: number
    description: string
  }[]
}

export const VEHICLE_TYPES: VehicleType[] = [
  {
    id: 'passenger_cars',
    name: 'Легковые автомобили',
    unit: 'л.с.',
    description: 'Автомобили для перевозки пассажиров'
  },
  {
    id: 'motorcycles',
    name: 'Мотоциклы и мотороллеры',
    unit: 'л.с.',
    description: 'Двухколесные транспортные средства'
  },
  {
    id: 'trucks',
    name: 'Грузовые автомобили',
    unit: 'л.с.',
    description: 'Автомобили для перевозки грузов'
  },
  {
    id: 'buses',
    name: 'Автобусы',
    unit: 'л.с.',
    description: 'Автомобили для перевозки пассажиров (более 8 мест)'
  },
  {
    id: 'special_equipment',
    name: 'Спецтехника',
    unit: 'л.с.',
    description: 'Специальная техника (тракторы, экскаваторы и т.д.)'
  },
  {
    id: 'other',
    name: 'Другие ТС',
    unit: 'л.с.',
    description: 'Прочие транспортные средства'
  }
]

export const REGIONS: Region[] = [
  {
    id: 'moscow',
    name: 'Москва',
    rates: {
      passenger_cars: [
        { minHorsepower: 0, maxHorsepower: 100, ratePerHorsepower: 12, description: 'До 100 л.с.' },
        { minHorsepower: 100, maxHorsepower: 150, ratePerHorsepower: 25, description: '100-150 л.с.' },
        { minHorsepower: 150, maxHorsepower: 200, ratePerHorsepower: 35, description: '150-200 л.с.' },
        { minHorsepower: 200, maxHorsepower: 250, ratePerHorsepower: 50, description: '200-250 л.с.' },
        { minHorsepower: 250, maxHorsepower: null, ratePerHorsepower: 75, description: 'Свыше 250 л.с.' }
      ],
      motorcycles: [
        { minHorsepower: 0, maxHorsepower: 20, ratePerHorsepower: 7, description: 'До 20 л.с.' },
        { minHorsepower: 20, maxHorsepower: 35, ratePerHorsepower: 15, description: '20-35 л.с.' },
        { minHorsepower: 35, maxHorsepower: null, ratePerHorsepower: 30, description: 'Свыше 35 л.с.' }
      ],
      trucks: [
        { minHorsepower: 0, maxHorsepower: 100, ratePerHorsepower: 15, description: 'До 100 л.с.' },
        { minHorsepower: 100, maxHorsepower: 150, ratePerHorsepower: 26, description: '100-150 л.с.' },
        { minHorsepower: 150, maxHorsepower: 200, ratePerHorsepower: 38, description: '150-200 л.с.' },
        { minHorsepower: 200, maxHorsepower: 250, ratePerHorsepower: 55, description: '200-250 л.с.' },
        { minHorsepower: 250, maxHorsepower: null, ratePerHorsepower: 70, description: 'Свыше 250 л.с.' }
      ],
      buses: [
        { minHorsepower: 0, maxHorsepower: 200, ratePerHorsepower: 25, description: 'До 200 л.с.' },
        { minHorsepower: 200, maxHorsepower: null, ratePerHorsepower: 50, description: 'Свыше 200 л.с.' }
      ],
      special_equipment: [
        { minHorsepower: 0, maxHorsepower: 100, ratePerHorsepower: 8, description: 'До 100 л.с.' },
        { minHorsepower: 100, maxHorsepower: 200, ratePerHorsepower: 15, description: '100-200 л.с.' },
        { minHorsepower: 200, maxHorsepower: null, ratePerHorsepower: 25, description: 'Свыше 200 л.с.' }
      ],
      other: [
        { minHorsepower: 0, maxHorsepower: null, ratePerHorsepower: 20, description: 'Любая мощность' }
      ]
    }
  },
  {
    id: 'spb',
    name: 'Санкт-Петербург',
    rates: {
      passenger_cars: [
        { minHorsepower: 0, maxHorsepower: 100, ratePerHorsepower: 8, description: 'До 100 л.с.' },
        { minHorsepower: 100, maxHorsepower: 150, ratePerHorsepower: 20, description: '100-150 л.с.' },
        { minHorsepower: 150, maxHorsepower: 200, ratePerHorsepower: 30, description: '150-200 л.с.' },
        { minHorsepower: 200, maxHorsepower: 250, ratePerHorsepower: 40, description: '200-250 л.с.' },
        { minHorsepower: 250, maxHorsepower: null, ratePerHorsepower: 60, description: 'Свыше 250 л.с.' }
      ],
      motorcycles: [
        { minHorsepower: 0, maxHorsepower: 20, ratePerHorsepower: 5, description: 'До 20 л.с.' },
        { minHorsepower: 20, maxHorsepower: 35, ratePerHorsepower: 12, description: '20-35 л.с.' },
        { minHorsepower: 35, maxHorsepower: null, ratePerHorsepower: 25, description: 'Свыше 35 л.с.' }
      ],
      trucks: [
        { minHorsepower: 0, maxHorsepower: 100, ratePerHorsepower: 12, description: 'До 100 л.с.' },
        { minHorsepower: 100, maxHorsepower: 150, ratePerHorsepower: 20, description: '100-150 л.с.' },
        { minHorsepower: 150, maxHorsepower: 200, ratePerHorsepower: 30, description: '150-200 л.с.' },
        { minHorsepower: 200, maxHorsepower: 250, ratePerHorsepower: 40, description: '200-250 л.с.' },
        { minHorsepower: 250, maxHorsepower: null, ratePerHorsepower: 55, description: 'Свыше 250 л.с.' }
      ],
      buses: [
        { minHorsepower: 0, maxHorsepower: 200, ratePerHorsepower: 20, description: 'До 200 л.с.' },
        { minHorsepower: 200, maxHorsepower: null, ratePerHorsepower: 40, description: 'Свыше 200 л.с.' }
      ],
      special_equipment: [
        { minHorsepower: 0, maxHorsepower: 100, ratePerHorsepower: 6, description: 'До 100 л.с.' },
        { minHorsepower: 100, maxHorsepower: 200, ratePerHorsepower: 12, description: '100-200 л.с.' },
        { minHorsepower: 200, maxHorsepower: null, ratePerHorsepower: 20, description: 'Свыше 200 л.с.' }
      ],
      other: [
        { minHorsepower: 0, maxHorsepower: null, ratePerHorsepower: 15, description: 'Любая мощность' }
      ]
    }
  },
  {
    id: 'moscow_region',
    name: 'Московская область',
    rates: {
      passenger_cars: [
        { minHorsepower: 0, maxHorsepower: 100, ratePerHorsepower: 10, description: 'До 100 л.с.' },
        { minHorsepower: 100, maxHorsepower: 150, ratePerHorsepower: 22, description: '100-150 л.с.' },
        { minHorsepower: 150, maxHorsepower: 200, ratePerHorsepower: 32, description: '150-200 л.с.' },
        { minHorsepower: 200, maxHorsepower: 250, ratePerHorsepower: 45, description: '200-250 л.с.' },
        { minHorsepower: 250, maxHorsepower: null, ratePerHorsepower: 65, description: 'Свыше 250 л.с.' }
      ],
      motorcycles: [
        { minHorsepower: 0, maxHorsepower: 20, ratePerHorsepower: 6, description: 'До 20 л.с.' },
        { minHorsepower: 20, maxHorsepower: 35, ratePerHorsepower: 13, description: '20-35 л.с.' },
        { minHorsepower: 35, maxHorsepower: null, ratePerHorsepower: 27, description: 'Свыше 35 л.с.' }
      ],
      trucks: [
        { minHorsepower: 0, maxHorsepower: 100, ratePerHorsepower: 13, description: 'До 100 л.с.' },
        { minHorsepower: 100, maxHorsepower: 150, ratePerHorsepower: 24, description: '100-150 л.с.' },
        { minHorsepower: 150, maxHorsepower: 200, ratePerHorsepower: 35, description: '150-200 л.с.' },
        { minHorsepower: 200, maxHorsepower: 250, ratePerHorsepower: 50, description: '200-250 л.с.' },
        { minHorsepower: 250, maxHorsepower: null, ratePerHorsepower: 65, description: 'Свыше 250 л.с.' }
      ],
      buses: [
        { minHorsepower: 0, maxHorsepower: 200, ratePerHorsepower: 22, description: 'До 200 л.с.' },
        { minHorsepower: 200, maxHorsepower: null, ratePerHorsepower: 45, description: 'Свыше 200 л.с.' }
      ],
      special_equipment: [
        { minHorsepower: 0, maxHorsepower: 100, ratePerHorsepower: 7, description: 'До 100 л.с.' },
        { minHorsepower: 100, maxHorsepower: 200, ratePerHorsepower: 13, description: '100-200 л.с.' },
        { minHorsepower: 200, maxHorsepower: null, ratePerHorsepower: 22, description: 'Свыше 200 л.с.' }
      ],
      other: [
        { minHorsepower: 0, maxHorsepower: null, ratePerHorsepower: 18, description: 'Любая мощность' }
      ]
    }
  },
  {
    id: 'other',
    name: 'Другие регионы',
    rates: {
      passenger_cars: [
        { minHorsepower: 0, maxHorsepower: 100, ratePerHorsepower: 5, description: 'До 100 л.с.' },
        { minHorsepower: 100, maxHorsepower: 150, ratePerHorsepower: 10, description: '100-150 л.с.' },
        { minHorsepower: 150, maxHorsepower: 200, ratePerHorsepower: 15, description: '150-200 л.с.' },
        { minHorsepower: 200, maxHorsepower: 250, ratePerHorsepower: 20, description: '200-250 л.с.' },
        { minHorsepower: 250, maxHorsepower: null, ratePerHorsepower: 30, description: 'Свыше 250 л.с.' }
      ],
      motorcycles: [
        { minHorsepower: 0, maxHorsepower: 20, ratePerHorsepower: 2, description: 'До 20 л.с.' },
        { minHorsepower: 20, maxHorsepower: 35, ratePerHorsepower: 5, description: '20-35 л.с.' },
        { minHorsepower: 35, maxHorsepower: null, ratePerHorsepower: 10, description: 'Свыше 35 л.с.' }
      ],
      trucks: [
        { minHorsepower: 0, maxHorsepower: 100, ratePerHorsepower: 8, description: 'До 100 л.с.' },
        { minHorsepower: 100, maxHorsepower: 150, ratePerHorsepower: 12, description: '100-150 л.с.' },
        { minHorsepower: 150, maxHorsepower: 200, ratePerHorsepower: 18, description: '150-200 л.с.' },
        { minHorsepower: 200, maxHorsepower: 250, ratePerHorsepower: 25, description: '200-250 л.с.' },
        { minHorsepower: 250, maxHorsepower: null, ratePerHorsepower: 35, description: 'Свыше 250 л.с.' }
      ],
      buses: [
        { minHorsepower: 0, maxHorsepower: 200, ratePerHorsepower: 12, description: 'До 200 л.с.' },
        { minHorsepower: 200, maxHorsepower: null, ratePerHorsepower: 25, description: 'Свыше 200 л.с.' }
      ],
      special_equipment: [
        { minHorsepower: 0, maxHorsepower: 100, ratePerHorsepower: 4, description: 'До 100 л.с.' },
        { minHorsepower: 100, maxHorsepower: 200, ratePerHorsepower: 8, description: '100-200 л.с.' },
        { minHorsepower: 200, maxHorsepower: null, ratePerHorsepower: 15, description: 'Свыше 200 л.с.' }
      ],
      other: [
        { minHorsepower: 0, maxHorsepower: null, ratePerHorsepower: 10, description: 'Любая мощность' }
      ]
    }
  }
]

export const AGE_COEFFICIENTS: AgeCoefficient[] = [
  { minAge: 0, maxAge: 3, coefficient: 1.0, description: 'Новые автомобили (до 3 лет)' },
  { minAge: 3, maxAge: 5, coefficient: 0.9, description: 'Автомобили 3-5 лет' },
  { minAge: 5, maxAge: 10, coefficient: 0.8, description: 'Автомобили 5-10 лет' },
  { minAge: 10, maxAge: null, coefficient: 0.7, description: 'Старые автомобили (свыше 10 лет)' }
]

export const BENEFITS: Benefit[] = [
  { id: 'pensioner', name: 'Пенсионер', coefficient: 0.5, description: '50% скидка для пенсионеров' },
  { id: 'disabled', name: 'Инвалид', coefficient: 0.0, description: 'Полное освобождение от налога' },
  { id: 'large_family', name: 'Многодетная семья', coefficient: 0.5, description: '50% скидка для многодетных семей' },
  { id: 'veteran', name: 'Ветеран', coefficient: 0.0, description: 'Полное освобождение от налога' },
  { id: 'hero', name: 'Герой России/СССР', coefficient: 0.0, description: 'Полное освобождение от налога' },
  { id: 'electric', name: 'Электромобиль', coefficient: 0.0, description: 'Освобождение от налога для электромобилей' }
]

export function calculateTransportTax(
  vehicleTypeId: string,
  regionId: string,
  horsepower: number,
  yearOfManufacture: number,
  selectedBenefits: string[]
): TransportTaxCalculation | null {
  if (horsepower <= 0 || yearOfManufacture <= 0) {
    return null
  }

  const currentYear = new Date().getFullYear()
  const vehicleAge = currentYear - yearOfManufacture

  // Находим тип транспортного средства
  const vehicleType = VEHICLE_TYPES.find(type => type.id === vehicleTypeId)
  if (!vehicleType) {
    return null
  }

  // Находим регион
  const region = REGIONS.find(r => r.id === regionId)
  if (!region) {
    return null
  }

  // Получаем ставки для данного типа ТС в регионе
  const rates = region.rates[vehicleTypeId]
  if (!rates) {
    return null
  }

  // Находим подходящую ставку
  const applicableRate = rates.find(rate => {
    const maxHp = rate.maxHorsepower || Infinity
    return horsepower > rate.minHorsepower && horsepower <= maxHp
  })

  if (!applicableRate) {
    return null
  }

  // Определяем возрастной коэффициент
  const ageCoeff = AGE_COEFFICIENTS.find(coeff => {
    const maxAge = coeff.maxAge || Infinity
    return vehicleAge >= coeff.minAge && vehicleAge <= maxAge
  }) || AGE_COEFFICIENTS[0]

  // Определяем коэффициент льгот (берем минимальный из выбранных)
  let benefitCoeff = 1.0
  const appliedBenefits: string[] = []
  
  if (selectedBenefits.length > 0) {
    const benefitCoeffs = selectedBenefits.map(benefitId => {
      const benefit = BENEFITS.find(b => b.id === benefitId)
      if (benefit) {
        appliedBenefits.push(benefit.name)
        return benefit.coefficient
      }
      return 1.0
    })
    benefitCoeff = Math.min(...benefitCoeffs)
  }

  // Рассчитываем налог
  const baseTax = horsepower * applicableRate.ratePerHorsepower
  const ageAdjustedTax = baseTax * ageCoeff.coefficient
  const finalTax = ageAdjustedTax * benefitCoeff

  // Создаем детализацию расчета
  const calculationSteps = [
    {
      step: 'Базовая ставка',
      value: applicableRate.ratePerHorsepower,
      description: `${applicableRate.ratePerHorsepower} ₽ за л.с. (${applicableRate.description})`
    },
    {
      step: 'Мощность двигателя',
      value: horsepower,
      description: `${horsepower} л.с.`
    },
    {
      step: 'Базовый налог',
      value: baseTax,
      description: `${horsepower} л.с. × ${applicableRate.ratePerHorsepower} ₽ = ${formatCurrency(baseTax)}`
    },
    {
      step: 'Возрастной коэффициент',
      value: ageCoeff.coefficient,
      description: `${ageCoeff.description} (${ageCoeff.coefficient})`
    },
    {
      step: 'Налог с учетом возраста',
      value: ageAdjustedTax,
      description: `${formatCurrency(baseTax)} × ${ageCoeff.coefficient} = ${formatCurrency(ageAdjustedTax)}`
    }
  ]

  if (appliedBenefits.length > 0) {
    calculationSteps.push({
      step: 'Коэффициент льгот',
      value: benefitCoeff,
      description: `${appliedBenefits.join(', ')} (${benefitCoeff})`
    })
    calculationSteps.push({
      step: 'Итоговый налог',
      value: finalTax,
      description: `${formatCurrency(ageAdjustedTax)} × ${benefitCoeff} = ${formatCurrency(finalTax)}`
    })
  } else {
    calculationSteps.push({
      step: 'Итоговый налог',
      value: finalTax,
      description: 'Без льгот'
    })
  }

  return {
    vehicleType: vehicleType.name,
    region: region.name,
    horsepower,
    yearOfManufacture,
    vehicleAge,
    baseRate: applicableRate.ratePerHorsepower,
    ageCoefficient: ageCoeff.coefficient,
    benefitCoefficient: benefitCoeff,
    appliedBenefits,
    annualTax: finalTax,
    monthlyTax: finalTax / 12,
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

// Функция для получения всех типов транспортных средств
export function getVehicleTypes() {
  return VEHICLE_TYPES
}

// Функция для получения всех регионов
export function getRegions() {
  return REGIONS
}

// Функция для получения всех льгот
export function getBenefits() {
  return BENEFITS
}

// Функция для получения возрастных коэффициентов
export function getAgeCoefficients() {
  return AGE_COEFFICIENTS
}

// Функция для получения ставок по типу транспортного средства и региону
export function getRatesByVehicleTypeAndRegion(vehicleTypeId: string, regionId: string) {
  const region = REGIONS.find(r => r.id === regionId)
  if (!region) return []
  
  return region.rates[vehicleTypeId] || []
}