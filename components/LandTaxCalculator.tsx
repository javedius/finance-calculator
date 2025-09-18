'use client'

import { useState } from 'react'
import Input from './Input'
import Button from './Button'
import Card from './Card'
import { calculateLandTax, LandTaxParams } from '@/utils/landTax'

export default function LandTaxCalculator() {
  const [formData, setFormData] = useState({
    landArea: '',
    landCategory: 'residential' as 'agricultural' | 'residential' | 'commercial' | 'industrial' | 'forest' | 'water' | 'other',
    region: 'moscow',
    cadastralValue: '',
    ownershipType: 'individual' as 'individual' | 'organization',
    hasBenefits: false,
    benefitType: 'pensioner' as 'pensioner' | 'veteran' | 'disabled' | 'large_family' | 'other',
    benefitAmount: ''
  })
  
  const [result, setResult] = useState<ReturnType<typeof calculateLandTax> | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.landArea || isNaN(Number(formData.landArea)) || Number(formData.landArea) <= 0) {
      newErrors.landArea = 'Введите корректную площадь участка'
    }
    
    if (!formData.cadastralValue || isNaN(Number(formData.cadastralValue)) || Number(formData.cadastralValue) <= 0) {
      newErrors.cadastralValue = 'Введите корректную кадастровую стоимость'
    }
    
    if (formData.hasBenefits && formData.benefitType === 'other') {
      if (!formData.benefitAmount || isNaN(Number(formData.benefitAmount)) || Number(formData.benefitAmount) < 0) {
        newErrors.benefitAmount = 'Введите корректную сумму льготы'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCalculate = () => {
    if (!validateForm()) return
    
    const params: LandTaxParams = {
      landArea: Number(formData.landArea),
      landCategory: formData.landCategory,
      region: formData.region,
      cadastralValue: Number(formData.cadastralValue),
      ownershipType: formData.ownershipType,
      hasBenefits: formData.hasBenefits,
      benefitType: formData.benefitType,
      benefitAmount: formData.benefitAmount ? Number(formData.benefitAmount) : 0
    }
    
    const calculation = calculateLandTax(params)
    setResult(calculation)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getCategoryOptions = () => [
    { value: 'agricultural', label: 'Сельскохозяйственного назначения' },
    { value: 'residential', label: 'Населенных пунктов' },
    { value: 'commercial', label: 'Коммерческого назначения' },
    { value: 'industrial', label: 'Промышленности' },
    { value: 'forest', label: 'Лесного фонда' },
    { value: 'water', label: 'Водного фонда' },
    { value: 'other', label: 'Прочие земли' }
  ]

  const getRegionOptions = () => [
    { value: 'moscow', label: 'Москва' },
    { value: 'spb', label: 'Санкт-Петербург' },
    { value: 'moscow_region', label: 'Московская область' },
    { value: 'other', label: 'Другие регионы' }
  ]

  const getBenefitOptions = () => [
    { value: 'pensioner', label: 'Пенсионер (50% скидка)' },
    { value: 'veteran', label: 'Ветеран (50% скидка)' },
    { value: 'disabled', label: 'Инвалид (50% скидка)' },
    { value: 'large_family', label: 'Многодетная семья (30% скидка)' },
    { value: 'other', label: 'Другая льгота' }
  ]

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold mb-4">Калькулятор налога на землю</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Площадь участка (кв.м)"
            type="number"
            value={formData.landArea}
            onChange={(e) => handleInputChange('landArea', e.target.value)}
            error={errors.landArea}
            placeholder="600"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Категория земли
            </label>
            <select
              value={formData.landCategory}
              onChange={(e) => handleInputChange('landCategory', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {getCategoryOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

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
            label="Кадастровая стоимость (руб)"
            type="number"
            value={formData.cadastralValue}
            onChange={(e) => handleInputChange('cadastralValue', e.target.value)}
            error={errors.cadastralValue}
            placeholder="1000000"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тип собственности
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="ownershipType"
                  value="individual"
                  checked={formData.ownershipType === 'individual'}
                  onChange={(e) => handleInputChange('ownershipType', e.target.value)}
                  className="mr-2"
                />
                Физическое лицо
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="ownershipType"
                  value="organization"
                  checked={formData.ownershipType === 'organization'}
                  onChange={(e) => handleInputChange('ownershipType', e.target.value)}
                  className="mr-2"
                />
                Организация
              </label>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.hasBenefits}
                onChange={(e) => handleInputChange('hasBenefits', e.target.checked)}
                className="mr-2"
              />
              У меня есть льготы
            </label>
          </div>

          {formData.hasBenefits && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Тип льготы
                </label>
                <select
                  value={formData.benefitType}
                  onChange={(e) => handleInputChange('benefitType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {getBenefitOptions().map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {formData.benefitType === 'other' && (
                <Input
                  label="Сумма льготы (руб)"
                  type="number"
                  value={formData.benefitAmount}
                  onChange={(e) => handleInputChange('benefitAmount', e.target.value)}
                  error={errors.benefitAmount}
                  placeholder="5000"
                />
              )}
            </>
          )}
        </div>

        <div className="mt-6">
          <Button onClick={handleCalculate} className="w-full">
            Рассчитать налог на землю
          </Button>
        </div>
      </Card>

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <h3 className="text-lg font-semibold mb-4">Налог к доплате</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {result.taxAmount.toLocaleString('ru-RU')} руб
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  в год
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Ставка налога</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {result.taxRate}%
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  от кадастровой стоимости
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold mb-4">Льготы</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {result.benefits.toLocaleString('ru-RU')} руб
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  экономия
                </div>
              </div>
            </Card>
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
                      ? item.value.toLocaleString('ru-RU') + (item.description.includes('ставка') || item.description.includes('коэффициент') ? '%' : ' руб')
                      : item.value
                    }
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold mb-4">Дополнительная информация</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800">
                    Важная информация
                  </h4>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Налог уплачивается до 1 декабря следующего года</li>
                      <li>Кадастровая стоимость пересматривается каждые 3-5 лет</li>
                      <li>Льготы предоставляются при подаче заявления в ФНС</li>
                      <li>Для получения льгот необходимы подтверждающие документы</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
