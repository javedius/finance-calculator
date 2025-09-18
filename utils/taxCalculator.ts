// Прогрессивная шкала НДФЛ в РФ с 2024 года
export interface TaxBracket {
  min: number
  max: number | null
  rate: number
  description: string
}

export const TAX_BRACKETS: TaxBracket[] = [
  {
    min: 0,
    max: 2500000,
    rate: 0.13,
    description: 'До 2,5 млн руб. в год'
  },
  {
    min: 2500000,
    max: 5000000,
    rate: 0.15,
    description: 'От 2,5 до 5 млн руб. в год'
  },
  {
    min: 5000000,
    max: 20000000,
    rate: 0.18,
    description: 'От 5 до 20 млн руб. в год'
  },
  {
    min: 20000000,
    max: 50000000,
    rate: 0.20,
    description: 'От 20 до 50 млн руб. в год'
  },
  {
    min: 50000000,
    max: null,
    rate: 0.22,
    description: 'Свыше 50 млн руб. в год'
  }
]

export interface TaxCalculation {
  annualIncome: number
  monthlyIncome: number
  totalTax: number
  netIncome: number
  brackets: {
    bracket: TaxBracket
    taxableAmount: number
    taxAmount: number
  }[]
}

export function calculateTax(annualIncome: number): TaxCalculation {
  const monthlyIncome = annualIncome / 12
  let totalTax = 0
  const brackets: TaxCalculation['brackets'] = []

  for (const bracket of TAX_BRACKETS) {
    const maxAmount = bracket.max || Infinity
    const taxableAmount = Math.max(0, Math.min(annualIncome, maxAmount) - bracket.min)
    
    if (taxableAmount > 0) {
      const taxAmount = taxableAmount * bracket.rate
      totalTax += taxAmount
      
      brackets.push({
        bracket,
        taxableAmount,
        taxAmount
      })
    }
  }

  return {
    annualIncome,
    monthlyIncome,
    totalTax,
    netIncome: annualIncome - totalTax,
    brackets
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
