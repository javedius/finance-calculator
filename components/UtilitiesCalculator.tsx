'use client'

import { useState } from 'react'
import Input from './Input'
import Button from './Button'
import Card from './Card'
import { calculateUtilities, UtilitiesParams } from '@/utils/utilities'

export default function UtilitiesCalculator() {
  const [formData, setFormData] = useState({
    region: 'moscow',
    apartmentArea: '',
    residents: '',
    hasMetering: {
      electricity: false,
      water: false,
      heating: false,
      gas: false
    },
    consumption: {
      electricity: '',
      water: '',
      heating: '',
      gas: ''
    },
    wasteDisposal: true,
    wasteType: 'apartment' as 'apartment' | 'house'
  })
  
  const [result, setResult] = useState<ReturnType<typeof calculateUtilities> | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.apartmentArea || isNaN(Number(formData.apartmentArea)) || Number(formData.apartmentArea) <= 0) {
      newErrors.apartmentArea = 'Введите корректную площадь квартиры'
    }
    
    if (!formData.residents || isNaN(Number(formData.residents)) || Number(formData.residents) <= 0) {
      newErrors.residents = 'Введите корректное количество жильцов'
    }
    
    // Проверка показаний счетчиков
    if (formData.hasMetering.electricity && (!formData.consumption.electricity || isNaN(Number(formData.consumption.electricity)) || Number(formData.consumption.electricity) < 0)) {
      newErrors.electricity = 'Введите корректное потребление электроэнергии'
    }
    
    if (formData.hasMetering.water && (!formData.consumption.water || isNaN(Number(formData.consumption.water)) || Number(formData.consumption.water) < 0)) {
      newErrors.water = 'Введите корректное потребление воды'
    }
    
    if (formData.hasMetering.heating && (!formData.consumption.heating || isNaN(Number(formData.consumption.heating)) || Number(formData.consumption.heating) < 0)) {
      newErrors.heating = 'Введите корректное потребление тепла'
    }
    
    if (formData.hasMetering.gas && (!formData.consumption.gas || isNaN(Number(formData.consumption.gas)) || Number(formData.consumption.gas) < 0)) {
      newErrors.gas = 'Введите корректное потребление газа'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCalculate = () => {
    if (!validateForm()) return
    
    const params: UtilitiesParams = {
      region: formData.region,
      apartmentArea: Number(formData.apartmentArea),
      residents: Number(formData.residents),
      hasMetering: formData.hasMetering,
      consumption: {
        electricity: Number(formData.consumption.electricity) || 0,
        water: Number(formData.consumption.water) || 0,
        heating: Number(formData.consumption.heating) || 0,
        gas: Number(formData.consumption.gas) || 0
      },
      wasteDisposal: formData.wasteDisposal,
      wasteType: formData.wasteType
    }
    
    const calculation = calculateUtilities(params)
    setResult(calculation)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.startsWith('hasMetering.')) {
      const meterType = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        hasMetering: {
          ...prev.hasMetering,
          [meterType]: value
        }
      }))
    } else if (field.startsWith('consumption.')) {
      const consumptionType = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        consumption: {
          ...prev.consumption,
          [consumptionType]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getRegionOptions = () => [
    { value: 'moscow', label: 'Москва' },
    { value: 'spb', label: 'Санкт-Петербург' },
    { value: 'moscow_region', label: 'Московская область' },
    { value: 'other', label: 'Другие регионы' }
  ]

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Калькулятор коммунальных платежей</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Регион
            </label>
            <select
              value={formData.region}
              onChange={(e) => handleInputChange('region', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {getRegionOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Площадь квартиры (кв.м)"
            type="number"
            value={formData.apartmentArea}
            onChange={(e) => handleInputChange('apartmentArea', e.target.value)}
            error={errors.apartmentArea}
            placeholder="60"
          />

          <Input
            label="Количество жильцов"
            type="number"
            value={formData.residents}
            onChange={(e) => handleInputChange('residents', e.target.value)}
            error={errors.residents}
            placeholder="2"
          />

          <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.wasteDisposal}
                onChange={(e) => handleInputChange('wasteDisposal', e.target.checked)}
                className="mr-2"
              />
              Включить вывоз мусора
            </label>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <h3 className="text-lg font-medium">Счетчики и потребление</h3>
          
          {/* Электроэнергия */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Электроэнергия</h4>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.hasMetering.electricity}
                  onChange={(e) => handleInputChange('hasMetering.electricity', e.target.checked)}
                  className="mr-2"
                />
                Есть счетчик
              </label>
            </div>
            {formData.hasMetering.electricity ? (
              <Input
                label="Потребление (кВт⋅ч/мес)"
                type="number"
                value={formData.consumption.electricity}
                onChange={(e) => handleInputChange('consumption.electricity', e.target.value)}
                error={errors.electricity}
                placeholder="200"
              />
            ) : (
              <p className="text-sm text-gray-500">
                Будет использован норматив: 50 кВт⋅ч на человека
              </p>
            )}
          </div>

          {/* Вода */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Водоснабжение</h4>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.hasMetering.water}
                  onChange={(e) => handleInputChange('hasMetering.water', e.target.checked)}
                  className="mr-2"
                />
                Есть счетчик
              </label>
            </div>
            {formData.hasMetering.water ? (
              <Input
                label="Потребление (куб.м/мес)"
                type="number"
                step="0.1"
                value={formData.consumption.water}
                onChange={(e) => handleInputChange('consumption.water', e.target.value)}
                error={errors.water}
                placeholder="8"
              />
            ) : (
              <p className="text-sm text-gray-500">
                Будет использован норматив: 4.5 куб.м на человека
              </p>
            )}
          </div>

          {/* Отопление */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Отопление</h4>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.hasMetering.heating}
                  onChange={(e) => handleInputChange('hasMetering.heating', e.target.checked)}
                  className="mr-2"
                />
                Есть счетчик
              </label>
            </div>
            {formData.hasMetering.heating ? (
              <Input
                label="Потребление (Гкал/мес)"
                type="number"
                step="0.01"
                value={formData.consumption.heating}
                onChange={(e) => handleInputChange('consumption.heating', e.target.value)}
                error={errors.heating}
                placeholder="0.5"
              />
            ) : (
              <p className="text-sm text-gray-500">
                Будет использован норматив: 0.02 Гкал на кв.м
              </p>
            )}
          </div>

          {/* Газ */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Газоснабжение</h4>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.hasMetering.gas}
                  onChange={(e) => handleInputChange('hasMetering.gas', e.target.checked)}
                  className="mr-2"
                />
                Есть счетчик
              </label>
            </div>
            {formData.hasMetering.gas ? (
              <Input
                label="Потребление (куб.м/мес)"
                type="number"
                step="0.1"
                value={formData.consumption.gas}
                onChange={(e) => handleInputChange('consumption.gas', e.target.value)}
                error={errors.gas}
                placeholder="15"
              />
            ) : (
              <p className="text-sm text-gray-500">
                Будет использован норматив: 10 куб.м на человека
              </p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={handleCalculate} className="w-full">
            Рассчитать коммунальные платежи
          </Button>
        </div>
      </Card>

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Ежемесячные платежи</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Электроэнергия:</span>
                  <span className="font-medium">{result.monthly.electricity.toLocaleString('ru-RU')} руб</span>
                </div>
                <div className="flex justify-between">
                  <span>Водоснабжение:</span>
                  <span className="font-medium">{result.monthly.water.toLocaleString('ru-RU')} руб</span>
                </div>
                <div className="flex justify-between">
                  <span>Отопление:</span>
                  <span className="font-medium">{result.monthly.heating.toLocaleString('ru-RU')} руб</span>
                </div>
                <div className="flex justify-between">
                  <span>Газоснабжение:</span>
                  <span className="font-medium">{result.monthly.gas.toLocaleString('ru-RU')} руб</span>
                </div>
                {result.monthly.waste > 0 && (
                  <div className="flex justify-between">
                    <span>Вывоз мусора:</span>
                    <span className="font-medium">{result.monthly.waste.toLocaleString('ru-RU')} руб</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Итого в месяц:</span>
                  <span className="text-blue-600">{result.monthly.total.toLocaleString('ru-RU')} руб</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Годовые платежи</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Электроэнергия:</span>
                  <span className="font-medium">{result.yearly.electricity.toLocaleString('ru-RU')} руб</span>
                </div>
                <div className="flex justify-between">
                  <span>Водоснабжение:</span>
                  <span className="font-medium">{result.yearly.water.toLocaleString('ru-RU')} руб</span>
                </div>
                <div className="flex justify-between">
                  <span>Отопление:</span>
                  <span className="font-medium">{result.yearly.heating.toLocaleString('ru-RU')} руб</span>
                </div>
                <div className="flex justify-between">
                  <span>Газоснабжение:</span>
                  <span className="font-medium">{result.yearly.gas.toLocaleString('ru-RU')} руб</span>
                </div>
                {result.yearly.waste > 0 && (
                  <div className="flex justify-between">
                    <span>Вывоз мусора:</span>
                    <span className="font-medium">{result.yearly.waste.toLocaleString('ru-RU')} руб</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Итого в год:</span>
                  <span className="text-blue-600">{result.yearly.total.toLocaleString('ru-RU')} руб</span>
                </div>
              </div>
            </Card>
          </div>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Детализация расчетов</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Услуга</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Потребление</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Тариф</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Сумма</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {result.breakdown.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">{item.service}</td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {item.consumption.toLocaleString('ru-RU')} {item.unit}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">
                        {item.rate.toLocaleString('ru-RU')} руб/{item.unit}
                      </td>
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">
                        {item.amount.toLocaleString('ru-RU')} руб
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
