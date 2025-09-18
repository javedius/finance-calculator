'use client'

import { useState } from 'react'
import Card from './Card'
import Input from './Input'
import Button from './Button'
import ResultCard from './ResultCard'
import ResultSection from './ResultSection'
import DataTable from './DataTable'
import Select from './Select'
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
          <h2 className="card-header">Расчет ипотеки</h2>
          <p className="card-description">
            Введите параметры ипотеки для расчета ежемесячных платежей
          </p>
          
          <div className="form-grid">
            <Input
              label="Сумма кредита (руб.)"
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              placeholder="Введите сумму кредита"
              min="0"
              required
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
              required
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
                  required
                />
                <Select
                  value={termType}
                  onChange={(e) => setTermType(e.target.value as 'years' | 'months')}
                  options={[
                    { value: 'years', label: 'лет' },
                    { value: 'months', label: 'месяцев' }
                  ]}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="label">Тип платежей</label>
            <div className="checkbox-group">
              <div className="checkbox-item">
                <input
                  type="radio"
                  name="paymentType"
                  value="annuity"
                  checked={paymentType === 'annuity'}
                  onChange={(e) => setPaymentType(e.target.value as PaymentType)}
                />
                <label>Аннуитетные (равные платежи)</label>
              </div>
              <div className="checkbox-item">
                <input
                  type="radio"
                  name="paymentType"
                  value="differentiated"
                  checked={paymentType === 'differentiated'}
                  onChange={(e) => setPaymentType(e.target.value as PaymentType)}
                />
                <label>Дифференцированные (убывающие платежи)</label>
              </div>
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
          <h3 className="card-subheader">Досрочные платежи</h3>
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
                  variant="danger"
                  onClick={() => removeEarlyPayment(index)}
                  size="sm"
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
              <div className="warning-card">
                <div className="text-center py-8">
                  <div className="text-red-600 text-lg font-semibold mb-2">
                    Превышен максимальный срок кредита
                  </div>
                  <p className="text-gray-600">
                    Максимальный срок кредита составляет 30 лет (360 месяцев)
                  </p>
                </div>
              </div>
            </Card>
          )
        }
        return null
      })()}

      {calculation && (
        <div className="grid-results-2">
          <ResultSection
            title="Основные параметры"
            items={[
              { label: 'Сумма кредита:', value: formatCurrency(calculation.loanAmount) },
              { label: 'Первоначальный взнос:', value: formatCurrency(calculation.downPayment) },
              { label: 'Сумма к погашению:', value: formatCurrency(calculation.loanAmount - calculation.downPayment) },
              { label: 'Процентная ставка:', value: formatPercent(calculation.interestRate) },
              { label: 'Дата взятия кредита:', value: formatDate(calculation.loanDate) },
              { label: 'Срок кредита:', value: `${calculation.termMonths} месяцев` },
              { label: 'Тип платежей:', value: calculation.paymentType === 'annuity' ? 'Аннуитетные' : 'Дифференцированные' },
              { 
                label: calculation.paymentType === 'annuity' ? 'Текущий платеж:' : 'Первый платеж:', 
                value: formatCurrency(calculation.paymentSchedule[calculation.paymentSchedule.length - 1]?.payment || calculation.monthlyPayment),
                variant: 'primary' as const,
                className: 'result-divider'
              },
              ...(calculation.paymentType === 'differentiated' ? [{
                label: 'Последний платеж:',
                value: formatCurrency(calculation.paymentSchedule[calculation.paymentSchedule.length - 1]?.payment || 0),
                variant: 'primary' as const
              }] : []),
              ...(calculation.paymentType === 'annuity' && calculation.paymentSchedule.length > 1 ? [{
                label: 'Изначальный платеж:',
                value: formatCurrency(calculation.monthlyPayment)
              }] : []),
              { label: 'Общая сумма платежей:', value: formatCurrency(calculation.totalPayments), variant: 'danger' as const },
              { label: 'Переплата по процентам:', value: formatCurrency(calculation.totalInterest), variant: 'danger' as const }
            ]}
          />

          <Card>
            <h3 className="card-subheader">Полный график платежей</h3>
            <div className="overflow-x-auto max-h-96">
              <DataTable
                columns={[
                  { key: 'month', label: 'Месяц', align: 'left' },
                  { key: 'payment', label: 'Платеж', align: 'right' },
                  { key: 'principal', label: 'Основной долг', align: 'right', className: 'hidden sm:table-cell' },
                  { key: 'interest', label: 'Проценты', align: 'right', className: 'hidden sm:table-cell' },
                  { key: 'balance', label: 'Остаток', align: 'right' }
                ]}
                data={calculation.paymentSchedule.map((payment) => ({
                  month: (
                    <div>
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
                    </div>
                  ),
                  payment: (
                    <div>
                      <div className="font-medium">{formatCurrency(payment.payment)}</div>
                      {payment.isEarlyPayment && (
                        <div className="text-xs text-gray-500">
                          Базовый: {formatCurrency(payment.payment - (payment.earlyPaymentAmount || 0))}
                        </div>
                      )}
                    </div>
                  ),
                  principal: (
                    <div>
                      <div>{formatCurrency(payment.principal)}</div>
                      {payment.isEarlyPayment && (
                        <div className="text-xs text-green-600">
                          +{formatCurrency(payment.earlyPaymentAmount || 0)}
                        </div>
                      )}
                    </div>
                  ),
                  interest: <span className="text-red-600">{formatCurrency(payment.interest)}</span>,
                  balance: formatCurrency(payment.remainingBalance)
                }))}
              />
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
