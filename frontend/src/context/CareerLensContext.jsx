import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { apiError } from '../services/api'
import api from '../services/api'
import { uploadResume as uploadResumeRequest, analyzeResume } from '../services/resumeService'
import { getCareers, recommendCareers } from '../services/careerService'
import { generateAssessment, submitAssessment as submitAssessmentRequest, getAssessmentResult } from '../services/assessmentService'
import { useAuth } from './AuthContext'
import {
  nlpProcessing,
  assessmentLevels,
  confidenceLevels,
  nextSteps,
  analyticsOverview,
} from '../data/mockData'

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

  useEffect(() => {
    if (!profile) return
    const savedSkills = Array.isArray(profile.skills) && profile.skills.length
      ? profile.skills
      : profile.resume_state?.analysis?.skills || []
    setSkills(savedSkills.map((skill) => typeof skill === 'string' ? { id: skill.toLowerCase().replace(/\s+/g, '-'), name: skill, category: 'Skills', confidence: 0 } : skill))
    if (profile.resume_state) setResumeState(profile.resume_state)
    if (profile.selected_career_id) setSelectedCareerId(profile.selected_career_id)
    if (profile.skill_gap) setSkillGap(normalizeSkillGap(profile.skill_gap))
    if (Array.isArray(profile.recommendations)) setRecommendations(profile.recommendations)
    if (profile.assessment_result) setAssessmentResult(normalizeAssessmentResult(profile.assessment_result))
    if (typeof profile.confidence === 'number') setConfidence(profile.confidence)
    const savedSkillNames = savedSkills.map((skill) => typeof skill === 'string' ? skill : skill.name).filter(Boolean)
    if (savedSkillNames.length) {
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
    const request = { resume_id: resumeState.id, career_id: selectedCareerId }
    Promise.all([
      api.post('/skill-gap/analyze', request),
      api.post('/recommendations/skills', request),
      api.get('/confidence/demo-user'),
      api.get('/skills/claim-vs-actual/demo-user'),
      api.get('/career-readiness/demo-user'),
      api.get('/analytics/dashboard/demo-user'),
    ]).then(([gap, skillsResult, confidenceResult, claimsResult, readinessResult, analyticsResult]) => {
      const nextSkillGap = normalizeSkillGap(gap.data)
      const nextRecommendations = Array.isArray(skillsResult.data?.recommendations) ? skillsResult.data.recommendations.map(normalizeRecommendation) : Array.isArray(skillsResult.data) ? skillsResult.data.map(normalizeRecommendation) : []
      setSkillGap(nextSkillGap)
      setRecommendations(nextRecommendations)
      setConfidence(confidenceResult.data[0]?.confidence_score || 0)
      setClaimComparison(claimsResult.data)
      const readinessBreakdown = {
        resume_quality: Number(resumeState.analysis?.score || 0),
        skill_match: Number(selectedCareer?.score || nextSkillGap.overallMatch || 0),
        assessment_score: Number(assessmentResult?.score || 0),
        confidence: Number(confidence || 0),
      }
      const readinessValues = Object.values(readinessBreakdown).filter((value) => value > 0)
      setReadinessOverview({
        ...readinessOverviewState,
        ...readinessResult.data,
        score: readinessValues.length ? Math.round(readinessValues.reduce((sum, value) => sum + value, 0) / readinessValues.length) : 0,
        breakdown: readinessBreakdown,
      })
      setAnalyticsOverview({ ...analyticsOverviewState, main: analyticsResult.data })
      saveProgress({ skill_gap: nextSkillGap, recommendations: nextRecommendations }).catch(() => {})
    }).catch(() => {})
  }, [resumeState.id, selectedCareerId, assessmentResult])

  const selectedCareer = useMemo(
    () => careerMatches.find((item) => item.id === selectedCareerId) || careerMatches[0],
    [careerMatches, selectedCareerId],
  )

  const analyticsMain = useMemo(() => {
    const resumeScore = Number(resumeState.analysis?.score || analyticsOverviewState.main?.resume_score || 0)
    const skillMatch = Number(selectedCareer?.score || skillGap.overallMatch || analyticsOverviewState.main?.career_match || 0)
    const assessmentScore = Number(assessmentResult?.score || analyticsOverviewState.main?.assessment_score || 0)
    const confidenceScore = Number(confidence || analyticsOverviewState.main?.confidence_score || 0)
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
  }, [analyticsOverviewState.main, assessmentResult, confidence, resumeState.analysis, selectedCareer, skillGap, skills.length])

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
      await saveProgress({
        skills: analysis.skills || [],
        resume_state: { uploaded: true, processing: false, analysis, id: uploaded.resume_id },
      })
      await logActivity('resume_analyzed', { resume_id: uploaded.resume_id, skill_count: analysis.skills?.length || 0 })

      // Extract skill names and pass to recommend endpoint (expects skills array, not resume_id)
      const skillNames = (analysis.skills || []).map((s) => s.name).filter(Boolean)
      try {
        const recommendationsResult = await recommendCareers(skillNames)
        const normalizedCareerMatches = Array.isArray(recommendationsResult) && recommendationsResult.length > 0
          ? recommendationsResult.map(normalizeCareerMatch)
          : careerMatches

        setCareerMatches(normalizedCareerMatches)
        if (normalizedCareerMatches.length && !normalizedCareerMatches.some((item) => item.id === selectedCareerId)) {
          setSelectedCareerId(normalizedCareerMatches[0].id)
        }
      } catch (recommendationError) {
        console.warn('Career recommendations unavailable after resume analysis:', recommendationError)
      }
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
    user: { name: '', email: '', title: '' },
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
    readinessOverview: readinessOverviewState,
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
