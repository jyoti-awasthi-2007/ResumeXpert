import api from './api'

export async function getSkills() {
  try {
    const response = await api.get('/skills')
    return response.data || []
  } catch {
    return []
  }
}
