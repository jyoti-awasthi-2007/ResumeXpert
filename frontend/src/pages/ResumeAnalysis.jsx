import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, AlertTriangle, FileSearch, Layers } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import PageTransition from '../components/PageTransition'
import { useCareerLens } from '../context/CareerLensContext'
import ProgressBar from '../components/ProgressBar'

export default function ResumeAnalysis() {
  const { resumeState, nlpProcessing } = useCareerLens()
  const navigate = useNavigate()
  const resume = resumeState.analysis

  if (!resumeState.uploaded) {
    return (
      <PageTransition>
        <DashboardLayout title="Resume Analysis">
          <div className="max-w-3xl mx-auto glass-card p-10 text-center">
            <FileSearch size={48} className="mx-auto mb-6 text-primary" />
            <h2 className="text-2xl font-semibold text-white mb-3">No Resume Analyzed Yet</h2>
            <p className="text-white/50 mb-8">Upload your resume to unlock skill extraction, career matching, and readiness insights.</p>
            <button
              onClick={() => navigate('/upload-resume')}
              className="inline-flex items-center px-6 py-3 rounded-2xl bg-linear-to-r from-primary to-purple-500 text-white font-semibold hover:brightness-110 transition"
            >
              Upload Resume
            </button>
          </div>
        </DashboardLayout>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <DashboardLayout title="Resume Analysis">
        <div className="space-y-8">
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="glass-card p-8 rounded-3xl border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                <div>
                  <p className="text-sm text-white/50 uppercase tracking-[0.25em] mb-2">Resume Score</p>
                  <div className="flex items-baseline gap-3">
                    <h1 className="text-5xl font-bold text-white">{resume.score}</h1>
                    <span className="text-lg text-white/60">/ 100</span>
                  </div>
                  <p className="text-sm text-white/50 mt-2">{resume.status}</p>
                </div>
                <button
                  onClick={() => navigate('/upload-resume')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 text-white/80 hover:bg-white/10 transition"
                >
                  Analyze New Resume
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {Object.entries(resume.summary).map(([label, value]) => (
                  <div key={label} className="rounded-3xl bg-white/5 p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3">{label}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-semibold text-white">{value}%</span>
                      <CheckCircle2 size={20} className="text-green-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-card p-6 rounded-3xl border border-white/10">
                <h2 className="text-lg font-semibold text-white mb-4">Resume Strengths</h2>
                <div className="space-y-3">
                  {resume.strengths.map((item) => (
                    <div key={item} className="flex items-start gap-3 text-white/70">
                      <CheckCircle2 size={18} className="text-green-400 mt-1" />
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6 rounded-3xl border border-white/10">
                <h2 className="text-lg font-semibold text-white mb-4">Areas to Improve</h2>
                <div className="space-y-3">
                  {resume.improvements.map((item) => (
                    <div key={item} className="flex items-start gap-3 text-white/70">
                      <AlertTriangle size={18} className="text-warning mt-1" />
                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="glass-card p-8 rounded-3xl border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-white/50">Extracted Resume Information</p>
                  <h2 className="text-xl font-semibold text-white">Profile Snapshot</h2>
                </div>
                <Layers size={24} className="text-primary" />
              </div>
              <div className="grid gap-6">
                <div className="rounded-3xl bg-white/5 p-5">
                  <p className="text-sm text-white/50 mb-4">Personal Information</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries(resume.personal).map(([field, value]) => (
                      <div key={field}>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/40">{field}</p>
                        <p className="text-sm text-white mt-1">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl bg-white/5 p-5">
                  <p className="text-sm text-white/50 mb-4">Education</p>
                  <div className="grid gap-3">
                    {Object.entries(resume.education).map(([field, value]) => (
                      <div key={field}>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/40">{field}</p>
                        <p className="text-sm text-white mt-1">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-3xl border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-white/50">Experience & Projects</p>
                  <h2 className="text-xl font-semibold text-white">Career Signals</h2>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-white/50 mb-3">Experience</p>
                  <div className="space-y-3">
                    {resume.experience.map((role) => (
                      <div key={role.company} className="rounded-3xl bg-white/5 p-4">
                        <p className="text-sm text-white font-semibold">{role.role}</p>
                        <p className="text-xs text-white/40">{role.company} • {role.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-white/50 mb-3">Projects</p>
                  <div className="space-y-3">
                    {resume.projects.map((project) => (
                      <div key={project.name} className="rounded-3xl bg-white/5 p-4">
                        <p className="text-sm text-white font-semibold">{project.name}</p>
                        <p className="text-xs text-white/40 mb-2">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <span key={tech} className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/60">{tech}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-3xl border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/50">AI / NLP Resume Processing</p>
                <h2 className="text-xl font-semibold text-white">Processing Status</h2>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {nlpProcessing.map((step) => (
                <div key={step.label} className="rounded-3xl bg-white/5 p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-white/80">{step.label}</p>
                    <p className="text-xs text-white/40">{step.status}</p>
                  </div>
                  <CheckCircle2 size={22} className="text-green-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </PageTransition>
  )
}
