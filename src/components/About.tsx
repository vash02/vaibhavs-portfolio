'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="about" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            About Me
          </h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="text-gray-300 text-lg">
                I am a Machine Learning Software Engineer with a strong skills in AI/ML and scalable backend systems. I enjoy building non trivial solutions, exploring new technologies, contributing to open-source projects, following latest research in the field. 
                My work spans applied research, engineering, and deployment of ML systems at scale.
              </p>
              <div className="flex gap-4 mt-4">
                <a href="https://github.com/vash02" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">GitHub</a>
                <a href="https://tinyurl.com/vs-linkedin" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">LinkedIn</a>
                <a href="https://medium.com/@vaibh48" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Medium</a>
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-white">Education</h3>
              <div className="mb-2">
                <div className="font-bold text-white">MS, Computer Science - Data Science</div>
                <div className="text-gray-300">Indiana University Bloomington, USA</div>
                <div className="text-gray-400 text-sm">GPA: 3.8/4.0</div>
                <div className="text-gray-400 text-sm">Relevant Coursework: Applied Machine Learning, Data Mining, Statistics, Reinforcement Learning, Advanced Database Concepts, Applied NLP</div>
              </div>
              <h3 className="text-xl font-semibold mt-6 mb-4 text-white">Quick Facts</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  3.5 years of experience in AI/ML and backend engineering
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Strong background in both theoretical and practical aspects
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Always learning and exploring new technologies & research
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  Open to collaboration and new opportunities
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 