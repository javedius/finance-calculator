/**
 * Калькулятор утилизационного сбора для автомобилей
 * Соответствует требованиям РФ с 1 ноября 2025 года
 * 
 * Основные изменения с 1 ноября 2025:
 * - Учет мощности двигателя вместо только объема
 * - Прогрессивная шкала для автомобилей свыше 160 л.с.
 * - Льготы для экологически чистых транспортных средств
 * - Возрастные коэффициенты для стимулирования обновления парка
 */

export type VehicleCategory = 'passenger' | 'truck' | 'motorcycle'

export interface UtilSborParams {
  engineVolume: number // объем двигателя в см³
  power: number // мощность в л.с.
  age: number // возраст в годах (<=3 лет = новые, >3 лет = старше)
  category: VehicleCategory
  isElectric: boolean
  isHybrid: boolean
  isImported: boolean
}

export interface UtilSborCalculation {
  baseRate: number
  ageCoefficient: number
  ecoCoefficient: number
  importCoefficient: number
  categoryCoefficient: number
  totalUtilSbor: number
  breakdown: {
    baseAmount: number
    ageAdjustment: number
    ecoAdjustment: number
    importAdjustment: number
    categoryAdjustment: number
  }
}

// Официальная таблица утильсбора РФ с 1 ноября 2025 года
// Базовая ставка = 20 000 рублей
// Итоговая сумма = Коэффициент × 20 000

interface UtilSborRate {
  engineVolumeMin: number
  engineVolumeMax: number | null
  powerMin: number
  powerMax: number | null
  coefficientNew: number
  coefficientOld: number
}

const UTIL_SBOR_RATES: UtilSborRate[] = [
  // До 1000 см³
  { engineVolumeMin: 0, engineVolumeMax: 1000, powerMin: 0, powerMax: 160, coefficientNew: 0.17, coefficientOld: 0.26 },
  { engineVolumeMin: 0, engineVolumeMax: 1000, powerMin: 161, powerMax: 220, coefficientNew: 12.8, coefficientOld: 23.7 },
  { engineVolumeMin: 0, engineVolumeMax: 1000, powerMin: 221, powerMax: 250, coefficientNew: 13.5, coefficientOld: 25.1 },
  { engineVolumeMin: 0, engineVolumeMax: 1000, powerMin: 251, powerMax: null, coefficientNew: 14.4, coefficientOld: 26.5 },
  
  // 1000-2000 см³
  { engineVolumeMin: 1000, engineVolumeMax: 2000, powerMin: 0, powerMax: 160, coefficientNew: 0.17, coefficientOld: 0.26 },
  { engineVolumeMin: 1000, engineVolumeMax: 2000, powerMin: 161, powerMax: 220, coefficientNew: 37.5, coefficientOld: 45.0 },
  { engineVolumeMin: 1000, engineVolumeMax: 2000, powerMin: 221, powerMax: 280, coefficientNew: 42.1, coefficientOld: 50.52 },
  { engineVolumeMin: 1000, engineVolumeMax: 2000, powerMin: 281, powerMax: null, coefficientNew: 47.6, coefficientOld: 64.56 },
  
  // 2000-3000 см³
  { engineVolumeMin: 2000, engineVolumeMax: 3000, powerMin: 0, powerMax: 160, coefficientNew: 107.67, coefficientOld: 164.84 },
  { engineVolumeMin: 2000, engineVolumeMax: 3000, powerMin: 161, powerMax: 220, coefficientNew: 139.4, coefficientOld: 182.9 },
  { engineVolumeMin: 2000, engineVolumeMax: 3000, powerMin: 221, powerMax: 310, coefficientNew: 144.2, coefficientOld: 188.5 },
  { engineVolumeMin: 2000, engineVolumeMax: 3000, powerMin: 311, powerMax: null, coefficientNew: 152.5, coefficientOld: 201.6 },
  
  // >3000 см³
  { engineVolumeMin: 3000, engineVolumeMax: null, powerMin: 0, powerMax: 160, coefficientNew: 107.67, coefficientOld: 164.84 },
  { engineVolumeMin: 3000, engineVolumeMax: null, powerMin: 161, powerMax: 220, coefficientNew: 139.4, coefficientOld: 182.9 },
  { engineVolumeMin: 3000, engineVolumeMax: null, powerMin: 221, powerMax: 310, coefficientNew: 178.2, coefficientOld: 255.8 },
  { engineVolumeMin: 3000, engineVolumeMax: null, powerMin: 311, powerMax: null, coefficientNew: 190.5, coefficientOld: 286.9 }
]

const BASE_RATE = 20000 // Базовая ставка 20 000 рублей

// Экологические коэффициенты (актуально с 1 ноября 2025 года)
// Льготы для экологически чистых транспортных средств
const ECO_COEFFICIENTS = {
  electric: 0.5,  // Электромобили - скидка 50%
  hybrid: 0.7,    // Гибриды - скидка 30%
  regular: 1.0    // Обычные ДВС - полная ставка
}

// Импортные коэффициенты (актуально с 1 ноября 2025 года)
// Доплата за импортные автомобили
const IMPORT_COEFFICIENTS = {
  imported: 1.2,  // Импортные автомобили +20%
  local: 1.0      // Отечественные автомобили - базовая ставка
}

// Коэффициенты по категориям (актуально с 1 ноября 2025 года)
// Различные ставки для разных типов транспортных средств
const CATEGORY_COEFFICIENTS = {
  passenger: 1.0,  // Легковые автомобили - базовая ставка
  truck: 1.5,      // Грузовые автомобили +50%
  motorcycle: 0.3  // Мотоциклы - скидка 70%
}

export function calculateUtilSbor(params: UtilSborParams): UtilSborCalculation {
  const { engineVolume, power, age, category, isElectric, isHybrid, isImported } = params

  // Определяем, является ли автомобиль новым (<=3 лет) или старым (>3 лет)
  const isNew = age <= 3

  // Находим соответствующую ставку по объему двигателя и мощности
  const rate = UTIL_SBOR_RATES.find(rate => {
    const volumeMatch = engineVolume >= rate.engineVolumeMin && 
      (rate.engineVolumeMax === null || engineVolume <= rate.engineVolumeMax)
    const powerMatch = power >= rate.powerMin && 
      (rate.powerMax === null || power <= rate.powerMax)
    return volumeMatch && powerMatch
  })

  if (!rate) {
    // Если не найдена подходящая ставка, возвращаем нулевой расчет
    return {
      baseRate: 0,
      ageCoefficient: 1,
      ecoCoefficient: 1,
      importCoefficient: 1,
      categoryCoefficient: 1,
      totalUtilSbor: 0,
      breakdown: {
        baseAmount: 0,
        ageAdjustment: 0,
        ecoAdjustment: 0,
        importAdjustment: 0,
        categoryAdjustment: 0
      }
    }
  }

  // Получаем коэффициент в зависимости от возраста
  const baseCoefficient = isNew ? rate.coefficientNew : rate.coefficientOld
  const baseAmount = baseCoefficient * BASE_RATE

  // Определяем экологический коэффициент
  let ecoCoefficient = ECO_COEFFICIENTS.regular
  if (isElectric) {
    ecoCoefficient = ECO_COEFFICIENTS.electric
  } else if (isHybrid) {
    ecoCoefficient = ECO_COEFFICIENTS.hybrid
  }

  // Определяем импортный коэффициент
  const importCoefficient = isImported 
    ? IMPORT_COEFFICIENTS.imported 
    : IMPORT_COEFFICIENTS.local

  // Определяем коэффициент по категории
  const categoryCoefficient = CATEGORY_COEFFICIENTS[category]

  // Рассчитываем итоговую сумму
  const ecoAdjustment = baseAmount * (ecoCoefficient - 1)
  const importAdjustment = baseAmount * (importCoefficient - 1)
  const categoryAdjustment = baseAmount * (categoryCoefficient - 1)

  const totalUtilSbor = baseAmount + ecoAdjustment + importAdjustment + categoryAdjustment

  return {
    baseRate: baseAmount,
    ageCoefficient: isNew ? 1.0 : 1.0, // Возраст уже учтен в базовом коэффициенте
    ecoCoefficient,
    importCoefficient,
    categoryCoefficient,
    totalUtilSbor: Math.max(0, totalUtilSbor), // не может быть отрицательным
    breakdown: {
      baseAmount,
      ageAdjustment: 0, // Возраст уже учтен в базовом коэффициенте
      ecoAdjustment,
      importAdjustment,
      categoryAdjustment
    }
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
