'use client'

import { useState } from 'react'
import Input from './Input'
import Button from './Button'
import Card from './Card'
import { calculatePensionSavings, PensionSavingsParams } from '@/utils/pensionSavings'

export default function PensionSavingsCalculator() {
  const [formData, setFormData] = useState({
    currentAge: '',
    retirementAge: '',
    currentSavings: '',
    monthlyContribution: '',
    annualReturn: '',
    inflationRate: '',
    pensionType: 'mixed' as 'state' | 'private' | 'mixed',
    expectedPension: ''
  })
  
  const [result, setResult] = useState<ReturnType<typeof calculatePensionSavings> | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.currentAge || isNaN(Number(formData.currentAge)) || Number(formData.currentAge) < 18 || Number(formData.currentAge) > 80) {
      newErrors.currentAge = 'Введите корректный возраст (18-80 лет)'
    }
    
    if (!formData.retirementAge || isNaN(Number(formData.retirementAge)) || Number(formData.retirementAge) <= Number(formData.currentAge) || Number(formData.retirementAge) > 80) {
      newErrors.retirementAge = 'Возраст выхода на пенсию должен быть больше текущего возраста'
    }
    
    if (!formData.currentSavings || isNaN(Number(formData.currentSavings)) || Number(formData.currentSavings) < 0) {
      newErrors.currentSavings = 'Введите корректную сумму текущих накоплений'
    }
    
    if (!formData.monthlyContribution || isNaN(Number(formData.monthlyContribution)) || Number(formData.monthlyContribution) < 0) {
      newErrors.monthlyContribution = 'Введите корректную сумму ежемесячных взносов'
    }
    
    if (!formData.annualReturn || isNaN(Number(formData.annualReturn)) || Number(formData.annualReturn) < 0 || Number(formData.annualReturn) > 50) {
      newErrors.annualReturn = 'Введите корректную доходность (0-50%)'
    }
    
    if (!formData.inflationRate || isNaN(Number(formData.inflationRate)) || Number(formData.inflationRate) < 0 || Number(formData.inflationRate) > 20) {
      newErrors.inflationRate = 'Введите корректную инфляцию (0-20%)'
    }
    
    if (formData.pensionType === 'state' || formData.pensionType === 'mixed') {
      if (!formData.expectedPension || isNaN(Number(formData.expectedPension)) || Number(formData.expectedPension) < 0) {
        newErrors.expectedPension = 'Введите ожидаемую государственную пенсию'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCalculate = () => {
    if (!validateForm()) return
    
    const params: PensionSavingsParams = {
      currentAge: Number(formData.currentAge),
      retirementAge: Number(formData.retirementAge),
      currentSavings: Number(formData.currentSavings),
      monthlyContribution: Number(formData.monthlyContribution),
      annualReturn: Number(formData.annualReturn),
      inflationRate: Number(formData.inflationRate),
      pensionType: formData.pensionType,
      expectedPension: formData.expectedPension ? Number(formData.expectedPension) : 0
    }
    
    const calculation = calculatePensionSavings(params)
    setResult(calculation)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Калькулятор пенсии и накоплений</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Текущий возраст (лет)"
            type="number"
            value={formData.currentAge}
            onChange={(e) => handleInputChange('currentAge', e.target.value)}
            error={errors.currentAge}
            placeholder="30"
          />

          <Input
            label="Возраст выхода на пенсию (лет)"
            type="number"
            value={formData.retirementAge}
            onChange={(e) => handleInputChange('retirementAge', e.target.value)}
            error={errors.retirementAge}
            placeholder="65"
          />

          <Input
            label="Текущие накопления (руб)"
            type="number"
            value={formData.currentSavings}
            onChange={(e) => handleInputChange('currentSavings', e.target.value)}
            error={errors.currentSavings}
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
            label="Ожидаемая доходность (% в год)"
            type="number"
            step="0.1"
            value={formData.annualReturn}
            onChange={(e) => handleInputChange('annualReturn', e.target.value)}
            error={errors.annualReturn}
            placeholder="7"
          />

          <Input
            label="Инфляция (% в год)"
            type="number"
            step="0.1"
            value={formData.inflationRate}
            onChange={(e) => handleInputChange('inflationRate', e.target.value)}
            error={errors.inflationRate}
            placeholder="4"
          />

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тип пенсии
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="pensionType"
                  value="state"
                  checked={formData.pensionType === 'state'}
                  onChange={(e) => handleInputChange('pensionType', e.target.value)}
                  className="mr-2"
                />
                Только государственная пенсия
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="pensionType"
                  value="private"
                  checked={formData.pensionType === 'private'}
                  onChange={(e) => handleInputChange('pensionType', e.target.value)}
                  className="mr-2"
                />
                Только частная пенсия
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="pensionType"
                  value="mixed"
                  checked={formData.pensionType === 'mixed'}
                  onChange={(e) => handleInputChange('pensionType', e.target.value)}
                  className="mr-2"
                />
                Смешанная пенсия
              </label>
            </div>
          </div>

          {(formData.pensionType === 'state' || formData.pensionType === 'mixed') && (
            <Input
              label="Ожидаемая государственная пенсия (руб/мес)"
              type="number"
              value={formData.expectedPension}
              onChange={(e) => handleInputChange('expectedPension', e.target.value)}
              error={errors.expectedPension}
              placeholder="25000"
            />
          )}
        </div>

        <div className="mt-6">
          <Button onClick={handleCalculate} className="w-full">
            Рассчитать накопления
          </Button>
        </div>
      </Card>

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Итоговые накопления</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {result.totalSavings.toLocaleString('ru-RU')} руб
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  через {result.yearsToRetirement} лет
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Месячная пенсия</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {result.monthlyPension.toLocaleString('ru-RU')} руб
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  в месяц
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Годовая пенсия</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {result.yearlyPension.toLocaleString('ru-RU')} руб
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  в год
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Разбивка накоплений</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Ваши взносы:</span>
                  <span className="font-medium">{result.totalContributions.toLocaleString('ru-RU')} руб</span>
                </div>
                <div className="flex justify-between">
                  <span>Рост от инвестиций:</span>
                  <span className="font-medium text-green-600">{result.totalGrowth.toLocaleString('ru-RU')} руб</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Итого накоплений:</span>
                  <span className="text-blue-600">{result.totalSavings.toLocaleString('ru-RU')} руб</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Детализация расчетов</h3>
              <div className="space-y-3">
                {result.breakdown.map((item, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-3">
                    <div className="font-medium text-gray-900">{item.description}</div>
                    <div className="text-sm text-gray-600">{item.formula}</div>
                    <div className="text-sm font-medium text-blue-600">
                      {item.value.toLocaleString('ru-RU')} руб
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Прогноз накоплений по годам</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Год</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Возраст</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Накопления</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Взнос</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Рост</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {result.monthlyProjection.slice(0, 10).map((row, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm text-gray-900">{Math.floor(row.month / 12)}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">{row.age}</td>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">
                        {row.savings.toLocaleString('ru-RU')}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {row.contribution.toLocaleString('ru-RU')}
                      </td>
                      <td className="px-4 py-2 text-sm text-green-600">
                        {row.growth.toLocaleString('ru-RU')}
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
