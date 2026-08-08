import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function ScoreCard({ title, value, suffix = '', icon: Icon, color = 'primary', delay = 0 }) {
    const [count, setCount] = useState(0)
    const numericValue = typeof value === 'number' ? value : parseInt(value) || 0

    useEffect(() => {
        const duration = 1400
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

    const accentClasses = {
        primary: 'text-primary',
        accent: 'text-secondary',
        success: 'text-green-600',
        warning: 'text-amber-600',
        danger: 'text-red-600',
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, delay }}
            className="glass-card p-6 cursor-pointer"
        >
            <div className="flex items-start justify-between mb-4 gap-4">
                <div>
                    <p className="text-sm text-secondary font-medium mb-1">{title}</p>
                    <h3 className="text-3xl font-semibold text-primary">{count}{suffix}</h3>
                </div>
                {Icon && (
                    <div className="w-12 h-12 rounded-2xl bg-surface-secondary flex items-center justify-center text-primary">
                        <Icon size={24} className={accentClasses[color]} />
                    </div>
                )}
            </div>
            <div className="h-2 w-full rounded-full bg-surface-secondary overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((numericValue / 100) * 100, 100)}%` }}
                    transition={{ duration: 1.2, delay: delay + 0.2, ease: 'easeOut' }}
                    className={`h-full rounded-full ${accentClasses[color]}`}
                />
            </div>
        </motion.div>
    )
}
