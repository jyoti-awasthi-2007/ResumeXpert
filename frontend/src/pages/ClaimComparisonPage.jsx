import { useCareerLens } from '../context/CareerLensContext'
import DashboardLayout from '../layouts/DashboardLayout'
import PageTransition from '../components/PageTransition'
import ClaimComparison from '../components/ClaimComparison'
import { ShieldCheck, Sparkles } from 'lucide-react'

export default function ClaimComparisonPage() {
  const { claimComparison, resumeState } = useCareerLens()

  if (!resumeState.uploaded) {
    return (
      <PageTransition>
        <DashboardLayout title="Resume Claim vs Actual Skill">
          <div className="max-w-3xl mx-auto glass-card p-10 text-center">
            <ShieldCheck size={48} className="mx-auto mb-6 text-primary" />
            <h2 className="text-2xl font-semibold text-white mb-3">Claim vs Demonstrated Skill</h2>
            <p className="text-white/50 mb-8">Upload your resume and complete an assessment to compare resume claims with actual performance.</p>
            <button
              onClick={() => navigate('/upload-resume')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-linear-to-r from-primary to-purple-500 text-white font-semibold hover:brightness-110 transition"
            >
              Start Resume Analysis
            </button>
          </div>
        </DashboardLayout>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <DashboardLayout title="Resume Claim vs Actual Skill">
        <div className="space-y-8">
          <div className="glass-card p-8 rounded-3xl border border-white/10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-2">Your resume tells us what you claim. Your assessment shows what you demonstrate.</p>
                <h1 className="text-3xl font-semibold text-white">Resume Claim vs Demonstrated Skill</h1>
              </div>
              <Sparkles size={28} className="text-accent" />
            </div>
          </div>
          <div className="space-y-6">
            {claimComparison.map((item) => (
              <ClaimComparison key={item.skill} item={item} />
            ))}
          </div>
        </div>
      </DashboardLayout>
    </PageTransition>
  )
}
