import api from './api'

export async function getCareers() {
  return (await api.get('/careers')).data
}

export async function recommendCareers(skills) {
  const response = await api.post('/careers/recommend', { skills: skills || [], top_n: 5 })
  return response.data?.recommendations || response.data || []
}
