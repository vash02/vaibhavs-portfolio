'use client'

import { useEffect } from 'react'

export const VisitorTracker = () => {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        await fetch('/api/visitor-count', {
          method: 'POST',
        })
      } catch (error) {
        console.error('Error tracking visit:', error)
      }
    }

    trackVisit()
  }, [])

  return null // This component doesn't render anything
} 