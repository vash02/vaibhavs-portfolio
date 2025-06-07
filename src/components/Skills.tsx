'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const skills = [
  {
    category: 'Languages',
    items: [
      { name: 'Python', level: 95 },
      { name: 'Java', level: 85 },
      { name: 'Scala', level: 80 },
      { name: 'SQL', level: 90 },
      { name: 'Shell', level: 80 },
    ],
  },
  {
    category: 'Frameworks & Libraries',
    items: [
      { name: 'PyTorch', level: 90 },
      { name: 'TensorFlow', level: 90 },
      { name: 'scikit-learn', level: 90 },
      { name: 'MLlib', level: 80 },
      { name: 'Hugging Face', level: 85 },
      { name: 'Langchain', level: 80 },
      { name: 'OpenAI API', level: 80 },
      { name: 'GPT-4', level: 80 },
    ],
  },
  {
    category: 'Big Data & ML Infra',
    items: [
      { name: 'Apache Spark', level: 90 },
      { name: 'Hadoop', level: 80 },
      { name: 'Airflow', level: 85 },
      { name: 'Delta Lake', level: 80 },
      { name: 'Kafka', level: 80 },
      { name: 'Hive', level: 75 },
      { name: 'Databricks', level: 85 },
      { name: 'MLFlow', level: 80 },
    ],
  },
  {
    category: 'Cloud & Deployment',
    items: [
      { name: 'AWS (SageMaker, Lambda)', level: 85 },
      { name: 'GCP (Vertex AI)', level: 80 },
      { name: 'AzureML', level: 75 },
      { name: 'Docker', level: 85 },
      { name: 'Kubernetes', level: 75 },
      { name: 'MLFlow', level: 80 },
    ],
  },
  {
    category: 'Systems & Tools',
    items: [
      { name: 'Spring Boot', level: 70 },
      { name: 'Flask', level: 85 },
      { name: 'RESTful APIs', level: 90 },
      { name: 'CI/CD', level: 80 },
    ],
  },
  {
    category: 'Techniques',
    items: [
      { name: 'NLP', level: 90 },
      { name: 'Time Series', level: 85 },
      { name: 'Forecasting', level: 80 },
      { name: 'Recommendation Systems', level: 85 },
      { name: 'A/B Testing', level: 80 },
      { name: 'PCA', level: 75 },
      { name: 'Causal Inference', level: 70 },
      { name: 'Embedding Models', level: 80 },
      { name: 'LLM fine-tuning', level: 80 },
      { name: 'Prompt engineering', level: 80 },
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
                <div className="space-y-4">
                  {skillGroup.items.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300">{skill.name}</span>
                        <span className="text-gray-400">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${skill.level}%` } : {}}
                          transition={{ duration: 1, delay: index * 0.2 }}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                        />
                      </div>
                    </div>
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