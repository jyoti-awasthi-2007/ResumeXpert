export default function SkillBadge({ skill, confidence, category }) {
  return (
    <div className="glass-card p-4 rounded-3xl border-white/10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-white/60 uppercase tracking-[0.15em] mb-1">{category}</p>
          <h3 className="font-semibold text-white">{skill}</h3>
        </div>
        <span className="text-sm font-semibold text-white/90">{confidence}%</span>
      </div>
    </div>
  )
}
