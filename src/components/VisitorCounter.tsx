'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export const VisitorCounter = () => {
  const [count, setCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const incrementCounter = async () => {
      try {
        // First get the current count
        const response = await fetch('/api/visitor-count')
        const data = await response.json()
        setCount(data.count)

        // Then increment it
        const incrementResponse = await fetch('/api/visitor-count', {
          method: 'POST',
        })
        const incrementData = await incrementResponse.json()
        setCount(incrementData.count)
      } catch (error) {
        console.error('Error updating visitor count:', error)
      } finally {
        setIsLoading(false)
      }
    }

    incrementCounter()
  }, [])

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 bg-opacity-90 px-4 py-2 rounded-lg shadow-lg z-50">
      <div className="flex items-center space-x-2">
        <svg
          className="w-5 h-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        <span className="text-gray-300">Visitors:</span>
        <motion.span
          key={count}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-blue-500 font-bold"
        >
          {isLoading ? '...' : count.toLocaleString()}
        </motion.span>
      </div>
    </div>
  )
} 