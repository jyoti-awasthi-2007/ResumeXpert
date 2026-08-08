import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileCheck, ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle, XCircle, Upload } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import UploadBox from '../components/UploadBox'
import ProgressBar from '../components/ProgressBar'
import PageTransition from '../components/PageTransition'

const mockCerts = [
    { name: 'AWS Solutions Architect', issuer: 'Amazon Web Services', score: 96, status: 'verified', risk: 'low' },
    { name: 'Google Cloud Engineer', issuer: 'Google', score: 88, status: 'verified', risk: 'low' },
    { name: 'React Developer Certificate', issuer: 'Unknown Academy', score: 34, status: 'flagged', risk: 'high' },
    { name: 'Python Data Science', issuer: 'Coursera', score: 72, status: 'pending', risk: 'medium' },
]

export default function CertificateAnalysis() {
    const [analyzing, setAnalyzing] = useState(false)
    const [results, setResults] = useState(null)

    const handleUpload = () => {
        setAnalyzing(true)
        setTimeout(() => {
            setResults(mockCerts)
            setAnalyzing(false)
        }, 3000)
    }

    const statusIcons = {
        verified: <CheckCircle size={16} className="text-green-400" />,
        flagged: <XCircle size={16} className="text-red-400" />,
        pending: <AlertTriangle size={16} className="text-yellow-400" />,
    }

    const riskColors = {
        low: 'text-green-400 bg-green-500/10 border-green-500/20',
        medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
        high: 'text-red-400 bg-red-500/10 border-red-500/20',
    }

    return (
        <PageTransition>
            <DashboardLayout title="Certificate Analysis">
                <div className="max-w-4xl mx-auto">
                    {!results && !analyzing && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <div className="glass-card p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                                        <FileCheck size={20} className="text-accent" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">Certificate Verification</h2>
                                        <p className="text-sm text-white/40">Upload certificates to check authenticity</p>
                                    </div>
                                </div>
                                <UploadBox
                                    label="Upload certificates"
                                    description="Upload multiple certificates for batch analysis"
                                    multiple
                                    onFilesSelected={handleUpload}
                                />
                            </div>
                        </motion.div>
                    )}

                    {analyzing && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-8 text-center">
                            <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-accent to-primary flex items-center justify-center"
                            >
                                <ShieldCheck size={36} className="text-white" />
                            </motion.div>
                            <h2 className="text-xl font-semibold text-white mb-2">Analyzing Certificates...</h2>
                            <p className="text-white/40 mb-6 text-sm">Cross-referencing with issuer databases</p>
                            <div className="max-w-sm mx-auto space-y-3">
                                {['Checking digital signatures...', 'Verifying issuer authenticity...', 'Analyzing document metadata...', 'Computing trust score...'].map((step, i) => (
                                    <motion.div
                                        key={step}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.6 }}
                                    >
                                        <ProgressBar value={(i + 1) * 25} label={step} color={i < 2 ? 'accent' : 'primary'} delay={i * 0.5} height="h-1.5" />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {results && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            {/* Summary */}
                            <div className="grid sm:grid-cols-3 gap-4">
                                {[
                                    { label: 'Total Analyzed', value: results.length, icon: FileCheck, color: 'text-accent' },
                                    { label: 'Verified', value: results.filter(c => c.status === 'verified').length, icon: ShieldCheck, color: 'text-green-400' },
                                    { label: 'Flagged', value: results.filter(c => c.status === 'flagged').length, icon: ShieldAlert, color: 'text-red-400' },
                                ].map((stat, i) => (
                                    <motion.div
                                        key={stat.label}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="glass-card p-5 text-center"
                                    >
                                        <stat.icon size={24} className={`${stat.color} mx-auto mb-2`} />
                                        <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                                        <p className="text-xs text-white/40">{stat.label}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Certificate List */}
                            <div className="space-y-3">
                                {results.map((cert, i) => (
                                    <motion.div
                                        key={cert.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        whileHover={{ x: 5 }}
                                        className="glass-card p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                {statusIcons[cert.status]}
                                                <h3 className="font-semibold text-white truncate">{cert.name}</h3>
                                            </div>
                                            <p className="text-sm text-white/40">Issuer: {cert.issuer}</p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {/* Authenticity Score */}
                                            <div className="text-center">
                                                <div className="relative w-14 h-14">
                                                    <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                                                        <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                                                        <motion.circle
                                                            cx="28" cy="28" r="24" fill="none"
                                                            stroke={cert.score > 70 ? '#00C853' : cert.score > 40 ? '#FFD600' : '#FF1744'}
                                                            strokeWidth="4" strokeLinecap="round"
                                                            strokeDasharray={`${(cert.score / 100) * 150.8} 150.8`}
                                                            initial={{ strokeDasharray: '0 150.8' }}
                                                            animate={{ strokeDasharray: `${(cert.score / 100) * 150.8} 150.8` }}
                                                            transition={{ duration: 1.5, delay: i * 0.1 }}
                                                        />
                                                    </svg>
                                                    <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                                                        {cert.score}%
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Risk Badge */}
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-lg border ${riskColors[cert.risk]} capitalize`}>
                                                {cert.risk} risk
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setResults(null)}
                                className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-all cursor-pointer"
                            >
                                <Upload size={16} />
                                Analyze More Certificates
                            </motion.button>
                        </motion.div>
                    )}
                </div>
            </DashboardLayout>
        </PageTransition>
    )
}
