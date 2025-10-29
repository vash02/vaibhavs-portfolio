'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function VisitorStats() {
  const [visitorData, setVisitorData] = useState<{ totalVisits: number; visitors: Array<{ timestamp: string; userAgent: string; referrer: string; ip: string }> } | null>(null)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/visitor-data')
        if (!response.ok) {
          throw new Error('Failed to fetch visitor data')
        }
        const data = await response.json()
        setVisitorData(data)
      } catch {
        setError('Failed to load visitor data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/admin/login')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Visitor Statistics</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Summary</h2>
          <div className="text-2xl font-bold text-blue-500">
            Total Visits: {visitorData?.totalVisits || 0}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Visitors</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 border-b border-gray-700">
                  <th className="pb-4">Time</th>
                  <th className="pb-4">Source</th>
                  <th className="pb-4">Device</th>
                </tr>
              </thead>
              <tbody>
                {visitorData?.visitors.slice().reverse().map((visitor: { timestamp: string; userAgent: string; referrer: string; ip: string }, index: number) => (
                  <tr key={index} className="border-b border-gray-700">
                    <td className="py-4 text-gray-300">
                      {new Date(visitor.timestamp).toLocaleString()}
                    </td>
                    <td className="py-4 text-gray-300">
                      {visitor.referrer === 'direct' ? 'Direct Visit' : visitor.referrer}
                    </td>
                    <td className="py-4 text-gray-300">
                      {visitor.userAgent}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 