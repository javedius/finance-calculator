'use client'

import { useState } from 'react'
import Card from './Card'
import Input from './Input'
import Button from './Button'
import ResultCard from './ResultCard'
import ResultSection from './ResultSection'
import DataTable from './DataTable'
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
          <h2 className="card-header">Расчет НДФЛ</h2>
          <p className="card-description">
            Введите ваш месячный доход для расчета налога по прогрессивной шкале
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                label="Месячный доход (руб.)"
                type="number"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                placeholder="Введите сумму месячного дохода"
                min="0"
                required
              />
            </div>
            <div className="flex gap-2 items-end">
              <Button variant="secondary" onClick={handleClear} className="w-full sm:w-auto">
                Очистить
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {calculation && (
        <div className="grid-results-2">
          <ResultSection
            title="Результаты расчета"
            items={[
              { label: 'Месячный доход:', value: formatCurrency(calculation.monthlyIncome) },
              { label: 'Годовой доход:', value: formatCurrency(calculation.annualIncome) },
              { label: 'НДФЛ к уплате (в год):', value: formatCurrency(calculation.totalTax), variant: 'danger' },
              { label: 'НДФЛ к уплате (в месяц):', value: formatCurrency(calculation.totalTax / 12), variant: 'danger' },
              { label: 'Чистый доход (в год):', value: formatCurrency(calculation.netIncome), variant: 'success', className: 'result-divider' },
              { label: 'Чистый доход (в месяц):', value: formatCurrency(calculation.netIncome / 12), variant: 'success' }
            ]}
          />

          <ResultSection
            title="Детализация по ставкам"
            items={calculation.brackets.map((item, index) => ({
              label: `${item.bracket.description}:`,
              value: `${formatCurrency(item.taxableAmount)} × ${item.bracket.rate * 100}% = ${formatCurrency(item.taxAmount)}`,
              variant: 'danger' as const
            }))}
          />
        </div>
      )}

      {calculation && (
        <Card>
          <h3 className="card-subheader">Детализация по месяцам</h3>
          <DataTable
            columns={[
              { key: 'month', label: 'Месяц', align: 'left' },
              { key: 'income', label: 'Доход', align: 'right', className: 'hidden sm:table-cell' },
              { key: 'rate', label: 'Ставка', align: 'right' },
              { key: 'tax', label: 'Налог', align: 'right' },
              { key: 'netIncome', label: 'Чистый доход', align: 'right', className: 'hidden sm:table-cell' }
            ]}
            data={[
              ...Array.from({ length: 12 }, (_, index) => {
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
                
                return {
                  month: monthNames[index],
                  income: formatCurrency(calculation.monthlyIncome),
                  rate: `${effectiveRate.toFixed(1)}%`,
                  tax: formatCurrency(monthlyTax),
                  netIncome: formatCurrency(monthlyNetIncome)
                }
              }),
              {
                month: 'Итого за год:',
                income: formatCurrency(calculation.annualIncome),
                rate: `${((calculation.totalTax / calculation.annualIncome) * 100).toFixed(1)}%`,
                tax: formatCurrency(calculation.totalTax),
                netIncome: formatCurrency(calculation.netIncome)
              }
            ]}
          />
        </Card>
      )}

      <Card>
        <h3 className="card-subheader">Актуальные ставки НДФЛ в 2024 году</h3>
        <DataTable
          columns={[
            { key: 'range', label: 'Доход в год', align: 'left' },
            { key: 'rate', label: 'Ставка', align: 'left' },
            { key: 'description', label: 'Описание', align: 'left' }
          ]}
          data={TAX_BRACKETS.map((bracket) => ({
            range: bracket.min === 0 ? '0' : `${formatCurrency(bracket.min)} - ${bracket.max ? formatCurrency(bracket.max) : '∞'}`,
            rate: `${bracket.rate * 100}%`,
            description: bracket.description
          }))}
        />
      </Card>
    </div>
  )
}
