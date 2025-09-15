import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  children?: ReactNode
}

export default function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
      {description && (
        <p className="text-gray-600 text-lg">{description}</p>
      )}
      {children}
    </div>
  )
}
