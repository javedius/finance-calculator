'use client'

import { useState } from 'react'
import Input from './Input'
import Button from './Button'
import Card from './Card'
import { calculateFinesPenalties, FinesPenaltiesParams } from '@/utils/finesPenalties'

export default function FinesPenaltiesCalculator() {
  const [formData, setFormData] = useState({
    fineType: 'tax' as 'tax' | 'gibdd' | 'utilities' | 'custom',
    debtAmount: '',
    dueDate: '',
    paymentDate: '',
    customRate: '',
    customPeriod: 'daily' as 'daily' | 'monthly'
  })
  
  const [result, setResult] = useState<ReturnType<typeof calculateFinesPenalties> | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.debtAmount || isNaN(Number(formData.debtAmount)) || Number(formData.debtAmount) <= 0) {
      newErrors.debtAmount = 'Введите корректную сумму долга'
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Введите дату, до которой нужно было заплатить'
    }
    
    if (!formData.paymentDate) {
      newErrors.paymentDate = 'Введите дату фактической оплаты'
    }
    
    if (formData.fineType === 'custom') {
      if (!formData.customRate || isNaN(Number(formData.customRate)) || Number(formData.customRate) <= 0 || Number(formData.customRate) > 100) {
        newErrors.customRate = 'Введите корректную ставку пени (0-100%)'
      }
    }
    
    // Проверка, что дата оплаты не раньше даты платежа
    if (formData.dueDate && formData.paymentDate) {
      const due = new Date(formData.dueDate)
      const payment = new Date(formData.paymentDate)
      if (payment < due) {
        newErrors.paymentDate = 'Дата оплаты не может быть раньше срока платежа'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCalculate = () => {
    if (!validateForm()) return
    
    const params: FinesPenaltiesParams = {
      fineType: formData.fineType,
      debtAmount: Number(formData.debtAmount),
      dueDate: formData.dueDate,
      paymentDate: formData.paymentDate,
      customRate: formData.customRate ? Number(formData.customRate) : 0,
      customPeriod: formData.customPeriod
    }
    
    const calculation = calculateFinesPenalties(params)
    setResult(calculation)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getFineTypeDescription = (type: string) => {
    const descriptions = {
      tax: 'Налоговые пени (0.01% в день)',
      gibdd: 'Пени ГИБДД (0.01% в день)',
      utilities: 'Пени по коммунальным платежам (0.01% в день)',
      custom: 'Пользовательская ставка'
    }
    return descriptions[type as keyof typeof descriptions]
  }

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Калькулятор штрафов и пени</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тип задолженности
            </label>
            <select
              value={formData.fineType}
              onChange={(e) => handleInputChange('fineType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="tax">Налоги</option>
              <option value="gibdd">ГИБДД</option>
              <option value="utilities">Коммунальные платежи</option>
              <option value="custom">Пользовательская ставка</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {getFineTypeDescription(formData.fineType)}
            </p>
          </div>

          <Input
            label="Сумма долга (руб)"
            type="number"
            value={formData.debtAmount}
            onChange={(e) => handleInputChange('debtAmount', e.target.value)}
            error={errors.debtAmount}
            placeholder="10000"
          />

          <Input
            label="Дата, до которой нужно было заплатить"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleInputChange('dueDate', e.target.value)}
            error={errors.dueDate}
          />

          <Input
            label="Дата фактической оплаты"
            type="date"
            value={formData.paymentDate}
            onChange={(e) => handleInputChange('paymentDate', e.target.value)}
            error={errors.paymentDate}
          />

          {formData.fineType === 'custom' && (
            <>
              <Input
                label="Ставка пени (% в день)"
                type="number"
                step="0.001"
                value={formData.customRate}
                onChange={(e) => handleInputChange('customRate', e.target.value)}
                error={errors.customRate}
                placeholder="0.01"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Период начисления
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="customPeriod"
                      value="daily"
                      checked={formData.customPeriod === 'daily'}
                      onChange={(e) => handleInputChange('customPeriod', e.target.value)}
                      className="mr-2"
                    />
                    В день
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="customPeriod"
                      value="monthly"
                      checked={formData.customPeriod === 'monthly'}
                      onChange={(e) => handleInputChange('customPeriod', e.target.value)}
                      className="mr-2"
                    />
                    В месяц
                  </label>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-6">
          <Button onClick={handleCalculate} className="w-full">
            Рассчитать пени
          </Button>
        </div>
      </Card>

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Дней просрочки</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {result.daysOverdue}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  дней
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Сумма пени</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {result.penaltyAmount.toLocaleString('ru-RU')} руб
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  к доплате
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Общая сумма</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {result.totalAmount.toLocaleString('ru-RU')} руб
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  долг + пени
                </div>
              </div>
            </Card>
          </div>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Детализация расчетов</h3>
            <div className="space-y-3">
              {result.breakdown.map((item, index) => (
                <div key={index} className="border-l-4 border-red-200 pl-3">
                  <div className="font-medium text-gray-900">{item.description}</div>
                  <div className="text-sm text-gray-600">{item.formula}</div>
                  <div className="text-sm font-medium text-red-600">
                    {typeof item.value === 'number' 
                      ? item.value.toLocaleString('ru-RU') + (item.description.includes('Ставка') ? '%' : ' руб')
                      : item.value
                    }
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {result.daysOverdue > 0 && (
            <Card>
              <h3 className="text-lg font-semibold mb-4">Дополнительная информация</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-yellow-800">
                      Важно знать
                    </h4>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Пени начисляются за каждый день просрочки</li>
                        <li>Максимальная сумма пени не может превышать 20% от суммы долга</li>
                        <li>При частичной оплате пени пересчитываются с остатка долга</li>
                        <li>Рекомендуется погасить задолженность как можно скорее</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
