import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import GradientBackground from '../components/GradientBackground'
import AnimatedButton from '../components/AnimatedButton'
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
                <div className="auth-page min-h-screen flex items-center justify-center px-4 py-8">
                    <div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.7 }}
                        className="auth-frame w-full max-w-5xl"
                    >
                        <div className="auth-showcase">
                            <Link to="/" className="auth-brand"><BrandLockup /></Link>
                            <div className="auth-showcase-copy">
                                <span className="auth-kicker"><Sparkles size={15} /> AI-powered career clarity</span>
                                <h1>Turn your experience into your <em>next opportunity.</em></h1>
                                <p>Analyze your resume, discover your strongest skills, and build a career path that feels made for you.</p>
                            </div>
                            <div className="auth-proof"><span className="auth-proof-icon"><ShieldCheck size={20} /></span><span><strong>Trusted career insights</strong><small>One focused workspace for your next move</small></span></div>
                            <div className="auth-orbit auth-orbit-one" /><div className="auth-orbit auth-orbit-two" /><div className="auth-showcase-dots">✦<br /><span>+</span> ✦</div>
                        </div>

                        <div className="auth-form-panel">
                            <div className="auth-form-heading"><span className="auth-mobile-brand"><Link to="/"><BrandLockup compact /></Link></span><p className="auth-form-kicker">Welcome back</p><h2>Sign in to your account</h2><p>Pick up where you left off.</p></div>
                            <form onSubmit={handleSubmit} className="space-y-5">
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
                                        className="auth-input w-full pl-12 pr-4 py-3.5"
                                    />
                                </div>

                                {/* Password */}
                                <div className="relative">
                                    <Lock size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${focused === 'password' ? 'text-primary' : 'text-white/30'}`} />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onFocus={() => setFocused('password')}
                                        onBlur={() => setFocused('')}
                                        placeholder="Password"
                                        className="auth-input w-full pl-12 pr-12 py-3.5"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <label className="auth-checkbox flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" />
                                        <span>Remember me</span>
                                    </label>
                                    <a href="#" className="auth-link">Forgot password?</a>
                                </div>

                                {!configured && <p className="text-sm text-warning">Add Supabase keys to `frontend/.env` before signing in.</p>}
                                {error && <p className="text-sm text-danger">{error}</p>}
                                <AnimatedButton type="submit" disabled={submitting || !configured} variant="primary" size="lg" className="auth-submit w-full">
                                    {submitting ? 'Signing in...' : <>Sign In <ArrowRight size={17} /></>}
                                </AnimatedButton>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="auth-switch text-sm">
                                    Don't have an account?{' '}
                                    <Link to="/signup" className="auth-link font-medium transition-colors">
                                        Sign up
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </GradientBackground>
        </PageTransition>
    )
}
