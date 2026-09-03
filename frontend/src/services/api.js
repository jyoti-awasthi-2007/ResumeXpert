import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  timeout: 120000,
})

export function apiError(error) {
  return error.response?.data?.detail?.message || error.response?.data?.message || error.message || 'The ResumeXpert API is unavailable. Please try again.'
}

export default api