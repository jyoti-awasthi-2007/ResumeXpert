import { motion } from 'framer-motion'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { TrendingUp, Award, Target, Zap, FileText, Sparkles } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import PageTransition from '../components/PageTransition'
import { useCareerLens } from '../context/CareerLensContext'
import { useEffect, useState } from 'react'

export default function ResultsAnalytics() {
    const { analyticsOverview, skills, resumeState } = useCareerLens()
    const metrics = analyticsOverview.main || {}
    const [trustScore, setTrustScore] = useState(0)
    const targetScore = metrics.career_readiness || 0
    const radarData = skills.slice(0, 6).map((skill) => ({
        skill: typeof skill === 'string' ? skill : skill.name,
        value: Number(typeof skill === 'string' ? 0 : skill.confidence || 0),
    })).filter((item) => item.skill)
    const summaryData = [
        { label: 'Resume Score', value: metrics.resume_score, color: '#0b83c9', icon: FileText },
        { label: 'Skill Match', value: metrics.career_match, color: '#16b8c5', icon: Sparkles },
        { label: 'Assessment', value: metrics.assessment_score, color: '#f19a32', icon: Zap },
        { label: 'Confidence', value: metrics.confidence_score, color: '#19a979', icon: Award },
    ]
    const barData = summaryData.map(({ label, value }) => ({ name: label.replace(' Score', ''), score: value || 0 }))

    useEffect(() => {
        if (targetScore === 0) return
        const duration = 2000
        const start = Date.now()
        const frameId = { current: null }
        const animate = () => {
            const elapsed = Date.now() - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setTrustScore(Math.round(eased * targetScore))
            if (progress < 1) frameId.current = requestAnimationFrame(animate)
        }
        frameId.current = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(frameId.current)
    }, [targetScore])

    return (
        <PageTransition>
            <DashboardLayout title="Results & Analytics">
                <div className="analytics-page mx-auto max-w-7xl">
                    <div className="analytics-intro"><div><p className="analytics-kicker">Your progress, clearly mapped</p><h2>Results & Analytics</h2><p>See how your resume, skills, assessment, and career fit are moving together.</p></div><div className="analytics-intro-badge"><TrendingUp size={18} /><span>{resumeState.uploaded ? 'Live from your resume' : 'Waiting for your resume'}</span></div></div>
                    {!resumeState.uploaded && <div className="analytics-empty"><FileText size={22} /><span>Upload a resume to replace demo values with your personal results.</span></div>}
                    <div className="grid gap-5 xl:grid-cols-[1fr_1fr_1.15fr] mb-5">
                        {/* Large Circular Score */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="analytics-card flex flex-col items-center justify-center p-6 sm:p-8"
                        >
                            <h3 className="analytics-card-label">Career readiness</h3>
                            <div className="relative w-44 h-44">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
                                    <circle cx="90" cy="90" r="76" fill="none" stroke="#e6f0f4" strokeWidth="10" />
                                    <motion.circle
                                        cx="90" cy="90" r="76" fill="none"
                                        stroke="url(#trustGrad)"
                                        strokeWidth="10" strokeLinecap="round"
                                        strokeDasharray={`${(trustScore / 100) * 477.5} 477.5`}
                                        transition={{ duration: 0.3 }}
                                    />
                                    <defs>
                                        <linearGradient id="trustGrad" x1="0" y1="0" x2="1" y2="1">
                                            <stop offset="0%" stopColor="#0878c9" />
                                            <stop offset="100%" stopColor="#16c7d8" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <motion.span className="text-4xl font-bold text-primary">{trustScore}</motion.span>
                                    <span className="text-sm text-secondary">out of 100</span>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-sm text-success">
                                <TrendingUp size={16} />
                                <span>{resumeState.uploaded ? 'Calculated from your current results' : 'Complete your profile to begin'}</span>
                            </div>
                        </motion.div>

                        {/* Quick Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="analytics-card p-6 sm:p-8"
                        >
                            <h3 className="analytics-card-label mb-6">Performance summary</h3>
                            <div className="space-y-5">{summaryData.map((item) => <div key={item.label}><div className="mb-2 flex items-center justify-between gap-3 text-sm"><span className="flex items-center gap-2 text-secondary"><item.icon size={15} style={{ color: item.color }} />{item.label}</span><strong className="text-primary">{item.value || 0}%</strong></div><div className="analytics-progress"><i style={{ width: `${Math.min(item.value || 0, 100)}%`, background: item.color }} /></div></div>)}</div>
                        </motion.div>

                        {/* Radar Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="analytics-card p-5 sm:p-6"
                        >
                            <h3 className="analytics-card-label mb-2">Skill radar</h3>
                            {radarData.length ? <ResponsiveContainer width="100%" height={245}>
                                <RadarChart data={radarData} outerRadius="72%">
                                    <PolarGrid stroke="#dbeaf0" />
                                    <PolarAngleAxis dataKey="skill" tick={{ fill: '#668096', fontSize: 11 }} />
                                    <PolarRadiusAxis tick={false} axisLine={false} />
                                    <Radar dataKey="value" stroke="#0878c9" fill="#16c7d8" fillOpacity={0.24} strokeWidth={2} />
                                </RadarChart>
                            </ResponsiveContainer> : <div className="analytics-chart-empty"><Target size={26} /><span>Your extracted skills will appear here.</span></div>}
                        </motion.div>
                    </div>

                    {/* Performance Breakdown Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="analytics-card p-5 sm:p-6"
                    >
                        <h3 className="analytics-card-title">Performance breakdown</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={barData} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5eff3" />
                                <XAxis dataKey="name" stroke="#668096" fontSize={12} />
                                <YAxis stroke="#668096" fontSize={12} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ background: '#102a43', border: 0, borderRadius: '10px', color: '#fff' }}
                                />
                                <defs>
                                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#0878c9" />
                                        <stop offset="100%" stopColor="#16c7d8" />
                                    </linearGradient>
                                </defs>
                                <Bar dataKey="score" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>
            </DashboardLayout>
        </PageTransition>
    )
}
