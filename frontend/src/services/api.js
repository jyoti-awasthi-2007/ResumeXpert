import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 30000,
})

export function apiError(error) {
  return error.response?.data?.detail?.message || error.response?.data?.message || error.message || 'The CareerLens API is unavailable. Please try again.'
}

export default api