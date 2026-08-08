import { createContext, useContext, useMemo, useState } from 'react'
import {
  user,
  resumeOverview,
  nlpProcessing,
  skills as skillList,
  careerMatches as careerList,
  skillGap as defaultSkillGap,
  recommendations as defaultRecommendations,
  assessmentLevels,
  assessmentQuestions,
  assessmentResult as defaultAssessmentResult,
  claimComparison,
  confidenceLevels,
  readinessOverview,
  nextSteps,
  analyticsOverview,
} from '../data/mockData'

const CareerLensContext = createContext(null)

export function CareerLensProvider({ children }) {
  const [selectedCareerId, setSelectedCareerId] = useState(careerList[0].id)
  const [resumeState, setResumeState] = useState({ uploaded: false, processing: false, analysis: resumeOverview })
  const [skills, setSkills] = useState(skillList)
  const [careerMatches] = useState(careerList)
  const [skillGap, setSkillGap] = useState(defaultSkillGap)
  const [recommendations, setRecommendations] = useState(defaultRecommendations)
  const [assessmentResult, setAssessmentResult] = useState(defaultAssessmentResult)
  const [confidence, setConfidence] = useState(82)

  const selectedCareer = useMemo(
    () => careerMatches.find((item) => item.id === selectedCareerId) || careerMatches[0],
    [careerMatches, selectedCareerId],
  )

  const uploadResume = () => {
    setResumeState({ uploaded: true, processing: true, analysis: resumeOverview })
    return new Promise((resolve) => {
      setTimeout(() => {
        setResumeState({ uploaded: true, processing: false, analysis: resumeOverview })
        resolve(resumeOverview)
      }, 1800)
    })
  }

  const selectCareer = (careerId) => {
    setSelectedCareerId(careerId)
  }

  const submitAssessment = (answers) => {
    const score = Math.round((answers.filter((answer) => answer.isCorrect).length / answers.length) * 100)
    const updatedResult = {
      ...defaultAssessmentResult,
      score,
      status: score >= 80 ? 'HIGH CONFIDENCE' : score >= 60 ? 'GOOD CONFIDENCE' : 'DEVELOPING',
      summary: {
        correct: answers.filter((answer) => answer.isCorrect).length,
        incorrect: answers.filter((answer) => !answer.isCorrect).length,
        total: answers.length,
      },
    }
    setAssessmentResult(updatedResult)
    setConfidence(Math.min(100, Math.max(0, score)))
    return updatedResult
  }

  const generateAssessmentQuestions = (level) => {
    return assessmentQuestions[level] || []
  }

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
    claimComparison,
    confidence,
    confidenceLevels,
    readinessOverview,
    nextSteps,
    analyticsOverview,
    uploadResume,
    selectCareer,
    submitAssessment,
    generateAssessmentQuestions,
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
