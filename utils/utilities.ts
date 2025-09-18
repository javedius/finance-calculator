export interface UtilitiesParams {
  region: string
  apartmentArea: number
  residents: number
  hasMetering: {
    electricity: boolean
    water: boolean
    heating: boolean
    gas: boolean
  }
  consumption: {
    electricity: number // кВт⋅ч
    water: number // куб.м
    heating: number // Гкал
    gas: number // куб.м
  }
  wasteDisposal: boolean
  wasteType: 'apartment' | 'house'
}

export interface UtilitiesResult {
  monthly: {
    electricity: number
    water: number
    heating: number
    gas: number
    waste: number
    total: number
  }
  yearly: {
    electricity: number
    water: number
    heating: number
    gas: number
    waste: number
    total: number
  }
  breakdown: {
    service: string
    consumption: number
    rate: number
    amount: number
    unit: string
  }[]
}

// Тарифы по регионам (примерные, в рублях)
const RATES = {
  moscow: {
    electricity: 5.47, // за кВт⋅ч
    water: 45.33, // за куб.м
    heating: 2500, // за Гкал
    gas: 6.17, // за куб.м
    waste: 0.016 // за кв.м
  },
  spb: {
    electricity: 4.12,
    water: 35.20,
    heating: 2200,
    gas: 5.50,
    waste: 0.014
  },
  moscow_region: {
    electricity: 4.20,
    water: 38.50,
    heating: 2100,
    gas: 5.80,
    waste: 0.012
  },
  other: {
    electricity: 3.50,
    water: 30.00,
    heating: 1800,
    gas: 5.00,
    waste: 0.010
  }
}

// Нормативы потребления (при отсутствии счетчиков)
const NORMATIVES = {
  electricity: 50, // кВт⋅ч на человека
  water: 4.5, // куб.м на человека
  heating: 0.02, // Гкал на кв.м
  gas: 10 // куб.м на человека
}

export function calculateUtilities(params: UtilitiesParams): UtilitiesResult {
  const { region, apartmentArea, residents, hasMetering, consumption, wasteDisposal, wasteType } = params
  
  const rates = RATES[region as keyof typeof RATES] || RATES.other
  
  // Расчет потребления
  const actualConsumption = {
    electricity: hasMetering.electricity ? consumption.electricity : residents * NORMATIVES.electricity,
    water: hasMetering.water ? consumption.water : residents * NORMATIVES.water,
    heating: hasMetering.heating ? consumption.heating : apartmentArea * NORMATIVES.heating,
    gas: hasMetering.gas ? consumption.gas : residents * NORMATIVES.gas
  }
  
  // Расчет стоимости услуг
  const monthly = {
    electricity: actualConsumption.electricity * rates.electricity,
    water: actualConsumption.water * rates.water,
    heating: actualConsumption.heating * rates.heating,
    gas: actualConsumption.gas * rates.gas,
    waste: wasteDisposal ? apartmentArea * rates.waste : 0,
    total: 0
  }
  
  monthly.total = monthly.electricity + monthly.water + monthly.heating + monthly.gas + monthly.waste
  
  const yearly = {
    electricity: monthly.electricity * 12,
    water: monthly.water * 12,
    heating: monthly.heating * 12,
    gas: monthly.gas * 12,
    waste: monthly.waste * 12,
    total: monthly.total * 12
  }
  
  const breakdown = [
    {
      service: 'Электроэнергия',
      consumption: actualConsumption.electricity,
      rate: rates.electricity,
      amount: monthly.electricity,
      unit: 'кВт⋅ч'
    },
    {
      service: 'Водоснабжение',
      consumption: actualConsumption.water,
      rate: rates.water,
      amount: monthly.water,
      unit: 'куб.м'
    },
    {
      service: 'Отопление',
      consumption: actualConsumption.heating,
      rate: rates.heating,
      amount: monthly.heating,
      unit: 'Гкал'
    },
    {
      service: 'Газоснабжение',
      consumption: actualConsumption.gas,
      rate: rates.gas,
      amount: monthly.gas,
      unit: 'куб.м'
    }
  ]
  
  if (wasteDisposal) {
    breakdown.push({
      service: 'Вывоз мусора',
      consumption: apartmentArea,
      rate: rates.waste,
      amount: monthly.waste,
      unit: 'кв.м'
    })
  }
  
  return {
    monthly: {
      electricity: Math.round(monthly.electricity),
      water: Math.round(monthly.water),
      heating: Math.round(monthly.heating),
      gas: Math.round(monthly.gas),
      waste: Math.round(monthly.waste),
      total: Math.round(monthly.total)
    },
    yearly: {
      electricity: Math.round(yearly.electricity),
      water: Math.round(yearly.water),
      heating: Math.round(yearly.heating),
      gas: Math.round(yearly.gas),
      waste: Math.round(yearly.waste),
      total: Math.round(yearly.total)
    },
    breakdown
  }
}
