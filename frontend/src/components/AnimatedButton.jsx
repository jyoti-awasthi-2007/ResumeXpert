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
    const baseClasses = 'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 overflow-hidden active:translate-y-px'

    const sizeClasses = {
        sm: 'px-3.5 py-2 text-xs gap-1.5',
        md: 'px-5 py-2.5 text-sm gap-2',
        lg: 'px-6 py-3 text-sm gap-2.5',
    }

    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'btn-secondary',
        ghost: 'btn-secondary',
        ai: 'btn-ai',
        premium: 'btn-premium',
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
