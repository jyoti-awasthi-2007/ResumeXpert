import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCareerLens } from '../context/CareerLensContext'
import DashboardLayout from '../layouts/DashboardLayout'
import PageTransition from '../components/PageTransition'
import { CheckCircle2, BarChart3, Star } from 'lucide-react'
import ProgressBar from '../components/ProgressBar'

export default function AssessmentResults() {
  const { assessmentResult, resumeState, loadAssessmentResult } = useCareerLens()
  const { assessmentId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(Boolean(assessmentId))
  const [error, setError] = useState('')
  useEffect(() => {
    if (!assessmentId) return undefined
    loadAssessmentResult(assessmentId).catch((requestError) => setError(requestError.message)).finally(() => setLoading(false))
    return undefined
  }, [assessmentId, loadAssessmentResult])

  if (loading) return <PageTransition><DashboardLayout title="Assessment Results"><div className="glass-card p-10 text-center text-secondary">Loading your saved result...</div></DashboardLayout></PageTransition>
  if (error) return <PageTransition><DashboardLayout title="Assessment Results"><div className="glass-card mx-auto max-w-2xl p-10 text-center"><h2 className="text-2xl font-semibold text-primary">Result unavailable</h2><p className="mt-3 text-secondary">{error}</p><button onClick={() => navigate('/assessment')} className="mt-6 rounded-xl bg-primary px-5 py-3 font-semibold text-white">Back to assessment</button></div></DashboardLayout></PageTransition>

  if (!resumeState.uploaded || !assessmentResult) {
    return (
      <PageTransition>
        <DashboardLayout title="Assessment Results">
          <div className="max-w-3xl mx-auto glass-card p-10 text-center">
            <BarChart3 size={48} className="mx-auto mb-6 text-primary" />
            <h2 className="text-2xl font-semibold text-white mb-3">Assessment Not Completed</h2>
            <p className="text-white/50 mb-8">Take an AI-generated skill assessment to calculate your confidence score.</p>
            <button
              onClick={() => window.location.assign('/assessment')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-linear-to-r from-primary to-purple-500 text-white font-semibold hover:brightness-110 transition"
            >
              Start Assessment
            </button>
          </div>
        </DashboardLayout>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <DashboardLayout title="Assessment Results">
        <div className="space-y-8">
          <div className="glass-card p-8 rounded-3xl border border-white/10">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-2">Assessment Complete</p>
                <h1 className="text-3xl font-semibold text-white">Overall Performance</h1>
              </div>
              <div className="rounded-3xl bg-white/5 px-6 py-5 text-center">
                <p className="text-sm uppercase tracking-[0.2em] text-white/40">Status</p>
                <p className="text-4xl font-bold text-white mt-2">{assessmentResult.status}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {(assessmentResult.skills || []).map((skill) => (
              <div key={skill.name} className="glass-card p-6 rounded-3xl border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-white/50">{skill.name}</p>
                    <p className="text-2xl font-semibold text-white">{skill.score}%</p>
                  </div>
                  <Star size={20} className="text-accent" />
                </div>
                <ProgressBar value={skill.score} color={skill.score >= 80 ? 'success' : skill.score >= 60 ? 'warning' : 'danger'} showValue={false} />
              </div>
            ))}
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/50">Answer Summary</p>
                <h2 className="text-xl font-semibold text-white">Assessment Summary</h2>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl bg-white/5 p-5 text-center">
                <p className="text-sm text-white/50 mb-2">Correct</p>
                <p className="text-3xl font-semibold text-white">{assessmentResult.summary.correct}</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-5 text-center">
                <p className="text-sm text-white/50 mb-2">Incorrect</p>
                <p className="text-3xl font-semibold text-white">{assessmentResult.summary.incorrect}</p>
              </div>
              <div className="rounded-3xl bg-white/5 p-5 text-center">
                <p className="text-sm text-white/50 mb-2">Total</p>
                <p className="text-3xl font-semibold text-white">{assessmentResult.summary.total}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-white/10">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/50">Confidence Score</p>
                <h2 className="text-2xl font-semibold text-white">Skill Confidence</h2>
              </div>
              <div className="rounded-3xl bg-white/5 px-5 py-4 text-center">
                <p className="text-sm uppercase tracking-[0.2em] text-white/40">Overall</p>
                <p className="text-3xl font-bold text-white">{assessmentResult.score}%</p>
              </div>
            </div>
            <p className="text-sm text-white/50">Your assessment performance indicates strong confidence in the selected career skills.</p>
          </div>
        </div>
      </DashboardLayout>
    </PageTransition>
  )
}
