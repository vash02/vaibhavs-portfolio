'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const projects = [
  {
    title: 'Code-visplain Application',
    period: 'Jan 2025 – Mar 2025',
    description: [
      'Developed a graph analysis + Retrieval Augmented Generation (RAG) based code repository visualizer leveraging LLaMA & networkx for component & parametric understanding of code components.',
      'Implemented application using Flask, enabling seamless setup and deployment on local machine.'
    ],
    technologies: ['LLaMA', 'networkx', 'Flask', 'RAG'],
    link: '#',
  },
  {
    title: 'Croatia IAB Ads Classification Model',
    period: 'Oct 2024 – Dec 2024',
    description: [
      'Designed a computationally efficient solution for a startup in Croatia in partnership with Indiana University to help them classify their ads into IAB categories.',
      'Employing LLM generated embedding and vector similarity scoring for classification baselining of multilingual data for European languages and developing unsupervised scoring metrics for the classification.'
    ],
    technologies: ['LLM', 'Vector Similarity', 'Unsupervised Scoring'],
    link: '#',
  },
  {
    title: 'RL - GAN - Net',
    period: 'Apr 2024 – Jun 2024',
    description: [
      'Orchestrated an RL agent-guided RL-GAN-Net pipeline to regenerate point cloud images from partial data inputs.',
      'Designed and experimented with different Markovian environments and component architectures to minimize reconstruction error with lower compute usage.'
    ],
    technologies: ['RL', 'GAN', 'Markovian Environments'],
    link: '#',
  },
]

export const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="projects" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Featured Projects
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-gray-800 rounded-lg overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 mb-2 text-sm">{project.period}</p>
                  <ul className="text-gray-300 mb-4 list-disc list-inside">
                    {project.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.link}
                    className="inline-block px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                  >
                    View Project
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
} 