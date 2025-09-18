export type PaymentType = 'annuity' | 'differentiated'

export interface EarlyPayment {
  month: number
  amount: number
  type: 'reduce_term' | 'reduce_payment'
  date: string // YYYY-MM-DD format
}

export interface MortgageCalculation {
  loanAmount: number
  downPayment: number
  interestRate: number
  termMonths: number
  paymentType: PaymentType
  loanDate: string
  monthlyPayment: number
  totalPayments: number
  totalInterest: number
  earlyPayments: EarlyPayment[]
  paymentSchedule: PaymentScheduleItem[]
}

export interface PaymentScheduleItem {
  month: number
  payment: number
  principal: number
  interest: number
  remainingBalance: number
  isEarlyPayment?: boolean
  earlyPaymentAmount?: number
}

export function calculateMortgage(
  loanAmount: number,
  downPayment: number,
  interestRate: number,
  termMonths: number,
  paymentType: PaymentType = 'annuity',
  loanDate: string = new Date().toISOString().split('T')[0],
  earlyPayments: EarlyPayment[] = []
): MortgageCalculation {
  const principal = loanAmount - downPayment
  const monthlyRate = interestRate / 100 / 12
  
  // Создаем копию досрочных платежей и сортируем по месяцам
  const sortedEarlyPayments = [...earlyPayments].sort((a, b) => a.month - b.month)
  
  // Рассчитываем базовый платеж в зависимости от типа
  let baseMonthlyPayment: number
  if (paymentType === 'annuity') {
    // Аннуитетный платеж - одинаковый каждый месяц
    baseMonthlyPayment = monthlyRate === 0 ? principal / termMonths : 
      principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / 
      (Math.pow(1 + monthlyRate, termMonths) - 1)
  } else {
    // Дифференцированный платеж - базовая часть + проценты
    // Базовая часть = principal / termMonths
    // Проценты = remainingBalance * monthlyRate
    baseMonthlyPayment = principal / termMonths
  }
  
  // Рассчитываем график платежей
  const paymentSchedule: PaymentScheduleItem[] = []
  let remainingBalance = principal
  let totalPayments = 0
  let totalInterest = 0
  let currentMonthlyPayment = baseMonthlyPayment
  let remainingTerm = termMonths
  
  for (let month = 1; month <= termMonths && remainingBalance > 0; month++) {
    const interestPayment = remainingBalance * monthlyRate
    let principalPayment: number
    let actualPayment: number
    
    if (paymentType === 'annuity') {
      // Аннуитетный платеж - пересчитываем при изменении остатка
      if (remainingTerm > 0 && remainingBalance > 0) {
        currentMonthlyPayment = monthlyRate === 0 ? remainingBalance / remainingTerm : 
          remainingBalance * (monthlyRate * Math.pow(1 + monthlyRate, remainingTerm)) / 
          (Math.pow(1 + monthlyRate, remainingTerm) - 1)
      }
      principalPayment = currentMonthlyPayment - interestPayment
      actualPayment = currentMonthlyPayment
    } else {
      // Дифференцированный платеж
      principalPayment = baseMonthlyPayment
      actualPayment = principalPayment + interestPayment
    }
    
    let isEarlyPayment = false
    let earlyPaymentAmount = 0
    
    // Проверяем, есть ли досрочный платеж в этом месяце
    const earlyPayment = sortedEarlyPayments.find(ep => ep.month === month)
    if (earlyPayment) {
      isEarlyPayment = true
      earlyPaymentAmount = earlyPayment.amount
      actualPayment += earlyPaymentAmount
      
      if (earlyPayment.type === 'reduce_term') {
        // Уменьшаем срок - увеличиваем основной платеж
        principalPayment += earlyPaymentAmount
      } else {
        // Уменьшаем сумму - уменьшаем остаток и пересчитываем платеж
        remainingBalance -= earlyPaymentAmount
        if (paymentType === 'annuity' && remainingTerm > 0 && remainingBalance > 0) {
          // Пересчитываем аннуитетный платеж с новым остатком
          currentMonthlyPayment = monthlyRate === 0 ? remainingBalance / remainingTerm : 
            remainingBalance * (monthlyRate * Math.pow(1 + monthlyRate, remainingTerm)) / 
            (Math.pow(1 + monthlyRate, remainingTerm) - 1)
          principalPayment = currentMonthlyPayment - interestPayment
          actualPayment = currentMonthlyPayment
        }
      }
    }
    
    // Корректируем платеж, если остаток меньше
    if (remainingBalance <= principalPayment) {
      principalPayment = remainingBalance
      actualPayment = principalPayment + interestPayment
    }
    
    remainingBalance -= principalPayment
    totalPayments += actualPayment
    totalInterest += interestPayment
    remainingTerm--
    
    paymentSchedule.push({
      month,
      payment: actualPayment,
      principal: principalPayment,
      interest: interestPayment,
      remainingBalance: Math.max(0, remainingBalance),
      isEarlyPayment,
      earlyPaymentAmount: isEarlyPayment ? earlyPaymentAmount : undefined
    })
    
    // Если остаток погашен, завершаем расчет
    if (remainingBalance <= 0) {
      break
    }
  }
  
  return {
    loanAmount,
    downPayment,
    interestRate,
    termMonths,
    paymentType,
    loanDate,
    monthlyPayment: paymentType === 'annuity' ? baseMonthlyPayment : paymentSchedule[0]?.payment || 0,
    totalPayments,
    totalInterest,
    earlyPayments: sortedEarlyPayments,
    paymentSchedule
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
  return `${rate.toFixed(2)}%`
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function getPaymentDate(loanDate: string, monthNumber: number): string {
  const startDate = new Date(loanDate)
  const paymentDate = new Date(startDate.getFullYear(), startDate.getMonth() + monthNumber, startDate.getDate())
  return paymentDate.toISOString().split('T')[0]
}

export function getMonthNumberFromDate(loanDate: string, paymentDate: string): number {
  const start = new Date(loanDate)
  const payment = new Date(paymentDate)
  
  const yearDiff = payment.getFullYear() - start.getFullYear()
  const monthDiff = payment.getMonth() - start.getMonth()
  
  return yearDiff * 12 + monthDiff
}
