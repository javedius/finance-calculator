'use client'

import { useState } from 'react'
import Card from './Card'
import Input from './Input'
import Button from './Button'
import { 
  calculatePropertyTax, 
  formatCurrency, 
  formatDate,
  getPropertyTypes, 
  getRegions,
  getBenefits,
  getRateByPropertyTypeAndRegion
} from '@/utils/propertyTaxCalculator'

export default function PropertyTaxCalculator() {
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('apartment')
  const [selectedRegion, setSelectedRegion] = useState<string>('moscow')
  const [cadastralValue, setCadastralValue] = useState<string>('')
  const [ownershipStartDate, setOwnershipStartDate] = useState<string>('')
  const [ownershipEndDate, setOwnershipEndDate] = useState<string>('')
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([])

  // Рассчитываем налог в реальном времени
  const calculation = (() => {
    const value = parseFloat(cadastralValue)
    const startDate = ownershipStartDate ? new Date(ownershipStartDate) : new Date()
    const endDate = ownershipEndDate ? new Date(ownershipEndDate) : new Date()
    
    if (isNaN(value) || value <= 0) {
      return null
    }
    
    return calculatePropertyTax(selectedPropertyType, selectedRegion, value, startDate, endDate, selectedBenefits)
  })()

  const handleClear = () => {
    setCadastralValue('')
    setOwnershipStartDate('')
    setOwnershipEndDate('')
    setSelectedBenefits([])
  }

  const handleBenefitChange = (benefitId: string, checked: boolean) => {
    if (checked) {
      setSelectedBenefits([...selectedBenefits, benefitId])
    } else {
      setSelectedBenefits(selectedBenefits.filter(id => id !== benefitId))
    }
  }

  const propertyTypes = getPropertyTypes()
  const regions = getRegions()
  const benefits = getBenefits()
  const currentRate = getRateByPropertyTypeAndRegion(selectedPropertyType, selectedRegion)

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Расчет налога на недвижимость</h2>
          <p className="text-gray-600">
            Рассчитайте размер налога на недвижимость с учетом типа объекта, региона, льгот и периода владения
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип недвижимости
              </label>
              <select
                value={selectedPropertyType}
                onChange={(e) => setSelectedPropertyType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {propertyTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">{propertyTypes.find(t => t.id === selectedPropertyType)?.description}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Регион регистрации
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Input
              label="Кадастровая стоимость (руб.)"
              type="number"
              value={cadastralValue}
              onChange={(e) => setCadastralValue(e.target.value)}
              placeholder="Введите кадастровую стоимость"
              min="1"
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Кадастровую стоимость можно узнать на сайте Росреестра или в выписке ЕГРН
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата начала владения
              </label>
              <input
                type="date"
                value={ownershipStartDate}
                onChange={(e) => setOwnershipStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Дата окончания владения
              </label>
              <input
                type="date"
                value={ownershipEndDate}
                onChange={(e) => setOwnershipEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Оставьте пустым для расчета на текущий год
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Льготы
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {benefits.map((benefit) => (
                <label key={benefit.id} className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedBenefits.includes(benefit.id)}
                    onChange={(e) => handleBenefitChange(benefit.id, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                  />
                  <div className="flex-1">
                    <span className="text-sm text-gray-700">{benefit.name}</span>
                    <p className="text-xs text-gray-500">{benefit.description}</p>
                  </div>
                </label>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Выберите все применимые льготы. При наличии нескольких льгот применяется максимальная скидка.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleClear}>
              Очистить
            </Button>
          </div>
        </div>
      </Card>

      {calculation && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Результаты расчета</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Тип недвижимости:</span>
                <span className="font-medium">{calculation.propertyType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Регион:</span>
                <span className="font-medium">{calculation.region}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Кадастровая стоимость:</span>
                <span className="font-medium">{formatCurrency(calculation.cadastralValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Период владения:</span>
                <span className="font-medium">{calculation.ownershipDays} дней</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Пропорция года:</span>
                <span className="font-medium">{(calculation.ownershipProportion * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ставка налога:</span>
                <span className="font-medium">{(calculation.baseRate * 100).toFixed(1)}%</span>
              </div>
              {calculation.appliedBenefits.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Применяемые льготы:</span>
                  <span className="font-medium text-green-600">{calculation.appliedBenefits.join(', ')}</span>
                </div>
              )}
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Налог без льгот:</span>
                  <span className="font-medium">{formatCurrency(calculation.baseTax)}</span>
                </div>
                {calculation.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Размер льготы:</span>
                    <span className="font-medium">-{formatCurrency(calculation.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-red-600 border-t pt-2">
                  <span className="font-medium">Итоговый налог:</span>
                  <span className="font-semibold text-lg">{formatCurrency(calculation.finalTax)}</span>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Детализация расчета</h3>
            <div className="space-y-3">
              {calculation.calculationSteps.map((step, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{step.step}:</div>
                    <div className="text-xs text-gray-600">{step.description}</div>
                  </div>
                  <div className="text-sm font-medium text-gray-900 ml-4 text-right">
                    {step.value}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ставки налога на недвижимость</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">Регион</th>
                <th className="text-left py-2">Жилая недвижимость</th>
                <th className="text-left py-2">Коммерческая</th>
              </tr>
            </thead>
            <tbody>
              {regions.map((region) => (
                <tr 
                  key={region.id} 
                  className={`border-b border-gray-100 ${
                    calculation && calculation.region === region.name 
                      ? 'bg-blue-50 font-medium' 
                      : ''
                  }`}
                >
                  <td className="py-2 font-medium">{region.name}</td>
                  <td className="py-2">{(region.rates.apartment * 100).toFixed(1)}%</td>
                  <td className="py-2">{(region.rates.commercial * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Справочная информация</h3>
        <div className="space-y-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Формула расчета:</h4>
            <p className="font-mono bg-gray-100 p-2 rounded">
              Налог = Кадастровая стоимость × Ставка налога × (1 − Льгота) × Пропорция года владения
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Где узнать кадастровую стоимость:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Официальный сайт Росреестра (rosreestr.gov.ru)</li>
              <li>Публичная кадастровая карта</li>
              <li>Выписка из ЕГРН</li>
              <li>Справка о кадастровой стоимости</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Важные моменты:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Ставки налога устанавливаются региональными законами</li>
              <li>Льготы могут различаться в зависимости от региона</li>
              <li>Налог рассчитывается пропорционально периоду владения</li>
              <li>Налог уплачивается один раз в год до 1 декабря</li>
              <li>Для точного расчета обратитесь в налоговую инспекцию</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Типы льгот:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Пенсионеры:</strong> 50% скидка (до 1 млн руб.)</li>
              <li><strong>Инвалиды:</strong> 100% освобождение (до 2 млн руб.)</li>
              <li><strong>Многодетные семьи:</strong> 50% скидка (до 1 млн руб.)</li>
              <li><strong>Ветераны:</strong> 100% освобождение (до 2 млн руб.)</li>
              <li><strong>Герои России/СССР:</strong> 100% освобождение (до 2 млн руб.)</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
