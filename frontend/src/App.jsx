import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Dashboard from './pages/Dashboard'
import ResumeUpload from './pages/ResumeUpload'
import ResumeAnalysis from './pages/ResumeAnalysis'
import Skills from './pages/Skills'
import CareerSuggestions from './pages/CareerSuggestions'
import CareerDetails from './pages/CareerDetails'
import SkillGap from './pages/SkillGap'
import Recommendations from './pages/Recommendations'
import Assessment from './pages/Assessment'
import AssessmentLevel from './pages/AssessmentLevel'
import AssessmentResults from './pages/AssessmentResults'
import Confidence from './pages/Confidence'
import ClaimComparisonPage from './pages/ClaimComparisonPage'
import CareerReadiness from './pages/CareerReadiness'
import Analytics from './pages/ResultsAnalytics'
import Profile from './pages/VerifiedProfile'
import Settings from './pages/Settings'

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
        <Route path="/resume" element={<ResumeUpload />} />
        <Route path="/resume-analysis" element={<ResumeAnalysis />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/career-suggestions" element={<CareerSuggestions />} />
        <Route path="/careers" element={<CareerSuggestions />} />
        <Route path="/career/:careerId" element={<CareerDetails />} />
        <Route path="/skill-gap" element={<SkillGap />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/assessment/:level" element={<AssessmentLevel />} />
        <Route path="/assessment/results" element={<AssessmentResults />} />
        <Route path="/confidence" element={<Confidence />} />
        <Route path="/claim-vs-actual" element={<ClaimComparisonPage />} />
        <Route path="/career-readiness" element={<CareerReadiness />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </AnimatePresence>
  )
}

export default App
