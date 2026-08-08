import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, X, CheckCircle } from 'lucide-react'

export default function UploadBox({
    onFilesSelected,
    accept = '.pdf,.doc,.docx,.jpg,.png',
    multiple = false,
    label = 'Upload your file',
    description = 'Drag & drop or click to browse',
}) {
    const [files, setFiles] = useState([])
    const [isDragging, setIsDragging] = useState(false)
    const [uploadProgress, setUploadProgress] = useState({})

    const handleFiles = useCallback((newFiles) => {
        const fileArray = Array.from(newFiles)
        setFiles(prev => multiple ? [...prev, ...fileArray] : fileArray)

        // Simulate upload progress
        fileArray.forEach((file, i) => {
            const id = file.name + Date.now()
            let progress = 0
            const interval = setInterval(() => {
                progress += Math.random() * 15
                if (progress >= 100) {
                    progress = 100
                    clearInterval(interval)
                }
                setUploadProgress(prev => ({ ...prev, [id]: progress }))
            }, 200)
        })

        onFilesSelected?.(fileArray)
    }, [multiple, onFilesSelected])

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        handleFiles(e.dataTransfer.files)
    }

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="space-y-4">
            <motion.div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload-input')?.click()}
                whileHover={{ scale: 1.01 }}
                className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300
          ${isDragging
                        ? 'border-accent bg-accent/5 shadow-[0_0_30px_rgba(0,212,255,0.15)]'
                        : 'border-white/10 hover:border-primary/50 hover:bg-primary/5'
                    }`}
            >
                <input
                    id="file-upload-input"
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={(e) => handleFiles(e.target.files)}
                    className="hidden"
                />

                <motion.div
                    animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }}
                    className="flex flex-col items-center gap-4"
                >
                    <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Upload size={28} className={isDragging ? 'text-accent' : 'text-primary'} />
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-white/80">{label}</p>
                        <p className="text-sm text-white/40 mt-1">{description}</p>
                    </div>
                    <p className="text-xs text-white/30">
                        Supported: PDF, DOC, DOCX, JPG, PNG
                    </p>
                </motion.div>

                {isDragging && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 rounded-2xl bg-accent/5 backdrop-blur-sm flex items-center justify-center"
                    >
                        <p className="text-accent font-semibold text-lg">Drop files here</p>
                    </motion.div>
                )}
            </motion.div>

            <AnimatePresence>
                {files.map((file, i) => (
                    <motion.div
                        key={file.name + i}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="glass-card p-4 flex items-center gap-3"
                    >
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                            <FileText size={18} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white/80 truncate">{file.name}</p>
                            <p className="text-xs text-white/40">{(file.size / 1024).toFixed(1)} KB</p>
                            <div className="h-1 mt-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 2 }}
                                    className="h-full bg-linear-to-r from-primary to-accent rounded-full"
                                />
                            </div>
                        </div>
                        <button onClick={() => removeFile(i)} className="text-white/30 hover:text-red-400 transition-colors cursor-pointer">
                            <X size={18} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}
