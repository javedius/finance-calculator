// Калькулятор конвертации валют с подключением к API

export interface Currency {
  code: string
  name: string
  symbol: string
  flag: string
}

export interface ExchangeRate {
  from: string
  to: string
  rate: number
  date: string
}

export interface CurrencyConversion {
  amount: number
  fromCurrency: string
  toCurrency: string
  rate: number
  result: number
  date: string
  error?: string
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'Доллар США', symbol: '$', flag: '🇺🇸' },
  { code: 'EUR', name: 'Евро', symbol: '€', flag: '🇪🇺' },
  { code: 'RUB', name: 'Российский рубль', symbol: '₽', flag: '🇷🇺' },
  { code: 'GBP', name: 'Британский фунт', symbol: '£', flag: '🇬🇧' },
  { code: 'JPY', name: 'Японская иена', symbol: '¥', flag: '🇯🇵' },
  { code: 'CNY', name: 'Китайский юань', symbol: '¥', flag: '🇨🇳' },
  { code: 'CHF', name: 'Швейцарский франк', symbol: 'CHF', flag: '🇨🇭' },
  { code: 'CAD', name: 'Канадский доллар', symbol: 'C$', flag: '🇨🇦' },
  { code: 'AUD', name: 'Австралийский доллар', symbol: 'A$', flag: '🇦🇺' },
  { code: 'NZD', name: 'Новозеландский доллар', symbol: 'NZ$', flag: '🇳🇿' },
  { code: 'SEK', name: 'Шведская крона', symbol: 'kr', flag: '🇸🇪' },
  { code: 'NOK', name: 'Норвежская крона', symbol: 'kr', flag: '🇳🇴' },
  { code: 'DKK', name: 'Датская крона', symbol: 'kr', flag: '🇩🇰' },
  { code: 'PLN', name: 'Польский злотый', symbol: 'zł', flag: '🇵🇱' },
  { code: 'CZK', name: 'Чешская крона', symbol: 'Kč', flag: '🇨🇿' },
  { code: 'HUF', name: 'Венгерский форинт', symbol: 'Ft', flag: '🇭🇺' },
  { code: 'TRY', name: 'Турецкая лира', symbol: '₺', flag: '🇹🇷' },
  { code: 'BRL', name: 'Бразильский реал', symbol: 'R$', flag: '🇧🇷' },
  { code: 'MXN', name: 'Мексиканское песо', symbol: '$', flag: '🇲🇽' },
  { code: 'INR', name: 'Индийская рупия', symbol: '₹', flag: '🇮🇳' },
  { code: 'KRW', name: 'Южнокорейская вона', symbol: '₩', flag: '🇰🇷' },
  { code: 'SGD', name: 'Сингапурский доллар', symbol: 'S$', flag: '🇸🇬' },
  { code: 'HKD', name: 'Гонконгский доллар', symbol: 'HK$', flag: '🇭🇰' },
  { code: 'ZAR', name: 'Южноафриканский рэнд', symbol: 'R', flag: '🇿🇦' }
]

// Кэш для хранения курсов валют
let exchangeRatesCache: { [key: string]: ExchangeRate } = {}
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 минут

// Fallback курсы валют (примерные, на случай недоступности API)
const FALLBACK_RATES: { [key: string]: { [key: string]: number } } = {
  'USD': {
    'EUR': 0.85,
    'RUB': 95.0,
    'GBP': 0.79,
    'JPY': 150.0,
    'CNY': 7.2,
    'CHF': 0.88,
    'CAD': 1.35,
    'AUD': 1.52,
    'NZD': 1.62,
    'SEK': 10.8,
    'NOK': 10.5,
    'DKK': 6.9,
    'PLN': 4.0,
    'CZK': 22.5,
    'HUF': 360.0,
    'TRY': 30.0,
    'BRL': 5.0,
    'MXN': 17.0,
    'INR': 83.0,
    'KRW': 1300.0,
    'SGD': 1.35,
    'HKD': 7.8,
    'ZAR': 18.5
  },
  'EUR': {
    'USD': 1.18,
    'RUB': 112.0,
    'GBP': 0.93,
    'JPY': 176.0,
    'CNY': 8.5,
    'CHF': 1.04,
    'CAD': 1.59,
    'AUD': 1.79,
    'NZD': 1.91,
    'SEK': 12.7,
    'NOK': 12.4,
    'DKK': 8.1,
    'PLN': 4.7,
    'CZK': 26.5,
    'HUF': 424.0,
    'TRY': 35.3,
    'BRL': 5.9,
    'MXN': 20.0,
    'INR': 98.0,
    'KRW': 1530.0,
    'SGD': 1.59,
    'HKD': 9.2,
    'ZAR': 21.8
  },
  'RUB': {
    'USD': 0.0105,
    'EUR': 0.0089,
    'GBP': 0.0083,
    'JPY': 1.58,
    'CNY': 0.076,
    'CHF': 0.0093,
    'CAD': 0.014,
    'AUD': 0.016,
    'NZD': 0.017,
    'SEK': 0.11,
    'NOK': 0.11,
    'DKK': 0.072,
    'PLN': 0.042,
    'CZK': 0.24,
    'HUF': 3.8,
    'TRY': 0.32,
    'BRL': 0.053,
    'MXN': 0.18,
    'INR': 0.87,
    'KRW': 13.7,
    'SGD': 0.014,
    'HKD': 0.082,
    'ZAR': 0.19
  }
}

// Получение fallback курса
function getFallbackRate(from: string, to: string, date?: string): ExchangeRate {
  if (from === to) {
    return {
      from,
      to,
      rate: 1,
      date: date || new Date().toISOString().split('T')[0]
    }
  }

  // Прямой курс
  if (FALLBACK_RATES[from] && FALLBACK_RATES[from][to]) {
    return {
      from,
      to,
      rate: FALLBACK_RATES[from][to],
      date: date || new Date().toISOString().split('T')[0]
    }
  }

  // Обратный курс
  if (FALLBACK_RATES[to] && FALLBACK_RATES[to][from]) {
    return {
      from,
      to,
      rate: 1 / FALLBACK_RATES[to][from],
      date: date || new Date().toISOString().split('T')[0]
    }
  }

  // Через USD как базовую валюту
  if (FALLBACK_RATES['USD'] && FALLBACK_RATES['USD'][from] && FALLBACK_RATES['USD'][to]) {
    const usdToFrom = FALLBACK_RATES['USD'][from]
    const usdToTo = FALLBACK_RATES['USD'][to]
    return {
      from,
      to,
      rate: usdToTo / usdToFrom,
      date: date || new Date().toISOString().split('T')[0]
    }
  }

  // Если ничего не найдено, возвращаем курс 1:1 с предупреждением
  console.warn(`Fallback курс не найден для ${from} -> ${to}, используем 1:1`)
  return {
    from,
    to,
    rate: 1,
    date: date || new Date().toISOString().split('T')[0]
  }
}

// Получение курса валют с альтернативными API
export async function getExchangeRate(from: string, to: string, date?: string): Promise<ExchangeRate> {
  const cacheKey = `${from}-${to}-${date || 'latest'}`
  
  // Проверяем кэш
  if (exchangeRatesCache[cacheKey] && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return exchangeRatesCache[cacheKey]
  }

  // Список API для попыток получения курса
  const apis = [
    {
      name: 'ExchangeRate-API',
      getUrl: (from: string, to: string, date?: string) => {
        if (date) {
          return `https://api.exchangerate-api.com/v4/history/${from}/${date}`
        }
        return `https://api.exchangerate-api.com/v4/latest/${from}`
      },
      parseResponse: (data: any, to: string) => {
        if (date) {
          return data.rates && data.rates[to] ? data.rates[to] : null
        }
        return data.rates && data.rates[to] ? data.rates[to] : null
      },
      getDate: (data: any) => date || data.date || new Date().toISOString().split('T')[0]
    },
    {
      name: 'Frankfurter API',
      getUrl: (from: string, to: string, date?: string) => {
        const baseUrl = 'https://api.frankfurter.app'
        return date 
          ? `${baseUrl}/${date}?from=${from}&to=${to}`
          : `${baseUrl}/latest?from=${from}&to=${to}`
      },
      parseResponse: (data: any, to: string) => {
        return data.rates && data.rates[to] ? data.rates[to] : null
      },
      getDate: (data: any) => data.date || new Date().toISOString().split('T')[0]
    },
    {
      name: 'Fixer API (demo)',
      getUrl: (from: string, to: string, date?: string) => {
        // Используем бесплатный демо-ключ (ограниченный)
        const accessKey = 'demo' // В реальном приложении нужен настоящий ключ
        return `http://data.fixer.io/api/${date || 'latest'}?access_key=${accessKey}&base=${from}&symbols=${to}`
      },
      parseResponse: (data: any, to: string) => {
        return data.success && data.rates && data.rates[to] ? data.rates[to] : null
      },
      getDate: (data: any) => data.date || new Date().toISOString().split('T')[0]
    }
  ]

  let lastError: Error | null = null

  // Пробуем каждый API по очереди
  for (const api of apis) {
    try {
      const url = api.getUrl(from, to, date)
      console.log(`Попытка получить курс с ${api.name}: ${url}`)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        // Добавляем таймаут
        signal: AbortSignal.timeout(10000) // 10 секунд
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      const rate = api.parseResponse(data, to)
      
      if (!rate) {
        throw new Error(`Курс для ${to} не найден в ответе API`)
      }
      
      const exchangeRate: ExchangeRate = {
        from,
        to,
        rate,
        date: api.getDate(data)
      }
      
      // Сохраняем в кэш
      exchangeRatesCache[cacheKey] = exchangeRate
      cacheTimestamp = Date.now()
      
      console.log(`Успешно получен курс с ${api.name}:`, exchangeRate)
      return exchangeRate
      
    } catch (error) {
      console.warn(`Ошибка с ${api.name}:`, error)
      lastError = error instanceof Error ? error : new Error('Неизвестная ошибка')
      continue // Пробуем следующий API
    }
  }

  // Если все API недоступны, используем fallback курсы
  console.warn('Все API недоступны, используем fallback курсы')
  return getFallbackRate(from, to, date)
}

// Конвертация валют
export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<CurrencyConversion> {
  if (amount <= 0) {
    return {
      amount: 0,
      fromCurrency,
      toCurrency,
      rate: 0,
      result: 0,
      date: new Date().toISOString().split('T')[0],
      error: 'Сумма должна быть больше нуля'
    }
  }

  if (fromCurrency === toCurrency) {
    return {
      amount,
      fromCurrency,
      toCurrency,
      rate: 1,
      result: amount,
      date: new Date().toISOString().split('T')[0]
    }
  }

  try {
    const exchangeRate = await getExchangeRate(fromCurrency, toCurrency)
    const result = amount * exchangeRate.rate

    return {
      amount,
      fromCurrency,
      toCurrency,
      rate: exchangeRate.rate,
      result,
      date: exchangeRate.date
    }
  } catch (error) {
    return {
      amount,
      fromCurrency,
      toCurrency,
      rate: 0,
      result: 0,
      date: new Date().toISOString().split('T')[0],
      error: error instanceof Error ? error.message : 'Неизвестная ошибка'
    }
  }
}

// Получение списка поддерживаемых валют
export function getSupportedCurrencies(): Currency[] {
  return SUPPORTED_CURRENCIES
}

// Поиск валюты по коду
export function getCurrencyByCode(code: string): Currency | undefined {
  return SUPPORTED_CURRENCIES.find(currency => currency.code === code)
}

// Форматирование валюты
export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = getCurrencyByCode(currencyCode)
  if (!currency) return `${amount.toFixed(2)} ${currencyCode}`

  // Специальная обработка для разных валют
  const options: Intl.NumberFormatOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }

  // Для японской иены и корейской воны не показываем десятичные знаки
  if (currencyCode === 'JPY' || currencyCode === 'KRW') {
    options.minimumFractionDigits = 0
    options.maximumFractionDigits = 0
  }

  const formatted = amount.toLocaleString('ru-RU', options)
  return `${currency.symbol}${formatted}`
}

// Получение исторических курсов (за последние 30 дней)
export async function getHistoricalRates(from: string, to: string, days: number = 30): Promise<ExchangeRate[]> {
  const rates: ExchangeRate[] = []
  const today = new Date()
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateString = date.toISOString().split('T')[0]
    
    try {
      const rate = await getExchangeRate(from, to, dateString)
      rates.push(rate)
    } catch (error) {
      console.warn(`Не удалось получить курс за ${dateString}:`, error)
    }
  }
  
  return rates.reverse() // Сортируем от старых к новым
}

// Очистка кэша
export function clearCache(): void {
  exchangeRatesCache = {}
  cacheTimestamp = 0
}
