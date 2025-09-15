'use client'

import { useState } from 'react'
import Modal from './Modal'
import Input from './Input'
import Button from './Button'
import { EarlyPayment, getMonthNumberFromDate, getPaymentDate } from '@/utils/mortgageCalculator'

interface EarlyPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (payment: EarlyPayment) => void
  loanDate: string
  maxMonths: number
}

export default function EarlyPaymentModal({ isOpen, onClose, onAdd, loanDate, maxMonths }: EarlyPaymentModalProps) {
  const [paymentDate, setPaymentDate] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const [type, setType] = useState<'reduce_term' | 'reduce_payment'>('reduce_term')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const amountNum = parseFloat(amount)
    const monthNum = getMonthNumberFromDate(loanDate, paymentDate)
    
    if (isNaN(amountNum) || amountNum <= 0 || !paymentDate) {
      alert('Пожалуйста, введите корректные данные')
      return
    }
    
    if (monthNum < 1 || monthNum > maxMonths) {
      alert(`Дата платежа должна быть в пределах срока кредита (1-${maxMonths} месяц)`)
      return
    }
    
    onAdd({
      month: monthNum,
      amount: amountNum,
      type,
      date: paymentDate
    })
    
    // Сбрасываем форму
    setPaymentDate('')
    setAmount('')
    setType('reduce_term')
    onClose()
  }

  const handleClose = () => {
    setPaymentDate('')
    setAmount('')
    setType('reduce_term')
    onClose()
  }

  // Вычисляем минимальную и максимальную даты
  const minDate = loanDate
  const maxDate = getPaymentDate(loanDate, maxMonths)

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Добавить досрочное погашение">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="label">Дата досрочного платежа</label>
          <input
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            min={minDate}
            max={maxDate}
            className="input-field"
            required
          />
          <p className="text-xs text-gray-500">
            Выберите дату в пределах срока кредита
          </p>
        </div>
        
        <Input
          label="Сумма досрочного платежа (руб.)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Введите сумму"
          min="1"
          required
        />
        
        <div className="space-y-2">
          <label className="label">Тип досрочного погашения</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentType"
                value="reduce_term"
                checked={type === 'reduce_term'}
                onChange={(e) => setType(e.target.value as 'reduce_term' | 'reduce_payment')}
                className="mr-2"
              />
              <span>Уменьшить срок кредита</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentType"
                value="reduce_payment"
                checked={type === 'reduce_payment'}
                onChange={(e) => setType(e.target.value as 'reduce_term' | 'reduce_payment')}
                className="mr-2"
              />
              <span>Уменьшить размер платежа</span>
            </label>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 pt-4">
          <Button type="submit" className="w-full sm:flex-1">
            Добавить
          </Button>
          <Button type="button" variant="secondary" onClick={handleClose} className="w-full sm:flex-1">
            Отмена
          </Button>
        </div>
      </form>
    </Modal>
  )
}
