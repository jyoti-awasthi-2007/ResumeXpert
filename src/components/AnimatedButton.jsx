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
        lg: 'px-8 py-4 text-lg gap-2.5',
    }

    const variantClasses = {
        primary: 'bg-linear-to-r from-primary to-purple-500 text-white hover:shadow-[0_0_30px_rgba(108,92,231,0.5)]',
        accent: 'bg-linear-to-r from-accent to-cyan-400 text-dark-900 hover:shadow-[0_0_30px_rgba(0,212,255,0.5)]',
        outline: 'border border-primary/50 text-primary hover:bg-primary/10 hover:border-primary hover:shadow-[0_0_20px_rgba(108,92,231,0.3)]',
        ghost: 'text-white/70 hover:text-white hover:bg-white/5',
        danger: 'bg-linear-to-r from-red-600 to-red-500 text-white hover:shadow-[0_0_30px_rgba(255,23,68,0.5)]',
    }

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
        >
            <motion.div
                className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
            />
            {Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />}
            <span className="relative z-10">{children}</span>
        </motion.button>
    )
}
