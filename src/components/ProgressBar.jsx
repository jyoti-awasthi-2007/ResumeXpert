import { motion } from 'framer-motion'

export default function ProgressBar({ value = 0, max = 100, label = '', color = 'primary', showValue = true, delay = 0, height = 'h-2' }) {
    const percentage = Math.min((value / max) * 100, 100)

    const colorClasses = {
        primary: 'from-primary to-purple-400',
        accent: 'from-accent to-cyan-300',
        success: 'from-green-500 to-emerald-400',
        warning: 'from-yellow-500 to-amber-400',
        danger: 'from-red-500 to-rose-400',
    }

    return (
        <div className="w-full">
            {(label || showValue) && (
                <div className="flex justify-between items-center mb-2">
                    {label && <span className="text-sm font-medium text-white/60">{label}</span>}
                    {showValue && <span className="text-sm font-semibold text-white/80">{Math.round(percentage)}%</span>}
                </div>
            )}
            <div className={`w-full ${height} bg-white/5 rounded-full overflow-hidden`}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.5, delay, ease: 'easeOut' }}
                    className={`h-full rounded-full bg-linear-to-r ${colorClasses[color]} relative`}
                >
                    <motion.div
                        className="absolute inset-0 bg-linear-to-r from-white/0 via-white/30 to-white/0"
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                    />
                </motion.div>
            </div>
        </div>
    )
}
