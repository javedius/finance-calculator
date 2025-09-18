import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  icon?: string
  children?: ReactNode
}

export default function PageHeader({ title, description, icon, children }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center space-x-3 mb-2">
        {icon && <span className="text-4xl">{icon}</span>}
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      </div>
      {description && (
        <p className="text-gray-600 text-lg">{description}</p>
      )}
      {children}
    </div>
  )
}
