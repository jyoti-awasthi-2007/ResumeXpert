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
                <section className="min-h-screen flex items-center justify-center px-4 pt-24">
                    <div className="max-w-6xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-white/60 mb-8"
                        >
                            <Zap size={14} className="text-accent" />
                            AI-Powered Verification Platform
                            <ChevronRight size={14} />
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
                        >
                            <span className="text-white">Verify Skills,</span>
                            <br />
                            <span className="gradient-text">Not Just Certificates</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10"
                        >
                            Our AI analyzes resumes, verifies certificates, conducts interviews, and generates
                            trust scores — eliminating fraud and surfacing real talent.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        >
                            <Link to="/signup">
                                <AnimatedButton variant="primary" size="lg" icon={ArrowRight}>
                                    Get Started Free
                                </AnimatedButton>
                            </Link>
                            <Link to="/dashboard">
                                <AnimatedButton variant="outline" size="lg">
                                    Try Demo
                                </AnimatedButton>
                            </Link>
                        </motion.div>

                        {/* Floating cards */}
                        <div className="relative mt-20 max-w-4xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 60 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 0.8 }}
                                className="glass-card-strong p-6 rounded-2xl"
                            >
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { label: 'Trust Score', value: '94%', color: 'text-green-400' },
                                        { label: 'Certificates Verified', value: '2,847', color: 'text-accent' },
                                        { label: 'Fraud Detected', value: '12.3%', color: 'text-red-400' },
                                    ].map((stat, i) => (
                                        <motion.div
                                            key={stat.label}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 1 + i * 0.15 }}
                                            className="text-center p-4"
                                        >
                                            <p className={`text-2xl sm:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                                            <p className="text-xs sm:text-sm text-white/40 mt-1">{stat.label}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Problem Section */}
                <section className="py-24 px-4">
                    <div className="max-w-6xl mx-auto">
                        <motion.div {...fadeUp} className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">The Problem We Solve</h2>
                            <p className="text-white/50 max-w-xl mx-auto">Credential fraud costs businesses billions annually. Traditional verification methods are slow and unreliable.</p>
                        </motion.div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { icon: FileCheck, title: 'Fake Certificates', desc: '68% of recruiters have caught candidates with falsified credentials.' },
                                { icon: Users, title: 'Slow Verification', desc: 'Manual verification takes 5-10 business days, delaying hiring decisions.' },
                                { icon: Lock, title: 'No Skill Proof', desc: 'Certificates prove attendance, not competence. Skills remain unverified.' },
                            ].map((item, i) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15, duration: 0.6 }}
                                    whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(108,92,231,0.15)' }}
                                    className="glass-card p-8 text-center"
                                >
                                    <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                                        <item.icon size={28} className="text-primary" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                                    <p className="text-sm text-white/40">{item.desc}</p>
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
                            <p className="text-white/50 max-w-xl mx-auto">Three simple steps to verified, trusted credentials.</p>
                        </motion.div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { step: '01', icon: Brain, title: 'Upload & Scan', desc: 'Upload resumes and certificates. Our AI extracts skills, validates documents, and detects anomalies.' },
                                { step: '02', icon: Shield, title: 'AI Interview', desc: 'Candidates take an AI-powered interview that assesses real-world knowledge and flags inconsistencies.' },
                                { step: '03', icon: Award, title: 'Trust Score', desc: 'Get a comprehensive Skill Trust Score combining certificate authenticity, interview performance, and skill tests.' },
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
                <section id="features" className="py-24 px-4">
                    <div className="max-w-6xl mx-auto">
                        <motion.div {...fadeUp} className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Powerful Features</h2>
                            <p className="text-white/50 max-w-xl mx-auto">Everything you need to verify credentials at scale.</p>
                        </motion.div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { icon: Brain, title: 'AI Resume Parsing', desc: 'Extract skills, experience, and education using NLP.' },
                                { icon: FileCheck, title: 'Certificate Verification', desc: 'Detect forged or tampered certificates instantly.' },
                                { icon: Shield, title: 'Integrity Monitoring', desc: 'Webcam + tab tracking ensures honest assessments.' },
                                { icon: BarChart3, title: 'Rich Analytics', desc: 'Detailed dashboards with trust scores and risk metrics.' },
                                { icon: Award, title: 'Verified Profiles', desc: 'Shareable verified profile badges for candidates.' },
                                { icon: Users, title: 'Recruiter Dashboard', desc: 'Compare candidates by skill scores and fraud risk.' },
                            ].map((feature, i) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="glass-card p-6 group cursor-pointer"
                                >
                                    <div className="w-11 h-11 mb-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                                        <feature.icon size={22} className="text-primary" />
                                    </div>
                                    <h3 className="text-base font-semibold text-white mb-1">{feature.title}</h3>
                                    <p className="text-sm text-white/40">{feature.desc}</p>
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
                            <p className="text-white/50 mb-8 max-w-lg mx-auto">Join thousands of recruiters and candidates using VerifyAI to build trusted credentials.</p>
                            <Link to="/signup">
                                <AnimatedButton variant="primary" size="lg" icon={ArrowRight}>
                                    Start Free Today
                                </AnimatedButton>
                            </Link>
                        </div>
                    </motion.div>
                </section>

                {/* Footer */}
                <footer className="border-t border-white/5 py-12 px-4">
                    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center">
                                <Shield size={16} className="text-white" />
                            </div>
                            <span className="font-bold gradient-text">VerifyAI</span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-white/40">
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                            <a href="#" className="hover:text-white transition-colors">Contact</a>
                        </div>
                        <p className="text-sm text-white/30">© 2026 VerifyAI. All rights reserved.</p>
                    </div>
                </footer>
            </GradientBackground>
        </PageTransition>
    )
}
