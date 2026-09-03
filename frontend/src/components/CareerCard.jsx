import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

export default function CareerCard({ career, onView }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-card p-6 rounded-3xl border border-white/10 hover:border-primary/30 transition-all cursor-pointer"
      onClick={() => onView(career.id)}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2">{career.status}</p>
          <h3 className="text-xl font-semibold text-white">{career.title}</h3>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-white">{career.score}%</p>
          <p className="text-xs text-white/40">Match</p>
        </div>
      </div>

      <div className="space-y-2 mb-5">
        <p className="text-sm text-white/60">Matched Skills</p>
        <div className="flex flex-wrap gap-2">
          {(career.matchedSkills ?? career.matched_skills ?? []).slice(0, 3).map((skill) => (
            <span key={skill} className="px-3 py-1 rounded-full bg-white/5 text-xs text-white/70">{skill}</span>
          ))}
          {((career.matchedSkills ?? career.matched_skills ?? []).length > 3) && (
            <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-white/50">+{(career.matchedSkills ?? career.matched_skills ?? []).length - 3}</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-white/50">
        <span>{(career.missingSkills ?? career.missing_skills ?? []).length} Missing</span>
        <ChevronRight size={18} className="text-white/40" />
      </div>
    </motion.div>
  )
}
