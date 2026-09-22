import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { apiError } from '../services/api'
import api from '../services/api'
import { uploadResume as uploadResumeRequest, analyzeResume } from '../services/resumeService'
import { getCareers, recommendCareers } from '../services/careerService'
import { generateAssessment, submitAssessment as submitAssessmentRequest, getAssessmentResult } from '../services/assessmentService'
import { useAuth } from './AuthContext'
export const assessmentLevels = [
  { id: 'beginner', title: 'Beginner Level', questions: 10, time: '15 min' },
  { id: 'intermediate', title: 'Intermediate Level', questions: 10, time: '20 min' },
  { id: 'advanced', title: 'Advanced Level', questions: 10, time: '25 min' },
  { id: 'expert', title: 'Expert Level', questions: 10, time: '30 min' },
]

export const confidenceLevels = [
  { range: '0–40', label: 'Low Confidence', color: 'danger' },
  { range: '41–60', label: 'Developing', color: 'warning' },
  { range: '61–75', label: 'Good', color: 'accent' },
  { range: '76–90', label: 'High', color: 'primary' },
  { range: '91–100', label: 'Expert Confidence', color: 'success' },
]

const CareerLensContext = createContext(null)

const normalizeCareerMatch = (career) => ({
  id: career?.id || career?.career_id || 'career',
  title: career?.title || career?.career_title || 'Career',
  description: career?.description || 'Career opportunity',
  score: Number(career?.score ?? career?.match_score ?? 0),
  status: career?.status || 'Potential Match',
  matchedSkills: (career?.matchedSkills ?? career?.matched_skills ?? []).map(String),
  missingSkills: (career?.missingSkills ?? career?.missing_skills ?? []).map(String),
  reasoning: career?.reasoning || career?.reason || '',
})

const normalizeSkillGap = (gap = {}) => ({
  overallMatch: Number(gap.overallMatch ?? gap.overall_match ?? 0),
  haveSkills: (gap.haveSkills ?? gap.have_skills ?? []).map(String),
  missingSkills: (gap.missingSkills ?? gap.missing_skills ?? []).map(String),
  priorities: (gap.priorities ?? []).map((group) => ({
    level: group.level || group.priority || 'MEDIUM',
    skills: (group.skills ?? group.skill_names ?? []).map(String),
  })),
  targetCareer: gap.targetCareer || gap.target_career || gap.career_path || 'Target Career',
})

const normalizeRecommendation = (item = {}) => ({
  skill: item.skill || item.name || 'Skill',
  priority: item.priority || item.level || 'MEDIUM',
  reason: item.reason || item.why || 'Important skill for career growth.',
  why: item.why || item.reason || 'Important skill for career growth.',
  path: (item.path ?? item.prerequisites ?? item.steps ?? []).map(String),
  prerequisites: (item.prerequisites ?? item.path ?? item.steps ?? []).map(String),
  estimated_learning_time: item.estimated_learning_time || item.estimatedLearningTime || '1-3 months',
  difficulty: item.difficulty || 'Intermediate',
})

const normalizeAssessmentResult = (result = {}) => ({
  ...result,
  status: result.status || 'complete',
  skills: result.skills || (result.skill_scores || []).map((item) => ({ name: item.skill, score: item.score })),
  summary: result.summary || { correct: result.correct || 0, incorrect: result.incorrect || 0, total: result.total || 0 },
})

export function CareerLensProvider({ children }) {
  const { user: authUser, profile, saveProgress, logActivity } = useAuth()
  const [selectedCareerId, setSelectedCareerId] = useState(null)
  const [resumeState, setResumeState] = useState({ uploaded: false, processing: false, analysis: null, id: null })
  const [skills, setSkills] = useState([])
  const [careerMatches, setCareerMatches] = useState([])
  const [skillGap, setSkillGap] = useState(normalizeSkillGap())
  const [recommendations, setRecommendations] = useState([])
  const [assessmentResult, setAssessmentResult] = useState(null)
  const [confidence, setConfidence] = useState(0)
  const [claimComparisonState, setClaimComparison] = useState([])
  const [readinessOverviewState, setReadinessOverview] = useState({ score: 0, status: 'Waiting for resume', breakdown: {}, strengths: [], improvements: [] })
  const [analyticsOverviewState, setAnalyticsOverview] = useState({ main: {} })
  const [error, setError] = useState('')

  const lastAnalyzedKeyRef = useRef('')
  const lastSkillsKeyRef = useRef('')

  useEffect(() => {
    if (!profile) return
    const savedSkills = Array.isArray(profile.skills) && profile.skills.length
      ? profile.skills
      : profile.resume_state?.analysis?.skills || []

    setSkills((prev) => {
      const prevNames = prev.map((s) => s.name).sort().join(',')
      const nextNames = savedSkills.map((s) => typeof s === 'string' ? s : s.name).sort().join(',')
      if (prevNames === nextNames && prev.length > 0) return prev
      return savedSkills.map((skill) => typeof skill === 'string' ? { id: skill.toLowerCase().replace(/\s+/g, '-'), name: skill, category: 'Skills', confidence: 0 } : skill)
    })

    if (profile.resume_state && profile.resume_state.id) {
      setResumeState((prev) => (prev.id === profile.resume_state.id && prev.uploaded === profile.resume_state.uploaded ? prev : profile.resume_state))
    }
    if (profile.selected_career_id) {
      setSelectedCareerId((prev) => (prev === profile.selected_career_id ? prev : profile.selected_career_id))
    }
    if (profile.skill_gap) {
      setSkillGap((prev) => (prev.overallMatch === profile.skill_gap.overallMatch && prev.missingSkills?.length === profile.skill_gap.missingSkills?.length ? prev : normalizeSkillGap(profile.skill_gap)))
    }
    if (Array.isArray(profile.recommendations) && profile.recommendations.length > 0) {
      setRecommendations((prev) => (prev.length === profile.recommendations.length ? prev : profile.recommendations))
    }
    if (profile.assessment_result) {
      setAssessmentResult((prev) => {
        if (prev && prev.score === profile.assessment_result.score && prev.status === profile.assessment_result.status) {
          return prev
        }
        return normalizeAssessmentResult(profile.assessment_result)
      })
    }
    if (typeof profile.confidence === 'number') {
      setConfidence((prev) => (prev === profile.confidence ? prev : profile.confidence))
    }

    const savedSkillNames = savedSkills.map((skill) => typeof skill === 'string' ? skill : skill.name).filter(Boolean)
    const skillsKey = savedSkillNames.sort().join(',')
    if (savedSkillNames.length && skillsKey !== lastSkillsKeyRef.current) {
      lastSkillsKeyRef.current = skillsKey
      recommendCareers(savedSkillNames).then((items) => {
        const normalized = Array.isArray(items) ? items.map(normalizeCareerMatch) : []
        if (normalized.length) setCareerMatches(normalized)
      }).catch(() => {})
    }
  }, [profile])

  useEffect(() => {
    getCareers()
      .then((items) => {
        const normalized = Array.isArray(items) ? items.map(normalizeCareerMatch) : []
        setCareerMatches(normalized)
        if (normalized.length && (!selectedCareerId || !normalized.some((item) => item.id === selectedCareerId))) {
          setSelectedCareerId(normalized[0].id)
        }
      })
      .catch(() => {})
  }, [selectedCareerId])

  useEffect(() => {
    if (!resumeState.id) return
    if (!selectedCareerId) return

    const currentKey = `${resumeState.id}_${selectedCareerId}`
    if (lastAnalyzedKeyRef.current === currentKey) return
    lastAnalyzedKeyRef.current = currentKey

    const effectiveUserId = authUser?.id || profile?.id || 'demo-user'
    const request = { resume_id: resumeState.id, career_id: selectedCareerId, user_id: effectiveUserId }
    Promise.all([
      api.post('/skill-gap/analyze', request),
      api.post('/recommendations/skills', request),
      api.get(`/confidence/${effectiveUserId}`),
      api.get(`/skills/claim-vs-actual/${effectiveUserId}`),
      api.get(`/career-readiness/${effectiveUserId}`),
      api.get(`/analytics/dashboard/${effectiveUserId}`),
    ]).then(([gap, skillsResult, confidenceResult, claimsResult, readinessResult, analyticsResult]) => {
      const nextSkillGap = normalizeSkillGap(gap.data)
      const nextRecommendations = Array.isArray(skillsResult.data?.recommendations) ? skillsResult.data.recommendations.map(normalizeRecommendation) : Array.isArray(skillsResult.data) ? skillsResult.data.map(normalizeRecommendation) : []
      setSkillGap(nextSkillGap)
      setRecommendations(nextRecommendations)

      // Only set demo confidence if no real assessment/profile confidence exists
      setConfidence((current) => {
        if (typeof profile?.confidence === 'number') return profile.confidence
        if (assessmentResult?.score != null) return assessmentResult.score
        if (current > 0) return current
        return confidenceResult.data?.[0]?.confidence_score || 0
      })

      setClaimComparison(Array.isArray(claimsResult.data) ? claimsResult.data : [])

      const activeConfidence = typeof profile?.confidence === 'number'
        ? profile.confidence
        : (assessmentResult?.score != null ? assessmentResult.score : (confidenceResult.data?.[0]?.confidence_score || 0))
      const activeAssessment = Number(assessmentResult?.score ?? profile?.assessment_result?.score ?? 0)

      const readinessBreakdown = {
        resume_quality: Number(resumeState.analysis?.score || 0),
        skill_match: Number(selectedCareer?.score || nextSkillGap.overallMatch || 0),
        assessment_score: activeAssessment,
        confidence: activeConfidence,
      }
      const readinessValues = Object.values(readinessBreakdown).filter((value) => value > 0)
      setReadinessOverview({
        ...readinessOverviewState,
        ...readinessResult.data,
        score: readinessValues.length ? Math.round(readinessValues.reduce((sum, value) => sum + value, 0) / readinessValues.length) : 0,
        breakdown: readinessBreakdown,
      })
      setAnalyticsOverview({ ...analyticsOverviewState, main: analyticsResult.data })
    }).catch(() => {})
  }, [authUser?.id, profile?.id, resumeState.id, selectedCareerId])

  const selectedCareer = useMemo(
    () => careerMatches.find((item) => item.id === selectedCareerId) || careerMatches[0],
    [careerMatches, selectedCareerId],
  )

  const analyticsMain = useMemo(() => {
    const resumeScore = Number(resumeState.analysis?.score || analyticsOverviewState.main?.resume_score || 0)
    const skillMatch = Number(selectedCareer?.score || skillGap.overallMatch || analyticsOverviewState.main?.career_match || 0)
    const assessmentScore = Number(assessmentResult?.score ?? profile?.assessment_result?.score ?? analyticsOverviewState.main?.assessment_score ?? 0)
    const confidenceScore = Number(
      typeof profile?.confidence === 'number'
        ? profile.confidence
        : (assessmentResult?.score ?? (confidence > 0 ? confidence : 0) ?? analyticsOverviewState.main?.confidence_score ?? 0)
    )
    const scoredValues = [resumeScore, skillMatch, assessmentScore, confidenceScore].filter((value) => value > 0)
    const careerReadiness = scoredValues.length ? Math.round(scoredValues.reduce((sum, value) => sum + value, 0) / scoredValues.length) : 0

    return {
      ...analyticsOverviewState.main,
      resume_score: resumeScore,
      skills_detected: skills.length,
      career_match: skillMatch,
      skill_gap_count: skillGap.missingSkills.length,
      assessment_score: assessmentScore,
      confidence_score: confidenceScore,
      career_readiness: careerReadiness,
      career_readiness_score: careerReadiness,
    }
  }, [analyticsOverviewState.main, assessmentResult?.score, confidence, profile?.assessment_result?.score, profile?.confidence, resumeState.analysis?.score, selectedCareer?.score, skillGap.missingSkills.length, skillGap.overallMatch, skills.length])

  const readinessOverview = useMemo(() => {
    const resumeQuality = Number(resumeState.analysis?.score || readinessOverviewState.breakdown?.resume_quality || 0)
    const skillMatch = Number(selectedCareer?.score || skillGap.overallMatch || readinessOverviewState.breakdown?.skill_match || 0)
    const assessmentScore = Number(assessmentResult?.score ?? profile?.assessment_result?.score ?? readinessOverviewState.breakdown?.assessment_score ?? 0)
    const confidenceScore = Number(
      typeof profile?.confidence === 'number'
        ? profile.confidence
        : (assessmentResult?.score ?? (confidence > 0 ? confidence : 0) ?? readinessOverviewState.breakdown?.confidence ?? 0)
    )

    const breakdown = {
      resumeQuality,
      skillMatch,
      assessment: assessmentScore,
      confidence: confidenceScore,
    }

    const scoredValues = [resumeQuality, skillMatch, assessmentScore, confidenceScore].filter((v) => v > 0)
    const score = scoredValues.length ? Math.round(scoredValues.reduce((sum, v) => sum + v, 0) / scoredValues.length) : 0

    return {
      ...readinessOverviewState,
      score: score || readinessOverviewState.score || 0,
      status: readinessOverviewState.status || 'Good Preparation',
      breakdown,
      strengths: readinessOverviewState.strengths?.length ? readinessOverviewState.strengths : ['Resume processed successfully', 'Core technical qualifications identified'],
      improvements: readinessOverviewState.improvements?.length ? readinessOverviewState.improvements : ['Complete skill assessment to validate your qualifications', 'Focus on priority skills for your target career'],
    }
  }, [assessmentResult?.score, confidence, profile?.assessment_result?.score, profile?.confidence, readinessOverviewState, resumeState.analysis?.score, selectedCareer?.score, skillGap.overallMatch])

  const nlpProcessing = useMemo(() => {
    const isAnalyzed = Boolean(resumeState.analysis)
    const skillsCount = resumeState.analysis?.skills?.length || 0
    const sectionsCount = Object.keys(resumeState.analysis?.sections || {}).length
    return [
      { label: 'Text Extraction', status: isAnalyzed ? 'Complete' : 'Pending' },
      { label: 'Section Detection', status: isAnalyzed ? (sectionsCount ? `Complete (${sectionsCount} sections)` : 'Complete') : 'Pending' },
      { label: 'Entity Recognition', status: isAnalyzed ? 'Complete' : 'Pending' },
      { label: 'Skill Extraction', status: isAnalyzed ? (skillsCount ? `Complete (${skillsCount} skills)` : 'Complete') : 'Pending' },
      { label: 'Skill Normalization', status: isAnalyzed ? 'Complete' : 'Pending' },
      { label: 'Career Mapping', status: selectedCareer?.title ? `Complete (${selectedCareer.title})` : (isAnalyzed ? 'Complete' : 'Pending') },
    ]
  }, [resumeState.analysis, selectedCareer?.title])

  const nextSteps = useMemo(() => {
    if (recommendations && recommendations.length > 0) {
      return recommendations.slice(0, 4).map((rec) => ({
        title: `Learn ${rec.skill}`,
        reason: rec.reason || rec.why || `Key skill for ${selectedCareer?.title || 'your target career'}.`,
        action: 'View Recommendations',
        link: '/recommendations',
      }))
    }
    if (skillGap?.missingSkills && skillGap.missingSkills.length > 0) {
      return skillGap.missingSkills.slice(0, 4).map((skill) => ({
        title: `Develop ${skill}`,
        reason: `Required skill for ${selectedCareer?.title || 'your target career'}.`,
        action: 'View Skill Gap',
        link: '/skill-gap',
      }))
    }
    if (resumeState.uploaded) {
      return [
        {
          title: 'Take Skill Assessment',
          reason: 'Test your practical knowledge and earn validated confidence scores.',
          action: 'Start Assessment',
          link: '/assessment',
        },
        {
          title: 'Explore Career Suggestions',
          reason: 'Discover role opportunities matched to your extracted skills.',
          action: 'View Careers',
          link: '/career-suggestions',
        },
      ]
    }
    return [
      {
        title: 'Upload Your Resume',
        reason: 'Get started with AI parsing, skill extraction, and career readiness scoring.',
        action: 'Upload Resume',
        link: '/upload-resume',
      },
    ]
  }, [recommendations, resumeState.uploaded, selectedCareer?.title, skillGap?.missingSkills])

  const user = useMemo(() => ({
    name: profile?.full_name || authUser?.user_metadata?.full_name || authUser?.email?.split('@')[0] || '',
    email: profile?.email || authUser?.email || '',
    title: selectedCareer?.title || profile?.title || '',
  }), [authUser, profile, selectedCareer?.title])

  const uploadResume = async (file) => {
    setError('')
    setResumeState((current) => ({ ...current, uploaded: true, processing: true }))
    try {
      const uploaded = await uploadResumeRequest(file)
      const analysis = await analyzeResume(uploaded.resume_id)

      // Handle 200-OK error responses from backend (e.g. parse failures)
      if (analysis?.code && analysis.code !== 'success') {
        throw new Error(analysis.message || 'Failed to analyze resume.')
      }

      setResumeState({ uploaded: true, processing: false, analysis, id: uploaded.resume_id })
      setSkills(analysis.skills || [])

      // Run progress save, activity log, and career recommendations concurrently
      const skillNames = (analysis.skills || []).map((s) => s.name).filter(Boolean)
      Promise.all([
        saveProgress({
          skills: analysis.skills || [],
          resume_state: { uploaded: true, processing: false, analysis, id: uploaded.resume_id },
        }).catch((err) => console.warn('Could not save progress:', err)),
        logActivity('resume_analyzed', { resume_id: uploaded.resume_id, skill_count: analysis.skills?.length || 0 }).catch((err) => console.warn('Could not log activity:', err)),
        recommendCareers(skillNames)
          .then((recommendationsResult) => {
            const normalizedCareerMatches = Array.isArray(recommendationsResult) && recommendationsResult.length > 0
              ? recommendationsResult.map(normalizeCareerMatch)
              : careerMatches
            setCareerMatches(normalizedCareerMatches)
            if (normalizedCareerMatches.length && !normalizedCareerMatches.some((item) => item.id === selectedCareerId)) {
              setSelectedCareerId(normalizedCareerMatches[0].id)
            }
          })
          .catch((recommendationError) => {
            console.warn('Career recommendations unavailable after resume analysis:', recommendationError)
          }),
      ])

      return analysis
    } catch (requestError) {
      setError(apiError(requestError))
      setResumeState({ uploaded: false, processing: false, analysis: null, id: null })
      throw requestError
    }
  }

  const selectCareer = (careerId) => {
    setSelectedCareerId(careerId)
    saveProgress({ selected_career_id: careerId }).catch(() => {})
    logActivity('career_selected', { career_id: careerId }).catch(() => {})
    logActivity('career_selected', { career_id: careerId }).catch(() => {})
  }

  const submitAssessment = async (answers) => {
    const assessmentId = window.sessionStorage.getItem('careerlens_assessment_id')
    const result = await submitAssessmentRequest(assessmentId, answers)
    const updatedResult = normalizeAssessmentResult(result)
    setAssessmentResult(updatedResult)
    setConfidence(result.score)
    saveProgress({ assessment_result: updatedResult, confidence: result.score }).catch(() => {})
    logActivity('assessment_completed', { score: result.score }).catch(() => {})
    return { ...updatedResult, assessment_id: assessmentId }
  }

  const generateAssessmentQuestions = useCallback(async (level) => {
    const result = await generateAssessment(resumeState.id, selectedCareerId, level, authUser?.id)
    window.sessionStorage.setItem('careerlens_assessment_id', result.assessment_id)
    return result
  }, [authUser?.id, resumeState.id, selectedCareerId])

  const loadAssessmentResult = useCallback(async (assessmentId) => {
    const result = normalizeAssessmentResult(await getAssessmentResult(assessmentId))
    setAssessmentResult(result)
    return result
  }, [])

  const value = {
    user,
    resumeState,
    nlpProcessing,
    skills,
    careerMatches,
    selectedCareer,
    skillGap,
    recommendations,
    assessmentLevels,
    assessmentResult,
    claimComparison: claimComparisonState,
    confidence,
    confidenceLevels,
    readinessOverview,
    nextSteps,
    analyticsOverview: { ...analyticsOverviewState, main: analyticsMain },
    uploadResume,
    selectCareer,
    submitAssessment,
    generateAssessmentQuestions,
    loadAssessmentResult,
    error,
  }

  return <CareerLensContext.Provider value={value}>{children}</CareerLensContext.Provider>
}

export function useCareerLens() {
  const context = useContext(CareerLensContext)
  if (!context) {
    throw new Error('useCareerLens must be used inside CareerLensProvider')
  }
  return context
}
