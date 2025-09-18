'use client'

import { useEffect } from 'react'

export default function PerformanceOptimizer() {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload fonts
      const fontLink = document.createElement('link')
      fontLink.rel = 'preload'
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
      fontLink.as = 'style'
      document.head.appendChild(fontLink)

      // Preload critical images
      const criticalImages = [
        '/og-image.jpg',
        '/screenshot.jpg'
      ]

      criticalImages.forEach(src => {
        const link = document.createElement('link')
        link.rel = 'preload'
        link.href = src
        link.as = 'image'
        document.head.appendChild(link)
      })
    }

    // Optimize images
    const optimizeImages = () => {
      const images = document.querySelectorAll('img')
      images.forEach(img => {
        // Add loading="lazy" for non-critical images
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy')
        }
        
        // Add decoding="async" for better performance
        if (!img.hasAttribute('decoding')) {
          img.setAttribute('decoding', 'async')
        }
      })
    }

    // Add performance monitoring
    const addPerformanceMonitoring = () => {
      // Monitor Core Web Vitals
      import('web-vitals').then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
        onCLS(console.log)
        onFCP(console.log)
        onINP(console.log)
        onLCP(console.log)
        onTTFB(console.log)
      }).catch(() => {
        // Silently fail if web-vitals is not available
        console.log('Web Vitals monitoring not available')
      })
    }

    preloadCriticalResources()
    optimizeImages()
    addPerformanceMonitoring()
  }, [])

  return null
}

// Hook for lazy loading components
export function useLazyLoad() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement
            element.classList.add('loaded')
            observer.unobserve(element)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    )

    const lazyElements = document.querySelectorAll('[data-lazy]')
    lazyElements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])
}
