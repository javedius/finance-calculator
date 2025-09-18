export interface LoansCreditsParams {
  loanAmount: number
  interestRate: number
  loanTerm: number
  paymentType: 'annuity' | 'differentiated'
  earlyPayments?: {
    amount: number
    month: number
    type: 'reduce_payment' | 'reduce_term'
  }[]
}

export interface LoansCreditsResult {
  monthlyPayment: number
  totalPayments: number
  totalInterest: number
  totalAmount: number
  paymentSchedule: {
    month: number
    payment: number
    principal: number
    interest: number
    balance: number
  }[]
  earlyPaymentSavings?: {
    interestSaved: number
    monthsSaved: number
  }
  breakdown: {
    description: string
    value: number
    formula: string
  }[]
}

export function calculateLoansCredits(params: LoansCreditsParams): LoansCreditsResult {
  const { loanAmount, interestRate, loanTerm, paymentType, earlyPayments = [] } = params
  
  const monthlyRate = interestRate / 12 / 100
  const totalMonths = loanTerm * 12
  
  let paymentSchedule: {
    month: number
    payment: number
    principal: number
    interest: number
    balance: number
  }[] = []
  
  let totalPayments = 0
  let totalInterest = 0
  let currentBalance = loanAmount
  let earlyPaymentSavings = { interestSaved: 0, monthsSaved: 0 }
  
  if (paymentType === 'annuity') {
    // Аннуитетные платежи
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                          (Math.pow(1 + monthlyRate, totalMonths) - 1)
    
    for (let month = 1; month <= totalMonths; month++) {
      const interestPayment = currentBalance * monthlyRate
      const principalPayment = monthlyPayment - interestPayment
      const earlyPayment = earlyPayments.find(ep => ep.month === month)
      
      let actualPayment = monthlyPayment
      let actualPrincipal = principalPayment
      
      if (earlyPayment) {
        if (earlyPayment.type === 'reduce_payment') {
          // Уменьшение платежа
          currentBalance -= earlyPayment.amount
          actualPayment = monthlyPayment
        } else {
          // Уменьшение срока
          currentBalance -= (principalPayment + earlyPayment.amount)
          actualPayment = monthlyPayment + earlyPayment.amount
          actualPrincipal = principalPayment + earlyPayment.amount
        }
      } else {
        currentBalance -= principalPayment
      }
      
      if (currentBalance <= 0) {
        currentBalance = 0
        actualPayment = principalPayment + interestPayment
        actualPrincipal = principalPayment
      }
      
      paymentSchedule.push({
        month,
        payment: Math.round(actualPayment),
        principal: Math.round(actualPrincipal),
        interest: Math.round(interestPayment),
        balance: Math.round(Math.max(0, currentBalance))
      })
      
      totalPayments += actualPayment
      totalInterest += interestPayment
      
      if (currentBalance <= 0) break
    }
  } else {
    // Дифференцированные платежи
    const principalPayment = loanAmount / totalMonths
    
    for (let month = 1; month <= totalMonths; month++) {
      const interestPayment = currentBalance * monthlyRate
      const earlyPayment = earlyPayments.find(ep => ep.month === month)
      
      let actualPayment = principalPayment + interestPayment
      let actualPrincipal = principalPayment
      
      if (earlyPayment) {
        if (earlyPayment.type === 'reduce_payment') {
          // Уменьшение платежа
          currentBalance -= earlyPayment.amount
        } else {
          // Уменьшение срока
          currentBalance -= (principalPayment + earlyPayment.amount)
          actualPayment = principalPayment + interestPayment + earlyPayment.amount
          actualPrincipal = principalPayment + earlyPayment.amount
        }
      } else {
        currentBalance -= principalPayment
      }
      
      if (currentBalance <= 0) {
        currentBalance = 0
        actualPayment = principalPayment + interestPayment
        actualPrincipal = principalPayment
      }
      
      paymentSchedule.push({
        month,
        payment: Math.round(actualPayment),
        principal: Math.round(actualPrincipal),
        interest: Math.round(interestPayment),
        balance: Math.round(Math.max(0, currentBalance))
      })
      
      totalPayments += actualPayment
      totalInterest += interestPayment
      
      if (currentBalance <= 0) break
    }
  }
  
  const totalAmount = totalPayments
  const monthlyPayment = paymentSchedule.length > 0 ? paymentSchedule[0].payment : 0
  
  // Расчет экономии от досрочных платежей
  if (earlyPayments.length > 0) {
    const originalTotalInterest = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                                 (Math.pow(1 + monthlyRate, totalMonths) - 1) * totalMonths - loanAmount
    earlyPaymentSavings = {
      interestSaved: Math.round(originalTotalInterest - totalInterest),
      monthsSaved: totalMonths - paymentSchedule.length
    }
  }
  
  const breakdown = [
    {
      description: 'Сумма кредита',
      value: loanAmount,
      formula: 'Исходная сумма займа'
    },
    {
      description: 'Процентная ставка',
      value: interestRate,
      formula: `${interestRate}% годовых`
    },
    {
      description: 'Срок кредита',
      value: loanTerm,
      formula: `${loanTerm} лет (${totalMonths} месяцев)`
    },
    {
      description: 'Ежемесячный платеж',
      value: monthlyPayment,
      formula: paymentType === 'annuity' 
        ? 'Аннуитетный платеж'
        : 'Дифференцированный платеж'
    },
    {
      description: 'Общая сумма выплат',
      value: totalAmount,
      formula: 'Сумма всех платежей'
    },
    {
      description: 'Переплата по процентам',
      value: totalInterest,
      formula: 'Общие выплаты - Сумма кредита'
    }
  ]
  
  if (earlyPaymentSavings.interestSaved > 0) {
    breakdown.push({
      description: 'Экономия от досрочных платежей',
      value: earlyPaymentSavings.interestSaved,
      formula: 'Сэкономленные проценты'
    })
  }
  
  return {
    monthlyPayment: Math.round(monthlyPayment),
    totalPayments: Math.round(totalPayments),
    totalInterest: Math.round(totalInterest),
    totalAmount: Math.round(totalAmount),
    paymentSchedule,
    earlyPaymentSavings: earlyPaymentSavings.interestSaved > 0 ? earlyPaymentSavings : undefined,
    breakdown
  }
}
