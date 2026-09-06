import { createContext, useContext, useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(isSupabaseConfigured)

  const loadProfile = async (userId) => {
    if (!supabase || !userId) return null
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
    if (error) throw error
    setProfile(data)
    return data
  }

  const loadNotifications = async (userId) => {
    if (!supabase || !userId) return
    const { data, error } = await supabase.from('activity_logs').select('id, activity_type, metadata, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(8)
    if (!error) setNotifications(data || [])
  }

  useEffect(() => {
    if (!supabase) {
      return undefined
    }

    let active = true
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      setSession(data.session)
      if (data.session?.user) {
        await loadProfile(data.session.user.id).catch(() => {})
        await loadNotifications(data.session.user.id).catch(() => {})
      }
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      if (nextSession?.user) {
        loadProfile(nextSession.user.id).catch(() => {})
        loadNotifications(nextSession.user.id).catch(() => {})
      } else {
        setProfile(null)
        setNotifications([])
      }
    })

    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const signUp = async ({ name, email, password }) => {
    if (!supabase) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to frontend/.env.')
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
    if (error) throw error
    if (data.user && data.session) {
      await saveProfile({ full_name: name, email })
    }
    return data
  }

  const signIn = async ({ email, password }) => {
    if (!supabase) throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to frontend/.env.')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    const nextProfile = await loadProfile(data.user.id)
    return { ...data, profile: nextProfile }
  }

  const saveProfile = async (values) => {
    if (!supabase || !session?.user) throw new Error('Please sign in before saving your profile.')
    const payload = { id: session.user.id, email: session.user.email, ...values, updated_at: new Date().toISOString() }
    const { data, error } = await supabase.from('profiles').upsert(payload).select().single()
    if (error) throw error
    setProfile(data)
    await logActivity('profile_updated', values)
    return data
  }

  const saveProgress = async (progress) => {
    if (!supabase || !session?.user) return null
    const { data, error } = await supabase.from('profiles').upsert({
      id: session.user.id,
      email: session.user.email,
      full_name: profile?.full_name || session.user.user_metadata?.full_name || session.user.email,
      ...progress,
      updated_at: new Date().toISOString(),
    }).select().single()
    if (error) throw error
    setProfile(data)
    return data
  }

  const logActivity = async (activityType, metadata = {}) => {
    if (!supabase || !session?.user) return
    const { error } = await supabase.from('activity_logs').insert({
      user_id: session.user.id,
      activity_type: activityType,
      metadata,
    })
    if (error) console.warn('Could not save activity:', error.message)
    else await loadNotifications(session.user.id)
  }

  const uploadToStorage = async (file) => {
    if (!supabase || !session?.user) throw new Error('Please sign in before uploading a resume.')
    const extension = file.name.split('.').pop()?.toLowerCase() || 'pdf'
    const path = `${session.user.id}/${crypto.randomUUID()}.${extension}`
    const { error } = await supabase.storage.from('resumes').upload(path, file, { upsert: false, contentType: file.type })
    if (error) throw error
    await logActivity('resume_uploaded', { path, file_name: file.name, file_size: file.size })
    const { data, error: urlError } = await supabase.storage.from('resumes').createSignedUrl(path, 3600)
    if (urlError) throw urlError
    return { path, signedUrl: data.signedUrl }
  }

  const signOut = async () => {
    await logActivity('signed_out')
    return supabase?.auth.signOut()
  }

  return <AuthContext.Provider value={{ session, user: session?.user || null, profile, loading, notifications, configured: isSupabaseConfigured, signUp, signIn, saveProfile, saveProgress, logActivity, uploadToStorage, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used inside AuthProvider')
  return value
}
