'use client'

import { useState } from 'react'
import Input from './Input'
import Button from './Button'
import Card from './Card'
import { calculateEnergySavings, EnergySavingsParams } from '@/utils/energySavings'

export default function EnergySavingsCalculator() {
  const [formData, setFormData] = useState({
    energyType: 'electricity' as 'electricity' | 'heating' | 'solar' | 'mixed',
    currentConsumption: '',
    currentRate: '',
    improvementType: 'insulation' as 'insulation' | 'windows' | 'appliances' | 'solar_panels' | 'led_lighting' | 'smart_thermostat' | 'custom',
    improvementCost: '',
    expectedSavings: '',
    paybackPeriod: '',
    maintenanceCost: '',
    inflationRate: '',
    energyPriceGrowth: ''
  })
  
  const [result, setResult] = useState<ReturnType<typeof calculateEnergySavings> | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.currentConsumption || isNaN(Number(formData.currentConsumption)) || Number(formData.currentConsumption) <= 0) {
      newErrors.currentConsumption = 'Введите корректное текущее потребление'
    }
    
    if (!formData.currentRate || isNaN(Number(formData.currentRate)) || Number(formData.currentRate) <= 0) {
      newErrors.currentRate = 'Введите корректный тариф'
    }
    
    if (!formData.improvementCost || isNaN(Number(formData.improvementCost)) || Number(formData.improvementCost) <= 0) {
      newErrors.improvementCost = 'Введите корректную стоимость улучшений'
    }
    
    if (!formData.expectedSavings || isNaN(Number(formData.expectedSavings)) || Number(formData.expectedSavings) <= 0 || Number(formData.expectedSavings) > 100) {
      newErrors.expectedSavings = 'Введите корректную ожидаемую экономию (1-100%)'
    }
    
    if (!formData.paybackPeriod || isNaN(Number(formData.paybackPeriod)) || Number(formData.paybackPeriod) <= 0 || Number(formData.paybackPeriod) > 50) {
      newErrors.paybackPeriod = 'Введите корректный срок окупаемости (1-50 лет)'
    }
    
    if (!formData.maintenanceCost || isNaN(Number(formData.maintenanceCost)) || Number(formData.maintenanceCost) < 0) {
      newErrors.maintenanceCost = 'Введите корректные расходы на обслуживание'
    }
    
    if (!formData.inflationRate || isNaN(Number(formData.inflationRate)) || Number(formData.inflationRate) < 0 || Number(formData.inflationRate) > 20) {
      newErrors.inflationRate = 'Введите корректную инфляцию (0-20%)'
    }
    
    if (!formData.energyPriceGrowth || isNaN(Number(formData.energyPriceGrowth)) || Number(formData.energyPriceGrowth) < 0 || Number(formData.energyPriceGrowth) > 20) {
      newErrors.energyPriceGrowth = 'Введите корректный рост цен на энергию (0-20%)'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCalculate = () => {
    if (!validateForm()) return
    
    const params: EnergySavingsParams = {
      energyType: formData.energyType,
      currentConsumption: Number(formData.currentConsumption),
      currentRate: Number(formData.currentRate),
      improvementType: formData.improvementType,
      improvementCost: Number(formData.improvementCost),
      expectedSavings: Number(formData.expectedSavings),
      paybackPeriod: Number(formData.paybackPeriod),
      maintenanceCost: Number(formData.maintenanceCost),
      inflationRate: Number(formData.inflationRate),
      energyPriceGrowth: Number(formData.energyPriceGrowth)
    }
    
    const calculation = calculateEnergySavings(params)
    setResult(calculation)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getEnergyTypeOptions = () => [
    { value: 'electricity', label: 'Электроэнергия' },
    { value: 'heating', label: 'Отопление' },
    { value: 'solar', label: 'Солнечные панели' },
    { value: 'mixed', label: 'Смешанный тип' }
  ]

  const getImprovementTypeOptions = () => [
    { value: 'insulation', label: 'Утепление стен/крыши' },
    { value: 'windows', label: 'Замена окон' },
    { value: 'appliances', label: 'Энергоэффективные приборы' },
    { value: 'solar_panels', label: 'Солнечные панели' },
    { value: 'led_lighting', label: 'LED освещение' },
    { value: 'smart_thermostat', label: 'Умный термостат' },
    { value: 'custom', label: 'Другое' }
  ]

  const getConsumptionUnit = () => {
    switch (formData.energyType) {
      case 'electricity': return 'кВт⋅ч/мес'
      case 'heating': return 'Гкал/мес'
      case 'solar': return 'кВт⋅ч/мес'
      case 'mixed': return 'руб/мес'
      default: return 'ед/мес'
    }
  }

  const getRateUnit = () => {
    switch (formData.energyType) {
      case 'electricity': return 'руб/кВт⋅ч'
      case 'heating': return 'руб/Гкал'
      case 'solar': return 'руб/кВт⋅ч'
      case 'mixed': return 'руб'
      default: return 'руб/ед'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Калькулятор экономии от энергосбережения</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тип энергии
            </label>
            <select
              value={formData.energyType}
              onChange={(e) => handleInputChange('energyType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {getEnergyTypeOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тип улучшения
            </label>
            <select
              value={formData.improvementType}
              onChange={(e) => handleInputChange('improvementType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {getImprovementTypeOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label={`Текущее потребление (${getConsumptionUnit()})`}
            type="number"
            step="0.1"
            value={formData.currentConsumption}
            onChange={(e) => handleInputChange('currentConsumption', e.target.value)}
            error={errors.currentConsumption}
            placeholder="200"
          />

          <Input
            label={`Тариф (${getRateUnit()})`}
            type="number"
            step="0.01"
            value={formData.currentRate}
            onChange={(e) => handleInputChange('currentRate', e.target.value)}
            error={errors.currentRate}
            placeholder="5.47"
          />

          <Input
            label="Стоимость улучшений (руб)"
            type="number"
            value={formData.improvementCost}
            onChange={(e) => handleInputChange('improvementCost', e.target.value)}
            error={errors.improvementCost}
            placeholder="100000"
          />

          <Input
            label="Ожидаемая экономия (% в год)"
            type="number"
            step="0.1"
            value={formData.expectedSavings}
            onChange={(e) => handleInputChange('expectedSavings', e.target.value)}
            error={errors.expectedSavings}
            placeholder="30"
          />

          <Input
            label="Срок окупаемости (лет)"
            type="number"
            value={formData.paybackPeriod}
            onChange={(e) => handleInputChange('paybackPeriod', e.target.value)}
            error={errors.paybackPeriod}
            placeholder="5"
          />

          <Input
            label="Расходы на обслуживание (руб/год)"
            type="number"
            value={formData.maintenanceCost}
            onChange={(e) => handleInputChange('maintenanceCost', e.target.value)}
            error={errors.maintenanceCost}
            placeholder="5000"
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

          <Input
            label="Рост цен на энергию (% в год)"
            type="number"
            step="0.1"
            value={formData.energyPriceGrowth}
            onChange={(e) => handleInputChange('energyPriceGrowth', e.target.value)}
            error={errors.energyPriceGrowth}
            placeholder="6"
          />
        </div>

        <div className="mt-6">
          <Button onClick={handleCalculate} className="w-full">
            Рассчитать экономию
          </Button>
        </div>
      </Card>

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Годовая экономия</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {result.annualSavings.toLocaleString('ru-RU')} руб
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  в первый год
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Срок окупаемости</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {result.paybackPeriod} лет
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  до полной окупаемости
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Чистая экономия</h3>
              <div className="text-center">
                <div className={`text-3xl font-bold ${result.netSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {result.netSavings.toLocaleString('ru-RU')} руб
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  за весь период
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">ROI</h3>
              <div className="text-center">
                <div className={`text-3xl font-bold ${result.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {result.roi}%
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  возврат инвестиций
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Детализация расчетов</h3>
              <div className="space-y-3">
                {result.breakdown.map((item, index) => (
                  <div key={index} className="border-l-4 border-green-200 pl-3">
                    <div className="font-medium text-gray-900">{item.description}</div>
                    <div className="text-sm text-gray-600">{item.formula}</div>
                    <div className="text-sm font-medium text-green-600">
                      {typeof item.value === 'number' 
                        ? item.value.toLocaleString('ru-RU') + (item.description.includes('ROI') || item.description.includes('экономия') || item.description.includes('рост') || item.description.includes('инфляция') ? '%' : ' руб')
                        : item.value
                      }
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Оценка проекта</h3>
              <div className="space-y-3">
                <div className={`p-3 rounded-lg ${result.netSavings >= 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="font-medium text-gray-900">
                    {result.netSavings >= 0 ? '✅ Проект выгоден' : '❌ Проект убыточен'}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {result.netSavings >= 0 
                      ? 'Экономия превышает затраты'
                      : 'Затраты превышают экономию'
                    }
                  </div>
                </div>
                
                <div className={`p-3 rounded-lg ${result.paybackPeriod <= 5 ? 'bg-green-50 border border-green-200' : result.paybackPeriod <= 10 ? 'bg-yellow-50 border border-yellow-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="font-medium text-gray-900">
                    Срок окупаемости: {result.paybackPeriod} лет
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {result.paybackPeriod <= 5 
                      ? 'Отличный срок окупаемости'
                      : result.paybackPeriod <= 10 
                        ? 'Приемлемый срок окупаемости'
                        : 'Долгий срок окупаемости'
                    }
                  </div>
                </div>

                <div className={`p-3 rounded-lg ${result.roi >= 20 ? 'bg-green-50 border border-green-200' : result.roi >= 10 ? 'bg-yellow-50 border border-yellow-200' : 'bg-red-50 border border-red-200'}`}>
                  <div className="font-medium text-gray-900">
                    ROI: {result.roi}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {result.roi >= 20 
                      ? 'Высокая доходность'
                      : result.roi >= 10 
                        ? 'Средняя доходность'
                        : 'Низкая доходность'
                    }
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Прогноз экономии по годам</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Год</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Стоимость энергии</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Экономия</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Обслуживание</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Чистая экономия</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Накопленная экономия</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {result.yearlyProjection.slice(0, 15).map((row) => (
                    <tr key={row.year}>
                      <td className="px-4 py-2 text-sm text-gray-900">{row.year}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {row.energyCost.toLocaleString('ru-RU')}
                      </td>
                      <td className="px-4 py-2 text-sm text-green-600">
                        {row.savings.toLocaleString('ru-RU')}
                      </td>
                      <td className="px-4 py-2 text-sm text-red-600">
                        {row.maintenance.toLocaleString('ru-RU')}
                      </td>
                      <td className={`px-4 py-2 text-sm font-medium ${row.netSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {row.netSavings.toLocaleString('ru-RU')}
                      </td>
                      <td className={`px-4 py-2 text-sm font-medium ${row.cumulativeSavings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {row.cumulativeSavings.toLocaleString('ru-RU')}
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
