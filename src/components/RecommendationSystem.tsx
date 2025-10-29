'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

// Content interfaces
interface ContentItem {
  id: string
  title: string
  topics: string[]
  description: string
  url: string
  type: 'article' | 'project'
  publishedAt?: string
  stars?: number
}

// Default topics - will be replaced with actual content topics
const defaultTopics = [
  "AI", "Machine Learning", "Deep Learning", "NLP", "LLM",
  "Computer Vision", "Python", "Data Science", "RL", "GAN",
  "Flask", "RAG", "Vector Similarity", "Unsupervised Scoring",
  "TensorFlow", "PyTorch", "scikit-learn", "Hugging Face",
  "Apache Spark", "Docker", "Kubernetes", "AWS", "GCP", "Azure"
]

// Note: Topic mapping removed - now using only actual tags from APIs

export const RecommendationSystem = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [recommendations, setRecommendations] = useState<ContentItem[]>([])
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [contentDatabase, setContentDatabase] = useState<{ articles: ContentItem[], projects: ContentItem[] }>({
    articles: [],
    projects: []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [availableTopics, setAvailableTopics] = useState<string[]>(defaultTopics)

  // Fetch GitHub projects
  const fetchGitHubProjects = async (): Promise<ContentItem[]> => {
    try {
      const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN
      if (!token || token === 'your-github-token-here') {
        throw new Error('GitHub token not configured')
      }

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
                pinnedItems(first: 10, types: REPOSITORY) {
                  nodes {
                    ... on Repository {
                      name
                      description
                      url
                      stargazerCount
                      repositoryTopics(first: 10) {
                        nodes {
                          topic {
                            name
                          }
                        }
                      }
                      updatedAt
                    }
                  }
                }
              }
            }
          `,
        }),
      })

      if (!response.ok) {
        throw new Error(`GitHub API Error: ${response.status}`)
      }

      const data = await response.json()
      if (data.errors) {
        throw new Error(`GitHub API Error: ${data.errors[0].message}`)
      }

      return data.data.user.pinnedItems.nodes.map((repo: { name: string; description: string; url: string; stargazerCount: number; repositoryTopics: { nodes: { topic: { name: string } }[] }; updatedAt: string }) => ({
        id: `github-${repo.name}`,
        title: repo.name,
        description: repo.description || 'No description available',
        url: repo.url,
        type: 'project' as const,
        topics: repo.repositoryTopics.nodes.map((topic: any) => topic.topic.name),
        stars: repo.stargazerCount,
        publishedAt: repo.updatedAt
      }))
    } catch (error) {
      console.error('Error fetching GitHub projects:', error)
      return []
    }
  }

  // Fetch Medium articles (using RSS feed)
  const fetchMediumArticles = async (): Promise<ContentItem[]> => {
    try {
      // Medium RSS feed URL - you'll need to replace with your actual Medium username
      const rssUrl = 'https://medium.com/feed/@vaibh48'
      
      // Use a CORS proxy for RSS feed
      const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
      
      const response = await fetch(proxyUrl)
      if (!response.ok) {
        throw new Error(`Medium RSS Error: ${response.status}`)
      }

      const data = await response.json()
      if (data.status !== 'ok') {
        throw new Error('Failed to parse Medium RSS feed')
      }

      return data.items.map((item: { title: string; description: string; link: string; categories: string[]; pubDate: string }, index: number) => ({
        id: `medium-${index}`,
        title: item.title,
        description: item.description.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
        url: item.link,
        type: 'article' as const,
        topics: item.categories || [], // Use ONLY actual Medium tags
        publishedAt: item.pubDate
      }))
    } catch (error) {
      console.error('Error fetching Medium articles:', error)
      return []
    }
  }

  // Note: Content extraction removed - now using only actual tags from APIs

  // Extract all unique topics from content
  const extractAllTopics = (content: { articles: ContentItem[], projects: ContentItem[] }) => {
    const allTopics = new Set<string>()
    
    // Add topics from articles
    content.articles.forEach(article => {
      article.topics.forEach(topic => allTopics.add(topic))
    })
    
    // Add topics from projects
    content.projects.forEach(project => {
      project.topics.forEach(topic => allTopics.add(topic))
    })
    
    // Convert to array and sort
    return Array.from(allTopics).sort()
  }

  // Load content on component mount
  useEffect(() => {
    const loadContent = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const [projects, articles] = await Promise.all([
          fetchGitHubProjects(),
          fetchMediumArticles()
        ])
        
        const content = { projects, articles }
        setContentDatabase(content)
        
        // Extract and set available topics from actual content
        const topicsFromContent = extractAllTopics(content)
        if (topicsFromContent.length > 0) {
          setAvailableTopics(topicsFromContent)
        }
      } catch (error) {
        setError('Failed to load content. Please try again later.')
        console.error('Error loading content:', error)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [])

  const getRecommendations = () => {
    if (selectedTopics.length === 0) return

    // Combine articles and projects
    const allContent = [...contentDatabase.articles, ...contentDatabase.projects]

    if (allContent.length === 0) {
      setError('No content available for recommendations')
      return
    }

    // Score each content based on topic matches
    const scoredContent = allContent.map(content => {
      const matchingTopics = content.topics.filter(topic => 
        selectedTopics.includes(topic)
      ).length
      const score = matchingTopics / Math.max(content.topics.length, 1)
      return { ...content, score }
    })

    // Sort by score and get top 3 recommendations
    const topRecommendations = scoredContent
      .filter(content => content.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)

    setRecommendations(topRecommendations)
    setShowRecommendations(true)
  }

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev => 
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    )
  }

  return (
    <section id="recommendations" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Personalized Content Recommendations
          </h2>
          
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
            <p className="text-gray-300 mb-6 text-center">
              Select topics you&apos;re interested in, and I&apos;ll recommend relevant articles and projects from my portfolio.
            </p>
            
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-gray-300 mt-2">Loading your content...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-6">
                <p className="font-semibold">Error:</p>
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && (
              <div className="mb-8">
                <div className="flex flex-wrap gap-2 mb-4">
                  {availableTopics.map((topic) => (
                    <button
                      key={topic}
                      onClick={() => toggleTopic(topic)}
                      className={`px-4 py-2 rounded-full transition-colors ${
                        selectedTopics.includes(topic)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={getRecommendations}
                  disabled={selectedTopics.length === 0}
                  className={`w-full px-6 py-3 rounded-lg transition-colors ${
                    selectedTopics.length === 0
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  Get Recommendations
                </button>
              </div>
            )}

            {showRecommendations && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Recommended Content ({recommendations.length} found):
                </h3>
                {recommendations.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-lg">No matching content found for your selected topics.</p>
                    <p className="text-gray-500 text-sm mt-2">Try selecting different topics or check back later for new content.</p>
                  </div>
                ) : (
                  recommendations.map((content) => (
                    <div key={content.id} className="bg-gray-700 p-6 rounded-lg border border-gray-600">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-xl font-semibold text-white flex-1">
                          {content.title}
                        </h4>
                        <div className="flex items-center gap-2 ml-4">
                          {content.stars && (
                            <span className="text-yellow-400 text-sm">
                              ⭐ {content.stars}
                            </span>
                          )}
                          <span className="px-3 py-1 text-sm bg-purple-600 text-white rounded-full">
                            {content.type === 'article' ? 'Medium Article' : 'GitHub Project'}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-300 mb-4">{content.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {content.topics.map((topic: string) => (
                          <span
                            key={topic}
                            className={`px-3 py-1 text-sm rounded-full ${
                              selectedTopics.includes(topic)
                                ? 'bg-green-600 text-white'
                                : 'bg-gray-600 text-gray-300'
                            }`}
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <a
                          href={content.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          {content.type === 'article' ? 'Read Article' : 'View Project'}
                        </a>
                        {content.publishedAt && (
                          <span className="text-gray-400 text-sm">
                            {new Date(content.publishedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
} 