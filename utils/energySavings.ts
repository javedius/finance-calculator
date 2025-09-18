export interface EnergySavingsParams {
  energyType: 'electricity' | 'heating' | 'solar' | 'mixed'
  currentConsumption: number
  currentRate: number // руб за единицу
  improvementType: 'insulation' | 'windows' | 'appliances' | 'solar_panels' | 'led_lighting' | 'smart_thermostat' | 'custom'
  improvementCost: number
  expectedSavings: number // % экономии
  paybackPeriod: number // лет
  maintenanceCost: number // руб в год
  inflationRate: number // % в год
  energyPriceGrowth: number // % в год
}

export interface EnergySavingsResult {
  annualSavings: number
  totalSavings: number
  paybackPeriod: number
  netSavings: number
  roi: number
  breakdown: {
    description: string
    value: number
    formula: string
  }[]
  yearlyProjection: {
    year: number
    energyCost: number
    savings: number
    maintenance: number
    netSavings: number
    cumulativeSavings: number
  }[]
}

export function calculateEnergySavings(params: EnergySavingsParams): EnergySavingsResult {
  const {
    energyType,
    currentConsumption,
    currentRate,
    improvementType,
    improvementCost,
    expectedSavings,
    paybackPeriod,
    maintenanceCost,
    inflationRate,
    energyPriceGrowth
  } = params

  const monthlyInflation = inflationRate / 12 / 100
  const monthlyEnergyGrowth = energyPriceGrowth / 12 / 100

  // Расчет базовых показателей
  const currentAnnualCost = currentConsumption * currentRate * 12
  const annualSavings = currentAnnualCost * (expectedSavings / 100)
  
  let totalSavings = 0
  let cumulativeSavings = 0
  const yearlyProjection = []

  // Расчет по годам
  for (let year = 1; year <= paybackPeriod + 10; year++) { // +10 лет для долгосрочного прогноза
    // Рост стоимости энергии с учетом инфляции
    const energyCostThisYear = currentAnnualCost * Math.pow(1 + energyPriceGrowth / 100, year - 1)
    
    // Экономия с учетом роста цен
    const savingsThisYear = energyCostThisYear * (expectedSavings / 100)
    
    // Расходы на обслуживание с учетом инфляции
    const maintenanceThisYear = maintenanceCost * Math.pow(1 + inflationRate / 100, year - 1)
    
    // Чистая экономия за год
    const netSavingsThisYear = savingsThisYear - maintenanceThisYear
    
    // Учитываем первоначальные затраты только в первый год
    const totalCostThisYear = year === 1 ? improvementCost : 0
    const finalNetSavings = netSavingsThisYear - totalCostThisYear
    
    cumulativeSavings += finalNetSavings
    totalSavings += savingsThisYear

    yearlyProjection.push({
      year,
      energyCost: Math.round(energyCostThisYear),
      savings: Math.round(savingsThisYear),
      maintenance: Math.round(maintenanceThisYear),
      netSavings: Math.round(finalNetSavings),
      cumulativeSavings: Math.round(cumulativeSavings)
    })

    // Определяем срок окупаемости
    if (year === paybackPeriod && cumulativeSavings >= 0) {
      break
    }
  }

  const actualPaybackPeriod = yearlyProjection.find(p => p.cumulativeSavings >= 0)?.year || paybackPeriod
  const netSavings = cumulativeSavings
  const roi = (netSavings / improvementCost) * 100

  const breakdown = [
    {
      description: 'Текущие расходы на энергию',
      value: currentAnnualCost,
      formula: `${currentConsumption} × ${currentRate} руб × 12 мес`
    },
    {
      description: 'Ожидаемая экономия',
      value: expectedSavings,
      formula: `${expectedSavings}% от текущих расходов`
    },
    {
      description: 'Годовая экономия',
      value: annualSavings,
      formula: `${currentAnnualCost.toLocaleString('ru-RU')} × ${expectedSavings}%`
    },
    {
      description: 'Стоимость улучшений',
      value: improvementCost,
      formula: 'Первоначальные затраты'
    },
    {
      description: 'Расходы на обслуживание',
      value: maintenanceCost,
      formula: `${maintenanceCost} руб в год`
    },
    {
      description: 'Рост цен на энергию',
      value: energyPriceGrowth,
      formula: `${energyPriceGrowth}% в год`
    },
    {
      description: 'Срок окупаемости',
      value: actualPaybackPeriod,
      formula: 'Годы до полной окупаемости'
    },
    {
      description: 'Общая экономия',
      value: totalSavings,
      formula: 'Сумма экономии за весь период'
    },
    {
      description: 'Чистая экономия',
      value: netSavings,
      formula: 'Общая экономия - Затраты - Обслуживание'
    },
    {
      description: 'ROI (возврат инвестиций)',
      value: roi,
      formula: 'Отношение чистой экономии к затратам'
    }
  ]

  return {
    annualSavings: Math.round(annualSavings),
    totalSavings: Math.round(totalSavings),
    paybackPeriod: actualPaybackPeriod,
    netSavings: Math.round(netSavings),
    roi: Math.round(roi * 10) / 10,
    breakdown,
    yearlyProjection
  }
}
