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
      try {
        const response = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
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
          throw new Error('Failed to fetch pinned repositories')
        }

        const data = await response.json()
        console.log('GitHub API Response:', data)
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

  if (loading) return <div>Loading projects...</div>
  if (error) return <div>Error: {error}</div>

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
          <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            My Projects
          </h2>
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