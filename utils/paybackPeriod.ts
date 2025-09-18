export interface PaybackPeriodParams {
  initialInvestment: number
  monthlyCashFlow: number
  annualGrowthRate: number // % в год
  discountRate: number // % в год (ставка дисконтирования)
  projectLifetime: number // в годах
  hasVariableCashFlow: boolean
  variableCashFlow?: {
    year: number
    amount: number
  }[]
}

export interface PaybackPeriodResult {
  simplePaybackPeriod: number // в месяцах
  discountedPaybackPeriod: number // в месяцах
  npv: number // чистая приведенная стоимость
  irr: number // внутренняя норма доходности
  totalCashFlow: number
  totalReturn: number
  roi: number // возврат инвестиций
  breakdown: {
    description: string
    value: number
    formula: string
  }[]
  monthlyProjection: {
    month: number
    cumulativeCashFlow: number
    discountedCashFlow: number
    cumulativeDiscounted: number
  }[]
}

export function calculatePaybackPeriod(params: PaybackPeriodParams): PaybackPeriodResult {
  const {
    initialInvestment,
    monthlyCashFlow,
    annualGrowthRate,
    discountRate,
    projectLifetime,
    hasVariableCashFlow,
    variableCashFlow = []
  } = params

  const totalMonths = projectLifetime * 12
  const monthlyGrowthRate = annualGrowthRate / 12 / 100
  const monthlyDiscountRate = discountRate / 12 / 100

  let cumulativeCashFlow = -initialInvestment
  let cumulativeDiscounted = -initialInvestment
  let simplePaybackPeriod = -1
  let discountedPaybackPeriod = -1
  let totalCashFlow = -initialInvestment
  let totalDiscountedCashFlow = -initialInvestment
  const monthlyProjection = []

  // Расчет по месяцам
  for (let month = 1; month <= totalMonths; month++) {
    let currentCashFlow = monthlyCashFlow

    // Применяем рост, если есть
    if (annualGrowthRate > 0) {
      currentCashFlow = monthlyCashFlow * Math.pow(1 + monthlyGrowthRate, month - 1)
    }

    // Проверяем переменный денежный поток
    if (hasVariableCashFlow) {
      const year = Math.floor((month - 1) / 12) + 1
      const variableFlow = variableCashFlow.find(v => v.year === year)
      if (variableFlow) {
        currentCashFlow = variableFlow.amount / 12 // Распределяем годовую сумму по месяцам
      }
    }

    // Обновляем накопленный денежный поток
    cumulativeCashFlow += currentCashFlow
    totalCashFlow += currentCashFlow

    // Расчет дисконтированного денежного потока
    const discountedCashFlow = currentCashFlow / Math.pow(1 + monthlyDiscountRate, month)
    cumulativeDiscounted += discountedCashFlow
    totalDiscountedCashFlow += discountedCashFlow

    // Сохраняем данные для графика
    monthlyProjection.push({
      month,
      cumulativeCashFlow: Math.round(cumulativeCashFlow),
      discountedCashFlow: Math.round(discountedCashFlow),
      cumulativeDiscounted: Math.round(cumulativeDiscounted)
    })

    // Определяем простой срок окупаемости
    if (simplePaybackPeriod === -1 && cumulativeCashFlow >= 0) {
      simplePaybackPeriod = month
    }

    // Определяем дисконтированный срок окупаемости
    if (discountedPaybackPeriod === -1 && cumulativeDiscounted >= 0) {
      discountedPaybackPeriod = month
    }
  }

  const totalReturn = totalCashFlow + initialInvestment
  const roi = (totalReturn / initialInvestment) * 100
  const npv = totalDiscountedCashFlow

  // Упрощенный расчет IRR (методом подбора)
  let irr = 0
  for (let testRate = 0; testRate <= 100; testRate += 0.1) {
    const testMonthlyRate = testRate / 12 / 100
    let testNpv = -initialInvestment
    
    for (let month = 1; month <= totalMonths; month++) {
      let currentCashFlow = monthlyCashFlow
      if (annualGrowthRate > 0) {
        currentCashFlow = monthlyCashFlow * Math.pow(1 + monthlyGrowthRate, month - 1)
      }
      if (hasVariableCashFlow) {
        const year = Math.floor((month - 1) / 12) + 1
        const variableFlow = variableCashFlow.find(v => v.year === year)
        if (variableFlow) {
          currentCashFlow = variableFlow.amount / 12
        }
      }
      testNpv += currentCashFlow / Math.pow(1 + testMonthlyRate, month)
    }
    
    if (Math.abs(testNpv) < 100) { // Приблизительное равенство нулю
      irr = testRate
      break
    }
  }

  const breakdown = [
    {
      description: 'Начальные инвестиции',
      value: initialInvestment,
      formula: 'Сумма первоначальных вложений'
    },
    {
      description: 'Ежемесячный денежный поток',
      value: monthlyCashFlow,
      formula: 'Ожидаемый доход в месяц'
    },
    {
      description: 'Рост денежного потока',
      value: annualGrowthRate,
      formula: `${annualGrowthRate}% в год`
    },
    {
      description: 'Ставка дисконтирования',
      value: discountRate,
      formula: `${discountRate}% в год`
    },
    {
      description: 'Простой срок окупаемости',
      value: simplePaybackPeriod,
      formula: simplePaybackPeriod > 0 ? `${Math.floor(simplePaybackPeriod / 12)} лет ${simplePaybackPeriod % 12} мес` : 'Не окупается'
    },
    {
      description: 'Дисконтированный срок окупаемости',
      value: discountedPaybackPeriod,
      formula: discountedPaybackPeriod > 0 ? `${Math.floor(discountedPaybackPeriod / 12)} лет ${discountedPaybackPeriod % 12} мес` : 'Не окупается'
    },
    {
      description: 'Чистая приведенная стоимость (NPV)',
      value: npv,
      formula: 'Сумма дисконтированных денежных потоков'
    },
    {
      description: 'Внутренняя норма доходности (IRR)',
      value: irr,
      formula: 'Ставка, при которой NPV = 0'
    },
    {
      description: 'Общий денежный поток',
      value: totalCashFlow,
      formula: 'Сумма всех поступлений'
    },
    {
      description: 'Возврат инвестиций (ROI)',
      value: roi,
      formula: 'Отношение прибыли к инвестициям'
    }
  ]

  return {
    simplePaybackPeriod: simplePaybackPeriod > 0 ? simplePaybackPeriod : totalMonths,
    discountedPaybackPeriod: discountedPaybackPeriod > 0 ? discountedPaybackPeriod : totalMonths,
    npv: Math.round(npv),
    irr: Math.round(irr * 10) / 10,
    totalCashFlow: Math.round(totalCashFlow),
    totalReturn: Math.round(totalReturn),
    roi: Math.round(roi * 10) / 10,
    breakdown,
    monthlyProjection: monthlyProjection.filter((_, index) => index % 12 === 0) // Только годовые данные
  }
}
