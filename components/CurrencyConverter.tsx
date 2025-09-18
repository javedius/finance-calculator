'use client'

import { useState, useEffect } from 'react'
import Card from './Card'
import Input from './Input'
import Button from './Button'
import ResultCard from './ResultCard'
import ResultSection from './ResultSection'
import DataTable from './DataTable'
import Select from './Select'
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
          <h2 className="card-header">Конвертер валют</h2>
          <p className="card-description">
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
              required
            />
          </div>

          <div className="form-grid">
            <Select
              label="Из валюты"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              options={currencies.map((currency) => ({
                value: currency.code,
                label: `${currency.flag} ${currency.code} - ${currency.name}`
              }))}
            />
            
            <div className="flex items-end">
              <button
                onClick={handleSwapCurrencies}
                className="w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                title="Поменять валюты местами"
              >
                <svg className="w-5 h-5 mx-auto text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </button>
            </div>
            
            <Select
              label="В валюту"
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              options={currencies.map((currency) => ({
                value: currency.code,
                label: `${currency.flag} ${currency.code} - ${currency.name}`
              }))}
            />
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
          <div className="error-card">
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
        <div className="grid-results-2">
          <ResultCard
            title="Результат конвертации"
            value={formatCurrency(result.result, toCurrency)}
            description={`${formatCurrency(result.amount, fromCurrency)} = ${formatCurrency(result.result, toCurrency)}`}
            variant="primary"
          />

          <ResultSection
            title="Детали расчета"
            items={[
              { label: 'Курс:', value: `1 ${fromCurrency} = ${result.rate.toFixed(6)} ${toCurrency}` },
              { label: 'Дата курса:', value: result.date },
              { label: 'Исходная валюта:', value: `${fromCurrencyInfo?.flag} ${fromCurrencyInfo?.name}` },
              { label: 'Целевая валюта:', value: `${toCurrencyInfo?.flag} ${toCurrencyInfo?.name}` },
              { label: 'Обратный курс:', value: `1 ${toCurrency} = ${(1 / result.rate).toFixed(6)} ${fromCurrency}` },
              { label: 'Источник данных:', value: result.rate === 1 && result.from !== result.to ? 'Fallback курсы (примерные)' : 'Frankfurter API (ЕЦБ)' }
            ]}
          />
        </div>
      )}

      {showHistorical && historicalRates.length > 0 && (
        <Card>
          <h3 className="card-subheader">История курсов (последние 7 дней)</h3>
          <DataTable
            columns={[
              { key: 'date', label: 'Дата', align: 'left' },
              { key: 'rate', label: 'Курс', align: 'right' },
              { key: 'converted', label: `1 ${fromCurrency} =`, align: 'right' }
            ]}
            data={historicalRates.map((rate) => ({
              date: rate.date,
              rate: rate.rate.toFixed(6),
              converted: formatCurrency(1, toCurrency)
            }))}
          />
        </Card>
      )}

      <Card>
        <h3 className="card-subheader">Справочная информация</h3>
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
