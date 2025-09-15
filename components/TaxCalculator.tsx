'use client'

import { useState } from 'react'
import Card from './Card'
import Input from './Input'
import Button from './Button'
import { calculateTax, formatCurrency, TAX_BRACKETS } from '@/utils/taxCalculator'

export default function TaxCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState<string>('')

  // Рассчитываем налог в реальном времени
  const calculation = (() => {
    const monthly = parseFloat(monthlyIncome)
    if (isNaN(monthly) || monthly <= 0) {
      return null
    }
    
    const annualIncome = monthly * 12
    return calculateTax(annualIncome)
  })()

  const handleClear = () => {
    setMonthlyIncome('')
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Расчет НДФЛ</h2>
          <p className="text-gray-600">
            Введите ваш месячный доход для расчета налога по прогрессивной шкале
          </p>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                label="Месячный доход (руб.)"
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                placeholder="Введите сумму месячного дохода"
                min="0"
              />
            </div>
            <div className="flex gap-2 items-end">
              <Button variant="secondary" onClick={handleClear}>
                Очистить
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {calculation && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Результаты расчета</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Месячный доход:</span>
                <span className="font-medium">{formatCurrency(calculation.monthlyIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Годовой доход:</span>
                <span className="font-medium">{formatCurrency(calculation.annualIncome)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>НДФЛ к уплате (в год):</span>
                <span className="font-semibold">{formatCurrency(calculation.totalTax)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>НДФЛ к уплате (в месяц):</span>
                <span className="font-semibold">{formatCurrency(calculation.totalTax / 12)}</span>
              </div>
              <div className="flex justify-between text-green-600 border-t pt-3">
                <span className="font-medium">Чистый доход (в год):</span>
                <span className="font-semibold">{formatCurrency(calculation.netIncome)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span className="font-medium">Чистый доход (в месяц):</span>
                <span className="font-semibold">{formatCurrency(calculation.netIncome / 12)}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Детализация по ставкам</h3>
            <div className="space-y-2">
              {calculation.brackets.map((item, index) => (
                <div key={index} className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{item.bracket.description}:</span>
                    <span>{formatCurrency(item.taxableAmount)} × {item.bracket.rate * 100}%</span>
                  </div>
                  <div className="text-right text-red-600 font-medium">
                    = {formatCurrency(item.taxAmount)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {calculation && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Детализация по месяцам</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2">Месяц</th>
                  <th className="text-right py-2">Доход</th>
                  <th className="text-right py-2">Ставка НДФЛ</th>
                  <th className="text-right py-2">Налог</th>
                  <th className="text-right py-2">Чистый доход</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 12 }, (_, index) => {
                  const monthNames = [
                    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
                  ]
                  
                  // Рассчитываем нарастающий доход к концу месяца
                  const cumulativeIncome = calculation.monthlyIncome * (index + 1)
                  
                  // Рассчитываем налог нарастающим итогом
                  const cumulativeTax = calculateTax(cumulativeIncome).totalTax
                  
                  // Налог за текущий месяц = нарастающий налог - налог за предыдущие месяцы
                  const previousCumulativeTax = index > 0 ? calculateTax(calculation.monthlyIncome * index).totalTax : 0
                  const monthlyTax = cumulativeTax - previousCumulativeTax
                  
                  const monthlyNetIncome = calculation.monthlyIncome - monthlyTax
                  
                  // Рассчитываем эффективную ставку налога для месяца
                  const effectiveRate = calculation.monthlyIncome > 0 ? (monthlyTax / calculation.monthlyIncome) * 100 : 0
                  
                  return (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-2 font-medium">{monthNames[index]}</td>
                      <td className="py-2 text-right">{formatCurrency(calculation.monthlyIncome)}</td>
                      <td className="py-2 text-right text-gray-600 font-medium">{effectiveRate.toFixed(1)}%</td>
                      <td className="py-2 text-right text-red-600">{formatCurrency(monthlyTax)}</td>
                      <td className="py-2 text-right text-green-600">{formatCurrency(monthlyNetIncome)}</td>
                    </tr>
                  )
                })}
                <tr className="border-t-2 border-gray-300 font-semibold">
                  <td className="py-2">Итого за год:</td>
                  <td className="py-2 text-right">{formatCurrency(calculation.annualIncome)}</td>
                  <td className="py-2 text-right text-gray-600 font-medium">{((calculation.totalTax / calculation.annualIncome) * 100).toFixed(1)}%</td>
                  <td className="py-2 text-right text-red-600">{formatCurrency(calculation.totalTax)}</td>
                  <td className="py-2 text-right text-green-600">{formatCurrency(calculation.netIncome)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Актуальные ставки НДФЛ в 2024 году</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">Доход в год</th>
                <th className="text-left py-2">Ставка</th>
                <th className="text-left py-2">Описание</th>
              </tr>
            </thead>
            <tbody>
              {TAX_BRACKETS.map((bracket, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2">
                    {bracket.min === 0 ? '0' : formatCurrency(bracket.min)} - 
                    {bracket.max ? ` ${formatCurrency(bracket.max)}` : ' ∞'}
                  </td>
                  <td className="py-2 font-medium">{bracket.rate * 100}%</td>
                  <td className="py-2 text-gray-600">{bracket.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
