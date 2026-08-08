import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function ScoreCard({ title, value, suffix = '', icon: Icon, color = 'primary', delay = 0 }) {
    const [count, setCount] = useState(0)
    const numericValue = typeof value === 'number' ? value : parseInt(value) || 0

    useEffect(() => {
        let start = 0
        const duration = 1500
        const startTime = Date.now()

        const timer = setTimeout(() => {
            const animate = () => {
                const elapsed = Date.now() - startTime
                const progress = Math.min(elapsed / duration, 1)
                const eased = 1 - Math.pow(1 - progress, 3)
                setCount(Math.round(eased * numericValue))
                if (progress < 1) requestAnimationFrame(animate)
            }
            animate()
        }, delay * 1000)

        return () => clearTimeout(timer)
    }, [numericValue, delay])

    const colorMap = {
        primary: 'from-primary to-purple-400',
        accent: 'from-accent to-cyan-300',
        success: 'from-green-500 to-emerald-400',
        warning: 'from-yellow-500 to-amber-400',
        danger: 'from-red-500 to-rose-400',
    }

    const glowMap = {
        primary: 'rgba(108, 92, 231, 0.2)',
        accent: 'rgba(0, 212, 255, 0.2)',
        success: 'rgba(0, 200, 83, 0.2)',
        warning: 'rgba(255, 214, 0, 0.2)',
        danger: 'rgba(255, 23, 68, 0.2)',
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -5, boxShadow: `0 20px 40px ${glowMap[color]}` }}
            className="glass-card p-6 cursor-pointer"
        >
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm text-white/50 font-medium mb-1">{title}</p>
                    <h3 className="text-3xl font-bold">
                        <span className={`bg-linear-to-r ${colorMap[color]} bg-clip-text text-transparent`}>
                            {count}{suffix}
                        </span>
                    </h3>
                </div>
                {Icon && (
                    <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${colorMap[color]} bg-opacity-20 flex items-center justify-center`}
                        style={{ background: `linear-gradient(135deg, ${glowMap[color]}, transparent)` }}>
                        <Icon size={24} className="text-white/80" />
                    </div>
                )}
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((numericValue / 100) * 100, 100)}%` }}
                    transition={{ duration: 1.5, delay: delay + 0.3, ease: 'easeOut' }}
                    className={`h-full rounded-full bg-linear-to-r ${colorMap[color]}`}
                />
            </div>
        </motion.div>
    )
}
