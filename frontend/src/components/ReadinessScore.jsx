import ProgressRing from './ProgressRing'

export default function ReadinessScore({ score, status }) {
  return (
    <div className="glass-card p-8 rounded-3xl border border-white/10 text-center">
      <h3 className="text-lg font-semibold text-white mb-4">Career Readiness</h3>
      <div className="flex items-center justify-center mb-4">
        <ProgressRing value={score} label="Readiness" size={200} strokeWidth={18} color="accent" />
      </div>
      <p className="text-2xl font-bold text-white mb-2">{score} / 100</p>
      <p className="text-sm text-white/50 uppercase tracking-[0.2em]">{status}</p>
    </div>
  )
}
