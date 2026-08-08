import { motion } from 'framer-motion'
import { useCareerLens } from '../context/CareerLensContext'
import DashboardLayout from '../layouts/DashboardLayout'
import PageTransition from '../components/PageTransition'
import ReadinessScore from '../components/ReadinessScore'
import { CheckCircle2, ArrowRight } from 'lucide-react'

export default function CareerReadiness() {
  const { readinessOverview, nextSteps, resumeState } = useCareerLens()

  if (!resumeState.uploaded) {
    return (
      <PageTransition>
        <DashboardLayout title="Career Readiness">
          <div className="max-w-3xl mx-auto glass-card p-10 text-center">
            <CheckCircle2 size={48} className="mx-auto mb-6 text-primary" />
            <h2 className="text-2xl font-semibold text-primary mb-3">Career readiness is unavailable</h2>
            <p className="text-secondary mb-8">Upload your resume to view your readiness score and career action plan.</p>
          </div>
        </DashboardLayout>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <DashboardLayout title="Career Readiness">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-card p-8 rounded-3xl border border-surface">
            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.2em] text-secondary mb-2">Readiness overview</p>
              <h1 className="text-3xl font-semibold text-primary">Career Readiness</h1>
              <p className="text-secondary mt-3">A combined view of your resume quality, skill match, assessment performance, and confidence.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(readinessOverview.breakdown).map(([label, value]) => (
                <div key={label} className="rounded-3xl bg-surface-secondary p-5">
                  <p className="text-sm uppercase tracking-[0.2em] text-secondary mb-2">{label.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="text-3xl font-semibold text-primary mt-1">{value}%</p>
                </div>
              ))}
            </div>

            <div className="grid gap-5 mt-6">
              <div className="rounded-3xl bg-surface-secondary p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-secondary mb-2">Strengths</p>
                <ul className="list-disc list-inside text-secondary space-y-2">
                  {readinessOverview.strengths.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl bg-surface-secondary p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-secondary mb-2">Improvements</p>
                <ul className="list-disc list-inside text-secondary space-y-2">
                  {readinessOverview.improvements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <ReadinessScore score={readinessOverview.score} status={readinessOverview.status} />
            <div className="glass-card p-6 rounded-3xl border border-surface">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-secondary">Recommended next steps</p>
                  <h2 className="text-xl font-semibold text-primary">Action plan</h2>
                </div>
                <ArrowRight size={20} className="text-secondary" />
              </div>
              <div className="space-y-4">
                {nextSteps.map((step) => (
                  <div key={step.title} className="rounded-3xl bg-surface-secondary p-5">
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <p className="font-semibold text-primary">{step.title}</p>
                      <span className="text-xs uppercase tracking-[0.2em] text-secondary">{step.action}</span>
                    </div>
                    <p className="text-sm text-secondary">{step.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </PageTransition>
  )
}
