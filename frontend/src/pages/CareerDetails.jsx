import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCareerLens } from '../context/CareerLensContext'
import DashboardLayout from '../layouts/DashboardLayout'
import PageTransition from '../components/PageTransition'
import { CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react'

export default function CareerDetails() {
  const { careerId } = useParams()
  const { careerMatches, selectCareer } = useCareerLens()
  const navigate = useNavigate()

  const career = useMemo(() => careerMatches.find((item) => item.id === careerId), [careerMatches, careerId])

  if (!career) {
    return (
      <PageTransition>
        <DashboardLayout title="Career Detail">
          <div className="glass-card p-10 text-center">
            <h2 className="text-2xl font-semibold text-white mb-3">Career not found</h2>
            <p className="text-white/50 mb-6">Please return to career suggestions and choose a valid target.</p>
            <button
              onClick={() => navigate('/careers')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-linear-to-r from-primary to-purple-500 text-white font-semibold hover:brightness-110 transition"
            >
              Back to Careers
            </button>
          </div>
        </DashboardLayout>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <DashboardLayout title={career.title}>
        <div className="space-y-8">
          <div className="glass-card p-8 rounded-3xl border border-white/10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-2">Why this career matches you</p>
                <h1 className="text-3xl font-semibold text-white">{career.title}</h1>
                <p className="text-sm text-white/50 mt-2">{career.description}</p>
              </div>
              <div className="rounded-3xl bg-white/5 px-6 py-4 text-center">
                <p className="text-sm uppercase tracking-[0.2em] text-white/40">Match Score</p>
                <p className="text-4xl font-bold text-white mt-2">{career.score}%</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass-card p-6 rounded-3xl border border-white/10">
              <h2 className="text-lg font-semibold text-white mb-4">Skills you already have</h2>
              <div className="grid gap-2">
                {career.matchedSkills.map((skill) => (
                  <div key={skill} className="rounded-2xl bg-white/5 p-4 flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-green-400" />
                    <span className="text-white/80">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card p-6 rounded-3xl border border-white/10">
              <h2 className="text-lg font-semibold text-white mb-4">Skills you need</h2>
              <div className="grid gap-2">
                {career.missingSkills.map((skill) => (
                  <div key={skill} className="rounded-2xl bg-white/5 p-4 flex items-center gap-3">
                    <AlertTriangle size={18} className="text-warning" />
                    <span className="text-white/80">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={() => { selectCareer(career.id); navigate('/skill-gap') }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-r from-primary to-purple-500 text-white font-semibold hover:brightness-110 transition"
            >
              Analyze Skill Gap
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/recommendations')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 text-white/80 hover:bg-white/10 transition"
            >
              View Recommendations
            </button>
          </div>
        </div>
      </DashboardLayout>
    </PageTransition>
  )
}
