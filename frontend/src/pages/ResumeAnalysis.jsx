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
          <div className="max-w-3xl mx-auto bg-surface p-10 rounded-2xl text-center">
            <FileSearch size={48} className="mx-auto mb-6 text-primary" />
            <h2 className="text-2xl font-semibold text-primary mb-3">No Resume Analyzed Yet</h2>
            <p className="text-secondary mb-8">Upload your resume to unlock skill extraction, career matching, and readiness insights.</p>
            <button
              onClick={() => navigate('/upload-resume')}
              className="inline-flex items-center px-6 py-3 rounded-2xl btn-primary text-white font-semibold hover:brightness-110 transition"
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
            <div className="bg-surface p-8 rounded-2xl border" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                <div>
                  <p className="text-sm text-secondary uppercase tracking-[0.25em] mb-2">Resume Score</p>
                  <div className="flex items-baseline gap-3">
                    <h1 className="text-5xl font-bold text-primary">{resume.score}</h1>
                    <span className="text-lg text-secondary">/ 100</span>
                  </div>
                  <p className="text-sm text-secondary mt-2">{resume.status}</p>
                </div>
                <button
                  onClick={() => navigate('/upload-resume')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full btn-secondary text-primary"
                >
                  Analyze New Resume
                </button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {Object.entries(resume.summary).map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-surface-secondary p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-secondary mb-3">{label}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-semibold text-primary">{value}%</span>
                      <CheckCircle2 size={20} className="text-success" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-surface p-6 rounded-2xl border" style={{ borderColor: 'var(--color-border)' }}>
                <h2 className="text-lg font-semibold text-primary mb-4">Resume Strengths</h2>
                <div className="space-y-3">
                  {(resume.strengths || []).map((item) => {
                    const cleanItem = typeof item === 'string' ? item.replace(/^[~*\s\-\d.]+/, '').replace(/[~*]/g, '').trim() : String(item)
                    return (
                      <div key={cleanItem} className="flex items-start gap-3 text-primary">
                        <CheckCircle2 size={18} className="text-success flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-primary leading-snug">{cleanItem}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-surface p-6 rounded-2xl border" style={{ borderColor: 'var(--color-border)' }}>
                <h2 className="text-lg font-semibold text-primary mb-4">Areas to Improve</h2>
                <div className="space-y-3">
                  {(resume.improvements || resume.weaknesses || []).map((item) => {
                    const cleanItem = typeof item === 'string' ? item.replace(/^[~*\s\-\d.]+/, '').replace(/[~*]/g, '').trim() : String(item)
                    return (
                      <div key={cleanItem} className="flex items-start gap-3 text-primary">
                        <AlertTriangle size={18} className="text-warning flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-primary leading-snug">{cleanItem}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="bg-surface p-8 rounded-2xl border" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-secondary">Extracted Resume Information</p>
                  <h2 className="text-xl font-semibold text-primary">Profile Snapshot</h2>
                </div>
                <Layers size={24} className="text-primary" />
              </div>
              <div className="grid gap-6">
                <div className="rounded-2xl bg-surface-secondary p-5">
                  <p className="text-sm text-secondary mb-4">Personal Information</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries(resume.personal).map(([field, value]) => (
                      <div key={field}>
                        <p className="text-xs uppercase tracking-[0.2em] text-secondary">{field}</p>
                        <p className="text-sm text-primary mt-1">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl bg-surface-secondary p-5">
                  <p className="text-sm text-secondary mb-4">Education</p>
                  <div className="grid gap-3">
                    {Object.entries(resume.education).map(([field, value]) => (
                      <div key={field}>
                        <p className="text-xs uppercase tracking-[0.2em] text-secondary">{field}</p>
                        <p className="text-sm text-primary mt-1">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-surface p-8 rounded-2xl border" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-secondary">Experience & Projects</p>
                  <h2 className="text-xl font-semibold text-primary">Career Signals</h2>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-secondary mb-3">Experience</p>
                  <div className="space-y-3">
                    {resume.experience.map((role) => (
                      <div key={role.company} className="rounded-2xl bg-surface-secondary p-4">
                        <p className="text-sm text-primary font-semibold">{role.role}</p>
                        <p className="text-xs text-secondary">{role.company} • {role.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-secondary mb-3">Projects</p>
                  <div className="space-y-3">
                    {resume.projects.map((project) => (
                      <div key={project.name} className="rounded-2xl bg-surface-secondary p-4">
                        <p className="text-sm text-primary font-semibold">{project.name}</p>
                        <p className="text-xs text-secondary mb-2">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <span key={tech} className="px-3 py-1 rounded-full bg-surface text-xs text-primary">{tech}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface p-8 rounded-2xl border" style={{ borderColor: 'var(--color-border)' }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-secondary">AI / NLP Resume Processing</p>
                <h2 className="text-xl font-semibold text-primary">Processing Status</h2>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {nlpProcessing.map((step) => (
                <div key={step.label} className="rounded-2xl bg-surface-secondary p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-primary">{step.label}</p>
                    <p className="text-xs text-secondary">{step.status}</p>
                  </div>
                  <CheckCircle2 size={22} className="text-success" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </PageTransition>
  )
}
