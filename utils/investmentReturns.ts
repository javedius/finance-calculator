export interface InvestmentReturnsParams {
  initialAmount: number
  monthlyContribution: number
  investmentPeriod: number // в годах
  expectedReturn: number // % в год
  taxRate: number // % в год
  reinvestment: boolean
  compoundFrequency: 'monthly' | 'quarterly' | 'yearly'
}

export interface InvestmentReturnsResult {
  totalInvested: number
  finalAmount: number
  totalReturn: number
  netReturn: number
  taxAmount: number
  annualizedReturn: number
  breakdown: {
    description: string
    value: number
    formula: string
  }[]
  monthlyProjection: {
    month: number
    invested: number
    value: number
    return: number
    tax: number
  }[]
}

export function calculateInvestmentReturns(params: InvestmentReturnsParams): InvestmentReturnsResult {
  const {
    initialAmount,
    monthlyContribution,
    investmentPeriod,
    expectedReturn,
    taxRate,
    reinvestment,
    compoundFrequency
  } = params

  const totalMonths = investmentPeriod * 12
  const monthlyReturn = expectedReturn / 12 / 100
  const monthlyTaxRate = taxRate / 12 / 100

  let totalInvested = initialAmount
  let currentValue = initialAmount
  let totalReturn = 0
  let totalTax = 0
  const monthlyProjection = []

  // Расчет по месяцам
  for (let month = 1; month <= totalMonths; month++) {
    // Добавляем ежемесячный взнос
    if (month > 1) {
      totalInvested += monthlyContribution
      currentValue += monthlyContribution
    }

    // Расчет дохода за месяц
    const monthlyGain = currentValue * monthlyReturn
    currentValue += monthlyGain
    totalReturn += monthlyGain

    // Расчет налога (если не реинвестирование)
    let monthlyTax = 0
    if (!reinvestment) {
      monthlyTax = monthlyGain * monthlyTaxRate
      totalTax += monthlyTax
      currentValue -= monthlyTax
    }

    // Сохраняем данные для графика (каждый месяц)
    monthlyProjection.push({
      month,
      invested: totalInvested,
      value: Math.round(currentValue),
      return: Math.round(totalReturn),
      tax: Math.round(totalTax)
    })
  }

  const finalAmount = currentValue
  const netReturn = totalReturn - totalTax
  const annualizedReturn = Math.pow(finalAmount / initialAmount, 1 / investmentPeriod) - 1

  const breakdown = [
    {
      description: 'Начальная сумма',
      value: initialAmount,
      formula: 'Исходные инвестиции'
    },
    {
      description: 'Ежемесячные взносы',
      value: monthlyContribution * (totalMonths - 1),
      formula: `${monthlyContribution.toLocaleString('ru-RU')} руб × ${totalMonths - 1} мес`
    },
    {
      description: 'Общие инвестиции',
      value: totalInvested,
      formula: 'Начальная сумма + Ежемесячные взносы'
    },
    {
      description: 'Ожидаемая доходность',
      value: expectedReturn,
      formula: `${expectedReturn}% в год`
    },
    {
      description: 'Общий доход',
      value: totalReturn,
      formula: 'Рост от инвестиций'
    },
    {
      description: 'Налог на прибыль',
      value: totalTax,
      formula: `${taxRate}% от дохода`
    },
    {
      description: 'Чистый доход',
      value: netReturn,
      formula: 'Общий доход - Налог'
    },
    {
      description: 'Итоговая сумма',
      value: finalAmount,
      formula: 'Инвестиции + Чистый доход'
    },
    {
      description: 'Годовая доходность',
      value: annualizedReturn * 100,
      formula: 'Среднегодовая доходность'
    }
  ]

  return {
    totalInvested: Math.round(totalInvested),
    finalAmount: Math.round(finalAmount),
    totalReturn: Math.round(totalReturn),
    netReturn: Math.round(netReturn),
    taxAmount: Math.round(totalTax),
    annualizedReturn: Math.round(annualizedReturn * 100 * 100) / 100,
    breakdown,
    monthlyProjection: monthlyProjection.filter((_, index) => index % 12 === 0) // Только годовые данные
  }
}
