import { motion } from 'framer-motion'

export default function AnimatedButton({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    className = '',
    type = 'button',
    disabled = false,
    icon: Icon,
}) {
    const baseClasses = 'relative inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 overflow-hidden'

    const sizeClasses = {
        sm: 'px-4 py-2 text-sm gap-1.5',
        md: 'px-6 py-3 text-base gap-2',
        lg: 'px-7 py-3.5 text-base gap-2.5',
    }

    const variantClasses = {
        primary: 'bg-primary text-white shadow-sm hover:bg-slate-900',
        secondary: 'bg-white text-primary border border-surface shadow-sm hover:bg-surface-secondary',
        outline: 'bg-transparent text-primary border border-surface hover:bg-surface-secondary',
        ghost: 'bg-transparent text-primary hover:bg-surface-secondary',
        danger: 'bg-red-600 text-white hover:bg-red-700',
    }

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.03 }}
            whileTap={{ scale: disabled ? 1 : 0.96 }}
            className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
        >
            {Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />}
            <span className="relative z-10">{children}</span>
        </motion.button>
    )
}
