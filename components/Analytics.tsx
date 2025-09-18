'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Google Analytics 4
export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  useEffect(() => {
    // Load Google Analytics
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    document.head.appendChild(script)

    // Initialize gtag
    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) {
      window.dataLayer.push(args)
    }
    gtag('js', new Date())
    gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
    })

    // Track page views
    const handleRouteChange = () => {
      gtag('config', measurementId, {
        page_title: document.title,
        page_location: window.location.href,
      })
    }

    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [measurementId])

  return null
}

// Yandex Metrica
export function YandexMetrica({ counterId }: { counterId: string }) {
  useEffect(() => {
    // Load Yandex Metrica
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.innerHTML = `
      (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
      (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
      ym(${counterId}, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
      });
    `
    document.head.appendChild(script)

    // Add noscript fallback
    const noscript = document.createElement('noscript')
    noscript.innerHTML = `<div><img src="https://mc.yandex.ru/watch/${counterId}" style="position:absolute; left:-9999px;" alt="" /></div>`
    document.body.appendChild(noscript)
  }, [counterId])

  return null
}

// Track calculator usage
export function useCalculatorTracking() {
  const pathname = usePathname()

  const trackCalculatorUsage = (calculatorName: string, action: string, data?: any) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: 'Calculator',
        event_label: calculatorName,
        custom_parameters: data,
      })
    }

    if (typeof window !== 'undefined' && window.ym) {
      window.ym(Number(window.YANDEX_METRIKA_ID), 'reachGoal', `calculator_${action}`, {
        calculator: calculatorName,
        ...data,
      })
    }
  }

  const trackPageView = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: pathname,
      })
    }
  }

  useEffect(() => {
    trackPageView()
  }, [pathname])

  return { trackCalculatorUsage, trackPageView }
}

// SEO tracking
export function useSEOTracking() {
  const trackSearchQuery = (query: string, position: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'search', {
        search_term: query,
        position: position,
      })
    }
  }

  const trackCalculatorSearch = (query: string, results: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'calculator_search', {
        search_term: query,
        results_count: results,
      })
    }
  }

  return { trackSearchQuery, trackCalculatorSearch }
}

// Declare global types
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
    ym: (id: number, action: string, goal: string, params?: any) => void
    YANDEX_METRIKA_ID: string | number
  }
}
