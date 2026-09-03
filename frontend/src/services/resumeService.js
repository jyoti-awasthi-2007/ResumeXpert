import api from './api'

export async function uploadResume(file) {
  const formData = new FormData()
  formData.append('resume', file)
  return (await api.post('/resumes/upload', formData)).data
}

export async function analyzeResume(resumeId) {
  return (await api.post(`/resumes/${resumeId}/analyze`)).data
}
