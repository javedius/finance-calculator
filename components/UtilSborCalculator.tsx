'use client'

import { useState } from 'react'
import Card from './Card'
import Input from './Input'
import Button from './Button'
import { calculateUtilSbor, formatCurrency, UtilSborParams, VehicleCategory } from '@/utils/calcUtilSbor'

export default function UtilSborCalculator() {
  const [formData, setFormData] = useState<UtilSborParams>({
    engineVolume: 0,
    power: 0,
    age: 0,
    category: 'passenger',
    isElectric: false,
    isHybrid: false,
    isImported: false
  })

  // Рассчитываем утильсбор в реальном времени
  const calculation = (() => {
    if (formData.engineVolume <= 0 || formData.power <= 0 || formData.age < 0) {
      return null
    }
    return calculateUtilSbor(formData)
  })()

  const handleInputChange = (field: keyof UtilSborParams, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleClear = () => {
    setFormData({
      engineVolume: 0,
      power: 0,
      age: 0,
      category: 'passenger',
      isElectric: false,
      isHybrid: false,
      isImported: false
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Расчет утильсбора</h2>
          <p className="text-gray-600">
            Введите параметры автомобиля для расчета утильсбора
          </p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Объем двигателя (см³)"
                type="number"
                value={formData.engineVolume.toString()}
                onChange={(e) => handleInputChange('engineVolume', e.target.value)}
                placeholder="Введите объем двигателя"
                min="0"
              />
              
              <Input
                label="Мощность (л.с.)"
                type="number"
                value={formData.power.toString()}
                onChange={(e) => handleInputChange('power', e.target.value)}
                placeholder="Введите мощность"
                min="0"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Возраст авто (лет)"
                type="number"
                value={formData.age.toString()}
                onChange={(e) => handleInputChange('age', e.target.value)}
                placeholder="Введите возраст"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <label className="label">Категория транспортного средства</label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value as VehicleCategory)}
                className="input-field"
              >
                <option value="passenger">Легковой автомобиль</option>
                <option value="truck">Грузовой автомобиль</option>
                <option value="motorcycle">Мотоцикл</option>
              </select>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <label className="label">Тип двигателя</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isElectric}
                      onChange={(e) => handleInputChange('isElectric', e.target.checked)}
                      className="mr-2"
                    />
                    <span>Электромобиль</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isHybrid}
                      onChange={(e) => handleInputChange('isHybrid', e.target.checked)}
                      className="mr-2"
                    />
                    <span>Гибридный автомобиль</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="label">Происхождение</label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isImported}
                    onChange={(e) => handleInputChange('isImported', e.target.checked)}
                    className="mr-2"
                  />
                  <span>Импортный автомобиль</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                {/* Поле остается пустым для выравнивания */}
              </div>
              <div className="flex gap-2 items-end">
                <Button variant="secondary" onClick={handleClear} className="w-full sm:w-auto">
                  Очистить
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {calculation && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Результаты расчета</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Объем двигателя:</span>
                <span className="font-medium">{formData.engineVolume} см³</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Мощность:</span>
                <span className="font-medium">{formData.power} л.с.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Возраст:</span>
                <span className="font-medium">{formData.age} лет</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Категория:</span>
                <span className="font-medium">
                  {formData.category === 'passenger' ? 'Легковой' : 
                   formData.category === 'truck' ? 'Грузовой' : 'Мотоцикл'}
                </span>
              </div>
              <div className="flex justify-between text-red-600">
                <span>Утильсбор к уплате:</span>
                <span className="font-semibold">{formatCurrency(calculation.totalUtilSbor)}</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Детализация расчета</h3>
            <div className="space-y-2">
              <div className="text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Базовая ставка:</span>
                  <span>{formatCurrency(calculation.breakdown.baseAmount)}</span>
                </div>
              </div>
              <div className="text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Возрастной коэффициент:</span>
                  <span>{calculation.ageCoefficient}x</span>
                </div>
              </div>
              <div className="text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Экологический коэффициент:</span>
                  <span>{calculation.ecoCoefficient}x</span>
                </div>
              </div>
              <div className="text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Импортный коэффициент:</span>
                  <span>{calculation.importCoefficient}x</span>
                </div>
              </div>
              <div className="text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Коэффициент категории:</span>
                  <span>{calculation.categoryCoefficient}x</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Справочная информация</h3>
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 font-medium">
            ℹ️ Данные актуальны с 1 ноября 2025 года согласно новым требованиям РФ
          </p>
        </div>
        <div className="space-y-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Официальная таблица ставок (базовая ставка 20 000 ₽):</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-2 py-1 text-left">Объем (см³)</th>
                    <th className="border border-gray-300 px-2 py-1 text-left">Мощность (л.с.)</th>
                    <th className="border border-gray-300 px-2 py-1 text-center">Новые (≤3 лет)</th>
                    <th className="border border-gray-300 px-2 py-1 text-center">Старше 3 лет</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-2 py-1" rowSpan={4}>До 1000</td>
                    <td className="border border-gray-300 px-2 py-1">До 160</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">3 400 ₽</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">5 200 ₽</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-1">161-220</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">256-264 тыс. ₽</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">474-517 тыс. ₽</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-1">221-250</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">270 тыс. ₽</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">502 тыс. ₽</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-1">251+</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">288 тыс. ₽</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">530 тыс. ₽</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-1" rowSpan={4}>1000-2000</td>
                    <td className="border border-gray-300 px-2 py-1">До 160</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">3 400 ₽</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">5 200 ₽</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-1">161-220</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">750-794 тыс. ₽</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">900-953 тыс. ₽</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-1">221-280</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">842-902 тыс. ₽</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">1,01-1,14 млн ₽</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-1">281+</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">952+ тыс. ₽</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">1,29+ млн ₽</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-1" rowSpan={4}>2000-3000</td>
                    <td className="border border-gray-300 px-2 py-1">До 160</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">2,15 млн ₽</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">3,3 млн ₽</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-1">161-220</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">2,79-2,84 млн ₽</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">3,66-3,71 млн ₽</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-1">221-310</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">2,88-3 млн ₽</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">3,77-3,98 млн ₽</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-1">311+</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">3,05+ млн ₽</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">4,03+ млн ₽</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-1" rowSpan={4}>3000+</td>
                    <td className="border border-gray-300 px-2 py-1">До 160</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">2,15-2,74 млн ₽</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">3,3-3,6 млн ₽</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-1">161-220</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">2,79-3,41 млн ₽</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">3,66-4,39 млн ₽</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-1">221-310</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">3,56-3,81 млн ₽</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">5,12-5,74 млн ₽</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-1">311+</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">3,81+ млн ₽</td>
                    <td className="border border-gray-300 px-2 py-1 text-center">5,74+ млн ₽</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Дополнительные коэффициенты:</h4>
            <ul className="space-y-1">
              <li>• <strong>Экологические:</strong> электромобиль 0.5, гибрид 0.7, обычный 1.0</li>
              <li>• <strong>Импортные:</strong> импортный 1.2, местный 1.0</li>
              <li>• <strong>Категории:</strong> легковой 1.0, грузовой 1.5, мотоцикл 0.3</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
