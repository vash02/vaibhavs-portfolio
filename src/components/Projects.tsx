'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface Project {
  name: string;
  description: string;
  url: string;
  stargazerCount: number;
  forkCount: number;
}

export const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPinnedRepos = async () => {
      // Try to get token from environment variables
      const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN
      
      console.log('Environment token (first 10 chars):', token ? token.substring(0, 10) + '...' : 'undefined')
      console.log('All env vars:', Object.keys(process.env).filter(key => key.includes('GITHUB')))
      
      if (!token || token === 'your-github-token-here') {
        setError('GitHub integration not configured. Please add a valid NEXT_PUBLIC_GITHUB_TOKEN to your .env.local file.')
        setLoading(false)
        return
      }

      try {
        const response = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: `
              query {
                user(login: "vash02") {
                  pinnedItems(first: 6, types: REPOSITORY) {
                    nodes {
                      ... on Repository {
                        name
                        description
                        url
                        stargazerCount
                        forkCount
                      }
                    }
                  }
                }
              }
            `,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error('GitHub API Error:', errorData)
          console.error('Response status:', response.status)
          console.error('Response headers:', Object.fromEntries(response.headers.entries()))
          throw new Error(`GitHub API Error (${response.status}): ${errorData.message || errorData.error || 'Failed to fetch repositories'}`)
        }

        const data = await response.json()
        console.log('GitHub API Response:', data)
        
        if (data.errors) {
          throw new Error(`GitHub API Error: ${data.errors[0].message}`)
        }
        
        setProjects(data.data.user.pinnedItems.nodes)
        setLoading(false)
      } catch (err: unknown) {
        console.error('Error fetching pinned repositories:', err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
        setLoading(false)
      }
    }

    fetchPinnedRepos()
  }, [])

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              My Projects
            </h2>
            <div className="text-gray-300 text-lg">Loading projects from GitHub...</div>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="projects" className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              My Projects
            </h2>
            <div className="text-red-400 text-lg mb-4">Error: {error}</div>
            <div className="text-gray-300 text-sm">
              Make sure you have a valid GitHub token configured and have pinned repositories on your GitHub profile.
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              My Projects
            </h2>
            <a 
              href="#recommendations" 
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
            >
              Content Recommendations
            </a>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <motion.div
                key={project.name}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="bg-gray-800 p-6 rounded-lg shadow-lg"
              >
                <h3 className="text-2xl font-semibold mb-2 text-white">{project.name}</h3>
                <p className="text-gray-300 mb-4">{project.description}</p>
                <div className="flex justify-between items-center">
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">View on GitHub</a>
                  <div className="flex space-x-4">
                    <span className="text-gray-300">⭐ {project.stargazerCount}</span>
                    <span className="text-gray-300">🍴 {project.forkCount}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
} 