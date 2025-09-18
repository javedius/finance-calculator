'use client'

import { useState } from 'react'
import Card from './Card'
import Input from './Input'
import Button from './Button'
import { 
  calculateTransportTax, 
  formatCurrency, 
  getVehicleTypes, 
  getRegions,
  getBenefits,
  getRatesByVehicleTypeAndRegion
} from '@/utils/transportTaxCalculator'

export default function TransportTaxCalculator() {
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('passenger_cars')
  const [selectedRegion, setSelectedRegion] = useState<string>('moscow')
  const [horsepower, setHorsepower] = useState<string>('')
  const [yearOfManufacture, setYearOfManufacture] = useState<string>('')
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([])

  // Рассчитываем налог в реальном времени
  const calculation = (() => {
    const hp = parseFloat(horsepower)
    const year = parseInt(yearOfManufacture)
    
    if (isNaN(hp) || hp <= 0 || isNaN(year) || year <= 0) {
      return null
    }
    
    return calculateTransportTax(selectedVehicleType, selectedRegion, hp, year, selectedBenefits)
  })()

  const handleClear = () => {
    setHorsepower('')
    setYearOfManufacture('')
    setSelectedBenefits([])
  }

  const handleBenefitChange = (benefitId: string, checked: boolean) => {
    if (checked) {
      setSelectedBenefits([...selectedBenefits, benefitId])
    } else {
      setSelectedBenefits(selectedBenefits.filter(id => id !== benefitId))
    }
  }

  const vehicleTypes = getVehicleTypes()
  const regions = getRegions()
  const benefits = getBenefits()
  const currentRates = getRatesByVehicleTypeAndRegion(selectedVehicleType, selectedRegion)

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Расчет транспортного налога</h2>
          <p className="text-gray-600">
            Рассчитайте размер транспортного налога с учетом типа ТС, региона, возраста и льгот
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Тип транспортного средства
              </label>
              <select
                value={selectedVehicleType}
                onChange={(e) => setSelectedVehicleType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {vehicleTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Мощность двигателя (л.с.)"
              type="number"
              value={horsepower}
              onChange={(e) => setHorsepower(e.target.value)}
              placeholder="Введите мощность в лошадиных силах"
              min="1"
            />
            
            <Input
              label="Год выпуска"
              type="number"
              value={yearOfManufacture}
              onChange={(e) => setYearOfManufacture(e.target.value)}
              placeholder="Введите год выпуска"
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Льготы
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {benefits.map((benefit) => (
                <label key={benefit.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedBenefits.includes(benefit.id)}
                    onChange={(e) => handleBenefitChange(benefit.id, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{benefit.name}</span>
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
                <span className="text-gray-600">Тип ТС:</span>
                <span className="font-medium">{calculation.vehicleType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Регион:</span>
                <span className="font-medium">{calculation.region}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Мощность двигателя:</span>
                <span className="font-medium">{calculation.horsepower} л.с.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Год выпуска:</span>
                <span className="font-medium">{calculation.yearOfManufacture}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Возраст ТС:</span>
                <span className="font-medium">{calculation.vehicleAge} лет</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Базовая ставка:</span>
                <span className="font-medium">{calculation.baseRate} ₽ за л.с.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Возрастной коэффициент:</span>
                <span className="font-medium">{calculation.ageCoefficient}</span>
              </div>
              {calculation.appliedBenefits.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Применяемые льготы:</span>
                  <span className="font-medium text-green-600">{calculation.appliedBenefits.join(', ')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Коэффициент льгот:</span>
                <span className="font-medium">{calculation.benefitCoefficient}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-red-600">
                  <span className="font-medium">Транспортный налог (в год):</span>
                  <span className="font-semibold text-lg">{formatCurrency(calculation.annualTax)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span className="font-medium">Транспортный налог (в месяц):</span>
                  <span className="font-semibold">{formatCurrency(calculation.monthlyTax)}</span>
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
                  <div className="text-sm font-medium text-gray-900 ml-4">
                    {typeof step.value === 'number' && step.value !== 1 ? formatCurrency(step.value) : step.value}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ставки для выбранного типа ТС и региона</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2">Мощность</th>
                <th className="text-left py-2">Ставка за л.с.</th>
                <th className="text-left py-2">Описание</th>
              </tr>
            </thead>
            <tbody>
              {currentRates.map((rate, index) => (
                <tr 
                  key={index} 
                  className={`border-b border-gray-100 ${
                    calculation && calculation.baseRate === rate.ratePerHorsepower 
                      ? 'bg-blue-50 font-medium' 
                      : ''
                  }`}
                >
                  <td className="py-2">
                    {rate.minHorsepower === 0 ? '0' : rate.minHorsepower} - 
                    {rate.maxHorsepower ? ` ${rate.maxHorsepower}` : ' ∞'} л.с.
                  </td>
                  <td className="py-2 font-medium">
                    {rate.ratePerHorsepower} ₽
                    {calculation && calculation.baseRate === rate.ratePerHorsepower && (
                      <span className="ml-2 text-blue-600">← применяется</span>
                    )}
                  </td>
                  <td className="py-2 text-gray-600">{rate.description}</td>
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
              Налог = Мощность × Ставка за л.с. × Возрастной коэффициент × Коэффициент льгот
            </p>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Важные моменты:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Ставки налога устанавливаются региональными законами и могут отличаться</li>
              <li>Возрастной коэффициент применяется в зависимости от года выпуска ТС</li>
              <li>При наличии нескольких льгот применяется максимальная скидка</li>
              <li>Налог уплачивается один раз в год до 1 декабря</li>
              <li>Для точного расчета обратитесь в налоговую инспекцию вашего региона</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Возрастные коэффициенты:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>До 3 лет: 1.0 (без скидки)</li>
              <li>3-5 лет: 0.9 (10% скидка)</li>
              <li>5-10 лет: 0.8 (20% скидка)</li>
              <li>Свыше 10 лет: 0.7 (30% скидка)</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}