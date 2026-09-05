import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import AnimatedButton from './AnimatedButton'
import BrandLockup from './BrandLockup'

const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
]

export default function Navbar() {
    const [open, setOpen] = useState(false)
    const location = useLocation()
    const isLanding = location.pathname === '/'

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-50"
        >
            <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
                <div className="glass-card mt-3 px-4 py-2 sm:px-5 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5 group shrink-0" aria-label="ResumeXpert home">
                        <BrandLockup compact />
                    </Link>

                    {isLanding && (
                        <div className="hidden md:flex items-center gap-6">
                            {navLinks.map(link => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="text-secondary hover:text-primary transition-colors text-sm font-medium"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    )}

                    <div className="hidden md:flex items-center gap-3">
                        <Link to="/login">
                            <AnimatedButton variant="ghost" size="sm">Log in</AnimatedButton>
                        </Link>
                        <Link to="/signup">
                            <AnimatedButton variant="primary" size="sm">Get Started</AnimatedButton>
                        </Link>
                    </div>

                    <button
                        onClick={() => setOpen(!open)}
                        className="md:hidden text-secondary hover:text-primary"
                    >
                        {open ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:hidden glass-card mt-2 p-4 flex flex-col gap-3"
                    >
                        {isLanding && navLinks.map(link => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-secondary hover:text-primary transition-colors text-sm py-2"
                                onClick={() => setOpen(false)}
                            >
                                {link.name}
                            </a>
                        ))}
                        <Link to="/login" onClick={() => setOpen(false)}>
                            <AnimatedButton variant="ghost" size="sm" className="w-full">Log in</AnimatedButton>
                        </Link>
                        <Link to="/signup" onClick={() => setOpen(false)}>
                            <AnimatedButton variant="outline" size="sm" className="w-full">Get Started</AnimatedButton>
                        </Link>
                    </motion.div>
                )}
            </div>
        </motion.nav>
    )
}
