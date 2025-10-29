'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const experiences = [
  {
    title: 'Georgia Institute of Technology | Open-source AI Engineer',
    company: 'Remote, USA',
    period: 'Sep 2025 – Present',
    description: [
      'Developing and maintaining open-source AI frameworks and tools for the research community.',
      'Collaborating with faculty and researchers on AI project focused on multi agent system for scientific experimentation.',
      'Contributing to Apache Airavata open-source projects for a scientific MCP framework.'
    ],
  },
  {
    title: 'Google Summer of Code (Apache) | Open-source AI Developer',
    company: 'Remote, USA',
    period: 'Apr 2025 – Aug 2025',
    description: [
      'Designed and implemented a Model Context Protocol (MCP) server, enabling AI agents to generate, execute, and reason over 1000+ scientific simulations.',
      'Built a modular framework for executing simulation code, performing parameter sweeps, and storing structured results in a queryable DB.',
      'Integrated ReAct style tool-enabled agent workflows to support reasoning over experiments and dynamic exploration.',
      'Contributed framework to an Apache open-source project, expanding adoption in the AI/ML research and scientific computing community.'
    ],
  },
  {
    title: 'Reality AI | AI Engineer',
    company: 'Remote, USA',
    period: 'Jun 2024 – Aug 2024',
    description: [
      'Designed and deployed worksheet generator for educators using RAG architecture and LangChain, optimizing data retrieval pipelines using GCP Vertex AI API.',
      'Integrated evaluation metrics for Question-Answering system for comparing fine tuning vs RAG performance.'
    ],
  },
  {
    title: 'Inmobi | ML Engineer',
    company: 'Bangalore, India',
    period: 'Apr 2021 – Jul 2023',
    description: [
      'Optimized inference latency of a lookalikes ML recommendation engine by 67% through systematic experimentation with Spark query plans and caching strategies, significantly improving online performance.',
      'Designed augmentation algorithm over internal identity graphs to enrich user profiles, enabling efficient user ID transactions to Cosmos DB and improving CTR by 20% while reducing RU consumption by 40%.',
      'Integrated hyper-log-log data structure in DB storage model and Spark jobs for ETL framework mitigating data availability delay issues and reducing compute costs by 30%.',
      'Evaluated BERT embeddings vs traditional LDA for topic modelling on app descriptions; deployed a hybrid NLP model that improved coherence scores by 60%, enhancing semantic relevance in recommendations.',
      'Redesigned big data pipeline quality checks with automated data validation and dashboarding, reducing manual QA efforts by 50% and ensuring reliable monitoring at scale.',
      'Built threshold-based forecasting models on high-dimensional user activity data; reduced feature space by 80% while preserving model accuracy, enabling scalable deployment for downstream tasks.',
      'Developed an ensemble model combining LightGBM and TF-IDF features for user lookalike classification, achieving 20% offline ROC-AUC lift and 25% improvement in business KPIs during A/B testing.',
      'Modernized the A/B testing framework implementation and pipelines for performance benchmarking reducing manual efforts by 50%.'
    ],
  },
  {
    title: 'Fintech Unicorn (CRED) | Data Scientist',
    company: 'Remote',
    period: 'Jul 2020 – Mar 2021',
    description: [
      'Achieved 87% accuracy in forecasting the peak signups & bureau fetches on the CRED app during high-demand periods in 2021 using ARIMA.',
      'Built pipelines for real-time monitoring and analysis of traffic spikes to support business insights and load balancing.'
    ],
  },
]

export const Experience = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="experience" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Professional Experience
          </h2>

          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="relative pl-8 border-l-2 border-blue-500"
              >
                <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full" />
                <div className="bg-gray-800 p-6 rounded-lg">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                    <h3 className="text-xl font-semibold text-white">{exp.title}</h3>
                    <span className="text-gray-400">{exp.period}</span>
                  </div>
                  <h4 className="text-lg text-blue-400 mb-4">{exp.company}</h4>
                  <ul className="space-y-2">
                    {exp.description.map((item, i) => (
                      <li key={i} className="flex items-start text-gray-300">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
} 