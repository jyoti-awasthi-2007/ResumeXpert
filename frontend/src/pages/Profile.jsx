import { motion } from 'framer-motion'
import { BriefcaseBusiness, CheckCircle2, Mail, MapPin, Pencil, ShieldCheck, UserRound } from 'lucide-react'
import { useCareerLens } from '../context/CareerLensContext'
import DashboardLayout from '../layouts/DashboardLayout'
import PageTransition from '../components/PageTransition'

export default function Profile() {
  const { user, skills, selectedCareer } = useCareerLens()
  const displaySkills = skills.slice(0, 6).map((skill) => typeof skill === 'string' ? skill : skill.name).filter(Boolean)

  return (
    <PageTransition>
      <DashboardLayout title="Profile">
        <div className="mx-auto max-w-5xl space-y-6">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary via-cyan-500 to-sky-400 p-8 text-white shadow-lg"
          >
            <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 text-3xl font-bold ring-1 ring-white/30">
                  {user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-white/70">ResumeXpert profile</p>
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <p className="mt-1 text-white/80">{user.title}</p>
                </div>
              </div>
              <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-primary shadow-sm transition hover:bg-white/90">
                <Pencil size={16} /> Edit profile
              </button>
            </div>
            <div className="absolute -right-12 -top-20 h-64 w-64 rounded-full bg-white/10" />
          </motion.section>

          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="glass-card p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2.5 text-primary"><UserRound size={20} /></div>
                <div><h2 className="text-lg font-semibold text-primary">Personal details</h2><p className="text-sm text-secondary">Your career identity at a glance</p></div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-2xl bg-surface-secondary p-4"><Mail size={18} className="text-primary" /><div><p className="text-xs text-secondary">Email</p><p className="font-medium text-primary">aisha.khan@example.com</p></div></div>
                <div className="flex items-center gap-3 rounded-2xl bg-surface-secondary p-4"><MapPin size={18} className="text-primary" /><div><p className="text-xs text-secondary">Location</p><p className="font-medium text-primary">New York, NY</p></div></div>
                <div className="flex items-center gap-3 rounded-2xl bg-surface-secondary p-4"><BriefcaseBusiness size={18} className="text-primary" /><div><p className="text-xs text-secondary">Target career</p><p className="font-medium text-primary">{selectedCareer?.title || 'Choose a target career'}</p></div></div>
              </div>
            </motion.section>

            <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="glass-card p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-success/10 p-2.5 text-success"><ShieldCheck size={20} /></div>
                <div><h2 className="text-lg font-semibold text-primary">Skills snapshot</h2><p className="text-sm text-secondary">Extracted from your resume</p></div>
              </div>
              <div className="flex flex-wrap gap-2">
                {displaySkills.length ? displaySkills.map((skill) => <span key={skill} className="inline-flex items-center gap-1.5 rounded-full bg-surface-secondary px-3 py-2 text-sm font-medium text-primary"><CheckCircle2 size={14} className="text-success" />{skill}</span>) : <p className="text-sm text-secondary">Upload a resume to build your skills snapshot.</p>}
              </div>
            </motion.section>
          </div>
        </div>
      </DashboardLayout>
    </PageTransition>
  )
}