export default function AnalyticsCard({ label, value, subtext, color = 'primary' }) {
  return (
    <div className="glass-card p-6 rounded-3xl border border-white/10">
      <p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-4">{label}</p>
      <h3 className="text-3xl font-semibold text-white mb-2">{value}</h3>
      <p className="text-sm text-white/40">{subtext}</p>
    </div>
  )
}
