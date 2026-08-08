import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, Monitor, AlertTriangle, ShieldCheck, Camera, Wifi, WifiOff } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import PageTransition from '../components/PageTransition'

export default function IntegrityMonitor() {
    const [integrityScore, setIntegrityScore] = useState(92)
    const [alerts, setAlerts] = useState([
        { type: 'info', message: 'Session started', time: '0:00', icon: ShieldCheck },
        { type: 'warning', message: 'Multiple faces detected briefly', time: '2:34', icon: Eye },
        { type: 'info', message: 'Focus restored to test window', time: '3:12', icon: Monitor },
    ])
    const [indicators, setIndicators] = useState({
        faceDetected: true,
        tabActive: true,
        screenRecording: false,
        networkStable: true,
    })

    // Simulate live updates
    useEffect(() => {
        const interval = setInterval(() => {
            setIntegrityScore(prev => {
                const delta = (Math.random() - 0.4) * 2
                return Math.round(Math.min(100, Math.max(60, prev + delta)))
            })
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    const getScoreColor = (s) => s >= 80 ? '#00C853' : s >= 60 ? '#FFD600' : '#FF1744'

    return (
        <PageTransition>
            <DashboardLayout title="Integrity Monitor">
                <div className="max-w-5xl mx-auto">
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Main Score */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-2 glass-card p-8"
                        >
                            <h3 className="text-lg font-semibold text-white mb-6">Integrity Score</h3>
                            <div className="flex items-center justify-center px-4">
                                <div className="relative w-40 h-40 sm:w-56 sm:h-56">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                                        <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                                        <motion.circle
                                            cx="100" cy="100" r="85" fill="none"
                                            stroke={getScoreColor(integrityScore)}
                                            strokeWidth="12" strokeLinecap="round"
                                            strokeDasharray={`${(integrityScore / 100) * 534} 534`}
                                            animate={{ strokeDasharray: `${(integrityScore / 100) * 534} 534` }}
                                            transition={{ duration: 0.8 }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <motion.span
                                            key={integrityScore}
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            className="text-5xl font-bold"
                                            style={{ color: getScoreColor(integrityScore) }}
                                        >
                                            {integrityScore}
                                        </motion.span>
                                        <span className="text-sm text-white/40 mt-1">/ 100</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 text-center">
                                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${integrityScore >= 80
                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                    : integrityScore >= 60
                                        ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                    }`}>
                                    <ShieldCheck size={16} />
                                    {integrityScore >= 80 ? 'High Integrity' : integrityScore >= 60 ? 'Moderate' : 'Low Integrity'}
                                </span>
                            </div>
                        </motion.div>

                        {/* Floating Indicators */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-4"
                        >
                            {[
                                { label: 'Face Detected', active: indicators.faceDetected, icon: Camera, activeColor: 'text-green-400 bg-green-500/10 border-green-500/20' },
                                { label: 'Tab Active', active: indicators.tabActive, icon: Monitor, activeColor: 'text-green-400 bg-green-500/10 border-green-500/20' },
                                { label: 'Screen Recording', active: indicators.screenRecording, icon: Eye, activeColor: 'text-red-400 bg-red-500/10 border-red-500/20' },
                                { label: 'Network Stable', active: indicators.networkStable, icon: indicators.networkStable ? Wifi : WifiOff, activeColor: 'text-green-400 bg-green-500/10 border-green-500/20' },
                            ].map((ind, i) => (
                                <motion.div
                                    key={ind.label}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`glass-card p-4 flex items-center gap-3 border ${ind.active
                                        ? (ind.label === 'Screen Recording' ? 'border-red-500/20' : 'border-green-500/20')
                                        : 'border-white/10'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ind.active
                                        ? (ind.label === 'Screen Recording' ? 'bg-red-500/10' : 'bg-green-500/10')
                                        : 'bg-white/5'
                                        }`}>
                                        <ind.icon size={18} className={
                                            ind.active
                                                ? (ind.label === 'Screen Recording' ? 'text-red-400' : 'text-green-400')
                                                : 'text-white/30'
                                        } />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white/80">{ind.label}</p>
                                        <p className={`text-xs ${ind.active
                                            ? (ind.label === 'Screen Recording' ? 'text-red-400' : 'text-green-400')
                                            : 'text-white/30'
                                            }`}>
                                            {ind.active ? (ind.label === 'Screen Recording' ? 'Detected!' : 'Active') : 'Inactive'}
                                        </p>
                                    </div>
                                    <motion.div
                                        animate={ind.active ? { scale: [1, 1.3, 1] } : {}}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className={`w-3 h-3 rounded-full ${ind.active
                                            ? (ind.label === 'Screen Recording' ? 'bg-red-400' : 'bg-green-400')
                                            : 'bg-white/20'
                                            }`}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Alerts Feed */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card p-6 mt-6"
                    >
                        <h3 className="text-lg font-semibold text-white mb-4">Activity Log</h3>
                        <div className="space-y-3">
                            {alerts.map((alert, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                    className={`flex items-center gap-3 p-3 rounded-xl ${alert.type === 'warning' ? 'bg-yellow-500/5 border border-yellow-500/10' : 'bg-white/2 border border-white/5'
                                        }`}
                                >
                                    <alert.icon size={18} className={alert.type === 'warning' ? 'text-yellow-400' : 'text-green-400'} />
                                    <span className="text-sm text-white/70 flex-1">{alert.message}</span>
                                    <span className="text-xs text-white/30 font-mono">{alert.time}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </DashboardLayout>
        </PageTransition>
    )
}
