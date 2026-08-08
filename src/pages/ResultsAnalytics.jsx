import { motion } from 'framer-motion'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { TrendingUp, Award, Target, Zap } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import ProgressBar from '../components/ProgressBar'
import PageTransition from '../components/PageTransition'
import { useState, useEffect } from 'react'

const radarData = [
    { skill: 'React', value: 92 },
    { skill: 'Node.js', value: 85 },
    { skill: 'Python', value: 78 },
    { skill: 'AWS', value: 70 },
    { skill: 'System Design', value: 65 },
    { skill: 'DSA', value: 80 },
]

const barData = [
    { name: 'Resume', score: 90 },
    { name: 'Certificates', score: 85 },
    { name: 'Interview', score: 78 },
    { name: 'Skill Test', score: 92 },
    { name: 'Integrity', score: 95 },
]

export default function ResultsAnalytics() {
    const [trustScore, setTrustScore] = useState(0)
    const targetScore = 87

    useEffect(() => {
        const duration = 2000
        const start = Date.now()
        const animate = () => {
            const elapsed = Date.now() - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setTrustScore(Math.round(eased * targetScore))
            if (progress < 1) requestAnimationFrame(animate)
        }
        animate()
    }, [])

    return (
        <PageTransition>
            <DashboardLayout title="Results & Analytics">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-6 mb-6">
                        {/* Large Circular Score */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-8 flex flex-col items-center justify-center"
                        >
                            <h3 className="text-sm text-white/50 mb-4 font-medium">Skill Trust Score</h3>
                            <div className="relative w-44 h-44">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 180 180">
                                    <circle cx="90" cy="90" r="76" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                                    <motion.circle
                                        cx="90" cy="90" r="76" fill="none"
                                        stroke="url(#trustGrad)"
                                        strokeWidth="10" strokeLinecap="round"
                                        strokeDasharray={`${(trustScore / 100) * 477.5} 477.5`}
                                        transition={{ duration: 0.3 }}
                                    />
                                    <defs>
                                        <linearGradient id="trustGrad" x1="0" y1="0" x2="1" y2="1">
                                            <stop offset="0%" stopColor="#6C5CE7" />
                                            <stop offset="100%" stopColor="#00D4FF" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <motion.span className="text-4xl font-bold gradient-text">{trustScore}</motion.span>
                                    <span className="text-sm text-white/30">out of 100</span>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-sm">
                                <TrendingUp size={16} className="text-green-400" />
                                <span className="text-green-400">+5 from last assessment</span>
                            </div>
                        </motion.div>

                        {/* Quick Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-card p-8 space-y-6"
                        >
                            <h3 className="text-sm text-white/50 font-medium">Performance Summary</h3>
                            {[
                                { label: 'Resume Score', value: 90, color: 'primary', icon: Target },
                                { label: 'Interview Score', value: 78, color: 'accent', icon: Zap },
                                { label: 'Test Score', value: 92, color: 'success', icon: Award },
                            ].map((item, i) => (
                                <div key={item.label}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <item.icon size={14} className="text-white/40" />
                                        <ProgressBar label={item.label} value={item.value} color={item.color} delay={0.3 + i * 0.2} />
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        {/* Radar Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-card p-6"
                        >
                            <h3 className="text-sm text-white/50 font-medium mb-4">Skill Radar</h3>
                            <ResponsiveContainer width="100%" height={240}>
                                <RadarChart data={radarData}>
                                    <PolarGrid stroke="rgba(255,255,255,0.08)" />
                                    <PolarAngleAxis dataKey="skill" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                                    <PolarRadiusAxis tick={false} axisLine={false} />
                                    <Radar dataKey="value" stroke="#6C5CE7" fill="#6C5CE7" fillOpacity={0.2} strokeWidth={2} />
                                </RadarChart>
                            </ResponsiveContainer>
                        </motion.div>
                    </div>

                    {/* Performance Breakdown Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card p-6"
                    >
                        <h3 className="text-lg font-semibold text-white mb-4">Performance Breakdown</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={barData} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                                />
                                <defs>
                                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6C5CE7" />
                                        <stop offset="100%" stopColor="#00D4FF" />
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
