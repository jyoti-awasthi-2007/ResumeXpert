import { useNavigate } from 'react-router-dom'
import { useCareerLens } from '../context/CareerLensContext'
import DashboardLayout from '../layouts/DashboardLayout'
import PageTransition from '../components/PageTransition'
import RecommendationCard from '../components/RecommendationCard'
import { Lightbulb, ArrowRight } from 'lucide-react'

export default function Recommendations() {
  const navigate = useNavigate()
  const { recommendations, resumeState } = useCareerLens()

  if (!resumeState.uploaded) {
    return (
      <PageTransition>
        <DashboardLayout title="Skill Recommendations">
          <div className="max-w-3xl mx-auto glass-card p-10 text-center">
            <Lightbulb size={48} className="mx-auto mb-6 text-primary" />
            <h2 className="text-2xl font-semibold text-white mb-3">Discover Missing Skills</h2>
            <p className="text-white/50 mb-8">Upload your resume to receive skill recommendations that improve your career compatibility.</p>
            <button
              onClick={() => navigate('/upload-resume')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-linear-to-r from-primary to-purple-500 text-white font-semibold hover:brightness-110 transition"
            >
              Analyze Resume
            </button>
          </div>
        </DashboardLayout>
      </PageTransition>
    )
  }

  const handleMark = (skill) => {
    alert(`Marked ${skill} as learning.`)
  }

  return (
    <PageTransition>
      <DashboardLayout title="Skill Recommendations">
        <div className="space-y-8">
          <div className="glass-card p-8 rounded-3xl border border-white/10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-2">Skills that can improve your career compatibility</p>
                <h1 className="text-3xl font-semibold text-white">Recommended Skills</h1>
              </div>
              <ArrowRight size={24} className="text-primary" />
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {recommendations.map((item) => (
              <RecommendationCard key={item.skill} item={item} onMark={handleMark} />
            ))}
          </div>
        </div>
      </DashboardLayout>
    </PageTransition>
  )
}
