interface StructuredDataProps {
  type: 'WebApplication' | 'SoftwareApplication' | 'FAQPage' | 'BreadcrumbList'
  data: any
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'WebApplication':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          ...data,
        }
      case 'SoftwareApplication':
        return {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          ...data,
        }
      case 'FAQPage':
        return {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          ...data,
        }
      case 'BreadcrumbList':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          ...data,
        }
      default:
        return data
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(getStructuredData(), null, 2),
      }}
    />
  )
}

// Предустановленные структурированные данные для калькуляторов
export const calculatorStructuredData = {
  name: 'Финансовый калькулятор',
  description: 'Бесплатные онлайн калькуляторы для расчета налогов, ипотеки, кредитов и других финансовых операций',
  url: 'https://finkalk.ru',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'RUB',
  },
  author: {
    '@type': 'Organization',
    name: 'Финансовый калькулятор',
  },
  publisher: {
    '@type': 'Organization',
    name: 'Финансовый калькулятор',
  },
  inLanguage: 'ru',
  isAccessibleForFree: true,
  browserRequirements: 'Requires JavaScript. Requires HTML5.',
  screenshot: 'https://finkalk.ru/screenshot.jpg',
}

export const faqStructuredData = {
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Как пользоваться финансовым калькулятором?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Выберите нужный калькулятор, введите данные в поля формы и нажмите кнопку "Рассчитать". Результат появится мгновенно.',
      },
    },
    {
      '@type': 'Question',
      name: 'Актуальны ли ставки в калькуляторах?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Да, все ставки и формулы обновляются в соответствии с действующим законодательством РФ.',
      },
    },
    {
      '@type': 'Question',
      name: 'Безопасно ли вводить свои данные?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Да, все расчеты происходят локально в вашем браузере. Ваши данные не передаются на сервер и не сохраняются.',
      },
    },
  ],
}
