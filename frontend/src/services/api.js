import axios from 'axios'
import { supabase } from '../lib/supabase'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://resumexpert-3v2l.onrender.com/api',
  timeout: 120000,
})

api.interceptors.request.use(async (config) => {
  try {
    if (supabase) {
      const { data } = await supabase.auth.getSession()
      const token = data?.session?.access_token
      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
      }
    }
  } catch {
    // Proceed without token if session is unavailable
  }
  return config
})

export function apiError(error) {
  return error.response?.data?.detail?.message || error.response?.data?.message || error.message || 'The ResumeXpert API is unavailable. Please try again.'
}

export default api