'use client'

import { useState, useEffect } from 'react'
import Card from './Card'
import Input from './Input'
import Button from './Button'
import { 
  convertCurrency, 
  getSupportedCurrencies, 
  getCurrencyByCode,
  formatCurrency,
  getHistoricalRates,
  clearCache
} from '@/utils/currencyConverter'

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>('')
  const [fromCurrency, setFromCurrency] = useState<string>('USD')
  const [toCurrency, setToCurrency] = useState<string>('RUB')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const [showHistorical, setShowHistorical] = useState<boolean>(false)
  const [historicalRates, setHistoricalRates] = useState<any[]>([])

  const currencies = getSupportedCurrencies()

  // Автоматическая конвертация при изменении параметров
  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      handleConvert()
    }
  }, [fromCurrency, toCurrency])

  const handleConvert = async () => {
    const amountValue = parseFloat(amount)
    
    if (!amountValue || amountValue <= 0) {
      setError('Введите корректную сумму')
      setResult(null)
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      const conversion = await convertCurrency(
        amountValue,
        fromCurrency,
        toCurrency
      )
      
      if (conversion.error) {
        setError(conversion.error)
        setResult(null)
      } else {
        setResult(conversion)
        setError('')
      }
    } catch (err) {
      setError('Произошла ошибка при конвертации валют')
      setResult(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const handleClear = () => {
    setAmount('')
    setResult(null)
    setError('')
    setShowHistorical(false)
    setHistoricalRates([])
  }

  const handleShowHistorical = async () => {
    if (showHistorical) {
      setShowHistorical(false)
      setHistoricalRates([])
      return
    }

    setIsLoading(true)
    try {
      const rates = await getHistoricalRates(fromCurrency, toCurrency, 7)
      setHistoricalRates(rates)
      setShowHistorical(true)
    } catch (err) {
      setError('Не удалось загрузить исторические данные')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    clearCache()
    if (amount && parseFloat(amount) > 0) {
      handleConvert()
    }
  }

  const fromCurrencyInfo = getCurrencyByCode(fromCurrency)
  const toCurrencyInfo = getCurrencyByCode(toCurrency)

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Конвертер валют</h2>
          <p className="text-gray-600">
            Конвертируйте валюты по актуальным курсам в реальном времени
          </p>
          
          <div>
            <Input
              label="Сумма"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Введите сумму"
              min="0"
              step="0.01"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Из валюты
              </label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.flag} {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={handleSwapCurrencies}
                className="w-full p-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                title="Поменять валюты местами"
              >
                <svg className="w-5 h-5 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                В валюту
              </label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.flag} {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={handleConvert} 
              disabled={isLoading || !amount || parseFloat(amount) <= 0}
              className="flex-1 sm:flex-none"
            >
              {isLoading ? 'Конвертация...' : 'Конвертировать'}
            </Button>
            <Button 
              variant="secondary" 
              onClick={handleClear}
              className="flex-1 sm:flex-none"
            >
              Очистить
            </Button>
            <Button 
              variant="secondary" 
              onClick={handleRefresh}
              className="flex-1 sm:flex-none"
            >
              Обновить курсы
            </Button>
            <Button 
              variant="secondary" 
              onClick={handleShowHistorical}
              disabled={isLoading}
              className="flex-1 sm:flex-none"
            >
              {showHistorical ? 'Скрыть историю' : 'История курсов'}
            </Button>
          </div>
        </div>
      </Card>

      {error && (
        <Card>
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Ошибка</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {result && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Результат конвертации</h3>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatCurrency(result.result, toCurrency)}
                </div>
                <div className="text-gray-600">
                  {formatCurrency(result.amount, fromCurrency)} = {formatCurrency(result.result, toCurrency)}
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Курс:</span>
                  <span className="font-medium">
                    1 {fromCurrency} = {result.rate.toFixed(6)} {toCurrency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Дата курса:</span>
                  <span className="font-medium">{result.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Исходная валюта:</span>
                  <span className="font-medium">
                    {fromCurrencyInfo?.flag} {fromCurrencyInfo?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Целевая валюта:</span>
                  <span className="font-medium">
                    {toCurrencyInfo?.flag} {toCurrencyInfo?.name}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Детали расчета</h3>
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm text-gray-600 mb-1">Формула расчета:</div>
                <div className="font-mono text-sm">
                  {formatCurrency(result.amount, fromCurrency)} × {result.rate.toFixed(6)} = {formatCurrency(result.result, toCurrency)}
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <p className="mb-2">
                  <strong>Обратный курс:</strong> 1 {toCurrency} = {(1 / result.rate).toFixed(6)} {fromCurrency}
                </p>
                <p>
                  <strong>Источник данных:</strong> {result.rate === 1 && result.from !== result.to ? 'Fallback курсы (примерные)' : 'Frankfurter API (ЕЦБ)'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {showHistorical && historicalRates.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">История курсов (последние 7 дней)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2">Дата</th>
                  <th className="text-right py-2">Курс</th>
                  <th className="text-right py-2">1 {fromCurrency} =</th>
                </tr>
              </thead>
              <tbody>
                {historicalRates.map((rate, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2">{rate.date}</td>
                    <td className="py-2 text-right">{rate.rate.toFixed(6)}</td>
                    <td className="py-2 text-right font-medium">
                      {formatCurrency(1, toCurrency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Справочная информация</h3>
        <div className="space-y-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">О курсах валют:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Курсы обновляются в реальном времени с Frankfurter API</li>
              <li>Источник данных: Европейский центральный банк (ЕЦБ)</li>
              <li>Курсы актуальны на рабочие дни (пн-пт)</li>
              <li>Выходные и праздники показывают последний рабочий день</li>
              <li>При недоступности API используются примерные fallback курсы</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Поддерживаемые валюты:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {currencies.slice(0, 12).map((currency) => (
                <div key={currency.code} className="flex items-center space-x-2 text-xs">
                  <span>{currency.flag}</span>
                  <span>{currency.code}</span>
                </div>
              ))}
              <div className="text-gray-500 text-xs">
                и еще {currencies.length - 12} валют...
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Важные моменты:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Курсы могут отличаться от банковских (включают комиссии)</li>
              <li>Для точных расчетов обратитесь в банк</li>
              <li>Исторические курсы доступны за последние 30 дней</li>
              <li>Кэш курсов обновляется каждые 5 минут</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
