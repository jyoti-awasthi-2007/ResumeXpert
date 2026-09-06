import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'
import GradientBackground from '../components/GradientBackground'
import AnimatedButton from '../components/AnimatedButton'
import PageTransition from '../components/PageTransition'
import BrandLockup from '../components/BrandLockup'
import { useAuth } from '../context/AuthContext'

export default function SignupPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [focused, setFocused] = useState('')
    const [error, setError] = useState('')
    const [notice, setNotice] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const navigate = useNavigate()
    const { signUp, configured } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setNotice('')
        setSubmitting(true)
        try {
            const result = await signUp({ name, email, password })
            if (result.session) navigate('/profile-setup', { replace: true })
            else setNotice('Account created. Check your email to confirm your account, then sign in to continue.')
        } catch (requestError) {
            setError(requestError.message || 'Could not create your account.')
        } finally {
            setSubmitting(false)
        }
    }

    const strengthScore = password.length === 0 ? 0 : password.length < 4 ? 1 : password.length < 8 ? 2 : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3
    const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong']
    const strengthColors = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500']

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
                                <span className="auth-kicker"><Sparkles size={15} /> Start your career journey</span>
                                <h1>Make your next move feel <em>intentional.</em></h1>
                                <p>Create your workspace to turn your resume into practical, AI-guided career momentum.</p>
                            </div>
                            <div className="auth-proof"><span className="auth-proof-icon"><ShieldCheck size={20} /></span><span><strong>Your progress, in one place</strong><small>Skills, readiness, and recommendations together</small></span></div>
                            <div className="auth-orbit auth-orbit-one" /><div className="auth-orbit auth-orbit-two" /><div className="auth-showcase-dots">✦<br /><span>+</span> ✦</div>
                        </div>

                        <div className="auth-form-panel">
                            <div className="auth-form-heading"><span className="auth-mobile-brand"><Link to="/"><BrandLockup compact /></Link></span><p className="auth-form-kicker">Create your account</p><h2>Build your career workspace</h2><p>It only takes a minute to get started.</p></div>
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
                                        className="auth-input w-full pl-12 pr-4 py-3.5"
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
                                        className="auth-input w-full pl-12 pr-4 py-3.5"
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
                                    {password && (
                                        <div className="mt-2 flex gap-1">
                                            {[1, 2, 3, 4].map(i => (
                                                <div
                                                    key={i}
                                                    initial={{ scaleX: 0 }}
                                                    animate={{ scaleX: i <= strengthScore ? 1 : 0.3 }}
                                                    className={`auth-strength h-1 flex-1 rounded-full ${i <= strengthScore ? strengthColors[strengthScore] : 'auth-strength-muted'}`}
                                                />
                                            ))}
                                            <span className="auth-strength-label text-xs ml-2">{strengthLabels[strengthScore]}</span>
                                        </div>
                                    )}
                                </div>

                                {!configured && <p className="text-sm text-warning">Add Supabase keys to `frontend/.env` before creating an account.</p>}
                                {error && <p className="text-sm text-danger">{error}</p>}
                                {notice && <p className="text-sm text-success">{notice}</p>}
                                <AnimatedButton type="submit" disabled={submitting || !configured} variant="primary" size="lg" className="auth-submit w-full">
                                    {submitting ? 'Creating account...' : <>Create Account <ArrowRight size={17} /></>}
                                </AnimatedButton>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="auth-switch text-sm">
                                    Already have an account?{' '}
                                    <Link to="/login" className="auth-link font-medium transition-colors">
                                        Sign in
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
