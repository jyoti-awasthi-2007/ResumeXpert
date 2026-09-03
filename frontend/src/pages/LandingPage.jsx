import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Shield, Brain, FileCheck, Zap, ChevronRight, Award, Lock, BarChart3, Users, ArrowRight, CheckCircle } from 'lucide-react'
import Navbar from '../components/Navbar'
import AnimatedButton from '../components/AnimatedButton'
import GradientBackground from '../components/GradientBackground'
import PageTransition from '../components/PageTransition'

const fadeUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.7 }
}

const stagger = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { staggerChildren: 0.15 }
}

export default function LandingPage() {
    return (
        <PageTransition>
            <GradientBackground variant="default">
                <Navbar />

                {/* Hero */}
                <section className="min-h-screen px-4 pt-24">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-6 order-2 lg:order-1">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-secondary text-sm text-secondary mb-6">
                                    <Zap size={14} className="text-accent" />
                                    AI-Powered Verification Platform
                                </div>

                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-primary mb-6">
                                    Verify the right talent with <span className="sig-gradient text-transparent gradient-text">AI-powered insights</span>
                                </h1>

                                <p className="text-lg text-secondary max-w-2xl mb-8">Analyze your resume, discover career paths, close skill gaps, and measure the knowledge behind your claims.</p>

                                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                    <Link to="/signup">
                                        <AnimatedButton variant="primary" size="lg" icon={ArrowRight}>Get Started</AnimatedButton>
                                    </Link>
                                    <Link to="/dashboard">
                                        <AnimatedButton variant="secondary" size="lg">Open Dashboard</AnimatedButton>
                                    </Link>
                                </div>
                            </motion.div>
                        </div>

                        <div className="lg:col-span-6 order-1 lg:order-2 relative flex justify-center">
                            {/* Decorative blobs */}
                            <div className="hero-blob" style={{ width: 420, height: 420, background: 'linear-gradient(90deg,var(--grad-1),var(--grad-2))', right: -60, top: 40 }} />
                            <div className="hero-blob" style={{ width: 260, height: 260, background: 'linear-gradient(90deg,var(--grad-2),var(--grad-3))', left: -40, bottom: -20 }} />

                            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative w-full max-w-md">
                                <div className="bg-surface rounded-2xl p-6 shadow-md card-float">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-sm text-secondary">Trust Score</p>
                                            <p className="text-2xl font-bold text-primary">94%</p>
                                        </div>
                                        <div className="w-12 h-12 rounded-lg sig-gradient flex items-center justify-center">
                                            <Shield size={20} className="text-white" />
                                        </div>
                                    </div>
                                    <p className="text-sm text-secondary">Career paths analyzed • 2,847</p>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-4">
                                    <div className="bg-surface p-4 rounded-xl card-float">
                                        <p className="text-xs text-secondary">Fraud Detected</p>
                                        <p className="font-semibold text-primary">12.3%</p>
                                    </div>
                                    <div className="bg-surface p-4 rounded-xl card-float">
                                        <p className="text-xs text-secondary">Assessments</p>
                                        <p className="font-semibold text-primary">1,204</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Problem Section */}
                <section className="py-20 px-4 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <motion.div {...fadeUp} className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">The Problem We Solve</h2>
                            <p className="text-secondary max-w-xl mx-auto">Credential fraud costs businesses billions annually. Traditional verification methods are slow and unreliable.</p>
                        </motion.div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { icon: FileCheck, title: 'Unclear Resumes', desc: 'Important skills and outcomes are often difficult to identify quickly.' },
                                { icon: Users, title: 'Slow Verification', desc: 'Manual verification takes 5-10 business days, delaying hiring decisions.' },
                                { icon: Lock, title: 'No Skill Proof', desc: 'A resume claim is more useful when backed by demonstrated knowledge.' },
                            ].map((item, i) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15, duration: 0.6 }}
                                    whileHover={{ y: -8 }}
                                    className="bg-surface p-8 text-center rounded-2xl card-float"
                                >
                                    <div className="w-14 h-14 mx-auto mb-5 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(90deg,var(--grad-1),var(--grad-2))' }}>
                                        <item.icon size={28} className="text-white" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-primary mb-2">{item.title}</h3>
                                    <p className="text-sm text-secondary">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How it Works */}
                <section id="how-it-works" className="py-24 px-4">
                    <div className="max-w-6xl mx-auto">
                        <motion.div {...fadeUp} className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">How It Works</h2>
                            <p className="text-white/50 max-w-xl mx-auto">Three simple steps from resume to career readiness.</p>
                        </motion.div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { step: '01', icon: Brain, title: 'Upload & Analyze', desc: 'Upload a resume and extract the skills, experience, and education that shape your profile.' },
                                { step: '02', icon: Shield, title: 'Test Your Skills', desc: 'Take a career-specific assessment to measure demonstrated knowledge at your chosen level.' },
                                { step: '03', icon: Award, title: 'Build Your Path', desc: 'See your gaps, confidence, readiness, and the next skills to learn.' },
                            ].map((item, i) => (
                                <motion.div
                                    key={item.step}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2, duration: 0.7 }}
                                    className="relative"
                                >
                                    <div className="glass-card-strong p-8 relative overflow-hidden">
                                        <span className="absolute top-4 right-4 text-6xl font-black text-white/3">{item.step}</span>
                                        <div className="w-12 h-12 mb-5 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center">
                                            <item.icon size={24} className="text-white" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                                        <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
                                    </div>
                                    {i < 2 && (
                                        <div className="hidden md:block absolute top-1/2 -right-4 transform translate-x-full">
                                            <ChevronRight size={20} className="text-white/20" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section id="features" className="py-20 px-4 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <motion.div {...fadeUp} className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Powerful Features</h2>
                            <p className="text-secondary max-w-xl mx-auto">Everything you need to verify credentials at scale.</p>
                        </motion.div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { icon: Brain, title: 'AI Resume Parsing', desc: 'Extract skills, experience, and education using NLP.' },
                                { icon: FileCheck, title: 'Resume Analysis', desc: 'Understand the quality and coverage of your resume.' },
                                { icon: Shield, title: 'Skill Validation', desc: 'Compare resume claims with assessment performance.' },
                                { icon: BarChart3, title: 'Rich Analytics', desc: 'Detailed dashboards with trust scores and risk metrics.' },
                                { icon: Award, title: 'Career Readiness', desc: 'Combine resume quality, skill match, and demonstrated knowledge.' },
                                { icon: Users, title: 'Personalized Guidance', desc: 'Get a practical learning order for your next skills.' },
                            ].map((feature, i) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="bg-surface p-6 group cursor-pointer rounded-2xl card-float"
                                >
                                    <div className="w-11 h-11 mb-4 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(90deg,var(--grad-1),var(--grad-2))' }}>
                                        <feature.icon size={22} className="text-white" />
                                    </div>
                                    <h3 className="text-base font-semibold text-primary mb-1">{feature.title}</h3>
                                    <p className="text-sm text-secondary">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-24 px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto glass-card-strong p-12 text-center relative overflow-hidden"
                    >
                        <motion.div
                            className="absolute inset-0 bg-linear-to-r from-primary/10 via-accent/10 to-primary/10"
                            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                            transition={{ duration: 8, repeat: Infinity }}
                            style={{ backgroundSize: '200% 200%' }}
                        />
                        <div className="relative z-10">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Verify Smarter?</h2>
                            <p className="text-white/50 mb-8 max-w-lg mx-auto">Build a clearer path from what your resume claims to what you can demonstrate.</p>
                            <Link to="/signup">
                                <AnimatedButton variant="secondary" size="lg" icon={ArrowRight}>
                                    Start Free Today
                                </AnimatedButton>
                            </Link>
                        </div>
                    </motion.div>
                </section>

                {/* Footer */}
                <footer className="py-12 px-4" style={{ background: 'var(--color-text-primary)', color: 'white' }}>
                    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg" style={{ background: 'linear-gradient(90deg,var(--grad-1),var(--grad-2))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Shield size={16} className="text-white" />
                            </div>
                            <span className="font-bold gradient-text">ResumeXpert</span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-white/80">
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                            <a href="#" className="hover:text-white transition-colors">Contact</a>
                        </div>
                        <p className="text-sm text-white/60">© 2026 ResumeXpert. All rights reserved.</p>
                    </div>
                </footer>
            </GradientBackground>
        </PageTransition>
    )
}
