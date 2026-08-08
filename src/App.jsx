import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Dashboard from './pages/Dashboard'
import ResumeUpload from './pages/ResumeUpload'
import CertificateAnalysis from './pages/CertificateAnalysis'
import AIInterview from './pages/AIInterview'
import SkillTest from './pages/SkillTest'
import IntegrityMonitor from './pages/IntegrityMonitor'
import ResultsAnalytics from './pages/ResultsAnalytics'
import VerifiedProfile from './pages/VerifiedProfile'
import RecruiterDashboard from './pages/RecruiterDashboard'

function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload-resume" element={<ResumeUpload />} />
        <Route path="/certificate-analysis" element={<CertificateAnalysis />} />
        <Route path="/ai-interview" element={<AIInterview />} />
        <Route path="/skill-test" element={<SkillTest />} />
        <Route path="/integrity-monitor" element={<IntegrityMonitor />} />
        <Route path="/results" element={<ResultsAnalytics />} />
        <Route path="/profile" element={<VerifiedProfile />} />
        <Route path="/recruiter" element={<RecruiterDashboard />} />
      </Routes>
    </AnimatePresence>
  )
}

export default App
