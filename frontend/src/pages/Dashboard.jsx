import { motion } from 'framer-motion'
import { TrendingUp, FileText, Award, Brain, Upload, ArrowRight, Compass, ArrowDownRight } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Link } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import ScoreCard from '../components/ScoreCard'
import ProgressBar from '../components/ProgressBar'
import PageTransition from '../components/PageTransition'
import { useCareerLens } from '../context/CareerLensContext'

const recentActivities = [
    { action: 'Resume analyzed', detail: 'react_developer_resume.pdf', time: '2 min ago', icon: FileText },
    { action: 'Assessment completed', detail: 'Career skill assessment', time: '1 hour ago', icon: Brain },
    { action: 'Career readiness updated', detail: 'Review your next steps', time: '3 hours ago', icon: Award },
]

export default function Dashboard() {
    const { analyticsOverview } = useCareerLens()
    const metrics = analyticsOverview.main || {}
    const chartData = [
        { name: 'Resume', score: metrics.resume_score || 0 },
        { name: 'Match', score: metrics.career_match || 0 },
        { name: 'Assessment', score: metrics.assessment_score || 0 },
        { name: 'Readiness', score: metrics.career_readiness || 0 },
    ]
    return (
        <PageTransition>
            <DashboardLayout title="Dashboard">
                {/* Stat Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <ScoreCard title="Career Readiness" value={metrics.career_readiness || 0} suffix="%" icon={TrendingUp} color="primary" delay={0} />
                    <ScoreCard title="Resume Score" value={metrics.resume_score || 0} suffix="%" icon={FileText} color="accent" delay={0.1} />
                    <ScoreCard title="Assessment Score" value={metrics.assessment_score || 0} suffix="%" icon={Award} color="success" delay={0.2} />
                    <ScoreCard title="Skill Confidence" value={metrics.confidence_score || 0} suffix="%" icon={Brain} color="warning" delay={0.3} />
                </div>

                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    {/* Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2 bg-surface p-6 rounded-2xl"
                    >
                        <h3 className="text-lg font-semibold text-primary mb-4">Trust Score Trend</h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--grad-1)" stopOpacity={0.28} />
                                        <stop offset="95%" stopColor="var(--grad-2)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                <XAxis dataKey="name" stroke="var(--color-text-secondary)" fontSize={12} />
                                <YAxis stroke="var(--color-text-secondary)" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ background: '#ffffff', border: '1px solid var(--color-border)', borderRadius: '12px', color: '#172033' }}
                                />
                                <Area type="monotone" dataKey="score" stroke="var(--grad-1)" strokeWidth={2} fill="url(#scoreGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Skills */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-surface p-6 rounded-2xl"
                    >
                        <h3 className="text-lg font-semibold text-primary mb-5">Top Skills</h3>
                        <div className="space-y-4">
                            <ProgressBar label="Skills detected" value={metrics.skills_detected || 0} color="primary" delay={0.6} />
                            <ProgressBar label="Career match" value={metrics.career_match || 0} color="accent" delay={0.7} />
                            <ProgressBar label="Skill gap" value={metrics.skill_gap_count || 0} color="warning" delay={0.8} />
                            <ProgressBar label="Assessment" value={metrics.assessment_score || 0} color="success" delay={0.9} />
                        </div>
                    </motion.div>
                </div>

                {/* Recent Activity + Quick Actions */}
                <div className="grid lg:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="lg:col-span-2 bg-surface p-6 rounded-2xl"
                    >
                        <h3 className="text-lg font-semibold text-primary mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                            {recentActivities.map((activity, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 + i * 0.1 }}
                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-surface-secondary transition-colors group cursor-pointer"
                                >
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(90deg,var(--grad-1),var(--grad-2))' }}>
                                        <activity.icon size={18} className="text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-primary">{activity.action}</p>
                                        <p className="text-xs text-secondary truncate">{activity.detail}</p>
                                    </div>
                                    <span className="text-xs text-secondary shrink-0">{activity.time}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-surface p-6 rounded-2xl"
                    >
                        <h3 className="text-lg font-semibold text-primary mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Upload Resume', icon: Upload, path: '/upload-resume' },
                                { label: 'Find Career Matches', icon: Compass, path: '/career-suggestions' },
                                { label: 'Review Skill Gap', icon: ArrowDownRight, path: '/skill-gap' },
                            ].map((action, i) => (
                                <Link key={action.path} to={action.path}>
                                    <motion.div
                                        whileHover={{ x: 5 }}
                                        className="flex items-center gap-3 p-3 rounded-xl cursor-pointer group"
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center`} style={{ background: 'linear-gradient(90deg,var(--grad-1),var(--grad-2))' }}>
                                            <action.icon size={18} className="text-white" />
                                        </div>
                                        <span className="text-sm font-medium text-primary flex-1">{action.label}</span>
                                        <ArrowRight size={16} className="text-secondary" />
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </DashboardLayout>
        </PageTransition>
    )
}
