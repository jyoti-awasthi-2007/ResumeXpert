import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, BriefcaseBusiness, MapPin, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import GradientBackground from '../components/GradientBackground'
import PageTransition from '../components/PageTransition'
import BrandLockup from '../components/BrandLockup'

export default function ProfileSetup() {
  const { user, saveProfile } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ full_name: user?.user_metadata?.full_name || '', location: '', target_role: '', experience_level: 'Early career' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const submit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      await saveProfile(form)
      navigate('/upload-resume', { replace: true })
    } catch (requestError) {
      setError(requestError.message || 'Could not save your profile.')
    } finally {
      setSaving(false)
    }
  }

  return <PageTransition><GradientBackground variant="auth"><div className="auth-page min-h-screen flex items-center justify-center px-4 py-10"><div className="auth-frame auth-frame-single w-full max-w-xl"><div className="auth-form-panel"><div className="auth-form-heading"><BrandLockup /><p className="auth-form-kicker mt-8">Step 1 of 2</p><h2>Make your workspace yours</h2><p>Tell us a little about your direction. We will use it to tailor your resume insights.</p></div><form onSubmit={submit} className="space-y-4"><label className="auth-field"><span>Full name</span><input className="auth-input w-full px-4 py-3.5" name="full_name" value={form.full_name} onChange={update} required placeholder="Your name" /></label><label className="auth-field"><span>Where are you based?</span><div className="relative"><MapPin size={17} className="auth-field-icon" /><input className="auth-input w-full pl-11 pr-4 py-3.5" name="location" value={form.location} onChange={update} placeholder="City, country" /></div></label><label className="auth-field"><span>Target role or career</span><div className="relative"><BriefcaseBusiness size={17} className="auth-field-icon" /><input className="auth-input w-full pl-11 pr-4 py-3.5" name="target_role" value={form.target_role} onChange={update} required placeholder="e.g. Data Scientist" /></div></label><label className="auth-field"><span>Experience level</span><select className="auth-input w-full px-4 py-3.5" name="experience_level" value={form.experience_level} onChange={update}><option>Student</option><option>Early career</option><option>Mid career</option><option>Senior</option><option>Career switcher</option></select></label>{error && <p className="text-sm text-danger">{error}</p>}<button className="auth-submit w-full inline-flex items-center justify-center gap-2" disabled={saving}>{saving ? 'Saving profile...' : <>Continue to resume upload <ArrowRight size={17} /></>}</button></form><p className="profile-setup-note"><Sparkles size={14} /> You can update these details later from Profile.</p></div></div></div></GradientBackground></PageTransition>
}
