import { motion } from 'framer-motion'
import { TrendingUp, FileText, Award, ShieldCheck, Brain, Upload, ArrowRight } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Link } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import ScoreCard from '../components/ScoreCard'
import ProgressBar from '../components/ProgressBar'
import PageTransition from '../components/PageTransition'

const chartData = [
    { name: 'Jan', score: 65 }, { name: 'Feb', score: 72 }, { name: 'Mar', score: 68 },
    { name: 'Apr', score: 78 }, { name: 'May', score: 82 }, { name: 'Jun', score: 87 },
    { name: 'Jul', score: 91 },
]

const recentActivities = [
    { action: 'Resume analyzed', detail: 'react_developer_resume.pdf', time: '2 min ago', icon: FileText },
    { action: 'Certificate verified', detail: 'AWS Solutions Architect', time: '15 min ago', icon: Award },
    { action: 'AI Interview completed', detail: 'React & Node.js assessment', time: '1 hour ago', icon: Brain },
    { action: 'Skill test passed', detail: 'JavaScript Advanced — 94%', time: '3 hours ago', icon: ShieldCheck },
]

export default function Dashboard() {
    return (
        <PageTransition>
            <DashboardLayout title="Dashboard">
                {/* Stat Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <ScoreCard title="Skill Trust Score" value={87} suffix="%" icon={TrendingUp} color="primary" delay={0} />
                    <ScoreCard title="Certificates Uploaded" value={12} icon={FileText} color="accent" delay={0.1} />
                    <ScoreCard title="Tests Completed" value={8} icon={Award} color="success" delay={0.2} />
                    <ScoreCard title="Verification Status" value={94} suffix="%" icon={ShieldCheck} color="warning" delay={0.3} />
                </div>

                <div className="grid lg:grid-cols-3 gap-6 mb-8">
                    {/* Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="lg:col-span-2 glass-card p-6"
                    >
                        <h3 className="text-lg font-semibold text-white mb-4">Trust Score Trend</h3>
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6C5CE7" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6C5CE7" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="score" stroke="#6C5CE7" strokeWidth={2} fill="url(#scoreGradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Skills */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="glass-card p-6"
                    >
                        <h3 className="text-lg font-semibold text-white mb-5">Top Skills</h3>
                        <div className="space-y-4">
                            <ProgressBar label="React.js" value={92} color="primary" delay={0.6} />
                            <ProgressBar label="Node.js" value={85} color="accent" delay={0.7} />
                            <ProgressBar label="Python" value={78} color="success" delay={0.8} />
                            <ProgressBar label="AWS" value={70} color="warning" delay={0.9} />
                            <ProgressBar label="TypeScript" value={88} color="primary" delay={1.0} />
                        </div>
                    </motion.div>
                </div>

                {/* Recent Activity + Quick Actions */}
                <div className="grid lg:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="lg:col-span-2 glass-card p-6"
                    >
                        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                        <div className="space-y-3">
                            {recentActivities.map((activity, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.7 + i * 0.1 }}
                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <activity.icon size={18} className="text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-white/80">{activity.action}</p>
                                        <p className="text-xs text-white/40 truncate">{activity.detail}</p>
                                    </div>
                                    <span className="text-xs text-white/30 shrink-0">{activity.time}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="glass-card p-6"
                    >
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Upload Resume', icon: Upload, path: '/upload-resume', color: 'from-primary to-purple-400' },
                                { label: 'Start AI Interview', icon: Brain, path: '/ai-interview', color: 'from-accent to-cyan-300' },
                                { label: 'Take Skill Test', icon: Award, path: '/skill-test', color: 'from-green-500 to-emerald-400' },
                            ].map((action, i) => (
                                <Link key={action.path} to={action.path}>
                                    <motion.div
                                        whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                        className="flex items-center gap-3 p-3 rounded-xl cursor-pointer group"
                                    >
                                        <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${action.color} flex items-center justify-center`}>
                                            <action.icon size={18} className="text-white" />
                                        </div>
                                        <span className="text-sm font-medium text-white/70 group-hover:text-white flex-1">{action.label}</span>
                                        <ArrowRight size={16} className="text-white/20 group-hover:text-white/60" />
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
