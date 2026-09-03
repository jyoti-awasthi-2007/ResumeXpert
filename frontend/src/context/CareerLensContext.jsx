import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { apiError } from '../services/api'
import api from '../services/api'
import { uploadResume as uploadResumeRequest, analyzeResume } from '../services/resumeService'
import { getCareers, recommendCareers } from '../services/careerService'
import { generateAssessment, submitAssessment as submitAssessmentRequest } from '../services/assessmentService'
import {
  user,
  nlpProcessing,
  skills as skillList,
  careerMatches as careerList,
  skillGap as defaultSkillGap,
  recommendations as defaultRecommendations,
  assessmentLevels,
  assessmentResult as defaultAssessmentResult,
  claimComparison,
  confidenceLevels,
  readinessOverview,
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

export function CareerLensProvider({ children }) {
  const [selectedCareerId, setSelectedCareerId] = useState(careerList[0].id)
  const [resumeState, setResumeState] = useState({ uploaded: false, processing: false, analysis: null, id: null })
  const [skills, setSkills] = useState(skillList)
  const [careerMatches, setCareerMatches] = useState(careerList)
  const [skillGap, setSkillGap] = useState(defaultSkillGap)
  const [recommendations, setRecommendations] = useState(defaultRecommendations)
  const [assessmentResult, setAssessmentResult] = useState(defaultAssessmentResult)
  const [confidence, setConfidence] = useState(82)
  const [claimComparisonState, setClaimComparison] = useState(claimComparison)
  const [readinessOverviewState, setReadinessOverview] = useState(readinessOverview)
  const [analyticsOverviewState, setAnalyticsOverview] = useState(analyticsOverview)
  const [error, setError] = useState('')

  useEffect(() => {
    getCareers()
      .then((items) => {
        const normalized = Array.isArray(items) ? items.map(normalizeCareerMatch) : []
        setCareerMatches(normalized.length ? normalized : careerList)
        if (normalized.length && !normalized.some((item) => item.id === selectedCareerId)) {
          setSelectedCareerId(normalized[0].id)
        }
      })
      .catch(() => {})
  }, [selectedCareerId])

  useEffect(() => {
    if (!resumeState.id) return
    const request = { resume_id: resumeState.id, career_id: selectedCareerId }
    Promise.all([
      api.post('/skill-gap/analyze', request),
      api.post('/recommendations/skills', request),
      api.get('/confidence/demo-user'),
      api.get('/skills/claim-vs-actual/demo-user'),
      api.get('/career-readiness/demo-user'),
      api.get('/analytics/dashboard/demo-user'),
    ]).then(([gap, skillsResult, confidenceResult, claimsResult, readinessResult, analyticsResult]) => {
      setSkillGap(normalizeSkillGap(gap.data))
      setRecommendations(Array.isArray(skillsResult.data?.recommendations) ? skillsResult.data.recommendations.map(normalizeRecommendation) : Array.isArray(skillsResult.data) ? skillsResult.data.map(normalizeRecommendation) : [])
      setConfidence(confidenceResult.data[0]?.confidence_score || 0)
      setClaimComparison(claimsResult.data)
      setReadinessOverview({ ...readinessOverviewState, ...readinessResult.data, score: readinessResult.data.score })
      setAnalyticsOverview({ ...analyticsOverviewState, main: analyticsResult.data })
    }).catch(() => {})
  }, [resumeState.id, selectedCareerId, assessmentResult])

  const selectedCareer = useMemo(
    () => careerMatches.find((item) => item.id === selectedCareerId) || careerMatches[0],
    [careerMatches, selectedCareerId],
  )

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
    api.post('/users/demo-user/career', { career_id: careerId }).catch(() => {})
  }

  const submitAssessment = async (answers) => {
    const result = await submitAssessmentRequest(window.sessionStorage.getItem('careerlens_assessment_id'), answers)
    const updatedResult = { ...result, summary: { correct: result.correct, incorrect: result.incorrect, total: result.total } }
    setAssessmentResult(updatedResult)
    setConfidence(result.score)
    return updatedResult
  }

  const generateAssessmentQuestions = useCallback(async (level) => {
    const result = await generateAssessment(resumeState.id, selectedCareerId, level)
    window.sessionStorage.setItem('careerlens_assessment_id', result.assessment_id)
    return result
  }, [resumeState.id, selectedCareerId])

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
    readinessOverview: readinessOverviewState,
    nextSteps,
    analyticsOverview: analyticsOverviewState,
    uploadResume,
    selectCareer,
    submitAssessment,
    generateAssessmentQuestions,
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
