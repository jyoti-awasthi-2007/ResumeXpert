import api from './api'

export async function generateAssessment(resumeId, careerId, difficulty, userId) {
  const result = (await api.post('/assessments/generate', {
    resume_id: resumeId,
    career_id: careerId,
    difficulty: difficulty.toUpperCase(),
    user_id: userId,
  })).data
  if (result?.code || !Array.isArray(result?.questions)) {
    throw new Error(result?.message || 'The assessment questions could not be generated.')
  }
  return result
}

export async function submitAssessment(assessmentId, answers) {
  const result = (await api.post(`/assessments/${assessmentId}/submit`, { answers })).data
  if (result?.code || typeof result?.score !== 'number') {
    throw new Error(result?.message || 'The assessment could not be scored.')
  }
  return result
}

export async function getAssessmentResult(assessmentId) {
  const result = (await api.get(`/assessments/${assessmentId}/result`)).data
  if (result?.code) throw new Error(result.message || 'The assessment result could not be loaded.')
  return result
}
