import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import GradientBackground from '../components/GradientBackground'
import PageTransition from '../components/PageTransition'
import BrandLockup from '../components/BrandLockup'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [focused, setFocused] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const navigate = useNavigate()
    const { signIn, configured } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSubmitting(true)
        try {
            const result = await signIn({ email, password })
            navigate(result.profile ? '/dashboard' : '/profile-setup', { replace: true })
        } catch (requestError) {
            setError(requestError.message || 'Could not sign in.')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <PageTransition>
            <GradientBackground variant="auth">
                <div className="h-screen max-h-screen overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-8">
                    <motion.div
                        initial={{ opacity: 0, y: 16, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="w-full max-w-[940px] rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-[0_20px_70px_-15px_rgba(8,120,201,0.12)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10"
                    >
                        {/* Left Brand & Story Panel */}
                        <div className="hidden md:flex lg:col-span-6 relative p-8 lg:p-10 flex-col justify-between overflow-hidden bg-gradient-to-br from-sky-50/70 via-white to-cyan-50/40 border-r border-slate-100">
                            {/* Ambient soft glow */}
                            <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-sky-400/10 blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />

                            {/* Brand Header */}
                            <div className="relative z-10">
                                <Link to="/" className="inline-flex focus:outline-hidden">
                                    <BrandLockup />
                                </Link>
                            </div>

                            {/* Headline & Airy Value Points */}
                            <div className="relative z-10 my-auto py-6 space-y-5">
                                <div>
                                    <h1 className="text-2xl lg:text-[30px] font-display font-bold text-slate-900 leading-[1.22] tracking-tight">
                                        Turn your experience into your{' '}
                                        <span className="gradient-text">next opportunity.</span>
                                    </h1>
                                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mt-2.5 max-w-sm">
                                        AI-powered resume optimization, skill insights, and personalized career roadmaps in one place.
                                    </p>
                                </div>

                                {/* Clean feature points with generous breathing room */}
                                <div className="space-y-3 pt-1">
                                    <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                                        <div className="w-7 h-7 rounded-lg bg-sky-100/90 text-sky-700 flex items-center justify-center shrink-0">
                                            <Sparkles size={14} />
                                        </div>
                                        <span className="font-medium">Real-time ATS resume scoring & optimization</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                                        <div className="w-7 h-7 rounded-lg bg-teal-100/90 text-teal-700 flex items-center justify-center shrink-0">
                                            <CheckCircle2 size={14} />
                                        </div>
                                        <span className="font-medium">Automated skill gap & role readiness mapping</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                                        <div className="w-7 h-7 rounded-lg bg-indigo-100/90 text-indigo-700 flex items-center justify-center shrink-0">
                                            <ShieldCheck size={14} />
                                        </div>
                                        <span className="font-medium">Personalized career trajectory & guidance</span>
                                    </div>
                                </div>
                            </div>

                            {/* Clean Social Proof Footer */}
                            <div className="relative z-10 pt-4 border-t border-slate-200/60 flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    <div className="w-7 h-7 rounded-full ring-2 ring-white bg-gradient-to-tr from-sky-400 to-blue-500 text-[10px] font-bold text-white flex items-center justify-center shadow-xs">AK</div>
                                    <div className="w-7 h-7 rounded-full ring-2 ring-white bg-gradient-to-tr from-teal-400 to-emerald-500 text-[10px] font-bold text-white flex items-center justify-center shadow-xs">SL</div>
                                    <div className="w-7 h-7 rounded-full ring-2 ring-white bg-gradient-to-tr from-orange-400 to-rose-500 text-[10px] font-bold text-white flex items-center justify-center shadow-xs">RJ</div>
                                </div>
                                <p className="text-xs text-slate-500">
                                    Joined by <strong className="text-slate-800 font-semibold">10,000+</strong> professionals
                                </p>
                            </div>
                        </div>

                        {/* Right Form Panel */}
                        <div className="lg:col-span-6 p-8 lg:p-10 flex flex-col justify-center bg-white">
                            {/* Mobile brand header */}
                            <div className="md:hidden mb-5 flex items-center justify-center">
                                <Link to="/" className="inline-flex">
                                    <BrandLockup compact />
                                </Link>
                            </div>

                            <div className="mb-6">
                                <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Welcome back</h2>
                                <p className="text-xs text-slate-500 mt-1">Sign in to access your personalized workspace.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Email Field */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-medium text-slate-700">Email address</label>
                                    <div className="relative">
                                        <Mail
                                            size={17}
                                            className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${
                                                focused === 'email' ? 'text-sky-600' : 'text-slate-400'
                                            }`}
                                        />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            onFocus={() => setFocused('email')}
                                            onBlur={() => setFocused('')}
                                            placeholder="you@company.com"
                                            required
                                            className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all text-sm outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Password Field */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-medium text-slate-700">Password</label>
                                        <a href="#" className="text-xs font-medium text-sky-600 hover:text-sky-700 hover:underline transition-colors">
                                            Forgot password?
                                        </a>
                                    </div>
                                    <div className="relative">
                                        <Lock
                                            size={17}
                                            className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${
                                                focused === 'password' ? 'text-sky-600' : 'text-slate-400'
                                            }`}
                                        />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            onFocus={() => setFocused('password')}
                                            onBlur={() => setFocused('')}
                                            placeholder="Enter your password"
                                            required
                                            className="w-full h-11 pl-10 pr-11 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all text-sm outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Remember me */}
                                <div className="flex items-center text-xs">
                                    <label className="inline-flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-900 select-none">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 accent-sky-600 cursor-pointer"
                                        />
                                        <span>Remember me for 30 days</span>
                                    </label>
                                </div>

                                {/* Warning & Error Banners */}
                                {!configured && (
                                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs">
                                        <AlertCircle size={16} className="shrink-0 text-amber-600 mt-0.5" />
                                        <span>Add Supabase keys to <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[11px]">frontend/.env</code> before signing in.</span>
                                    </div>
                                )}

                                {error && (
                                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs">
                                        <AlertCircle size={16} className="shrink-0 text-rose-600 mt-0.5" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {/* Submit CTA Button */}
                                <button
                                    type="submit"
                                    disabled={submitting || !configured}
                                    className="w-full h-11 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 shadow-md shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-500/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 group mt-1"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="animate-spin" size={17} />
                                            <span>Signing in...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Sign In</span>
                                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Switch to Sign Up */}
                            <div className="mt-6 text-center pt-3 border-t border-slate-100">
                                <p className="text-xs sm:text-sm text-slate-500">
                                    Don't have an account?{' '}
                                    <Link to="/signup" className="font-semibold text-sky-600 hover:text-sky-700 hover:underline transition-colors ml-0.5">
                                        Sign up
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
