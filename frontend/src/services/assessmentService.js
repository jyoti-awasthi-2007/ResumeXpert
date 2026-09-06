import api from './api'

export async function generateAssessment(resumeId, careerId, difficulty) {
  const result = (await api.post('/assessments/generate', {
    resume_id: resumeId,
    career_id: careerId,
    difficulty: difficulty.toUpperCase(),
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
