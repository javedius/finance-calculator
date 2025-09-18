'use client'

import { useState } from 'react'
import Input from './Input'
import Button from './Button'
import Card from './Card'
import { calculateInsuranceContributions, InsuranceContributionsParams } from '@/utils/insuranceContributions'

export default function InsuranceContributionsCalculator() {
  const [formData, setFormData] = useState({
    income: '',
    type: 'ip' as 'ip' | 'self-employed',
    year: 2024,
    hasEmployees: false,
    employeeCount: '',
    averageSalary: ''
  })
  
  const [result, setResult] = useState<ReturnType<typeof calculateInsuranceContributions> | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.income || isNaN(Number(formData.income)) || Number(formData.income) <= 0) {
      newErrors.income = 'Введите корректный годовой доход'
    }
    
    if (formData.hasEmployees) {
      if (!formData.employeeCount || isNaN(Number(formData.employeeCount)) || Number(formData.employeeCount) <= 0) {
        newErrors.employeeCount = 'Введите количество сотрудников'
      }
      if (!formData.averageSalary || isNaN(Number(formData.averageSalary)) || Number(formData.averageSalary) <= 0) {
        newErrors.averageSalary = 'Введите среднюю зарплату сотрудников'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCalculate = () => {
    if (!validateForm()) return
    
    const params: InsuranceContributionsParams = {
      income: Number(formData.income),
      type: formData.type,
      year: formData.year,
      hasEmployees: formData.hasEmployees,
      employeeCount: formData.hasEmployees ? Number(formData.employeeCount) : 0,
      averageSalary: formData.hasEmployees ? Number(formData.averageSalary) : 0
    }
    
    const calculation = calculateInsuranceContributions(params)
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
        <h2 className="text-xl font-semibold mb-4">Калькулятор страховых взносов</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тип деятельности
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="ip"
                  checked={formData.type === 'ip'}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="mr-2"
                />
                Индивидуальный предприниматель (ИП)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="self-employed"
                  checked={formData.type === 'self-employed'}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="mr-2"
                />
                Самозанятый
              </label>
            </div>
          </div>

          <Input
            label="Годовой доход (руб)"
            type="number"
            value={formData.income}
            onChange={(e) => handleInputChange('income', e.target.value)}
            error={errors.income}
            placeholder="1000000"
          />

          <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.hasEmployees}
                onChange={(e) => handleInputChange('hasEmployees', e.target.checked)}
                className="mr-2"
              />
              У меня есть сотрудники
            </label>
          </div>

          {formData.hasEmployees && (
            <>
              <Input
                label="Количество сотрудников"
                type="number"
                value={formData.employeeCount}
                onChange={(e) => handleInputChange('employeeCount', e.target.value)}
                error={errors.employeeCount}
                placeholder="5"
              />

              <Input
                label="Средняя зарплата сотрудника (руб/мес)"
                type="number"
                value={formData.averageSalary}
                onChange={(e) => handleInputChange('averageSalary', e.target.value)}
                error={errors.averageSalary}
                placeholder="50000"
              />
            </>
          )}
        </div>

        <div className="mt-6">
          <Button onClick={handleCalculate} className="w-full">
            Рассчитать страховые взносы
          </Button>
        </div>
      </Card>

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold mb-4">Ежемесячные взносы</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Пенсионные взносы:</span>
                <span className="font-medium">{result.monthly.pension.toLocaleString('ru-RU')} руб</span>
              </div>
              <div className="flex justify-between">
                <span>Медицинские взносы:</span>
                <span className="font-medium">{result.monthly.medical.toLocaleString('ru-RU')} руб</span>
              </div>
              <div className="flex justify-between">
                <span>Социальные взносы:</span>
                <span className="font-medium">{result.monthly.social.toLocaleString('ru-RU')} руб</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Итого в месяц:</span>
                <span className="text-blue-600">{result.monthly.total.toLocaleString('ru-RU')} руб</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Годовые взносы</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Пенсионные взносы:</span>
                <span className="font-medium">{result.yearly.pension.toLocaleString('ru-RU')} руб</span>
              </div>
              <div className="flex justify-between">
                <span>Медицинские взносы:</span>
                <span className="font-medium">{result.yearly.medical.toLocaleString('ru-RU')} руб</span>
              </div>
              <div className="flex justify-between">
                <span>Социальные взносы:</span>
                <span className="font-medium">{result.yearly.social.toLocaleString('ru-RU')} руб</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Итого в год:</span>
                <span className="text-blue-600">{result.yearly.total.toLocaleString('ru-RU')} руб</span>
              </div>
            </div>
          </Card>

          <Card className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Разбивка расчетов</h3>
            <div className="space-y-4">
              {result.breakdown.map((item, index) => (
                <div key={index} className="border-l-4 border-blue-200 pl-4">
                  <h4 className="font-medium text-gray-900">{item.description}</h4>
                  <p className="text-sm text-gray-600 mt-1">{item.formula}</p>
                  <p className="text-sm font-medium text-blue-600 mt-1">{item.calculation}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
