import api from './api'

export async function generateAssessment(resumeId, careerId, difficulty) {
  return (await api.post('/assessments/generate', { resume_id: resumeId, career_id: careerId, difficulty })).data
}

export async function submitAssessment(assessmentId, answers) {
  return (await api.post(`/assessments/${assessmentId}/submit`, { answers })).data
}
