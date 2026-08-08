import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCareerLens } from '../context/CareerLensContext'
import DashboardLayout from '../layouts/DashboardLayout'
import PageTransition from '../components/PageTransition'
import SkillBadge from '../components/SkillBadge'
import { Search, ListChecks } from 'lucide-react'

const categories = ['All', 'Programming', 'AI / ML', 'Database', 'Web', 'Tools']

export default function Skills() {
  const navigate = useNavigate()
  const { skills, resumeState } = useCareerLens()
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return skills.filter((skill) => {
      const matchCategory = filter === 'All' || skill.category === filter
      const matchSearch = skill.name.toLowerCase().includes(search.toLowerCase())
      return matchCategory && matchSearch
    })
  }, [filter, search, skills])

  return (
    <PageTransition>
      <DashboardLayout title="Your Skills">
        {!resumeState.uploaded ? (
          <div className="max-w-3xl mx-auto glass-card p-10 text-center">
            <ListChecks size={48} className="mx-auto mb-6 text-primary" />
            <h2 className="text-2xl font-semibold text-white mb-3">Your Skills Are Waiting</h2>
            <p className="text-white/50 mb-8">Upload your resume to see skills extracted through NLP and confidence scores for each technology.</p>
            <button
              onClick={() => navigate('/upload-resume')}
              className="inline-flex items-center px-6 py-3 rounded-2xl bg-linear-to-r from-primary to-purple-500 text-white font-semibold hover:brightness-110 transition"
            >
              Analyze Resume
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="glass-card p-8 rounded-3xl border border-white/10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-2">Skills identified from your resume using NLP analysis</p>
                  <h1 className="text-3xl font-semibold text-white">Your Skills</h1>
                </div>
                <div className="grid gap-3 sm:grid-cols-[1fr_auto] w-full sm:w-auto">
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search skills"
                      className="w-full sm:w-72 pl-10 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setFilter(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${filter === category ? 'bg-primary text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {filtered.map((skill) => (
                <SkillBadge key={skill.id} skill={skill.name} confidence={skill.confidence} category={skill.category} />
              ))}
            </div>
          </div>
        )}
      </DashboardLayout>
    </PageTransition>
  )
}
