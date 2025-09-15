'use client'

import { useState } from 'react'
import Card from './Card'
import Input from './Input'
import Button from './Button'
import { calculateMortgage, formatCurrency, formatPercent, formatDate, EarlyPayment, MortgageCalculation, PaymentType } from '@/utils/mortgageCalculator'
import EarlyPaymentModal from './EarlyPaymentModal'

export default function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState<string>('')
  const [downPayment, setDownPayment] = useState<string>('')
  const [interestRate, setInterestRate] = useState<string>('')
  const [termValue, setTermValue] = useState<string>('')
  const [termType, setTermType] = useState<'years' | 'months'>('years')
  const [paymentType, setPaymentType] = useState<PaymentType>('annuity')
  const [loanDate, setLoanDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [earlyPayments, setEarlyPayments] = useState<EarlyPayment[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Рассчитываем ипотеку в реальном времени
  const calculation = (() => {
    const loan = parseFloat(loanAmount)
    const down = parseFloat(downPayment) || 0
    const rate = parseFloat(interestRate)
    const term = parseFloat(termValue)
    
    if (isNaN(loan) || loan <= 0 || isNaN(rate) || rate < 0 || isNaN(term) || term <= 0) {
      return null
    }
    
    const termMonths = termType === 'years' ? term * 12 : term
    
    // Проверяем ограничение в 30 лет (360 месяцев)
    if (termMonths > 360) {
      return null
    }
    
    return calculateMortgage(loan, down, rate, termMonths, paymentType, loanDate, earlyPayments)
  })()

  const addEarlyPayment = (payment: EarlyPayment) => {
    setEarlyPayments([...earlyPayments, payment])
  }

  const removeEarlyPayment = (index: number) => {
    setEarlyPayments(earlyPayments.filter((_, i) => i !== index))
  }

  const clearAll = () => {
    setLoanAmount('')
    setDownPayment('')
    setInterestRate('')
    setTermValue('')
    setPaymentType('annuity')
    setLoanDate(new Date().toISOString().split('T')[0])
    setEarlyPayments([])
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Расчет ипотеки</h2>
          <p className="text-gray-600">
            Введите параметры ипотеки для расчета ежемесячных платежей
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Сумма кредита (руб.)"
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="Введите сумму кредита"
              min="0"
            />
            
            <Input
              label="Первоначальный взнос (руб.)"
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
              placeholder="Введите сумму взноса"
              min="0"
            />
            
            <Input
              label="Процентная ставка (%)"
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="Введите ставку"
              min="0"
              step="0.01"
            />
            
            <div className="space-y-2">
              <label className="label">Дата взятия кредита</label>
              <input
                type="date"
                value={loanDate}
                onChange={(e) => setLoanDate(e.target.value)}
                className="input-field"
              />
            </div>
            
            <div className="space-y-2">
              <label className="label">Срок кредита (максимум 30 лет)</label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={termValue}
                  onChange={(e) => setTermValue(e.target.value)}
                  placeholder="Введите срок"
                  min="1"
                  max={termType === 'years' ? '30' : '360'}
                  step="1"
                  className="flex-1"
                />
                <select
                  value={termType}
                  onChange={(e) => setTermType(e.target.value as 'years' | 'months')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="years">лет</option>
                  <option value="months">месяцев</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="label">Тип платежей</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentType"
                  value="annuity"
                  checked={paymentType === 'annuity'}
                  onChange={(e) => setPaymentType(e.target.value as PaymentType)}
                  className="mr-2"
                />
                <span>Аннуитетные (равные платежи)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentType"
                  value="differentiated"
                  checked={paymentType === 'differentiated'}
                  onChange={(e) => setPaymentType(e.target.value as PaymentType)}
                  className="mr-2"
                />
                <span>Дифференцированные (убывающие платежи)</span>
              </label>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
              Добавить досрочное погашение
            </Button>
            <Button variant="secondary" onClick={clearAll} className="w-full sm:w-auto">
              Очистить все
            </Button>
          </div>
        </div>
      </Card>

      {earlyPayments.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Досрочные платежи</h3>
          <div className="space-y-2">
            {earlyPayments.map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{formatDate(payment.date)}</div>
                  <div className="text-sm text-gray-600">
                    {payment.month} месяц • {formatCurrency(payment.amount)} • 
                    {payment.type === 'reduce_term' ? ' уменьшить срок' : ' уменьшить сумму'}
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => removeEarlyPayment(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  Удалить
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {termValue && parseFloat(termValue) > 0 && (() => {
        const term = parseFloat(termValue)
        const termMonths = termType === 'years' ? term * 12 : term
        if (termMonths > 360) {
          return (
            <Card>
              <div className="text-center py-8">
                <div className="text-red-600 text-lg font-semibold mb-2">
                  Превышен максимальный срок кредита
                </div>
                <p className="text-gray-600">
                  Максимальный срок кредита составляет 30 лет (360 месяцев)
                </p>
              </div>
            </Card>
          )
        }
        return null
      })()}

      {calculation && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Основные параметры</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Сумма кредита:</span>
                <span className="font-medium">{formatCurrency(calculation.loanAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Первоначальный взнос:</span>
                <span className="font-medium">{formatCurrency(calculation.downPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Сумма к погашению:</span>
                <span className="font-medium">{formatCurrency(calculation.loanAmount - calculation.downPayment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Процентная ставка:</span>
                <span className="font-medium">{formatPercent(calculation.interestRate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Дата взятия кредита:</span>
                <span className="font-medium">{formatDate(calculation.loanDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Срок кредита:</span>
                <span className="font-medium">{calculation.termMonths} месяцев</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Тип платежей:</span>
                <span className="font-medium">
                  {calculation.paymentType === 'annuity' ? 'Аннуитетные' : 'Дифференцированные'}
                </span>
              </div>
              <div className="flex justify-between text-blue-600 border-t pt-3">
                <span className="font-medium">
                  {calculation.paymentType === 'annuity' ? 'Текущий платеж:' : 'Первый платеж:'}
                </span>
                <span className="font-semibold">
                  {formatCurrency(calculation.paymentSchedule[calculation.paymentSchedule.length - 1]?.payment || calculation.monthlyPayment)}
                </span>
              </div>
              {calculation.paymentType === 'differentiated' && (
                <div className="flex justify-between text-blue-600">
                  <span className="font-medium">Последний платеж:</span>
                  <span className="font-semibold">
                    {formatCurrency(calculation.paymentSchedule[calculation.paymentSchedule.length - 1]?.payment || 0)}
                  </span>
                </div>
              )}
              {calculation.paymentType === 'annuity' && calculation.paymentSchedule.length > 1 && (
                <div className="flex justify-between text-gray-600">
                  <span className="text-sm">Изначальный платеж:</span>
                  <span className="text-sm">{formatCurrency(calculation.monthlyPayment)}</span>
                </div>
              )}
              <div className="flex justify-between text-red-600">
                <span>Общая сумма платежей:</span>
                <span className="font-semibold">{formatCurrency(calculation.totalPayments)}</span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Переплата по процентам:</span>
                <span className="font-semibold">{formatCurrency(calculation.totalInterest)}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Полный график платежей</h3>
            <div className="overflow-x-auto max-h-96 -mx-4 sm:mx-0">
              <div className="min-w-full px-4 sm:px-0">
                <table className="w-full text-xs sm:text-sm">
                  <thead className="sticky top-0 bg-white">
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2">Месяц</th>
                      <th className="text-right py-2">Платеж</th>
                      <th className="text-right py-2 hidden sm:table-cell">Основной долг</th>
                      <th className="text-right py-2 hidden sm:table-cell">Проценты</th>
                      <th className="text-right py-2">Остаток</th>
                    </tr>
                  </thead>
                <tbody>
                  {calculation.paymentSchedule.map((payment) => (
                    <tr key={payment.month} className={`border-b border-gray-100 hover:bg-gray-50 ${payment.isEarlyPayment ? 'bg-green-50' : ''}`}>
                      <td className="py-2 font-medium">
                        {payment.month}
                        {payment.isEarlyPayment && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              ДП
                            </span>
                            <span className="text-xs text-green-600 font-medium">
                              {formatCurrency(payment.earlyPaymentAmount || 0)}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="py-2 text-right">
                        <div className="font-medium">{formatCurrency(payment.payment)}</div>
                        {payment.isEarlyPayment && (
                          <div className="text-xs text-gray-500">
                            Базовый: {formatCurrency(payment.payment - (payment.earlyPaymentAmount || 0))}
                          </div>
                        )}
                      </td>
                      <td className="py-2 text-right hidden sm:table-cell">
                        <div>{formatCurrency(payment.principal)}</div>
                        {payment.isEarlyPayment && (
                          <div className="text-xs text-green-600">
                            +{formatCurrency(payment.earlyPaymentAmount || 0)}
                          </div>
                        )}
                      </td>
                      <td className="py-2 text-right text-red-600 hidden sm:table-cell">{formatCurrency(payment.interest)}</td>
                      <td className="py-2 text-right">{formatCurrency(payment.remainingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      )}

      <EarlyPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addEarlyPayment}
        loanDate={loanDate}
        maxMonths={calculation?.termMonths || 360}
      />
    </div>
  )
}
