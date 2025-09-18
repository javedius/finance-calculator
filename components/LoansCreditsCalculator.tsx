'use client'

import { useState } from 'react'
import Input from './Input'
import Button from './Button'
import Card from './Card'
import { calculateLoansCredits, LoansCreditsParams } from '@/utils/loansCredits'

export default function LoansCreditsCalculator() {
  const [formData, setFormData] = useState({
    loanAmount: '',
    interestRate: '',
    loanTerm: '',
    paymentType: 'annuity' as 'annuity' | 'differentiated',
    earlyPayments: [] as { amount: number; month: number; type: 'reduce_payment' | 'reduce_term' }[]
  })
  
  const [result, setResult] = useState<ReturnType<typeof calculateLoansCredits> | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showEarlyPayments, setShowEarlyPayments] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.loanAmount || isNaN(Number(formData.loanAmount)) || Number(formData.loanAmount) <= 0) {
      newErrors.loanAmount = 'Введите корректную сумму кредита'
    }
    
    if (!formData.interestRate || isNaN(Number(formData.interestRate)) || Number(formData.interestRate) <= 0 || Number(formData.interestRate) > 100) {
      newErrors.interestRate = 'Введите корректную процентную ставку (0-100%)'
    }
    
    if (!formData.loanTerm || isNaN(Number(formData.loanTerm)) || Number(formData.loanTerm) <= 0 || Number(formData.loanTerm) > 50) {
      newErrors.loanTerm = 'Введите корректный срок кредита (1-50 лет)'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCalculate = () => {
    if (!validateForm()) return
    
    const params: LoansCreditsParams = {
      loanAmount: Number(formData.loanAmount),
      interestRate: Number(formData.interestRate),
      loanTerm: Number(formData.loanTerm),
      paymentType: formData.paymentType,
      earlyPayments: formData.earlyPayments
    }
    
    const calculation = calculateLoansCredits(params)
    setResult(calculation)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const addEarlyPayment = () => {
    setFormData(prev => ({
      ...prev,
      earlyPayments: [...prev.earlyPayments, { amount: 0, month: 1, type: 'reduce_payment' }]
    }))
  }

  const updateEarlyPayment = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      earlyPayments: prev.earlyPayments.map((ep, i) => 
        i === index ? { ...ep, [field]: value } : ep
      )
    }))
  }

  const removeEarlyPayment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      earlyPayments: prev.earlyPayments.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Калькулятор кредитов и займов</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Сумма кредита (руб)"
            type="number"
            value={formData.loanAmount}
            onChange={(e) => handleInputChange('loanAmount', e.target.value)}
            error={errors.loanAmount}
            placeholder="1000000"
          />

          <Input
            label="Процентная ставка (% в год)"
            type="number"
            step="0.1"
            value={formData.interestRate}
            onChange={(e) => handleInputChange('interestRate', e.target.value)}
            error={errors.interestRate}
            placeholder="12"
          />

          <Input
            label="Срок кредита (лет)"
            type="number"
            value={formData.loanTerm}
            onChange={(e) => handleInputChange('loanTerm', e.target.value)}
            error={errors.loanTerm}
            placeholder="10"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тип платежей
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentType"
                  value="annuity"
                  checked={formData.paymentType === 'annuity'}
                  onChange={(e) => handleInputChange('paymentType', e.target.value)}
                  className="mr-2"
                />
                Аннуитетные (равные)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentType"
                  value="differentiated"
                  checked={formData.paymentType === 'differentiated'}
                  onChange={(e) => handleInputChange('paymentType', e.target.value)}
                  className="mr-2"
                />
                Дифференцированные (убывающие)
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Button 
            onClick={() => setShowEarlyPayments(!showEarlyPayments)}
            variant="secondary"
            className="w-full"
          >
            {showEarlyPayments ? 'Скрыть' : 'Показать'} досрочные платежи
          </Button>
        </div>

        {showEarlyPayments && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Досрочные платежи</h3>
            {formData.earlyPayments.map((payment, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-white rounded border">
                <Input
                  label="Месяц"
                  type="number"
                  value={payment.month}
                  onChange={(e) => updateEarlyPayment(index, 'month', Number(e.target.value))}
                  placeholder="12"
                />
                <Input
                  label="Сумма (руб)"
                  type="number"
                  value={payment.amount}
                  onChange={(e) => updateEarlyPayment(index, 'amount', Number(e.target.value))}
                  placeholder="50000"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Тип платежа
                  </label>
                  <select
                    value={payment.type}
                    onChange={(e) => updateEarlyPayment(index, 'type', e.target.value as 'reduce_payment' | 'reduce_term')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="reduce_payment">Уменьшить платеж</option>
                    <option value="reduce_term">Уменьшить срок</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={() => removeEarlyPayment(index)}
                    variant="secondary"
                    className="w-full"
                  >
                    Удалить
                  </Button>
                </div>
              </div>
            ))}
            <Button onClick={addEarlyPayment} variant="secondary" className="w-full">
              Добавить досрочный платеж
            </Button>
          </div>
        )}

        <div className="mt-6">
          <Button onClick={handleCalculate} className="w-full">
            Рассчитать кредит
          </Button>
        </div>
      </Card>

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Ежемесячный платеж</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {result.monthlyPayment.toLocaleString('ru-RU')} руб
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  в месяц
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Общая сумма выплат</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {result.totalAmount.toLocaleString('ru-RU')} руб
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  за весь срок
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Переплата</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">
                  {result.totalInterest.toLocaleString('ru-RU')} руб
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  по процентам
                </div>
              </div>
            </Card>

            {result.earlyPaymentSavings && (
              <Card>
                <h3 className="text-lg font-semibold mb-4">Экономия</h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">
                    {result.earlyPaymentSavings.interestSaved.toLocaleString('ru-RU')} руб
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    от досрочных платежей
                  </div>
                </div>
              </Card>
            )}
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
                      ? item.value.toLocaleString('ru-RU') + ' руб'
                      : item.value
                    }
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">График платежей (первые 12 месяцев)</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Месяц</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Платеж</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Основной долг</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Проценты</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Остаток</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {result.paymentSchedule.slice(0, 12).map((row) => (
                    <tr key={row.month}>
                      <td className="px-4 py-2 text-sm text-gray-900">{row.month}</td>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">
                        {row.payment.toLocaleString('ru-RU')}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {row.principal.toLocaleString('ru-RU')}
                      </td>
                      <td className="px-4 py-2 text-sm text-red-600">
                        {row.interest.toLocaleString('ru-RU')}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {row.balance.toLocaleString('ru-RU')}
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
