export interface LandTaxParams {
  landArea: number
  landCategory: 'agricultural' | 'residential' | 'commercial' | 'industrial' | 'forest' | 'water' | 'other'
  region: string
  cadastralValue: number
  ownershipType: 'individual' | 'organization'
  hasBenefits: boolean
  benefitType?: 'pensioner' | 'veteran' | 'disabled' | 'large_family' | 'other'
  benefitAmount?: number
}

export interface LandTaxResult {
  taxAmount: number
  taxRate: number
  cadastralValue: number
  benefits: number
  breakdown: {
    description: string
    value: number
    formula: string
  }[]
}

// Ставки налога на землю по категориям (в %)
const TAX_RATES = {
  agricultural: 0.3,
  residential: 0.3,
  commercial: 1.5,
  industrial: 1.5,
  forest: 0.3,
  water: 0.3,
  other: 1.5
}

// Региональные коэффициенты (примерные)
const REGIONAL_COEFFICIENTS: { [key: string]: number } = {
  'moscow': 1.0,
  'spb': 1.0,
  'moscow_region': 0.8,
  'other': 0.6
}

// Льготы по типам (в % от налога)
const BENEFITS = {
  pensioner: 0.5, // 50% скидка
  veteran: 0.5,   // 50% скидка
  disabled: 0.5,  // 50% скидка
  large_family: 0.3, // 30% скидка
  other: 0 // Пользовательская скидка
}

export function calculateLandTax(params: LandTaxParams): LandTaxResult {
  const {
    landArea,
    landCategory,
    region,
    cadastralValue,
    ownershipType,
    hasBenefits,
    benefitType = 'other',
    benefitAmount = 0
  } = params

  // Базовая ставка налога
  const baseTaxRate = TAX_RATES[landCategory]
  
  // Региональный коэффициент
  const regionalCoeff = REGIONAL_COEFFICIENTS[region] || REGIONAL_COEFFICIENTS['other']
  
  // Итоговая ставка налога
  const taxRate = baseTaxRate * regionalCoeff
  
  // Расчет налога
  let taxAmount = cadastralValue * taxRate / 100
  
  // Применение льгот
  let benefits = 0
  if (hasBenefits) {
    if (benefitType === 'other' && benefitAmount > 0) {
      // Пользовательская льгота в рублях
      benefits = Math.min(benefitAmount, taxAmount)
    } else {
      // Процентная льгота
      const benefitRate = BENEFITS[benefitType]
      benefits = taxAmount * benefitRate
    }
    
    taxAmount = Math.max(0, taxAmount - benefits)
  }
  
  const breakdown = [
    {
      description: 'Кадастровая стоимость',
      value: cadastralValue,
      formula: 'Стоимость по кадастру'
    },
    {
      description: 'Площадь участка',
      value: landArea,
      formula: `${landArea} кв.м`
    },
    {
      description: 'Категория земли',
      value: 0,
      formula: getCategoryDescription(landCategory)
    },
    {
      description: 'Базовая ставка налога',
      value: baseTaxRate,
      formula: `${baseTaxRate}%`
    },
    {
      description: 'Региональный коэффициент',
      value: regionalCoeff,
      formula: `Коэффициент для ${region}`
    },
    {
      description: 'Итоговая ставка',
      value: taxRate,
      formula: `${baseTaxRate}% × ${regionalCoeff} = ${taxRate}%`
    },
    {
      description: 'Налог до льгот',
      value: cadastralValue * taxRate / 100,
      formula: `${cadastralValue.toLocaleString('ru-RU')} × ${taxRate}%`
    }
  ]
  
  if (hasBenefits) {
    breakdown.push({
      description: 'Льгота',
      value: benefits,
      formula: benefitType === 'other' 
        ? `${benefitAmount.toLocaleString('ru-RU')} руб`
        : `${(BENEFITS[benefitType] * 100)}% от налога`
    })
  }
  
  breakdown.push({
    description: 'К доплате',
    value: taxAmount,
    formula: 'Налог - Льгота'
  })
  
  return {
    taxAmount: Math.round(taxAmount),
    taxRate: Math.round(taxRate * 100) / 100,
    cadastralValue,
    benefits: Math.round(benefits),
    breakdown
  }
}

function getCategoryDescription(category: string): string {
  const descriptions = {
    agricultural: 'Земли сельскохозяйственного назначения',
    residential: 'Земли населенных пунктов',
    commercial: 'Земли коммерческого назначения',
    industrial: 'Земли промышленности',
    forest: 'Земли лесного фонда',
    water: 'Земли водного фонда',
    other: 'Прочие земли'
  }
  return descriptions[category as keyof typeof descriptions] || 'Неизвестная категория'
}
