import { ReactNode } from 'react'
import Card from './Card'

interface ResultCardProps {
  title: string
  value: string | number
  description?: string
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'secondary'
  className?: string
}

export default function ResultCard({ 
  title, 
  value, 
  description, 
  variant = 'primary',
  className = '' 
}: ResultCardProps) {
  const valueClasses = {
    primary: 'result-primary',
    success: 'result-success',
    danger: 'result-danger',
    warning: 'result-warning',
    secondary: 'result-secondary'
  }

  return (
    <Card className={className}>
      <h3 className="card-subheader">{title}</h3>
      <div className="text-center">
        <div className={valueClasses[variant]}>
          {typeof value === 'number' ? value.toLocaleString('ru-RU') : value}
        </div>
        {description && (
          <div className="result-description">{description}</div>
        )}
      </div>
    </Card>
  )
}
