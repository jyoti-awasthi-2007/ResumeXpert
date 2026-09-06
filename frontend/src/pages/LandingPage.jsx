import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, Brain, CheckCircle2, ChevronRight, Cloud, FileCheck2, Gauge, GraduationCap, Sparkles, Target, TrendingUp, Users, Zap } from 'lucide-react'
import Navbar from '../components/Navbar'
import AnimatedButton from '../components/AnimatedButton'
import GradientBackground from '../components/GradientBackground'
import PageTransition from '../components/PageTransition'

const reveal = {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.65, ease: 'easeOut' },
}

const journey = [
    { number: '01', icon: FileCheck2, title: 'Read your resume', text: 'Turn your experience into a clear skill profile in seconds.' },
    { number: '02', icon: Brain, title: 'Measure what you know', text: 'Use focused assessments to validate your strongest claims.' },
    { number: '03', icon: Target, title: 'Choose your next move', text: 'Get a practical career path and the skills to learn next.' },
]

const features = [
    { icon: Sparkles, title: 'Resume intelligence', text: 'See strengths, missing keywords, and the story your resume tells.' },
    { icon: TrendingUp, title: 'Career matching', text: 'Compare your current profile with roles that fit your momentum.' },
    { icon: Gauge, title: 'Skill confidence', text: 'Replace guesswork with a confidence score for every key skill.' },
    { icon: BarChart3, title: 'Readiness analytics', text: 'Track progress from first upload to your next opportunity.' },
    { icon: GraduationCap, title: 'Personal learning path', text: 'Prioritize the skills that make the biggest career difference.' },
    { icon: Cloud, title: 'Always in reach', text: 'Keep your career workspace ready whenever inspiration strikes.' },
]

export default function LandingPage() {
    return (
        <PageTransition>
            <GradientBackground variant="default">
                <Navbar />
                <main className="landing-page">
                    <section className="landing-hero">
                        <div className="landing-hero-grid">
                            <motion.div {...reveal} className="landing-hero-copy">
                                <span className="landing-pill"><span className="landing-pill-dot" /> Built for your next chapter</span>
                                <h1>Your career deserves more than a <span>static resume.</span></h1>
                                <p className="landing-lead">ResumeXpert turns your experience, skills, and ambitions into a clearer path forward, so you can move from &quot;I think I am ready&quot; to &quot;I know what is next.&quot;</p>
                                <div className="landing-hero-actions"><Link to="/signup"><AnimatedButton variant="primary" size="lg" icon={ArrowRight}>Start your journey</AnimatedButton></Link><a href="#how-it-works" className="landing-text-link">See how it works <ChevronRight size={17} /></a></div>
                                <div className="landing-trust-line"><CheckCircle2 size={17} /> <span>Free to explore</span><i /> <span>No complicated setup</span></div>
                            </motion.div>
                            <motion.div className="landing-preview-wrap" initial={{ opacity: 0, scale: .92, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: .8, delay: .15, ease: 'easeOut' }}>
                                <div className="landing-preview-glow" />
                                <div className="landing-preview-card">
                                    <div className="preview-topbar"><span className="preview-dots"><i /><i /><i /></span><span className="preview-topbar-label">Career snapshot</span><span className="preview-topbar-status"><span /> Live</span></div>
                                    <div className="preview-heading"><div><span className="preview-overline">Good morning, Aisha</span><h2>Your readiness is moving up.</h2></div><span className="preview-avatar">AK</span></div>
                                    <div className="preview-score-row"><div className="preview-score-ring"><div><strong>81</strong><span>/ 100</span></div></div><div className="preview-score-copy"><strong>Good preparation</strong><p>Keep building the skills that turn potential into proof.</p><div className="preview-mini-line"><i /></div><small>+12% this month</small></div></div>
                                    <div className="preview-bottom-grid"><div className="preview-mini-card"><span className="preview-icon blue"><Brain size={15} /></span><small>Skills detected</small><strong>12</strong><em>+ 3 new</em></div><div className="preview-mini-card"><span className="preview-icon orange"><Target size={15} /></span><small>Career matches</small><strong>5</strong><em>Top fit 91%</em></div><div className="preview-mini-card"><span className="preview-icon green"><GraduationCap size={15} /></span><small>Skill confidence</small><strong>82%</strong><em>Growing</em></div></div>
                                    <div className="preview-floating-badge"><span><Sparkles size={14} /></span><div><strong>Next best skill</strong><small>Cloud deployment</small></div><ArrowRight size={14} /></div>
                                </div>
                                <span className="landing-float-label landing-float-one"><span className="float-label-icon green"><CheckCircle2 size={15} /></span> Resume analyzed</span><span className="landing-float-label landing-float-two"><span className="float-label-icon orange"><Zap size={15} /></span> Your next step</span>
                            </motion.div>
                        </div>
                    </section>
                    <section className="landing-metrics" aria-label="ResumeXpert highlights"><div><strong>12+</strong><span>career signals<br />from one resume</span></div><div><strong>5</strong><span>focused paths<br />to explore</span></div><div><strong>1</strong><span>clearer direction<br />for your next move</span></div><div className="landing-metrics-note"><Sparkles size={17} /> Your momentum, made visible.</div></section>
                    <section id="how-it-works" className="landing-section landing-journey-section"><motion.div {...reveal} className="landing-section-heading"><span className="landing-eyebrow">A clearer way forward</span><h2>From resume to <span>ready.</span></h2><p>Every feature works together to help you understand where you are and decide where to go next.</p></motion.div><div className="landing-journey-grid">{journey.map((item, index) => <motion.div {...reveal} transition={{ ...reveal.transition, delay: index * .12 }} className="landing-journey-card" key={item.number}><span className="journey-number">{item.number}</span><span className="journey-icon"><item.icon size={24} /></span><h3>{item.title}</h3><p>{item.text}</p>{index < journey.length - 1 && <ChevronRight className="journey-arrow" size={21} />}</motion.div>)}</div></section>
                    <section id="features" className="landing-section landing-features-section"><motion.div {...reveal} className="landing-section-heading landing-section-heading-left"><span className="landing-eyebrow">Everything in one view</span><h2>Make your next move <span>feel intentional.</span></h2><p>Less noise. Better questions. A career workspace that grows with you.</p></motion.div><div className="landing-feature-grid">{features.map((feature, index) => <motion.div {...reveal} transition={{ ...reveal.transition, delay: index * 0.06 }} whileHover={{ y: -7 }} className="landing-feature-card" key={feature.title}><span className={`feature-icon feature-tone-${index % 4}`}><feature.icon size={21} /></span><div><h3>{feature.title}</h3><p>{feature.text}</p></div><ArrowRight className="feature-arrow" size={17} /></motion.div>)}</div></section>
                    <section className="landing-cta-section"><motion.div {...reveal} className="landing-cta"><div className="landing-cta-shape landing-cta-shape-one" /><div className="landing-cta-shape landing-cta-shape-two" /><div className="landing-cta-content"><span className="landing-eyebrow landing-eyebrow-light">Your next chapter starts here</span><h2>Stop wondering.<br /><span>Start building.</span></h2><p>Bring your resume. We will help you find the signal, the gap, and the next step.</p><Link to="/signup"><AnimatedButton variant="secondary" size="lg" icon={ArrowRight}>Create your free workspace</AnimatedButton></Link></div><div className="landing-cta-stat"><Users size={20} /><strong>One workspace</strong><span>for your complete career picture</span></div></motion.div></section>
                </main>
            </GradientBackground>
        </PageTransition>
    )
}
