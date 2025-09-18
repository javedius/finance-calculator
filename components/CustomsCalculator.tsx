'use client'

import { useState } from 'react'
import Card from './Card'
import Input from './Input'
import Button from './Button'
import { calculateCustoms, formatCurrency, formatPercent, CustomsParams, VehicleCategory, EngineType } from '@/utils/calcCustoms'

export default function CustomsCalculator() {
    const [formData, setFormData] = useState<CustomsParams>({
        engineVolume: 0,
        power: 0,
        age: 0,
        category: 'passenger',
        engineType: 'gasoline',
        isImported: true,
        customsValue: 0,
        engineDisplacement: 0,
        isElectric: false,
        isHybrid: false
    })

    // Рассчитываем растаможку в реальном времени
    const calculation = (() => {
        // Минимальные требования для расчета
        if (formData.engineVolume <= 0 || formData.power <= 0 || formData.customsValue <= 0) {
            return null
        }

        // Если возраст не указан, считаем новым (0 лет)
        const age = formData.age >= 0 ? formData.age : 0

        // Если рабочий объем не указан, используем объем двигателя
        const engineDisplacement = formData.engineDisplacement > 0 ? formData.engineDisplacement : formData.engineVolume

        try {
            const result = calculateCustoms({
                ...formData,
                age,
                engineDisplacement
            })

            // Отладочная информация
            console.log('Расчет растаможки:', {
                params: { ...formData, age, engineDisplacement },
                result: {
                    customsDuty: result.customsDuty,
                    vat: result.vat,
                    excise: result.excise,
                    utilSbor: result.utilSbor,
                    totalCustoms: result.totalCustoms,
                    totalWithUtilSbor: result.totalWithUtilSbor
                }
            })

            return result
        } catch (error) {
            console.error('Ошибка расчета растаможки:', error)
            return null
        }
    })()

    const handleInputChange = (field: keyof CustomsParams, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]:
                typeof value === 'boolean'
                    ? value
                    : ['engineVolume', 'power', 'age', 'customsValue', 'engineDisplacement'].includes(field)
                        ? Number(value) // 👈 преобразуем к числу
                        : value
        }))
    }

    const handleClear = () => {
        setFormData({
            engineVolume: 0,
            power: 0,
            age: 0,
            category: 'passenger',
            engineType: 'gasoline',
            isImported: true,
            customsValue: 0,
            engineDisplacement: 0,
            isElectric: false,
            isHybrid: false
        })
    }

    return (
        <div className="space-y-6">
            <Card>
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-900">Расчет растаможки</h2>
                    <p className="text-gray-600">
                        Введите параметры автомобиля для расчета таможенных платежей и утильсбора
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

                            <Input
                                label="Таможенная стоимость (руб.)"
                                type="number"
                                value={formData.customsValue.toString()}
                                onChange={(e) => handleInputChange('customsValue', e.target.value)}
                                placeholder="Введите стоимость"
                                min="0"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                label="Рабочий объем (см³)"
                                type="number"
                                value={formData.engineDisplacement.toString()}
                                onChange={(e) => handleInputChange('engineDisplacement', e.target.value)}
                                placeholder="Для расчета пошлин"
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

                        <div className="space-y-2">
                            <label className="label">Тип двигателя</label>
                            <select
                                value={formData.engineType}
                                onChange={(e) => handleInputChange('engineType', e.target.value as EngineType)}
                                className="input-field"
                            >
                                <option value="gasoline">Бензиновый</option>
                                <option value="diesel">Дизельный</option>
                                <option value="electric">Электрический</option>
                                <option value="hybrid">Гибридный</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <div className="space-y-2">
                                <label className="label">Дополнительные параметры</label>
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
                                <span className="text-gray-600">Таможенная стоимость:</span>
                                <span className="font-medium">{formatCurrency(calculation.breakdown.customsValue)}</span>
                            </div>
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
                            <div className="flex justify-between text-red-600">
                                <span>Таможенная пошлина:</span>
                                <span className="font-semibold">{formatCurrency(calculation.customsDuty)}</span>
                            </div>
                            <div className="flex justify-between text-red-600">
                                <span>НДС (20%):</span>
                                <span className="font-semibold">{formatCurrency(calculation.vat)}</span>
                            </div>
                            <div className="flex justify-between text-red-600">
                                <span>Акциз:</span>
                                <span className="font-semibold">{formatCurrency(calculation.excise)}</span>
                            </div>
                            <div className="flex justify-between text-red-600">
                                <span>Утильсбор:</span>
                                <span className="font-semibold">{formatCurrency(calculation.utilSbor)}</span>
                            </div>
                            <div className="flex justify-between text-blue-600 border-t pt-3">
                                <span className="font-medium">Итого таможенные платежи:</span>
                                <span className="font-semibold">{formatCurrency(calculation.totalCustoms)}</span>
                            </div>
                            <div className="flex justify-between text-green-600 border-t pt-3">
                                <span className="font-medium text-lg">Общая сумма к уплате:</span>
                                <span className="font-semibold text-lg">{formatCurrency(calculation.totalWithUtilSbor)}</span>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Детализация расчета</h3>
                        <div className="space-y-2">
                            <div className="text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Ставка пошлины:</span>
                                    <span>{formatPercent(calculation.breakdown.dutyRate)}</span>
                                </div>
                            </div>
                            <div className="text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">База для НДС:</span>
                                    <span>{formatCurrency(calculation.breakdown.vatBase)}</span>
                                </div>
                            </div>
                            <div className="text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Категория:</span>
                                    <span>
                                        {formData.category === 'passenger' ? 'Легковой' :
                                            formData.category === 'truck' ? 'Грузовой' : 'Мотоцикл'}
                                    </span>
                                </div>
                            </div>
                            <div className="text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Тип двигателя:</span>
                                    <span>
                                        {formData.engineType === 'gasoline' ? 'Бензиновый' :
                                            formData.engineType === 'diesel' ? 'Дизельный' :
                                                formData.engineType === 'electric' ? 'Электрический' : 'Гибридный'}
                                    </span>
                                </div>
                            </div>
                            <div className="text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Экологические льготы:</span>
                                    <span>
                                        {formData.isElectric ? 'Электромобиль' :
                                            formData.isHybrid ? 'Гибрид' : 'Обычный ДВС'}
                                    </span>
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
                        ℹ️ Данные актуальны с 1 ноября 2025 года согласно требованиям РФ
                    </p>
                </div>
                <div className="space-y-4 text-sm text-gray-600">
                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">Ставки таможенных пошлин:</h4>
                        <ul className="space-y-1">
                            <li>• До 1000 см³ → 20%</li>
                            <li>• 1000-1500 см³ → 25%</li>
                            <li>• 1500-1800 см³ → 30%</li>
                            <li>• 1800-2300 см³ → 35%</li>
                            <li>• 2300-3000 см³ → 40%</li>
                            <li>• Свыше 3000 см³ → 50%</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">Ставки акциза (руб/л):</h4>
                        <ul className="space-y-1">
                            <li>• До 1000 см³ → 0 руб/л</li>
                            <li>• 1000-1500 см³ → 45 руб/л</li>
                            <li>• 1500-1800 см³ → 50 руб/л</li>
                            <li>• 1800-2300 см³ → 60 руб/л</li>
                            <li>• 2300-3000 см³ → 80 руб/л</li>
                            <li>• Свыше 3000 см³ → 100 руб/л</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-medium text-gray-900 mb-2">Дополнительные коэффициенты:</h4>
                        <ul className="space-y-1">
                            <li>• <strong>НДС:</strong> 20% от (стоимость + пошлина + акциз)</li>
                            <li>• <strong>Экологические:</strong> электромобиль 0.1, гибрид 0.5, обычный 1.0</li>
                            <li>• <strong>Категории:</strong> легковой 1.0, грузовой 1.2, мотоцикл 0.3</li>
                            <li>• <strong>Утильсбор:</strong> рассчитывается по официальной таблице</li>
                        </ul>
                    </div>
                </div>
            </Card>
        </div>
    )
}
