# Финансовый калькулятор

Сайт на Next.js для расчета налогов по прогрессивной шкале в РФ.

## Возможности

- 🧮 Калькулятор НДФЛ по прогрессивной шкале
- 📊 Детализация расчета по налоговым ставкам
- 🎨 Сдержанный и современный дизайн
- 📱 Адаптивная верстка
- 🔧 Легкое добавление новых страниц

## Технологии

- Next.js 14 с App Router
- TypeScript
- Tailwind CSS
- Переиспользуемые компоненты

## Запуск проекта

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## Добавление новых страниц

### 1. Создайте файл страницы

Создайте новый файл в папке `app/`:

```
app/новая-страница/page.tsx
```

### 2. Добавьте страницу в навигацию

Откройте файл `utils/navigation.ts` и добавьте новую страницу:

```typescript
import { addNavigationItem } from '@/utils/navigation'

// Добавить новую страницу
addNavigationItem({
  name: 'Название страницы',
  href: '/новая-страница',
  description: 'Описание страницы'
})
```

### 3. Используйте готовые компоненты

Используйте переиспользуемые компоненты для единообразного дизайна:

```tsx
import PageHeader from '@/components/PageHeader'
import Card from '@/components/Card'
import Button from '@/components/Button'
import Input from '@/components/Input'

export default function NewPage() {
  return (
    <div>
      <PageHeader
        title="Заголовок страницы"
        description="Описание страницы"
      />
      <Card>
        {/* Содержимое страницы */}
      </Card>
    </div>
  )
}
```

## Доступные компоненты

- `PageHeader` - заголовок страницы с описанием
- `Card` - карточка с содержимым
- `Button` - кнопка (primary/secondary)
- `Input` - поле ввода с лейблом и валидацией
- `Navigation` - навигационное меню

## Структура проекта

```
├── app/
│   ├── layout.tsx          # Основной layout
│   ├── page.tsx           # Главная страница
│   ├── about/
│   │   └── page.tsx       # Страница "О проекте"
│   └── globals.css        # Глобальные стили
├── components/
│   ├── Navigation.tsx     # Навигация
│   ├── PageHeader.tsx    # Заголовок страницы
│   ├── Card.tsx          # Карточка
│   ├── Button.tsx        # Кнопка
│   └── Input.tsx         # Поле ввода
├── utils/
│   ├── navigation.ts      # Управление навигацией
│   └── taxCalculator.ts   # Логика расчета налогов
└── README.md
```
