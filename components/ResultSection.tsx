import { ReactNode } from 'react'
import Card from './Card'

interface ResultItem {
  label: string
  value: string | number
  variant?: 'default' | 'primary' | 'success' | 'danger'
  className?: string
}

interface ResultSectionProps {
  title: string
  items: ResultItem[]
  className?: string
  children?: ReactNode
}

export default function ResultSection({ 
  title, 
  items, 
  className = '',
  children 
}: ResultSectionProps) {
  const getValueClass = (variant?: 'default' | 'primary' | 'success' | 'danger') => {
    switch (variant) {
      case 'primary':
        return 'result-item-value-primary'
      case 'success':
        return 'result-item-value-success'
      case 'danger':
        return 'result-item-value-danger'
      default:
        return 'result-item-value'
    }
  }

  return (
    <Card className={className}>
      <h3 className="card-subheader">{title}</h3>
      <div className="result-section">
        {items.map((item, index) => (
          <div key={index} className={`result-item ${item.className || ''}`}>
            <span className="result-item-label">{item.label}</span>
            <span className={getValueClass(item.variant)}>
              {typeof item.value === 'number' ? item.value.toLocaleString('ru-RU') : item.value}
            </span>
          </div>
        ))}
        {children}
      </div>
    </Card>
  )
}
