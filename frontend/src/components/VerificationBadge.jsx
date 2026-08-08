import { motion } from 'framer-motion'
import { BadgeCheck } from 'lucide-react'

export default function VerificationBadge({ verified = true, size = 'md', label }) {
    const sizeClasses = {
        sm: 'w-5 h-5',
        md: 'w-7 h-7',
        lg: 'w-10 h-10',
    }
    const iconSize = { sm: 14, md: 18, lg: 24 }

    if (!verified) {
        return (
            <div className="flex items-center gap-1.5">
                <div className={`${sizeClasses[size]} rounded-full bg-white/10 flex items-center justify-center`}>
                    <span className="text-white/30 text-xs">?</span>
                </div>
                {label && <span className="text-sm text-white/40">{label}</span>}
            </div>
        )
    }

    return (
        <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="flex items-center gap-1.5"
        >
            <div className="relative">
                <motion.div
                    animate={{ boxShadow: ['0 0 10px rgba(108,92,231,0.3)', '0 0 25px rgba(108,92,231,0.5)', '0 0 10px rgba(108,92,231,0.3)'] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`${sizeClasses[size]} rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center`}
                >
                    <BadgeCheck size={iconSize[size]} className="text-white" />
                </motion.div>
            </div>
            {label && <span className="text-sm font-medium text-white/80">{label}</span>}
        </motion.div>
    )
}
