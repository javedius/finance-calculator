'use client'

import { useState } from 'react'
import Input from './Input'
import Button from './Button'
import Card from './Card'
import { calculatePaybackPeriod, PaybackPeriodParams } from '@/utils/paybackPeriod'

export default function PaybackPeriodCalculator() {
  const [formData, setFormData] = useState({
    initialInvestment: '',
    monthlyCashFlow: '',
    annualGrowthRate: '',
    discountRate: '',
    projectLifetime: '',
    hasVariableCashFlow: false,
    variableCashFlow: [] as { year: number; amount: number }[]
  })
  
  const [result, setResult] = useState<ReturnType<typeof calculatePaybackPeriod> | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showVariableFlow, setShowVariableFlow] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.initialInvestment || isNaN(Number(formData.initialInvestment)) || Number(formData.initialInvestment) <= 0) {
      newErrors.initialInvestment = 'Введите корректную сумму начальных инвестиций'
    }
    
    if (!formData.monthlyCashFlow || isNaN(Number(formData.monthlyCashFlow)) || Number(formData.monthlyCashFlow) <= 0) {
      newErrors.monthlyCashFlow = 'Введите корректный ежемесячный денежный поток'
    }
    
    if (!formData.annualGrowthRate || isNaN(Number(formData.annualGrowthRate)) || Number(formData.annualGrowthRate) < 0 || Number(formData.annualGrowthRate) > 100) {
      newErrors.annualGrowthRate = 'Введите корректный рост денежного потока (0-100%)'
    }
    
    if (!formData.discountRate || isNaN(Number(formData.discountRate)) || Number(formData.discountRate) < 0 || Number(formData.discountRate) > 100) {
      newErrors.discountRate = 'Введите корректную ставку дисконтирования (0-100%)'
    }
    
    if (!formData.projectLifetime || isNaN(Number(formData.projectLifetime)) || Number(formData.projectLifetime) <= 0 || Number(formData.projectLifetime) > 50) {
      newErrors.projectLifetime = 'Введите корректный срок проекта (1-50 лет)'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCalculate = () => {
    if (!validateForm()) return
    
    const params: PaybackPeriodParams = {
      initialInvestment: Number(formData.initialInvestment),
      monthlyCashFlow: Number(formData.monthlyCashFlow),
      annualGrowthRate: Number(formData.annualGrowthRate),
      discountRate: Number(formData.discountRate),
      projectLifetime: Number(formData.projectLifetime),
      hasVariableCashFlow: formData.hasVariableCashFlow,
      variableCashFlow: formData.variableCashFlow
    }
    
    const calculation = calculatePaybackPeriod(params)
    setResult(calculation)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const addVariableCashFlow = () => {
    setFormData(prev => ({
      ...prev,
      variableCashFlow: [...prev.variableCashFlow, { year: 1, amount: 0 }]
    }))
  }

  const updateVariableCashFlow = (index: number, field: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      variableCashFlow: prev.variableCashFlow.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const removeVariableCashFlow = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variableCashFlow: prev.variableCashFlow.filter((_, i) => i !== index)
    }))
  }

  const formatPaybackPeriod = (months: number) => {
    if (months >= 12) {
      const years = Math.floor(months / 12)
      const remainingMonths = months % 12
      return `${years} лет ${remainingMonths > 0 ? remainingMonths + ' мес' : ''}`
    }
    return `${months} мес`
  }

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Калькулятор окупаемости проекта</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Начальные инвестиции (руб)"
            type="number"
            value={formData.initialInvestment}
            onChange={(e) => handleInputChange('initialInvestment', e.target.value)}
            error={errors.initialInvestment}
            placeholder="1000000"
          />

          <Input
            label="Ежемесячный денежный поток (руб)"
            type="number"
            value={formData.monthlyCashFlow}
            onChange={(e) => handleInputChange('monthlyCashFlow', e.target.value)}
            error={errors.monthlyCashFlow}
            placeholder="50000"
          />

          <Input
            label="Рост денежного потока (% в год)"
            type="number"
            step="0.1"
            value={formData.annualGrowthRate}
            onChange={(e) => handleInputChange('annualGrowthRate', e.target.value)}
            error={errors.annualGrowthRate}
            placeholder="5"
          />

          <Input
            label="Ставка дисконтирования (% в год)"
            type="number"
            step="0.1"
            value={formData.discountRate}
            onChange={(e) => handleInputChange('discountRate', e.target.value)}
            error={errors.discountRate}
            placeholder="10"
          />

          <Input
            label="Срок проекта (лет)"
            type="number"
            value={formData.projectLifetime}
            onChange={(e) => handleInputChange('projectLifetime', e.target.value)}
            error={errors.projectLifetime}
            placeholder="10"
          />

          <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.hasVariableCashFlow}
                onChange={(e) => {
                  handleInputChange('hasVariableCashFlow', e.target.checked)
                  setShowVariableFlow(e.target.checked)
                }}
                className="mr-2"
              />
              Переменный денежный поток по годам
            </label>
          </div>
        </div>

        {showVariableFlow && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Переменный денежный поток</h3>
            {formData.variableCashFlow.map((flow, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-white rounded border">
                <Input
                  label="Год"
                  type="number"
                  value={flow.year}
                  onChange={(e) => updateVariableCashFlow(index, 'year', Number(e.target.value))}
                  placeholder="1"
                />
                <Input
                  label="Годовой денежный поток (руб)"
                  type="number"
                  value={flow.amount}
                  onChange={(e) => updateVariableCashFlow(index, 'amount', Number(e.target.value))}
                  placeholder="600000"
                />
                <div className="flex items-end">
                  <Button
                    onClick={() => removeVariableCashFlow(index)}
                    variant="secondary"
                    className="w-full"
                  >
                    Удалить
                  </Button>
                </div>
              </div>
            ))}
            <Button onClick={addVariableCashFlow} variant="secondary" className="w-full">
              Добавить год
            </Button>
          </div>
        )}

        <div className="mt-6">
          <Button onClick={handleCalculate} className="w-full">
            Рассчитать окупаемость
          </Button>
        </div>
      </Card>

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Простой срок окупаемости</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {formatPaybackPeriod(result.simplePaybackPeriod)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  без учета дисконтирования
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Дисконтированный срок</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {formatPaybackPeriod(result.discountedPaybackPeriod)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  с учетом дисконтирования
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">NPV</h3>
              <div className="text-center">
                <div className={`text-3xl font-bold ${result.npv >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {result.npv.toLocaleString('ru-RU')} руб
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  чистая приведенная стоимость
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">IRR</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {result.irr}%
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  внутренняя норма доходности
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Финансовые показатели</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Общий денежный поток:</span>
                  <span className="font-medium">{result.totalCashFlow.toLocaleString('ru-RU')} руб</span>
                </div>
                <div className="flex justify-between">
                  <span>Общая прибыль:</span>
                  <span className="font-medium text-green-600">{result.totalReturn.toLocaleString('ru-RU')} руб</span>
                </div>
                <div className="flex justify-between">
                  <span>ROI (возврат инвестиций):</span>
                  <span className="font-medium text-blue-600">{result.roi}%</span>
                </div>
                <div className="flex justify-between">
                  <span>NPV:</span>
                  <span className={`font-medium ${result.npv >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {result.npv.toLocaleString('ru-RU')} руб
                  </span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Оценка проекта</h3>
              <div className="space-y-3">
                <div className={`p-3 rounded-lg ${result.npv >= 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="font-medium text-gray-900">
                    {result.npv >= 0 ? '✅ Проект выгоден' : '❌ Проект убыточен'}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {result.npv >= 0 
                      ? 'NPV положительный, проект принесет прибыль'
                      : 'NPV отрицательный, проект не окупится'
                    }
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg ${result.irr >= Number(formData.discountRate) ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                  <div className="font-medium text-gray-900">
                    IRR: {result.irr}% vs Ставка: {formData.discountRate}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {result.irr >= Number(formData.discountRate)
                      ? 'Внутренняя доходность выше ставки дисконтирования'
                      : 'Внутренняя доходность ниже ставки дисконтирования'
                    }
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Детализация расчетов</h3>
            <div className="space-y-3">
              {result.breakdown.map((item, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-3">
                  <div className="font-medium text-gray-900">{item.description}</div>
                  <div className="text-sm text-gray-600">{item.formula}</div>
                  <div className="text-sm font-medium text-blue-600">
                    {typeof item.value === 'number' 
                      ? item.value.toLocaleString('ru-RU') + (item.description.includes('ROI') || item.description.includes('IRR') ? '%' : ' руб')
                      : item.value
                    }
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Прогноз денежных потоков по годам</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Год</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Накопленный поток</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Дисконтированный поток</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Накопленный дисконтированный</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {result.monthlyProjection.slice(0, 10).map((row) => (
                    <tr key={row.month}>
                      <td className="px-4 py-2 text-sm text-gray-900">{Math.floor(row.month / 12)}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {row.cumulativeCashFlow.toLocaleString('ru-RU')}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {row.discountedCashFlow.toLocaleString('ru-RU')}
                      </td>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">
                        {row.cumulativeDiscounted.toLocaleString('ru-RU')}
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
