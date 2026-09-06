import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCareerLens } from '../context/CareerLensContext'
import DashboardLayout from '../layouts/DashboardLayout'
import PageTransition from '../components/PageTransition'
import QuestionCard from '../components/QuestionCard'
import { ChevronLeft, ChevronRight, CircleDot, Clock, LoaderCircle } from 'lucide-react'

export default function AssessmentLevel() {
  const { level } = useParams()
  const { generateAssessmentQuestions, submitAssessment, resumeState, assessmentLevels, selectedCareer } = useCareerLens()
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState([])
  const [finished, setFinished] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(15 * 60)
  const generationKey = useRef('')
  const navigate = useNavigate()

  const currentQuestion = questions[current]
  const levelMeta = useMemo(() => assessmentLevels.find((item) => item.id === level), [assessmentLevels, level])

  useEffect(() => {
    if (!resumeState.id || !selectedCareer?.id) return
    const requestKey = `${resumeState.id}:${selectedCareer.id}:${level}`
    if (generationKey.current === requestKey) return
    generationKey.current = requestKey
    setLoading(true)
    setError('')
    generateAssessmentQuestions(level).then((data) => {
      const nextQuestions = Array.isArray(data?.questions) ? data.questions : []
      setQuestions(nextQuestions)
      setCurrent(0)
      setSelectedAnswers([])
      setLoading(false)
    }).catch((requestError) => {
      setError(requestError?.response?.data?.message || requestError?.message || 'Unable to prepare the assessment.')
      setLoading(false)
    })
    return undefined
  }, [generateAssessmentQuestions, level, resumeState.id, selectedCareer?.id])

  useEffect(() => {
    if (loading || finished || submitting || !questions.length) return undefined
    if (timeLeft <= 0) {
      setError('Time is up. Please submit the assessment again.')
      return undefined
    }
    const timer = window.setInterval(() => setTimeLeft((remaining) => Math.max(remaining - 1, 0)), 1000)
    return () => window.clearInterval(timer)
  }, [loading, finished, submitting, questions.length, timeLeft])

  useEffect(() => {
    if (!resumeState.uploaded && !loading) {
      navigate('/upload-resume')
    }
  }, [resumeState.uploaded, loading, navigate])

  const handleSelect = (index) => {
    setSelectedAnswers((prev) => {
      const updated = [...prev]
      updated[current] = { questionId: currentQuestion.id, answer: index }
      return updated
    })
  }

  const currentSelection = selectedAnswers[current]?.answer ?? null

  const handleNext = () => {
    if (submitting || currentSelection === null) return
    if (current < questions.length - 1) {
      setCurrent((prev) => prev + 1)
    } else {
      const answers = questions.map((question, index) => ({
        question_id: question.id,
        answer: selectedAnswers[index]?.answer ?? -1,
      }))
      setSubmitting(true)
      setError('')
      submitAssessment(answers)
        .then((resultData) => {
          if (resultData?.code || typeof resultData?.score !== 'number') {
            throw new Error(resultData?.message || 'The assessment result was not returned.')
          }
          setResult(resultData)
          setFinished(true)
        })
        .catch((requestError) => setError(requestError?.response?.data?.message || requestError?.message || 'Unable to submit the assessment.'))
        .finally(() => setSubmitting(false))
    }
  }

  const formatTime = (seconds) => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`

  const handlePrevious = () => {
    if (current > 0) setCurrent((prev) => prev - 1)
  }

  if (loading) {
    return (
      <PageTransition>
        <DashboardLayout title="Assessment">
          <div className="glass-card p-10 text-center">
            <div className="flex items-center justify-center gap-2 text-white/50"><LoaderCircle size={18} className="animate-spin" /> Preparing your assessment...</div>
          </div>
        </DashboardLayout>
      </PageTransition>
    )
  }

  if ((error || !questions.length) && !loading) {
    return (
      <PageTransition>
        <DashboardLayout title="Assessment">
          <div className="glass-card mx-auto max-w-2xl p-10 text-center">
            <h2 className="mb-3 text-2xl font-semibold text-white">Assessment unavailable</h2>
            <p className="mb-6 text-white/60">{error || 'No questions were generated. Please try this assessment again.'}</p>
            <button onClick={() => navigate('/assessment')} className="rounded-full bg-linear-to-r from-primary to-purple-500 px-6 py-3 font-semibold text-white">Back to assessments</button>
          </div>
        </DashboardLayout>
      </PageTransition>
    )
  }

  if (!levelMeta) {
    return (
      <PageTransition>
        <DashboardLayout title="Assessment">
          <div className="glass-card p-10 text-center">
            <h2 className="text-2xl font-semibold text-white mb-3">Assessment level not found</h2>
            <p className="text-white/50 mb-6">Please choose a valid difficulty level.</p>
            <button
              onClick={() => navigate('/assessment')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-linear-to-r from-primary to-purple-500 text-white font-semibold hover:brightness-110 transition"
            >
              Choose Level
            </button>
          </div>
        </DashboardLayout>
      </PageTransition>
    )
  }

  if (finished && result) {
    return (
      <PageTransition>
        <DashboardLayout title="Assessment Results">
          <div className="glass-card p-8 rounded-3xl border border-white/10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-2">Assessment Complete</p>
                <h1 className="text-3xl font-semibold text-white">{levelMeta.title} Level Results</h1>
                <p className="text-sm text-white/50 mt-2">Your assessment has been submitted.</p>
              </div>
              <div className="rounded-3xl bg-white/5 px-6 py-4 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-white/40">Overall Score</p>
                <p className="text-4xl font-bold text-white mt-2">{result.score}%</p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2 mt-8">
              <div className="rounded-3xl bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-4">Answer Summary</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-white/80">
                    <span>Correct</span>
                    <span>{result.correct}</span>
                  </div>
                  <div className="flex items-center justify-between text-white/80">
                    <span>Incorrect</span>
                    <span>{result.incorrect}</span>
                  </div>
                  <div className="flex items-center justify-between text-white/80">
                    <span>Total</span>
                    <span>{result.total}</span>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-4">Next Step</p>
                <button
                  onClick={() => navigate('/assessment/results')}
                  className="w-full px-5 py-3 rounded-full bg-linear-to-r from-primary to-purple-500 text-white font-semibold hover:brightness-110 transition"
                >
                  View Full Results
                </button>
              </div>
            </div>
          </div>
        </DashboardLayout>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <DashboardLayout title={`${levelMeta.title} Assessment`}>
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-white/10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/50 mb-2">{selectedCareer.title} Assessment</p>
                <h1 className="text-2xl font-semibold text-white">{levelMeta.title} Level</h1>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/50">
                <span>Question {current + 1} of {questions.length}</span>
                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-mono ${timeLeft < 60 ? 'bg-red-500/20 text-red-300' : 'bg-white/5 text-white/60'}`}>
                  <Clock size={14} /> {formatTime(timeLeft)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-white/60">
                  <CircleDot size={14} /> Progress
                </span>
              </div>
            </div>
          </div>

          {error && <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}

          <QuestionCard
            question={currentQuestion}
            selectedOption={currentSelection}
            onSelect={handleSelect}
          />

          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handlePrevious}
              disabled={current === 0}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 text-white/70 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 transition"
            >
              <ChevronLeft size={18} /> Previous
            </button>
            <button
              onClick={handleNext}
              disabled={currentSelection === null || submitting || timeLeft <= 0}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-linear-to-r from-primary to-purple-500 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition"
            >
              {submitting ? 'Submitting...' : current === questions.length - 1 ? 'Submit Assessment' : 'Next'}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </DashboardLayout>
    </PageTransition>
  )
}
