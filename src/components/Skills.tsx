'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const skills = [
  {
    category: 'Languages',
    items: [
      { name: 'Python' },
      { name: 'Java' },
      { name: 'Scala' },
      { name: 'SQL' },
      { name: 'Shell' },
    ],
  },
  {
    category: 'Frameworks & Libraries',
    items: [
      { name: 'PyTorch' },
      { name: 'TensorFlow' },
      { name: 'scikit-learn' },
      { name: 'MLlib' },
      { name: 'Hugging Face' },
      { name: 'Langchain' },
      { name: 'OpenAI API' },
      { name: 'GPT-4' },
    ],
  },
  {
    category: 'Big Data & ML Infra',
    items: [
      { name: 'Apache Spark' },
      { name: 'Hadoop' },
      { name: 'Airflow' },
      { name: 'Delta Lake' },
      { name: 'Kafka' },
      { name: 'Hive' },
      { name: 'Databricks' },
      { name: 'MLFlow' },
    ],
  },
  {
    category: 'Cloud & Deployment',
    items: [
      { name: 'AWS (SageMaker, Lambda)' },
      { name: 'GCP (Vertex AI)' },
      { name: 'AzureML' },
      { name: 'Docker' },
      { name: 'Kubernetes' },
      { name: 'MLFlow' },
    ],
  },
  {
    category: 'Systems & Tools',
    items: [
      { name: 'Spring Boot' },
      { name: 'Flask' },
      { name: 'FastAPI' },
      { name: 'Model Context Protocol' },
      { name: 'RESTful APIs' },
      { name: 'CI/CD' },
    ],
  },
  {
    category: 'Techniques',
    items: [
      { name: 'NLP' },
      { name: 'Time Series' },
      { name: 'Forecasting' },
      { name: 'Recommendation Systems' },
      { name: 'A/B Testing' },
      { name: 'PCA' },
      { name: 'Embedding Models' },
      { name: 'LLM fine-tuning' },
      { name: 'prompt engineering' },
    ],
  },
]

export const Skills = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="skills" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Skills & Expertise
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {skills.map((skillGroup, index) => (
              <motion.div
                key={skillGroup.category}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-gray-800 rounded-lg p-6"
              >
                <h3 className="text-xl font-semibold mb-6 text-white">
                  {skillGroup.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroup.items.map((skill) => (
                    <motion.span
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm rounded-full font-medium"
                    >
                      {skill.name}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
} 