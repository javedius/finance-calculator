'use client'

import { useState } from 'react'
import Input from './Input'
import Button from './Button'
import Card from './Card'
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
        <h2 className="text-xl font-semibold mb-4">Калькулятор доходности инвестиций</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Начальная сумма (руб)"
            type="number"
            value={formData.initialAmount}
            onChange={(e) => handleInputChange('initialAmount', e.target.value)}
            error={errors.initialAmount}
            placeholder="100000"
          />

          <Input
            label="Ежемесячные взносы (руб)"
            type="number"
            value={formData.monthlyContribution}
            onChange={(e) => handleInputChange('monthlyContribution', e.target.value)}
            error={errors.monthlyContribution}
            placeholder="10000"
          />

          <Input
            label="Период инвестирования (лет)"
            type="number"
            value={formData.investmentPeriod}
            onChange={(e) => handleInputChange('investmentPeriod', e.target.value)}
            error={errors.investmentPeriod}
            placeholder="10"
          />

          <Input
            label="Ожидаемая доходность (% в год)"
            type="number"
            step="0.1"
            value={formData.expectedReturn}
            onChange={(e) => handleInputChange('expectedReturn', e.target.value)}
            error={errors.expectedReturn}
            placeholder="12"
          />

          <Input
            label="Налог на прибыль (% в год)"
            type="number"
            step="0.1"
            value={formData.taxRate}
            onChange={(e) => handleInputChange('taxRate', e.target.value)}
            error={errors.taxRate}
            placeholder="13"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Частота капитализации
            </label>
            <select
              value={formData.compoundFrequency}
              onChange={(e) => handleInputChange('compoundFrequency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="monthly">Ежемесячно</option>
              <option value="quarterly">Ежеквартально</option>
              <option value="yearly">Ежегодно</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.reinvestment}
                onChange={(e) => handleInputChange('reinvestment', e.target.checked)}
                className="mr-2"
              />
              Реинвестирование (налог не взимается)
            </label>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Итоговая сумма</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {result.finalAmount.toLocaleString('ru-RU')} руб
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  через {formData.investmentPeriod} лет
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Общие инвестиции</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {result.totalInvested.toLocaleString('ru-RU')} руб
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  вложено
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Чистый доход</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {result.netReturn.toLocaleString('ru-RU')} руб
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  прибыль
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Годовая доходность</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {result.annualizedReturn}%
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  в год
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Детализация расчетов</h3>
              <div className="space-y-3">
                {result.breakdown.map((item, index) => (
                  <div key={index} className="border-l-4 border-green-200 pl-3">
                    <div className="font-medium text-gray-900">{item.description}</div>
                    <div className="text-sm text-gray-600">{item.formula}</div>
                    <div className="text-sm font-medium text-green-600">
                      {typeof item.value === 'number' 
                        ? item.value.toLocaleString('ru-RU') + (item.description.includes('доходность') ? '%' : ' руб')
                        : item.value
                      }
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Сравнение с банковским депозитом</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Банковский депозит (5% годовых):</span>
                  <span className="font-medium">
                    {Math.round(result.totalInvested * Math.pow(1.05, Number(formData.investmentPeriod))).toLocaleString('ru-RU')} руб
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Ваши инвестиции:</span>
                  <span className="font-medium text-green-600">
                    {result.finalAmount.toLocaleString('ru-RU')} руб
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Дополнительная прибыль:</span>
                  <span className="text-green-600">
                    {(result.finalAmount - Math.round(result.totalInvested * Math.pow(1.05, Number(formData.investmentPeriod)))).toLocaleString('ru-RU')} руб
                  </span>
                </div>
              </div>
            </Card>
          </div>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Прогноз роста инвестиций по годам</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Год</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Вложено</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Стоимость</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Доход</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Налог</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {result.monthlyProjection.slice(0, 10).map((row) => (
                    <tr key={row.month}>
                      <td className="px-4 py-2 text-sm text-gray-900">{Math.floor(row.month / 12)}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {row.invested.toLocaleString('ru-RU')}
                      </td>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">
                        {row.value.toLocaleString('ru-RU')}
                      </td>
                      <td className="px-4 py-2 text-sm text-green-600">
                        {row.return.toLocaleString('ru-RU')}
                      </td>
                      <td className="px-4 py-2 text-sm text-red-600">
                        {row.tax.toLocaleString('ru-RU')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
