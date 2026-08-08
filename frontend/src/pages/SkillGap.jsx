import { useCareerLens } from '../context/CareerLensContext'
import DashboardLayout from '../layouts/DashboardLayout'
import PageTransition from '../components/PageTransition'
import { ArrowRight, ArrowDownRight, Circle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function SkillGap() {
  const { selectedCareer, skillGap, resumeState } = useCareerLens()
  const navigate = useNavigate()

  if (!resumeState.uploaded) {
    return (
      <PageTransition>
        <DashboardLayout title="Skill Gap Analysis">
          <div className="max-w-3xl mx-auto glass-card p-10 text-center">
            <ArrowDownRight size={48} className="mx-auto mb-6 text-primary" />
            <h2 className="text-2xl font-semibold text-white mb-3">Select a Career to View Skill Gaps</h2>
            <p className="text-white/50 mb-8">Upload your resume and choose a target career to see where your skills need improvement.</p>
            <button
              onClick={() => navigate('/careers')}
              className="inline-flex items-center px-6 py-3 rounded-2xl bg-linear-to-r from-primary to-purple-500 text-white font-semibold hover:brightness-110 transition"
            >
              Choose Career
            </button>
          </div>
        </DashboardLayout>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <DashboardLayout title="Skill Gap Analysis">
        <div className="space-y-8">
          <div className="glass-card p-8 rounded-3xl border border-white/10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-2">Target</p>
                <h1 className="text-3xl font-semibold text-white">{selectedCareer.title}</h1>
              </div>
              <div className="rounded-3xl bg-white/5 px-6 py-4 text-center">
                <p className="text-sm uppercase tracking-[0.2em] text-white/40">Overall Skill Match</p>
                <p className="text-4xl font-bold text-white mt-2">{skillGap.overallMatch}%</p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass-card p-6 rounded-3xl border border-white/10">
              <h2 className="text-lg font-semibold text-white mb-4">Skills You Have</h2>
              <div className="space-y-3">
                {skillGap.haveSkills.map((skill) => (
                  <div key={skill} className="rounded-2xl bg-white/5 p-4 flex items-center gap-3">
                    <Circle size={16} className="text-green-400" />
                    <span className="text-white/80">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-white/10">
              <h2 className="text-lg font-semibold text-white mb-4">Missing Skills</h2>
              <div className="space-y-3">
                {skillGap.missingSkills.map((skill) => (
                  <div key={skill} className="rounded-2xl bg-white/5 p-4 flex items-center gap-3">
                    <Circle size={16} className="text-warning" />
                    <span className="text-white/80">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4">Skill Gap Priority</h2>
            <div className="space-y-5">
              {skillGap.priorities.map((group) => (
                <div key={group.level} className="rounded-3xl bg-white/5 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm uppercase tracking-[0.2em] text-white/40">{group.level} Priority</span>
                    <span className="text-sm font-semibold text-white">{group.skills.length} skills</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {group.skills.map((skill) => (
                      <span key={skill} className="px-4 py-2 rounded-full bg-white/10 text-sm text-white/70">{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/recommendations')}
              className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-r from-primary to-purple-500 text-white font-semibold hover:brightness-110 transition"
            >
              Explore Recommendations
            </button>
          </div>
        </div>
      </DashboardLayout>
    </PageTransition>
  )
}
