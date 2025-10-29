import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { Skills } from '@/components/Skills'
import { Projects } from '@/components/Projects'
import { Experience } from '@/components/Experience'
import { Contact } from '@/components/Contact'
import { RecommendationSystem } from '@/components/RecommendationSystem'
import { VisitorTracker } from '@/components/VisitorTracker'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Hero />
      <About />
      <Experience />
      <RecommendationSystem />
      <Skills />
      <Projects />
      <Contact />
      <VisitorTracker />
    </main>
  )
}
