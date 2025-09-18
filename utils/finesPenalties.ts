export interface FinesPenaltiesParams {
  fineType: 'tax' | 'gibdd' | 'utilities' | 'custom'
  debtAmount: number
  dueDate: string
  paymentDate: string
  customRate?: number
  customPeriod?: 'daily' | 'monthly'
}

export interface FinesPenaltiesResult {
  daysOverdue: number
  penaltyAmount: number
  totalAmount: number
  breakdown: {
    description: string
    value: number
    formula: string
  }[]
  dailyPenalty: number
}

// Ставки пени по типам
const PENALTY_RATES = {
  tax: {
    rate: 0.0001, // 0.01% в день
    maxRate: 0.2, // Максимум 20% от суммы долга
    description: 'Налоговые пени (0.01% в день)'
  },
  gibdd: {
    rate: 0.0001, // 0.01% в день
    maxRate: 0.2, // Максимум 20% от суммы долга
    description: 'Пени ГИБДД (0.01% в день)'
  },
  utilities: {
    rate: 0.0001, // 0.01% в день
    maxRate: 0.2, // Максимум 20% от суммы долга
    description: 'Пени по коммунальным платежам (0.01% в день)'
  },
  custom: {
    rate: 0, // Будет установлена пользователем
    maxRate: 1, // Максимум 100% от суммы долга
    description: 'Пользовательская ставка'
  }
}

export function calculateFinesPenalties(params: FinesPenaltiesParams): FinesPenaltiesResult {
  const { fineType, debtAmount, dueDate, paymentDate, customRate = 0, customPeriod = 'daily' } = params
  
  const due = new Date(dueDate)
  const payment = new Date(paymentDate)
  const daysOverdue = Math.max(0, Math.ceil((payment.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)))
  
  let penaltyRate = PENALTY_RATES[fineType].rate
  let maxPenaltyRate = PENALTY_RATES[fineType].maxRate
  
  if (fineType === 'custom') {
    penaltyRate = customRate / 100
    if (customPeriod === 'monthly') {
      penaltyRate = penaltyRate / 30 // Конвертируем месячную ставку в дневную
    }
  }
  
  // Расчет пени
  let penaltyAmount = 0
  let dailyPenalty = 0
  
  if (daysOverdue > 0) {
    dailyPenalty = debtAmount * penaltyRate
    penaltyAmount = dailyPenalty * daysOverdue
    
    // Ограничение максимальной суммы пени
    const maxPenalty = debtAmount * maxPenaltyRate
    penaltyAmount = Math.min(penaltyAmount, maxPenalty)
  }
  
  const totalAmount = debtAmount + penaltyAmount
  
  const breakdown = [
    {
      description: 'Сумма долга',
      value: debtAmount,
      formula: 'Исходная сумма задолженности'
    },
    {
      description: 'Дней просрочки',
      value: daysOverdue,
      formula: `С ${due.toLocaleDateString('ru-RU')} по ${payment.toLocaleDateString('ru-RU')}`
    },
    {
      description: 'Ставка пени',
      value: penaltyRate * 100,
      formula: `${(penaltyRate * 100).toFixed(4)}% в день`
    },
    {
      description: 'Пени в день',
      value: dailyPenalty,
      formula: `${debtAmount.toLocaleString('ru-RU')} × ${(penaltyRate * 100).toFixed(4)}%`
    },
    {
      description: 'Общая сумма пени',
      value: penaltyAmount,
      formula: `${dailyPenalty.toLocaleString('ru-RU')} × ${daysOverdue} дней`
    },
    {
      description: 'К доплате',
      value: totalAmount,
      formula: 'Сумма долга + Пени'
    }
  ]
  
  // Добавляем информацию о максимальном ограничении, если оно применимо
  if (penaltyAmount >= debtAmount * maxPenaltyRate) {
    breakdown.push({
      description: 'Максимальное ограничение',
      value: debtAmount * maxPenaltyRate,
      formula: `Максимум ${(maxPenaltyRate * 100)}% от суммы долга`
    })
  }
  
  return {
    daysOverdue,
    penaltyAmount: Math.round(penaltyAmount),
    totalAmount: Math.round(totalAmount),
    breakdown,
    dailyPenalty: Math.round(dailyPenalty)
  }
}
