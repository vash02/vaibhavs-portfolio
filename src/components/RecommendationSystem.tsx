'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

// Sample content database - Replace with your actual content
const contentDatabase = {
  articles: [
    {
      id: 1,
      title: "Understanding Large Language Models",
      topics: ["AI", "Machine Learning", "NLP", "LLM"],
      description: "A deep dive into how Large Language Models work and their applications.",
      url: "https://medium.com/@vaibh48/understanding-large-language-models",
      type: "article"
    },
    {
      id: 2,
      title: "Building a Recommendation System",
      topics: ["Machine Learning", "Python", "Data Science"],
      description: "Step-by-step guide to building a content-based recommendation system.",
      url: "https://medium.com/@vaibh48/building-recommendation-system",
      type: "article"
    },
    {
      id: 3,
      title: "Deep Learning for Computer Vision",
      topics: ["Deep Learning", "Computer Vision", "Python", "AI"],
      description: "Exploring deep learning techniques for image recognition and processing.",
      url: "https://medium.com/@vaibh48/deep-learning-computer-vision",
      type: "article"
    }
  ],
  projects: [
    {
      id: 1,
      title: "Code-visplain Application",
      topics: ["LLaMA", "networkx", "Flask", "RAG"],
      description: "Graph analysis + RAG based code repository visualizer leveraging LLaMA & networkx.",
      url: "https://github.com/vash02/code-visplain",
      type: "project"
    },
    {
      id: 2,
      title: "Croatia IAB Ads Classification",
      topics: ["LLM", "Vector Similarity", "Unsupervised Scoring"],
      description: "Computationally efficient solution for classifying ads into IAB categories.",
      url: "https://github.com/vash02/croatia-iab-classification",
      type: "project"
    },
    {
      id: 3,
      title: "RL-GAN-Net",
      topics: ["RL", "GAN", "Markovian Environments"],
      description: "RL agent-guided pipeline to regenerate point cloud images from partial data inputs.",
      url: "https://github.com/vash02/rl-gan-net",
      type: "project"
    }
  ]
}

// Available topics for selection
const availableTopics = [
  "AI", "Machine Learning", "Deep Learning", "NLP", "LLM",
  "Computer Vision", "Python", "Data Science", "RL", "GAN",
  "Flask", "RAG", "Vector Similarity", "Unsupervised Scoring"
]

export const RecommendationSystem = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [showRecommendations, setShowRecommendations] = useState(false)

  const getRecommendations = () => {
    if (selectedTopics.length === 0) return

    // Combine articles and projects
    const allContent = [...contentDatabase.articles, ...contentDatabase.projects]

    // Score each content based on topic matches
    const scoredContent = allContent.map(content => {
      const matchingTopics = content.topics.filter(topic => 
        selectedTopics.includes(topic)
      ).length
      const score = matchingTopics / content.topics.length
      return { ...content, score }
    })

    // Sort by score and get top 3 recommendations
    const topRecommendations = scoredContent
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
              Select topics you're interested in, and I'll recommend relevant articles and projects from my portfolio.
            </p>
            
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

            {showRecommendations && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-semibold text-white mb-4">Recommended Content:</h3>
                {recommendations.map((content) => (
                  <div key={content.id} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-semibold text-white">
                        {content.title}
                      </h4>
                      <span className="px-3 py-1 text-sm bg-purple-600 text-white rounded-full">
                        {content.type === 'article' ? 'Medium Article' : 'GitHub Project'}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-3">{content.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
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
                    <a
                      href={content.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {content.type === 'article' ? 'Read Article' : 'View Project'}
                    </a>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
} 