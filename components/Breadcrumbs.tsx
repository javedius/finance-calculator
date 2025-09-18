import Link from 'next/link'
import StructuredData from './StructuredData'

interface BreadcrumbItem {
  name: string
  href: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const breadcrumbStructuredData = {
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://finkalk.ru${item.href}`,
    })),
  }

  return (
    <>
      <StructuredData type="BreadcrumbList" data={breadcrumbStructuredData} />
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6" aria-label="Хлебные крошки">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Главная
        </Link>
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            {index === items.length - 1 ? (
              <span className="text-gray-900 font-medium">{item.name}</span>
            ) : (
              <Link href={item.href} className="hover:text-blue-600 transition-colors">
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </>
  )
}
