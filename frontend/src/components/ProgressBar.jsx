import { motion } from 'framer-motion'

export default function ProgressBar({ value = 0, max = 100, label = '', color = 'primary', showValue = true, delay = 0, height = 'h-2' }) {
    const percentage = Math.min((value / max) * 100, 100)

    const colorMap = {
        primary: 'var(--color-primary)',
        accent: 'var(--grad-2)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)'
    }

    return (
        <div className="w-full">
            {(label || showValue) && (
                <div className="flex justify-between items-center mb-2">
                    {label && <span className="text-sm font-medium text-secondary">{label}</span>}
                    {showValue && <span className="text-sm font-semibold text-primary">{Math.round(percentage)}%</span>}
                </div>
            )}
            <div className={`w-full ${height} bg-surface-secondary rounded-full overflow-hidden`}> 
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.2, delay, ease: 'easeOut' }}
                    className={`h-full rounded-full`}
                    style={{ background: colorMap[color] }}
                />
            </div>
        </div>
    )
}
