export default function ClaimComparison({ item }) {
  return (
    <div className="glass-card p-6 rounded-3xl border border-white/10">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h3 className="text-lg font-semibold text-white">{item.skill}</h3>
        <span className="text-xs uppercase tracking-[0.2em] text-white/40">{item.status}</span>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-3xl bg-white/5 p-4">
          <p className="text-xs text-white/40 uppercase mb-2">Resume Claim</p>
          <p className="text-white font-semibold">{item.resumeClaim}</p>
        </div>
        <div className="rounded-3xl bg-white/5 p-4">
          <p className="text-xs text-white/40 uppercase mb-2">Assessment</p>
          <p className="text-white font-semibold">{item.assessment}%</p>
        </div>
        <div className="rounded-3xl bg-white/5 p-4">
          <p className="text-xs text-white/40 uppercase mb-2">Confidence</p>
          <p className="text-white font-semibold">{item.confidence}</p>
        </div>
        <div className="rounded-3xl p-4" style={{ background: 'rgba(108,92,231,0.12)' }}>
          <p className="text-xs text-white/40 uppercase mb-2">Status</p>
          <p className="text-white font-semibold">{item.status}</p>
        </div>
      </div>
    </div>
  )
}
