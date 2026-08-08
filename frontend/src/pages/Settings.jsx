import { motion } from 'framer-motion'
import { useCareerLens } from '../context/CareerLensContext'
import DashboardLayout from '../layouts/DashboardLayout'
import PageTransition from '../components/PageTransition'
import { Settings2, User, ShieldCheck, Bell } from 'lucide-react'

export default function Settings() {
  const { user } = useCareerLens()

  return (
    <PageTransition>
      <DashboardLayout title="Settings">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-3xl border border-surface"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-secondary mb-2">Account settings</p>
                <h1 className="text-3xl font-semibold text-primary">Profile & preferences</h1>
              </div>
              <Settings2 size={28} className="text-primary" />
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl bg-surface-secondary p-5">
                <p className="text-sm text-secondary">Name</p>
                <p className="mt-2 text-lg font-semibold text-primary">{user.name}</p>
              </div>
              <div className="rounded-3xl bg-surface-secondary p-5">
                <p className="text-sm text-secondary">Email</p>
                <p className="mt-2 text-lg font-semibold text-primary">{user.email}</p>
              </div>
              <div className="rounded-3xl bg-surface-secondary p-5">
                <p className="text-sm text-secondary">Job title</p>
                <p className="mt-2 text-lg font-semibold text-primary">{user.title}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 rounded-3xl border border-surface"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <User size={18} className="text-primary" />
                <p className="text-sm font-semibold text-primary">Profile settings</p>
              </div>
              <div className="rounded-3xl bg-surface p-5">
                <p className="text-sm text-secondary">Update your public profile, skills and visibility preferences.</p>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-primary" />
                <p className="text-sm font-semibold text-primary">Security</p>
              </div>
              <div className="rounded-3xl bg-surface p-5">
                <p className="text-sm text-secondary">Manage access, verification, and secure your account.</p>
              </div>
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-primary" />
                <p className="text-sm font-semibold text-primary">Notifications</p>
              </div>
              <div className="rounded-3xl bg-surface p-5">
                <p className="text-sm text-secondary">Choose which career alerts and updates you receive.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </PageTransition>
  )
}
