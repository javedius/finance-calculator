import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://finkalk.ru'
  const currentDate = new Date().toISOString()

  // Статические страницы
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1,
    },
  ]

  // Страницы калькуляторов
  const calculatorPages = [
    { path: '/ndfl', priority: 0.9 },
    { path: '/mortgage', priority: 0.9 },
    { path: '/loans-credits', priority: 0.8 },
    { path: '/insurance-contributions', priority: 0.8 },
    { path: '/property-tax', priority: 0.7 },
    { path: '/transport-tax', priority: 0.7 },
    { path: '/land-tax', priority: 0.7 },
    { path: '/utilities', priority: 0.6 },
    { path: '/util-sbor', priority: 0.6 },
    { path: '/pension-savings', priority: 0.6 },
    { path: '/investment-returns', priority: 0.6 },
    { path: '/payback-period', priority: 0.5 },
    { path: '/energy-savings', priority: 0.5 },
    { path: '/fines-penalties', priority: 0.5 },
    { path: '/customs', priority: 0.5 },
    { path: '/currency-converter', priority: 0.5 },
  ]

  const calculatorSitemap = calculatorPages.map((page) => ({
    url: `${baseUrl}${page.path}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: page.priority,
  }))

  return [...staticPages, ...calculatorSitemap]
}
