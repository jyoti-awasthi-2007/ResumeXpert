import { motion } from 'framer-motion'
import DashboardLayout from '../layouts/DashboardLayout'
import PageTransition from '../components/PageTransition'
import { useCareerLens } from '../context/CareerLensContext'
import { ShieldCheck, Sparkles, BarChart3 } from 'lucide-react'

export default function Confidence() {
  const { confidence, confidenceLevels, resumeState } = useCareerLens()

  return (
    <PageTransition>
      <DashboardLayout title="Skill Confidence">
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-3xl border border-surface"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-secondary mb-2">Confidence profile</p>
                <h1 className="text-3xl font-semibold text-primary">Skill Confidence</h1>
                <p className="text-sm text-secondary mt-2">Your assessment-based confidence score highlights which skills are strongest and where to focus.</p>
              </div>
              <div className="rounded-3xl bg-surface-secondary px-6 py-5 text-center">
                <p className="text-sm uppercase tracking-[0.2em] text-secondary mb-2">Current Confidence</p>
                <p className="text-5xl font-bold text-primary">{confidence}%</p>
                <p className="text-sm text-secondary mt-1">Based on your latest assessment</p>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {confidenceLevels.map((level) => (
              <motion.div
                key={level.range}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 rounded-3xl border border-surface"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-primary">{level.label}</p>
                    <p className="text-xs text-secondary mt-1">{level.range}</p>
                  </div>
                  <Sparkles size={24} className="text-primary" />
                </div>
                <p className="text-sm text-secondary">Confidence mapping for your skill assessment outcome.</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-3xl border border-surface"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-secondary">Insights</p>
                <h2 className="text-xl font-semibold text-primary">Confidence snapshot</h2>
              </div>
              <div className="flex items-center gap-2 text-secondary">
                <ShieldCheck size={18} />
                <span>Validated by AI assessment</span>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-surface-secondary p-5">
                <p className="text-sm text-secondary mb-2">Your strength areas</p>
                <p className="text-base text-primary">Focus on skills with high confidence to align with career goals.</p>
              </div>
              <div className="rounded-3xl bg-surface-secondary p-5">
                <p className="text-sm text-secondary mb-2">Opportunities to improve</p>
                <p className="text-base text-primary">Low-confidence skills are useful candidates for learning and practice.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </PageTransition>
  )
}
