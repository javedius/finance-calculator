'use client'

import { useState } from 'react'
import Input from './Input'
import Button from './Button'
import Card from './Card'
import ResultCard from './ResultCard'
import ResultSection from './ResultSection'
import DataTable from './DataTable'
import Select from './Select'
import { calculateInvestmentReturns, InvestmentReturnsParams } from '@/utils/investmentReturns'

export default function InvestmentReturnsCalculator() {
  const [formData, setFormData] = useState({
    initialAmount: '',
    monthlyContribution: '',
    investmentPeriod: '',
    expectedReturn: '',
    taxRate: '',
    reinvestment: true,
    compoundFrequency: 'monthly' as 'monthly' | 'quarterly' | 'yearly'
  })
  
  const [result, setResult] = useState<ReturnType<typeof calculateInvestmentReturns> | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.initialAmount || isNaN(Number(formData.initialAmount)) || Number(formData.initialAmount) < 0) {
      newErrors.initialAmount = 'Введите корректную начальную сумму'
    }
    
    if (!formData.monthlyContribution || isNaN(Number(formData.monthlyContribution)) || Number(formData.monthlyContribution) < 0) {
      newErrors.monthlyContribution = 'Введите корректную сумму ежемесячных взносов'
    }
    
    if (!formData.investmentPeriod || isNaN(Number(formData.investmentPeriod)) || Number(formData.investmentPeriod) <= 0 || Number(formData.investmentPeriod) > 50) {
      newErrors.investmentPeriod = 'Введите корректный период инвестирования (1-50 лет)'
    }
    
    if (!formData.expectedReturn || isNaN(Number(formData.expectedReturn)) || Number(formData.expectedReturn) < 0 || Number(formData.expectedReturn) > 100) {
      newErrors.expectedReturn = 'Введите корректную ожидаемую доходность (0-100%)'
    }
    
    if (!formData.taxRate || isNaN(Number(formData.taxRate)) || Number(formData.taxRate) < 0 || Number(formData.taxRate) > 50) {
      newErrors.taxRate = 'Введите корректную ставку налога (0-50%)'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCalculate = () => {
    if (!validateForm()) return
    
    const params: InvestmentReturnsParams = {
      initialAmount: Number(formData.initialAmount),
      monthlyContribution: Number(formData.monthlyContribution),
      investmentPeriod: Number(formData.investmentPeriod),
      expectedReturn: Number(formData.expectedReturn),
      taxRate: Number(formData.taxRate),
      reinvestment: formData.reinvestment,
      compoundFrequency: formData.compoundFrequency
    }
    
    const calculation = calculateInvestmentReturns(params)
    setResult(calculation)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="card-header">Калькулятор доходности инвестиций</h2>
        
        <div className="form-grid">
          <Input
            label="Начальная сумма (руб)"
            type="number"
            value={formData.initialAmount}
            onChange={(e) => handleInputChange('initialAmount', e.target.value)}
            error={errors.initialAmount}
            placeholder="100000"
            required
          />

          <Input
            label="Ежемесячные взносы (руб)"
            type="number"
            value={formData.monthlyContribution}
            onChange={(e) => handleInputChange('monthlyContribution', e.target.value)}
            error={errors.monthlyContribution}
            placeholder="10000"
            required
          />

          <Input
            label="Период инвестирования (лет)"
            type="number"
            value={formData.investmentPeriod}
            onChange={(e) => handleInputChange('investmentPeriod', e.target.value)}
            error={errors.investmentPeriod}
            placeholder="10"
            required
          />

          <Input
            label="Ожидаемая доходность (% в год)"
            type="number"
            step="0.1"
            value={formData.expectedReturn}
            onChange={(e) => handleInputChange('expectedReturn', e.target.value)}
            error={errors.expectedReturn}
            placeholder="12"
            required
          />

          <Input
            label="Налог на прибыль (% в год)"
            type="number"
            step="0.1"
            value={formData.taxRate}
            onChange={(e) => handleInputChange('taxRate', e.target.value)}
            error={errors.taxRate}
            placeholder="13"
            required
          />

          <Select
            label="Частота капитализации"
            value={formData.compoundFrequency}
            onChange={(e) => handleInputChange('compoundFrequency', e.target.value)}
            options={[
              { value: 'monthly', label: 'Ежемесячно' },
              { value: 'quarterly', label: 'Ежеквартально' },
              { value: 'yearly', label: 'Ежегодно' }
            ]}
          />

          <div className="md:col-span-2">
            <div className="checkbox-item">
              <input
                type="checkbox"
                checked={formData.reinvestment}
                onChange={(e) => handleInputChange('reinvestment', e.target.checked)}
              />
              <label>Реинвестирование (налог не взимается)</label>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={handleCalculate} className="w-full">
            Рассчитать доходность
          </Button>
        </div>
      </Card>

      {result && (
        <div className="space-y-6">
          <div className="grid-results">
            <ResultCard
              title="Итоговая сумма"
              value={`${result.finalAmount.toLocaleString('ru-RU')} руб`}
              description={`через ${formData.investmentPeriod} лет`}
              variant="success"
            />

            <ResultCard
              title="Общие инвестиции"
              value={`${result.totalInvested.toLocaleString('ru-RU')} руб`}
              description="вложено"
              variant="primary"
            />

            <ResultCard
              title="Чистый доход"
              value={`${result.netReturn.toLocaleString('ru-RU')} руб`}
              description="прибыль"
              variant="success"
            />

            <ResultCard
              title="Годовая доходность"
              value={`${result.annualizedReturn}%`}
              description="в год"
              variant="warning"
            />
          </div>

          <div className="grid-results-2">
            <ResultSection
              title="Детализация расчетов"
              items={result.breakdown.map((item) => ({
                label: item.description,
                value: typeof item.value === 'number' 
                  ? `${item.value.toLocaleString('ru-RU')}${item.description.includes('доходность') ? '%' : ' руб'}`
                  : item.value,
                variant: 'success' as const
              }))}
            />

            <ResultSection
              title="Сравнение с банковским депозитом"
              items={[
                {
                  label: 'Банковский депозит (5% годовых):',
                  value: `${Math.round(result.totalInvested * Math.pow(1.05, Number(formData.investmentPeriod))).toLocaleString('ru-RU')} руб`
                },
                {
                  label: 'Ваши инвестиции:',
                  value: `${result.finalAmount.toLocaleString('ru-RU')} руб`,
                  variant: 'success' as const
                },
                {
                  label: 'Дополнительная прибыль:',
                  value: `${(result.finalAmount - Math.round(result.totalInvested * Math.pow(1.05, Number(formData.investmentPeriod)))).toLocaleString('ru-RU')} руб`,
                  variant: 'success' as const,
                  className: 'result-divider'
                }
              ]}
            />
          </div>

          <Card>
            <h3 className="card-subheader">Прогноз роста инвестиций по годам</h3>
            <DataTable
              columns={[
                { key: 'year', label: 'Год', align: 'left' },
                { key: 'invested', label: 'Вложено', align: 'left' },
                { key: 'value', label: 'Стоимость', align: 'left' },
                { key: 'return', label: 'Доход', align: 'left' },
                { key: 'tax', label: 'Налог', align: 'left' }
              ]}
              data={result.monthlyProjection.slice(0, 10).map((row) => ({
                year: Math.floor(row.month / 12),
                invested: row.invested.toLocaleString('ru-RU'),
                value: row.value.toLocaleString('ru-RU'),
                return: row.return.toLocaleString('ru-RU'),
                tax: row.tax.toLocaleString('ru-RU')
              }))}
            />
          </Card>
        </div>
      )}
    </div>
  )
}
