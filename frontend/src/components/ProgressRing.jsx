import { motion } from 'framer-motion'

export default function ProgressRing({ value = 0, label = '', size = 180, strokeWidth = 12, color = 'primary' }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(Math.max(value, 0), 100)
  const offset = circumference - (progress / 100) * circumference

  const gradient = {
    primary: ['var(--grad-1)', 'var(--grad-2)'],
    accent: ['var(--grad-2)', 'var(--grad-1)'],
    success: ['var(--color-success)', 'var(--grad-2)'],
    warning: ['var(--grad-3)', 'var(--grad-1)'],
    danger: ['#F43F5E', '#FB7185'],
  }[color] || ['var(--grad-1)', 'var(--grad-2)']

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#gradient-${color})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ transformOrigin: 'center' }}
        />
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradient[0]} />
            <stop offset="100%" stopColor={gradient[1]} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-primary">{progress}</span>
        <span className="text-sm text-secondary">{label}</span>
      </div>
    </div>
  )
}
