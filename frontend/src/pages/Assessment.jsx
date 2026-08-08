import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCareerLens } from '../context/CareerLensContext'
import DashboardLayout from '../layouts/DashboardLayout'
import PageTransition from '../components/PageTransition'
import AssessmentLevelCard from '../components/AssessmentLevelCard'

export default function Assessment() {
  const { assessmentLevels, resumeState } = useCareerLens()
  const [selectedLevel, setSelectedLevel] = useState(null)
  const navigate = useNavigate()

  const selected = useMemo(() => assessmentLevels.find((item) => item.id === selectedLevel), [assessmentLevels, selectedLevel])

  if (!resumeState.uploaded) {
    return (
      <PageTransition>
        <DashboardLayout title="AI Career Skill Assessment">
          <div className="max-w-3xl mx-auto glass-card p-10 text-center">
            <h2 className="text-2xl font-semibold text-white mb-3">Assessment Not Available</h2>
            <p className="text-white/50 mb-8">Upload your resume and select a target career to unlock career-specific assessments.</p>
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

  return (
    <PageTransition>
      <DashboardLayout title="AI Career Skill Assessment">
        <div className="space-y-8">
          <div className="glass-card p-8 rounded-3xl border border-white/10">
            <p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-2">Test whether your demonstrated knowledge matches your resume skills</p>
            <h1 className="text-3xl font-semibold text-white">AI Career Skill Assessment</h1>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {assessmentLevels.map((level) => (
              <AssessmentLevelCard
                key={level.id}
                level={level}
                selected={selectedLevel === level.id}
                onSelect={setSelectedLevel}
              />
            ))}
          </div>

          {selected && (
            <div className="glass-card p-8 rounded-3xl border border-white/10 flex flex-col gap-6">
              <div>
                <p className="text-sm text-white/50 uppercase tracking-[0.2em] mb-2">Selected Assessment</p>
                <h2 className="text-2xl font-semibold text-white">{selected.title} Level</h2>
              </div>
              <p className="text-sm text-white/60">{selected.questions} questions • {selected.time}</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate(`/assessment/${selected.id}`)}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-linear-to-r from-primary to-purple-500 text-white font-semibold hover:brightness-110 transition"
                >
                  Start {selected.title} Test
                </button>
                <button
                  onClick={() => setSelectedLevel(null)}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white/5 text-white/80 hover:bg-white/10 transition"
                >
                  Choose Different Level
                </button>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </PageTransition>
  )
}
