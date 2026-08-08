import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

export default function AssessmentLevelCard({ level, selected, onSelect }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`glass-card p-6 rounded-3xl border ${selected ? 'border-primary/40 shadow-[0_20px_60px_rgba(108,92,231,0.16)]' : 'border-white/10'} transition-all cursor-pointer`}
      onClick={() => onSelect(level.id)}
    >
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2">{level.title}</p>
          <h3 className="text-2xl font-semibold text-white">{level.questions} Questions</h3>
        </div>
        <div className="text-sm text-white/50">{level.time}</div>
      </div>
      <p className="text-sm text-white/60 mb-6">{level.description}</p>
      <div className="flex items-center justify-between text-sm font-semibold text-white/80">
        <span>Start {level.title}</span>
        <ChevronRight size={18} />
      </div>
    </motion.div>
  )
}
