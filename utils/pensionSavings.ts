export interface PensionSavingsParams {
  currentAge: number
  retirementAge: number
  currentSavings: number
  monthlyContribution: number
  annualReturn: number
  inflationRate: number
  pensionType: 'state' | 'private' | 'mixed'
  expectedPension?: number
}

export interface PensionSavingsResult {
  totalSavings: number
  monthlyPension: number
  yearlyPension: number
  totalContributions: number
  totalGrowth: number
  yearsToRetirement: number
  breakdown: {
    description: string
    value: number
    formula: string
  }[]
  monthlyProjection: {
    month: number
    age: number
    savings: number
    contribution: number
    growth: number
  }[]
}

export function calculatePensionSavings(params: PensionSavingsParams): PensionSavingsResult {
  const {
    currentAge,
    retirementAge,
    currentSavings,
    monthlyContribution,
    annualReturn,
    inflationRate,
    pensionType,
    expectedPension = 0
  } = params

  const yearsToRetirement = retirementAge - currentAge
  const monthsToRetirement = yearsToRetirement * 12
  const monthlyReturn = annualReturn / 12 / 100
  const monthlyInflation = inflationRate / 12 / 100

  let totalSavings = currentSavings
  let totalContributions = currentSavings
  const monthlyProjection = []

  // Расчет накоплений по месяцам
  for (let month = 0; month <= monthsToRetirement; month++) {
    const age = currentAge + month / 12
    const contribution = month === 0 ? 0 : monthlyContribution
    const growth = totalSavings * monthlyReturn
    
    if (month > 0) {
      totalSavings = totalSavings + contribution + growth
      totalContributions += contribution
    }

    monthlyProjection.push({
      month,
      age: Math.round(age * 10) / 10,
      savings: Math.round(totalSavings),
      contribution: Math.round(contribution),
      growth: Math.round(growth)
    })
  }

  const totalGrowth = totalSavings - totalContributions

  // Расчет пенсии
  let monthlyPension = 0
  let yearlyPension = 0

  if (pensionType === 'state') {
    // Упрощенный расчет государственной пенсии
    monthlyPension = Math.max(0, expectedPension - (totalSavings * 0.04 / 12))
    yearlyPension = monthlyPension * 12
  } else if (pensionType === 'private') {
    // Аннуитетный расчет частной пенсии (4% в год от накоплений)
    monthlyPension = totalSavings * 0.04 / 12
    yearlyPension = monthlyPension * 12
  } else {
    // Смешанный тип
    const privatePension = totalSavings * 0.04 / 12
    const statePension = Math.max(0, expectedPension - privatePension)
    monthlyPension = privatePension + statePension
    yearlyPension = monthlyPension * 12
  }

  const breakdown = [
    {
      description: 'Текущие накопления',
      value: currentSavings,
      formula: 'Исходная сумма'
    },
    {
      description: 'Общие взносы',
      value: totalContributions,
      formula: `Текущие накопления + ${monthlyContribution.toLocaleString('ru-RU')} руб × ${monthsToRetirement} мес`
    },
    {
      description: 'Рост от инвестиций',
      value: totalGrowth,
      formula: `${annualReturn}% годовых в течение ${yearsToRetirement} лет`
    },
    {
      description: 'Итоговые накопления',
      value: totalSavings,
      formula: 'Взносы + Рост от инвестиций'
    },
    {
      description: 'Месячная пенсия',
      value: monthlyPension,
      formula: pensionType === 'private' 
        ? '4% от накоплений в год ÷ 12'
        : 'Государственная пенсия + частная пенсия'
    }
  ]

  return {
    totalSavings: Math.round(totalSavings),
    monthlyPension: Math.round(monthlyPension),
    yearlyPension: Math.round(yearlyPension),
    totalContributions: Math.round(totalContributions),
    totalGrowth: Math.round(totalGrowth),
    yearsToRetirement,
    breakdown,
    monthlyProjection: monthlyProjection.filter((_, index) => index % 12 === 0) // Только годовые данные
  }
}
