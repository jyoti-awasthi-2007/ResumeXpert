import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, ChevronRight, CheckCircle, XCircle, Code } from 'lucide-react'
import DashboardLayout from '../layouts/DashboardLayout'
import AnimatedButton from '../components/AnimatedButton'
import PageTransition from '../components/PageTransition'

const questions = [
    {
        id: 1,
        question: 'What is the output of typeof null in JavaScript?',
        options: ['"null"', '"undefined"', '"object"', '"boolean"'],
        correct: 2,
    },
    {
        id: 2,
        question: 'Which React hook is used for side effects?',
        options: ['useState', 'useEffect', 'useContext', 'useMemo'],
        correct: 1,
    },
    {
        id: 3,
        question: 'What does CSS "box-sizing: border-box" do?',
        options: [
            'Includes padding and border in the element\'s total width/height',
            'Adds borders around all boxes',
            'Sets the box model to content-box',
            'Removes margins',
        ],
        correct: 0,
    },
    {
        id: 4,
        question: 'Which HTTP method is idempotent?',
        options: ['POST', 'PATCH', 'PUT', 'None of the above'],
        correct: 2,
    },
    {
        id: 5,
        question: 'What is the time complexity of binary search?',
        options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
        correct: 2,
    },
]

export default function SkillTest() {
    const [started, setStarted] = useState(false)
    const [currentQ, setCurrentQ] = useState(0)
    const [selected, setSelected] = useState(null)
    const [answers, setAnswers] = useState([])
    const [timer, setTimer] = useState(300) // 5 minutes
    const [showResults, setShowResults] = useState(false)

    useEffect(() => {
        if (!started || showResults) return
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 0) {
                    setShowResults(true)
                    return 0
                }
                return prev - 1
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [started, showResults])

    const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

    const handleNext = () => {
        if (selected === null) return
        setAnswers(prev => [...prev, { question: currentQ, selected }])

        if (currentQ < questions.length - 1) {
            setCurrentQ(prev => prev + 1)
            setSelected(null)
        } else {
            setShowResults(true)
        }
    }

    const score = answers.filter((a, i) => questions[i]?.correct === a.selected).length

    if (!started) {
        return (
            <PageTransition>
                <DashboardLayout title="Skill Test">
                    <div className="max-w-2xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-10 text-center"
                        >
                            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-primary to-accent flex items-center justify-center">
                                <Code size={36} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-3">JavaScript Assessment</h2>
                            <p className="text-white/40 mb-2">{questions.length} Multiple Choice Questions</p>
                            <p className="text-white/40 mb-8">Time Limit: 5 minutes</p>

                            <div className="flex flex-wrap justify-center gap-3 mb-8">
                                {['JavaScript', 'React', 'CSS', 'HTTP', 'Algorithms'].map(tag => (
                                    <span key={tag} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <AnimatedButton variant="primary" size="lg" onClick={() => setStarted(true)}>
                                Start Test
                            </AnimatedButton>
                        </motion.div>
                    </div>
                </DashboardLayout>
            </PageTransition>
        )
    }

    if (showResults) {
        return (
            <PageTransition>
                <DashboardLayout title="Test Results">
                    <div className="max-w-2xl mx-auto">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-10 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                                className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${score >= questions.length * 0.7
                                    ? 'bg-linear-to-br from-green-500 to-emerald-400'
                                    : 'bg-linear-to-br from-yellow-500 to-amber-400'
                                    }`}
                            >
                                <span className="text-3xl font-bold text-white">{score}/{questions.length}</span>
                            </motion.div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                {score >= questions.length * 0.7 ? 'Excellent Work!' : 'Good Attempt!'}
                            </h2>
                            <p className="text-white/40 mb-8">Score: {Math.round((score / questions.length) * 100)}%</p>

                            <div className="space-y-3 text-left">
                                {questions.map((q, i) => {
                                    const answer = answers[i]
                                    const isCorrect = answer?.selected === q.correct
                                    return (
                                        <motion.div
                                            key={q.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className={`p-4 rounded-xl border ${isCorrect ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'}`}
                                        >
                                            <div className="flex items-start gap-2">
                                                {isCorrect ? <CheckCircle size={18} className="text-green-400 mt-0.5 shrink-0" /> : <XCircle size={18} className="text-red-400 mt-0.5 shrink-0" />}
                                                <div>
                                                    <p className="text-sm text-white/80">{q.question}</p>
                                                    <p className="text-xs text-white/40 mt-1">
                                                        Correct: {q.options[q.correct]}
                                                        {!isCorrect && answer && <> | Your answer: {q.options[answer.selected]}</>}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                        </motion.div>
                    </div>
                </DashboardLayout>
            </PageTransition>
        )
    }

    const q = questions[currentQ]

    return (
        <PageTransition>
            <DashboardLayout title="Skill Test">
                <div className="max-w-3xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        {/* Progress */}
                        <div className="flex gap-1.5">
                            {questions.map((_, i) => (
                                <div key={i} className={`w-8 h-1.5 rounded-full ${i < currentQ ? 'bg-primary' : i === currentQ ? 'bg-accent' : 'bg-white/10'}`} />
                            ))}
                        </div>
                        {/* Timer */}
                        <motion.div
                            animate={timer < 60 ? { color: ['#fff', '#FF1744', '#fff'] } : {}}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-sm font-mono"
                        >
                            <Clock size={16} className={timer < 60 ? 'text-red-400' : 'text-white/50'} />
                            {formatTime(timer)}
                        </motion.div>
                    </div>

                    {/* Question Card */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentQ}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3 }}
                            className="glass-card p-8"
                        >
                            <div className="flex items-center gap-2 text-white/30 text-sm mb-4">
                                <span>Question {currentQ + 1} of {questions.length}</span>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-8">{q.question}</h3>

                            <div className="space-y-3">
                                {q.options.map((option, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        onClick={() => setSelected(i)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${selected === i
                                            ? 'border-primary bg-primary/10 text-white'
                                            : 'border-white/10 bg-white/2 text-white/60 hover:border-white/20 hover:bg-white/5'
                                            }`}
                                    >
                                        <span className="flex items-center gap-3">
                                            <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${selected === i
                                                ? 'border-primary bg-primary text-white'
                                                : 'border-white/20'
                                                }`}>
                                                {selected === i && '✓'}
                                            </span>
                                            {option}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>

                            <div className="mt-8 flex justify-end">
                                <AnimatedButton
                                    variant="primary"
                                    onClick={handleNext}
                                    icon={ChevronRight}
                                    disabled={selected === null}
                                >
                                    {currentQ === questions.length - 1 ? 'Finish' : 'Next Question'}
                                </AnimatedButton>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </DashboardLayout>
        </PageTransition>
    )
}
