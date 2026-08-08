import { useNavigate } from 'react-router-dom'
import { useCareerLens } from '../context/CareerLensContext'
import DashboardLayout from '../layouts/DashboardLayout'
import PageTransition from '../components/PageTransition'
import CareerCard from '../components/CareerCard'
import { Sparkles, Compass } from 'lucide-react'

export default function CareerSuggestions() {
  const { careerMatches, resumeState } = useCareerLens()
  const navigate = useNavigate()

  if (!resumeState.uploaded) {
    return (
      <PageTransition>
        <DashboardLayout title="Career Suggestions">
          <div className="max-w-3xl mx-auto glass-card p-10 text-center">
            <Compass size={48} className="mx-auto mb-6 text-primary" />
            <h2 className="text-2xl font-semibold text-white mb-3">Select a Career Path</h2>
            <p className="text-white/50 mb-8">Upload your resume to get personalized career matches based on your current skills.</p>
            <button
              onClick={() => navigate('/upload-resume')}
              className="inline-flex items-center px-6 py-3 rounded-2xl bg-linear-to-r from-primary to-purple-500 text-white font-semibold hover:brightness-110 transition"
            >
              Analyze Resume
            </button>
          </div>
        </DashboardLayout>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <DashboardLayout title="Career Suggestions">
        <div className="space-y-8">
          <div className="glass-card p-8 rounded-3xl border border-white/10">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-3">Career paths that match your current skills and resume</p>
              <h1 className="text-3xl font-semibold text-white">Career Suggestions</h1>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            {careerMatches.map((career) => (
              <CareerCard key={career.id} career={career} onView={(id) => navigate(`/career/${id}`)} />
            ))}
          </div>
        </div>
      </DashboardLayout>
    </PageTransition>
  )
}
