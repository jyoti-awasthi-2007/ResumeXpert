import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, ChevronDown, BadgeCheck, AlertTriangle, Shield, Eye, Download, Users } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import AnimatedButton from '../components/AnimatedButton'
import PageTransition from '../components/PageTransition'

const candidates = [
    { id: 1, name: 'Alice Johnson', role: 'Frontend Developer', score: 94, risk: 'low', status: 'verified', avatar: 'AJ' },
    { id: 2, name: 'Bob Smith', role: 'Backend Engineer', score: 87, risk: 'low', status: 'verified', avatar: 'BS' },
    { id: 3, name: 'Charlie Brown', role: 'Full Stack Developer', score: 72, risk: 'medium', status: 'pending', avatar: 'CB' },
    { id: 4, name: 'Diana Ross', role: 'Data Scientist', score: 91, risk: 'low', status: 'verified', avatar: 'DR' },
    { id: 5, name: 'Eve Williams', role: 'DevOps Engineer', score: 45, risk: 'high', status: 'flagged', avatar: 'EW' },
    { id: 6, name: 'Frank Miller', role: 'ML Engineer', score: 88, risk: 'low', status: 'verified', avatar: 'FM' },
    { id: 7, name: 'Grace Lee', role: 'Product Manager', score: 68, risk: 'medium', status: 'pending', avatar: 'GL' },
    { id: 8, name: 'Henry Chen', role: 'Frontend Developer', score: 96, risk: 'low', status: 'verified', avatar: 'HC' },
]

export default function RecruiterDashboard() {
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('all')
    const [showFilters, setShowFilters] = useState(false)

    const filtered = candidates.filter(c => {
        const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase())
        const matchFilter = filter === 'all' || c.status === filter
        return matchSearch && matchFilter
    })

    const statusStyles = {
        verified: 'text-green-400 bg-green-500/10 border-green-500/20',
        pending: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
        flagged: 'text-red-400 bg-red-500/10 border-red-500/20',
    }

    const riskStyles = {
        low: 'text-green-400',
        medium: 'text-yellow-400',
        high: 'text-red-400',
    }

    return (
        <PageTransition>
            <DashboardLayout title="Recruiter Dashboard">
                <div className="max-w-6xl mx-auto">
                    {/* Summary Cards */}
                    <div className="grid sm:grid-cols-4 gap-4 mb-6">
                        {[
                            { label: 'Total Candidates', value: candidates.length, icon: Users, color: 'text-primary' },
                            { label: 'Verified', value: candidates.filter(c => c.status === 'verified').length, icon: BadgeCheck, color: 'text-green-400' },
                            { label: 'Pending', value: candidates.filter(c => c.status === 'pending').length, icon: Shield, color: 'text-yellow-400' },
                            { label: 'Flagged', value: candidates.filter(c => c.status === 'flagged').length, icon: AlertTriangle, color: 'text-red-400' },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                className="glass-card p-5 text-center"
                            >
                                <stat.icon size={22} className={`${stat.color} mx-auto mb-2`} />
                                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                                <p className="text-xs text-white/40">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Toolbar */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card p-4 mb-6 flex flex-col sm:flex-row gap-3"
                    >
                        <div className="relative flex-1">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search candidates..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {['all', 'verified', 'pending', 'flagged'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize cursor-pointer ${filter === f
                                        ? 'bg-primary/20 text-primary border border-primary/30'
                                        : 'bg-white/5 text-white/40 border border-white/10 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Candidate Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-card overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="text-left p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Candidate</th>
                                        <th className="text-left p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Role</th>
                                        <th className="text-center p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Skill Score</th>
                                        <th className="text-center p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Fraud Risk</th>
                                        <th className="text-center p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Status</th>
                                        <th className="text-center p-4 text-xs font-semibold text-white/40 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {filtered.map((c, i) => (
                                            <motion.tr
                                                key={c.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 10 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="border-b border-white/5 hover:bg-white/2 transition-colors"
                                            >
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-lg bg-linear-to-br from-primary/30 to-accent/30 flex items-center justify-center text-xs font-bold text-white/80">
                                                            {c.avatar}
                                                        </div>
                                                        <span className="text-sm font-medium text-white/80">{c.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm text-white/50">{c.role}</td>
                                                <td className="p-4 text-center">
                                                    <span className={`text-sm font-bold ${c.score >= 80 ? 'text-green-400' : c.score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                                                        {c.score}%
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className={`text-xs font-semibold ${riskStyles[c.risk]} capitalize`}>
                                                        {c.risk}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <span className={`inline-flex px-3 py-1 rounded-lg text-xs font-semibold border capitalize ${statusStyles[c.status]}`}>
                                                        {c.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        className="text-white/30 hover:text-primary transition-colors cursor-pointer"
                                                    >
                                                        <Eye size={18} />
                                                    </motion.button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>

                        {filtered.length === 0 && (
                            <div className="p-12 text-center text-white/30">
                                <Search size={32} className="mx-auto mb-3 opacity-50" />
                                <p>No candidates found</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </DashboardLayout>
        </PageTransition>
    )
}
