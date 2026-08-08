import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, Shield } from 'lucide-react'
import GradientBackground from '../components/GradientBackground'
import AnimatedButton from '../components/AnimatedButton'
import PageTransition from '../components/PageTransition'

export default function SignupPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [focused, setFocused] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        navigate('/dashboard')
    }

    const strengthScore = password.length === 0 ? 0 : password.length < 4 ? 1 : password.length < 8 ? 2 : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3
    const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong']
    const strengthColors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']

    return (
        <PageTransition>
            <GradientBackground variant="auth">
                <div className="min-h-screen flex items-center justify-center px-4 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.7 }}
                        className="w-full max-w-md"
                    >
                        <div className="text-center mb-8">
                            <Link to="/" className="inline-flex items-center gap-2 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center">
                                    <Shield size={22} className="text-white" />
                                </div>
                                <span className="text-2xl font-bold gradient-text">VerifyAI</span>
                            </Link>
                            <h1 className="text-3xl font-bold text-white mb-2">Create your account</h1>
                            <p className="text-white/40">Start verifying credentials today</p>
                        </div>

                        <div className="glass-card-strong p-8">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Name */}
                                <div className="relative">
                                    <User size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focused === 'name' ? 'text-primary' : 'text-white/30'}`} />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        onFocus={() => setFocused('name')}
                                        onBlur={() => setFocused('')}
                                        placeholder="Full name"
                                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/[0.07] transition-all"
                                    />
                                </div>

                                {/* Email */}
                                <div className="relative">
                                    <Mail size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focused === 'email' ? 'text-primary' : 'text-white/30'}`} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onFocus={() => setFocused('email')}
                                        onBlur={() => setFocused('')}
                                        placeholder="Email address"
                                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/[0.07] transition-all"
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <div className="relative">
                                        <Lock size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focused === 'password' ? 'text-primary' : 'text-white/30'}`} />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onFocus={() => setFocused('password')}
                                            onBlur={() => setFocused('')}
                                            placeholder="Password"
                                            className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary/50 focus:bg-white/[0.07] transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                    {password && (
                                        <div className="mt-2 flex gap-1">
                                            {[1, 2, 3, 4].map(i => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ scaleX: 0 }}
                                                    animate={{ scaleX: i <= strengthScore ? 1 : 0.3 }}
                                                    className={`h-1 flex-1 rounded-full ${i <= strengthScore ? strengthColors[strengthScore] : 'bg-white/10'}`}
                                                />
                                            ))}
                                            <span className="text-xs text-white/40 ml-2">{strengthLabels[strengthScore]}</span>
                                        </div>
                                    )}
                                </div>

                                <AnimatedButton type="submit" variant="secondary" size="lg" className="w-full">
                                    Create Account
                                </AnimatedButton>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-white/40">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-primary hover:text-primary-light font-medium transition-colors">
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </GradientBackground>
        </PageTransition>
    )
}
