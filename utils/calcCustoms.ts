/**
 * Калькулятор растаможки автомобилей
 * Включает расчет пошлин, НДС, утильсбора и других сборов
 * Соответствует требованиям РФ с 1 ноября 2025 года
 */

// Импорт утильсбора из calcUtilSbor
import { calculateUtilSbor, UtilSborParams } from './calcUtilSbor'

export type VehicleCategory = 'passenger' | 'truck' | 'motorcycle'
export type EngineType = 'gasoline' | 'diesel' | 'electric' | 'hybrid'

export interface CustomsParams {
  // Основные параметры автомобиля
  engineVolume: number // объем двигателя в см³
  power: number // мощность в л.с.
  age: number // возраст в годах
  category: VehicleCategory
  engineType: EngineType
  isImported: boolean
  
  // Финансовые параметры
  customsValue: number // таможенная стоимость в рублях
  engineDisplacement: number // рабочий объем двигателя в см³ (для пошлин)
  
  // Дополнительные параметры
  isElectric: boolean
  isHybrid: boolean
}

export interface CustomsCalculation {
  // Таможенные пошлины
  customsDuty: number // таможенная пошлина
  vat: number // НДС
  excise: number // акциз
  
  // Утильсбор
  utilSbor: number // утилизационный сбор
  
  // Итоговые суммы
  totalCustoms: number // общая сумма таможенных платежей
  totalWithUtilSbor: number // общая сумма с утильсбором
  
  // Детализация
  breakdown: {
    customsValue: number
    dutyRate: number
    dutyAmount: number
    vatBase: number
    vatAmount: number
    exciseAmount: number
    utilSborAmount: number
  }
}

// Ставки таможенных пошлин по объему двигателя (2025 год)
const CUSTOMS_DUTY_RATES = [
  { min: 0, max: 1000, rate: 0.2 },      // 20% для малолитражек
  { min: 1000, max: 1500, rate: 0.25 },  // 25% для 1-1.5л
  { min: 1500, max: 1800, rate: 0.3 },   // 30% для 1.5-1.8л
  { min: 1800, max: 2300, rate: 0.35 },  // 35% для 1.8-2.3л
  { min: 2300, max: 3000, rate: 0.4 },   // 40% для 2.3-3л
  { min: 3000, max: null, rate: 0.5 }    // 50% для 3л+
]

// Ставки акциза по объему двигателя (2025 год)
const EXCISE_RATES = [
  { min: 0, max: 1000, rate: 0 },        // 0 руб/л для малолитражек
  { min: 1000, max: 1500, rate: 45 },    // 45 руб/л для 1-1.5л
  { min: 1500, max: 1800, rate: 50 },    // 50 руб/л для 1.5-1.8л
  { min: 1800, max: 2300, rate: 60 },    // 60 руб/л для 1.8-2.3л
  { min: 2300, max: 3000, rate: 80 },    // 80 руб/л для 2.3-3л
  { min: 3000, max: null, rate: 100 }    // 100 руб/л для 3л+
]

// Ставка НДС
const VAT_RATE = 0.20 // 20% НДС

// Коэффициенты для электромобилей и гибридов
const ECO_COEFFICIENTS = {
  electric: 0.1,  // Электромобили - минимальная пошлина
  hybrid: 0.5,    // Гибриды - 50% от обычной пошлины
  regular: 1.0    // Обычные ДВС - полная пошлина
}

// Коэффициенты по категориям
const CATEGORY_COEFFICIENTS = {
  passenger: 1.0,  // Легковые автомобили
  truck: 1.2,      // Грузовые автомобили +20%
  motorcycle: 0.3  // Мотоциклы - скидка 70%
}

export function calculateCustoms(params: CustomsParams): CustomsCalculation {
  const { 
    engineVolume, 
    power, 
    age, 
    category, 
    engineType, 
    isImported, 
    customsValue, 
    engineDisplacement,
    isElectric,
    isHybrid
  } = params

  // Определяем ставку таможенной пошлины
  const dutyRate = CUSTOMS_DUTY_RATES.find(rate => 
    engineDisplacement >= rate.min && 
    (rate.max === null || engineDisplacement <= rate.max)
  )?.rate || 0.5

  // Определяем ставку акциза
  const exciseRate = EXCISE_RATES.find(rate => 
    engineDisplacement >= rate.min && 
    (rate.max === null || engineDisplacement <= rate.max)
  )?.rate || 100

  // Определяем экологический коэффициент
  let ecoCoefficient = ECO_COEFFICIENTS.regular
  if (isElectric) {
    ecoCoefficient = ECO_COEFFICIENTS.electric
  } else if (isHybrid) {
    ecoCoefficient = ECO_COEFFICIENTS.hybrid
  }

  // Определяем коэффициент по категории
  const categoryCoefficient = CATEGORY_COEFFICIENTS[category]

  // Рассчитываем таможенную пошлину
  const baseDutyRate = dutyRate * ecoCoefficient * categoryCoefficient
  const customsDuty = customsValue * baseDutyRate

  // Рассчитываем акциз (только для ДВС)
  const excise = engineType !== 'electric' ? (engineDisplacement / 1000) * exciseRate : 0

  // Рассчитываем НДС (только с таможенной стоимости + пошлина)
  const vatBase = customsValue + customsDuty
  const vat = vatBase * VAT_RATE

  // Рассчитываем утильсбор
  const utilSborParams: UtilSborParams = {
    engineVolume,
    power,
    age,
    category,
    isElectric,
    isHybrid,
    isImported: true // Все импортируемые автомобили считаются импортными
  }
  const utilSborCalculation = calculateUtilSbor(utilSborParams)
  const utilSbor = utilSborCalculation.totalUtilSbor

  // Итоговые суммы
  const totalCustoms = customsDuty + vat + excise
  const totalWithUtilSbor = totalCustoms + utilSbor

  return {
    customsDuty,
    vat,
    excise,
    utilSbor,
    totalCustoms,
    totalWithUtilSbor,
    breakdown: {
      customsValue,
      dutyRate: baseDutyRate,
      dutyAmount: customsDuty,
      vatBase,
      vatAmount: vat,
      exciseAmount: excise,
      utilSborAmount: utilSbor
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

export function formatPercent(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`
}
