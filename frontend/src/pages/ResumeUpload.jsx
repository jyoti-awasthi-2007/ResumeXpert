import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Sparkles, Tag, CheckCircle, Loader2 } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import UploadBox from '../components/UploadBox'
import PageTransition from '../components/PageTransition'
import { useCareerLens } from '../context/CareerLensContext'

export default function ResumeUpload() {
    const { uploadResume, error } = useCareerLens()
    const [stage, setStage] = useState('upload') // upload | scanning | results
    const [extractedSkills, setExtractedSkills] = useState([])

    const handleUpload = async (files) => {
        const file = files?.[0]
        if (!file) return
        setStage('scanning')
        try {
            const analysis = await uploadResume(file)
            setExtractedSkills(analysis.skills?.map((skill) => skill.name) || [])
            setStage('results')
        } catch {
            setStage('upload')
        }
    }

    return (
        <PageTransition>
            <DashboardLayout title="Resume Upload">
                <div className="max-w-3xl mx-auto">
                    {/* Upload Stage */}
                    {stage === 'upload' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="glass-card p-8 mb-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                                        <Brain size={20} className="text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">AI Resume Scanner</h2>
                                        <p className="text-sm text-white/40">Upload your resume and let AI extract your skills</p>
                                    </div>
                                </div>
                                <UploadBox
                                    label="Upload your resume"
                                    description="PDF, DOC, or DOCX — Max 10MB"
                                    onFilesSelected={handleUpload}
                                />
                                {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
                            </div>
                        </motion.div>
                    )}

                    {/* Scanning Stage */}
                    {stage === 'scanning' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="glass-card p-8"
                        >
                            <div className="text-center mb-8">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                    className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-linear-to-br from-primary to-accent flex items-center justify-center"
                                >
                                    <Brain size={32} className="text-white" />
                                </motion.div>
                                <h2 className="text-xl font-semibold text-white mb-2">AI is scanning your resume...</h2>
                                <div className="flex items-center justify-center gap-2 text-accent">
                                    <Loader2 size={16} className="animate-spin" />
                                    <motion.span
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="text-sm"
                                    >
                                        Extracting skills and qualifications
                                    </motion.span>
                                </div>
                            </div>

                            {/* Scanning animation bars */}
                            <div className="space-y-2 mb-8">
                                {[
                                    'Parsing document structure...',
                                    'Identifying skills & technologies...',
                                    'Analyzing work experience...',
                                    'Cross-referencing certifications...',
                                ].map((step, i) => (
                                    <motion.div
                                        key={step}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.8 }}
                                        className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: i * 0.8 + 0.5 }}
                                        >
                                            <CheckCircle size={16} className="text-green-400" />
                                        </motion.div>
                                        <span className="text-sm text-white/60">{step}</span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Extracted Skills */}
                            <div>
                                <h3 className="text-sm font-medium text-white/50 mb-3 flex items-center gap-2">
                                    <Sparkles size={14} className="text-accent" />
                                    Extracted Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    <AnimatePresence>
                                        {extractedSkills.map((skill) => (
                                            <motion.span
                                                key={skill}
                                                initial={{ opacity: 0, scale: 0, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0 }}
                                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                                className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-sm font-medium border border-primary/30 flex items-center gap-1.5"
                                            >
                                                <Tag size={12} />
                                                {skill}
                                            </motion.span>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Results Stage */}
                    {stage === 'results' && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="glass-card p-8 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200 }}
                                    className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-linear-to-br from-green-500 to-emerald-400 flex items-center justify-center"
                                >
                                    <CheckCircle size={40} className="text-white" />
                                </motion.div>
                                <h2 className="text-2xl font-bold text-white mb-2">Resume Analyzed Successfully!</h2>
                                <p className="text-white/50 mb-6">{extractedSkills.length} skills extracted from your resume</p>

                                <div className="flex flex-wrap justify-center gap-2 mb-6">
                                    {extractedSkills.map(skill => (
                                        <motion.span
                                            key={skill}
                                            whileHover={{ scale: 1.1 }}
                                            className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-sm font-medium border border-primary/30"
                                        >
                                            {skill}
                                        </motion.span>
                                    ))}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => { setStage('upload'); setExtractedSkills([]) }}
                                    className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                                >
                                    Upload Another Resume
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </DashboardLayout>
        </PageTransition>
    )
}
