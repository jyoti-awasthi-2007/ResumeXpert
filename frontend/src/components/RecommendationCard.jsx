import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function RecommendationCard({ item, onMark }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-3xl border border-white/10 transition-all">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-xl font-semibold text-white">{item.skill || item.name}</h3>
          <p className="text-sm text-white/50">Priority: <span className="font-semibold text-white">{item.priority || item.level}</span></p>
        </div>
        <div className="text-right text-sm text-white/40">{(item.path ?? item.prerequisites ?? item.steps ?? []).length || 0} steps</div>
      </div>
      <p className="text-sm text-white/60 mb-4">{item.why || item.reason || 'Important skill for career growth.'}</p>
      <div className="flex flex-wrap gap-2 mb-5 text-xs text-white/50">
        {(item.path ?? item.prerequisites ?? item.steps ?? []).map((step) => (
          <span key={step} className="px-3 py-1 rounded-full bg-white/5">{step}</span>
        ))}
      </div>
      <button
        onClick={() => onMark(item.skill)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-primary to-purple-500 text-white text-sm font-semibold hover:brightness-110 transition"
      >
        Mark as Learning
        <ArrowRight size={16} />
      </button>
    </motion.div>
  )
}
