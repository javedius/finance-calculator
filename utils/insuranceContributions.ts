export interface InsuranceContributionsParams {
  income: number
  type: 'ip' | 'self-employed'
  year: number
  hasEmployees: boolean
  employeeCount?: number
  averageSalary?: number
}

export interface InsuranceContributionsResult {
  monthly: {
    pension: number
    medical: number
    social: number
    total: number
  }
  yearly: {
    pension: number
    medical: number
    social: number
    total: number
  }
  breakdown: {
    description: string
    formula: string
    calculation: string
  }[]
}

// Ставки страховых взносов на 2024 год
const RATES_2024 = {
  ip: {
    pension: 0.22, // 22% с дохода до 1,917,000 руб
    medical: 0.051, // 5.1% с дохода до 1,917,000 руб
    social: 0.029, // 2.9% с дохода до 1,917,000 руб
    fixed: {
      pension: 36538.32, // Фиксированный взнос в ПФР
      medical: 8486.40, // Фиксированный взнос в ФФОМС
    }
  },
  'self-employed': {
    pension: 0.22,
    medical: 0.051,
    social: 0.029,
    fixed: {
      pension: 36538.32,
      medical: 8486.40,
    }
  }
}

// Максимальная база для начисления взносов в 2024 году
const MAX_BASE_2024 = 1917000

export function calculateInsuranceContributions(params: InsuranceContributionsParams): InsuranceContributionsResult {
  const { income, type, year, hasEmployees, employeeCount = 0, averageSalary = 0 } = params
  
  const rates = RATES_2024[type]
  const monthlyIncome = income / 12
  
  // Расчет взносов для ИП/самозанятого
  let pensionContribution = 0
  let medicalContribution = 0
  let socialContribution = 0
  
  if (type === 'ip' || type === 'self-employed') {
    // Фиксированные взносы
    const fixedPension = rates.fixed.pension
    const fixedMedical = rates.fixed.medical
    
    // Взносы с дохода (если доход больше минимального)
    const taxableIncome = Math.max(0, income - 300000) // Минимальный доход для дополнительных взносов
    const additionalPension = Math.min(taxableIncome * rates.pension, rates.pension * MAX_BASE_2024 - fixedPension)
    
    pensionContribution = fixedPension + Math.max(0, additionalPension)
    medicalContribution = fixedMedical
    socialContribution = 0 // Для ИП социальные взносы не уплачиваются
  }
  
  // Расчет взносов за сотрудников (если есть)
  if (hasEmployees && employeeCount > 0 && averageSalary > 0) {
    const monthlySalary = averageSalary
    const yearlySalary = averageSalary * 12
    
    // Взносы с зарплаты сотрудников
    const employeePension = Math.min(monthlySalary * rates.pension, rates.pension * MAX_BASE_2024 / 12)
    const employeeMedical = Math.min(monthlySalary * rates.medical, rates.medical * MAX_BASE_2024 / 12)
    const employeeSocial = Math.min(monthlySalary * rates.social, rates.social * MAX_BASE_2024 / 12)
    
    pensionContribution += employeePension * employeeCount
    medicalContribution += employeeMedical * employeeCount
    socialContribution += employeeSocial * employeeCount
  }
  
  const monthlyTotal = pensionContribution + medicalContribution + socialContribution
  const yearlyTotal = monthlyTotal * 12
  
  // Создание разбивки расчетов
  const breakdown = [
    {
      description: 'Пенсионные взносы',
      formula: type === 'ip' || type === 'self-employed' 
        ? 'Фиксированный взнос + 22% с дохода свыше 300,000 руб'
        : '22% с зарплаты сотрудников',
      calculation: `${pensionContribution.toLocaleString('ru-RU')} руб/мес`
    },
    {
      description: 'Медицинские взносы',
      formula: type === 'ip' || type === 'self-employed'
        ? 'Фиксированный взнос 8,486.40 руб/год'
        : '5.1% с зарплаты сотрудников',
      calculation: `${medicalContribution.toLocaleString('ru-RU')} руб/мес`
    },
    {
      description: 'Социальные взносы',
      formula: hasEmployees ? '2.9% с зарплаты сотрудников' : 'Не уплачиваются для ИП',
      calculation: `${socialContribution.toLocaleString('ru-RU')} руб/мес`
    }
  ]
  
  return {
    monthly: {
      pension: Math.round(pensionContribution),
      medical: Math.round(medicalContribution),
      social: Math.round(socialContribution),
      total: Math.round(monthlyTotal)
    },
    yearly: {
      pension: Math.round(pensionContribution * 12),
      medical: Math.round(medicalContribution * 12),
      social: Math.round(socialContribution * 12),
      total: Math.round(yearlyTotal)
    },
    breakdown
  }
}
