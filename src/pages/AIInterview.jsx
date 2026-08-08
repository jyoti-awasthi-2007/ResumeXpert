import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Send, Bot, User, Sparkles, Volume2 } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import PageTransition from '../components/PageTransition'

const aiQuestions = [
    "Hello! I'm your AI interviewer. Let's begin with a warm-up. Can you tell me about your experience with React.js?",
    "Great! Can you explain the difference between useEffect and useLayoutEffect?",
    "How would you optimize a React application that's experiencing slow renders?",
    "Tell me about a challenging project you worked on and how you overcame the obstacles.",
    "Thank you for the interview! I'll now compile your results. You did great!"
]

export default function AIInterview() {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [questionIndex, setQuestionIndex] = useState(0)
    const [isRecording, setIsRecording] = useState(false)
    const [confidence, setConfidence] = useState(0)
    const [started, setStarted] = useState(false)
    const chatRef = useRef(null)

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight
        }
    }, [messages, isTyping])

    const typeMessage = async (text) => {
        setIsTyping(true)
        await new Promise(r => setTimeout(r, 1500))
        setMessages(prev => [...prev, { role: 'ai', text }])
        setIsTyping(false)
    }

    const startInterview = async () => {
        setStarted(true)
        await typeMessage(aiQuestions[0])
        setQuestionIndex(1)
    }

    const sendMessage = async () => {
        if (!input.trim()) return
        const userMsg = input.trim()
        setInput('')
        setMessages(prev => [...prev, { role: 'user', text: userMsg }])
        setConfidence(prev => Math.min(prev + 15 + Math.random() * 10, 98))

        if (questionIndex < aiQuestions.length) {
            await typeMessage(aiQuestions[questionIndex])
            setQuestionIndex(prev => prev + 1)
        }
    }

    return (
        <PageTransition>
            <DashboardLayout title="AI Interview">
                <div className="max-w-4xl mx-auto">
                    {!started ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-6 sm:p-12 text-center"
                        >
                            {/* Animated AI Orb */}
                            <div className="relative w-32 h-32 mx-auto mb-8">
                                <motion.div
                                    animate={{
                                        boxShadow: [
                                            '0 0 20px rgba(108,92,231,0.3), 0 0 60px rgba(0,212,255,0.1)',
                                            '0 0 40px rgba(108,92,231,0.5), 0 0 80px rgba(0,212,255,0.3)',
                                            '0 0 20px rgba(108,92,231,0.3), 0 0 60px rgba(0,212,255,0.1)',
                                        ],
                                        scale: [1, 1.05, 1],
                                    }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="w-32 h-32 rounded-full bg-linear-to-br from-primary via-accent to-primary flex items-center justify-center"
                                >
                                    <Bot size={56} className="text-white" />
                                </motion.div>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                                    className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20"
                                />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">AI Interview Session</h2>
                            <p className="text-white/40 mb-8 max-w-md mx-auto">
                                Our AI will assess your technical skills through a conversational interview. Answer naturally and be specific.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={startInterview}
                                className="px-8 py-4 rounded-2xl bg-linear-to-r from-primary to-accent text-white font-semibold text-lg hover:shadow-[0_0_30px_rgba(108,92,231,0.5)] transition-shadow cursor-pointer"
                            >
                                <span className="flex items-center gap-2">
                                    <Sparkles size={20} />
                                    Start Interview
                                </span>
                            </motion.button>
                        </motion.div>
                    ) : (
                        <div className="grid lg:grid-cols-4 gap-6">
                            {/* Chat Area */}
                            <div className="lg:col-span-3 glass-card flex flex-col" style={{ height: 'min(70vh, 600px)' }}>
                                {/* Chat Messages */}
                                <div ref={chatRef} className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4">
                                    <AnimatePresence>
                                        {messages.map((msg, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                            >
                                                <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${msg.role === 'ai'
                                                    ? 'bg-linear-to-br from-primary to-accent'
                                                    : 'bg-white/10'
                                                    }`}>
                                                    {msg.role === 'ai' ? <Bot size={16} className="text-white" /> : <User size={16} className="text-white/60" />}
                                                </div>
                                                <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'ai'
                                                    ? 'bg-white/5 text-white/80 rounded-tl-sm'
                                                    : 'bg-primary/20 text-white rounded-tr-sm'
                                                    }`}>
                                                    {msg.text}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    {isTyping && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex gap-3"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center">
                                                <Bot size={16} className="text-white" />
                                            </div>
                                            <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-tl-sm">
                                                <div className="flex gap-1">
                                                    {[0, 1, 2].map(i => (
                                                        <motion.div
                                                            key={i}
                                                            animate={{ y: [0, -6, 0] }}
                                                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                                                            className="w-2 h-2 rounded-full bg-primary"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Input Area */}
                                <div className="border-t border-white/5 p-3 sm:p-4 flex gap-2 sm:gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsRecording(!isRecording)}
                                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer ${isRecording
                                            ? 'bg-red-500 text-white animate-pulse-glow'
                                            : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
                                    </motion.button>

                                    <input
                                        type="text"
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                                        placeholder="Type your answer..."
                                        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                                    />

                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={sendMessage}
                                        className="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-accent flex items-center justify-center text-white shrink-0 cursor-pointer"
                                    >
                                        <Send size={18} />
                                    </motion.button>
                                </div>
                            </div>

                            {/* Sidebar Info */}
                            <div className="grid grid-cols-3 lg:grid-cols-1 gap-4">
                                {/* AI Orb Mini */}
                                <div className="glass-card p-6 text-center">
                                    <motion.div
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="w-16 h-16 mx-auto mb-3 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_30px_rgba(108,92,231,0.3)]"
                                    >
                                        <Bot size={28} className="text-white" />
                                    </motion.div>
                                    <p className="text-sm font-medium text-white">AI Interviewer</p>
                                    <p className="text-xs text-green-400 flex items-center justify-center gap-1 mt-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                        Active
                                    </p>
                                </div>

                                {/* Confidence Meter */}
                                <div className="glass-card p-6">
                                    <p className="text-sm text-white/50 mb-3">Live Confidence</p>
                                    <div className="relative w-full h-32">
                                        <svg className="w-full h-full" viewBox="0 0 120 80">
                                            <path d="M 10 70 A 50 50 0 0 1 110 70" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" strokeLinecap="round" />
                                            <motion.path
                                                d="M 10 70 A 50 50 0 0 1 110 70"
                                                fill="none"
                                                stroke="url(#confGrad)"
                                                strokeWidth="8"
                                                strokeLinecap="round"
                                                strokeDasharray="157"
                                                initial={{ strokeDashoffset: 157 }}
                                                animate={{ strokeDashoffset: 157 - (confidence / 100) * 157 }}
                                                transition={{ duration: 0.8 }}
                                            />
                                            <defs>
                                                <linearGradient id="confGrad">
                                                    <stop offset="0%" stopColor="#6C5CE7" />
                                                    <stop offset="100%" stopColor="#00D4FF" />
                                                </linearGradient>
                                            </defs>
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center pt-4">
                                            <span className="text-2xl font-bold gradient-text">{Math.round(confidence)}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Question Progress */}
                                <div className="glass-card p-6">
                                    <p className="text-sm text-white/50 mb-3">Progress</p>
                                    <div className="flex gap-1.5">
                                        {aiQuestions.map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: 1 }}
                                                className={`h-1.5 flex-1 rounded-full ${i < questionIndex ? 'bg-linear-to-r from-primary to-accent' : 'bg-white/10'}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-white/30 mt-2">
                                        Question {Math.min(questionIndex, aiQuestions.length)} of {aiQuestions.length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </DashboardLayout>
        </PageTransition>
    )
}
