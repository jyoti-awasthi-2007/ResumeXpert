import { motion } from 'framer-motion'
import { BadgeCheck, Award, Code, Globe, Share2, ExternalLink, Shield, Star, Copy, CheckCircle } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import VerificationBadge from '../components/VerificationBadge'
import ProgressBar from '../components/ProgressBar'
import AnimatedButton from '../components/AnimatedButton'
import PageTransition from '../components/PageTransition'
import { useState } from 'react'

const skills = [
    { name: 'React.js', level: 92, verified: true },
    { name: 'Node.js', level: 85, verified: true },
    { name: 'Python', level: 78, verified: true },
    { name: 'AWS', level: 70, verified: false },
    { name: 'TypeScript', level: 88, verified: true },
    { name: 'Docker', level: 65, verified: false },
]

const certificates = [
    { name: 'AWS Solutions Architect', issuer: 'Amazon', year: '2025', verified: true },
    { name: 'Google Cloud Engineer', issuer: 'Google', year: '2024', verified: true },
    { name: 'React Advanced', issuer: 'Meta', year: '2025', verified: true },
]

export default function VerifiedProfile() {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText('https://verifyai.com/profile/john-doe-x7k2')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <PageTransition>
            <DashboardLayout title="Verified Profile">
                <div className="max-w-4xl mx-auto">
                    {/* Profile Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-8 relative overflow-hidden mb-6"
                    >
                        {/* Glow effect */}
                        <motion.div
                            animate={{
                                background: [
                                    'radial-gradient(circle at 20% 50%, rgba(108,92,231,0.15) 0%, transparent 50%)',
                                    'radial-gradient(circle at 80% 50%, rgba(0,212,255,0.15) 0%, transparent 50%)',
                                    'radial-gradient(circle at 20% 50%, rgba(108,92,231,0.15) 0%, transparent 50%)',
                                ],
                            }}
                            transition={{ duration: 6, repeat: Infinity }}
                            className="absolute inset-0"
                        />

                        <div className="relative flex flex-col sm:flex-row items-center gap-6">
                            {/* Avatar */}
                            <motion.div
                                animate={{ boxShadow: ['0 0 20px rgba(108,92,231,0.3)', '0 0 40px rgba(0,212,255,0.3)', '0 0 20px rgba(108,92,231,0.3)'] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="w-24 h-24 rounded-2xl bg-linear-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-white shrink-0"
                            >
                                JD
                            </motion.div>

                            <div className="flex-1 text-center sm:text-left">
                                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                                    <h2 className="text-2xl font-bold text-white">John Doe</h2>
                                    <VerificationBadge verified size="md" />
                                </div>
                                <p className="text-white/40 text-sm mb-3">Full Stack Developer • 5+ years experience</p>
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                    <span className="flex items-center gap-1 text-xs text-white/40">
                                        <Globe size={12} /> San Francisco, CA
                                    </span>
                                    <span className="flex items-center gap-1 text-xs text-green-400">
                                        <Star size={12} /> Trust Score: 87/100
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <AnimatedButton variant="primary" size="sm" icon={Share2} onClick={handleCopy}>
                                    {copied ? 'Copied!' : 'Share Profile'}
                                </AnimatedButton>
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* Verified Skills */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass-card p-6"
                        >
                            <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                                <Code size={18} className="text-primary" />
                                Verified Skills
                            </h3>
                            <div className="space-y-4">
                                {skills.map((skill, i) => (
                                    <motion.div
                                        key={skill.name}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + i * 0.08 }}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            {skill.verified && <BadgeCheck size={14} className="text-primary" />}
                                            <ProgressBar label={skill.name} value={skill.level} color={skill.verified ? 'primary' : 'warning'} delay={0.3 + i * 0.1} />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Certificates */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-card p-6"
                        >
                            <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                                <Award size={18} className="text-accent" />
                                Certificates
                            </h3>
                            <div className="space-y-3">
                                {certificates.map((cert, i) => (
                                    <motion.div
                                        key={cert.name}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 + i * 0.1 }}
                                        whileHover={{ x: 5 }}
                                        className="flex items-center gap-3 p-4 rounded-xl bg-white/2 border border-white/5 hover:border-white/10 transition-all cursor-pointer"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                                            <Award size={18} className="text-accent" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white/80 truncate">{cert.name}</p>
                                            <p className="text-xs text-white/40">{cert.issuer} • {cert.year}</p>
                                        </div>
                                        {cert.verified && <BadgeCheck size={18} className="text-green-400 shrink-0" />}
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Verification Link */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card p-6 mt-6"
                    >
                        <h3 className="text-sm font-medium text-white/50 mb-3">Verification Link</h3>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white/60 truncate font-mono">
                                https://verifyai.com/profile/john-doe-x7k2
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCopy}
                                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                            >
                                {copied ? <CheckCircle size={18} className="text-green-400" /> : <Copy size={18} />}
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                            >
                                <ExternalLink size={18} />
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </DashboardLayout>
        </PageTransition>
    )
}
