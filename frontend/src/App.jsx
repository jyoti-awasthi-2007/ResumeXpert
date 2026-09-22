import { Routes, Route } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import HelpChatbot from './components/HelpChatbot'
import { ChatProvider } from './context/ChatContext'

import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Dashboard from './pages/Dashboard'
import AIAssistantPage from './pages/AIAssistantPage'
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
import CareerReadiness from './pages/CareerReadiness'
import Analytics from './pages/ResultsAnalytics'
import Profile from './pages/Profile'
import ProfileSetup from './pages/ProfileSetup'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <ChatProvider>
      <Routes>
        <Route path="/"                   element={<LandingPage />} />
        <Route path="/login"              element={<LoginPage />} />
        <Route path="/signup"             element={<SignupPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard"          element={<Dashboard />} />
            <Route path="/ai-assistant"       element={<AIAssistantPage />} />
            <Route path="/upload-resume"      element={<ResumeUpload />} />
            <Route path="/resume"             element={<ResumeUpload />} />
            <Route path="/resume-analysis"    element={<ResumeAnalysis />} />
            <Route path="/skills"             element={<Skills />} />
            <Route path="/career-suggestions" element={<CareerSuggestions />} />
            <Route path="/careers"            element={<CareerSuggestions />} />
            <Route path="/career/:careerId"   element={<CareerDetails />} />
            <Route path="/skill-gap"          element={<SkillGap />} />
            <Route path="/recommendations"    element={<Recommendations />} />
            <Route path="/assessment"         element={<Assessment />} />
            <Route path="/assessment/:level"  element={<AssessmentLevel />} />
            <Route path="/assessment/results" element={<AssessmentResults />} />
            <Route path="/assessment/results/:assessmentId" element={<AssessmentResults />} />
            <Route path="/confidence"         element={<Confidence />} />
            <Route path="/career-readiness"   element={<CareerReadiness />} />
            <Route path="/analytics"          element={<Analytics />} />
            <Route path="/profile"            element={<Profile />} />
          </Route>
        </Route>
      </Routes>
      <HelpChatbot />
    </ChatProvider>
  )
}

export default App
