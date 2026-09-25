import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../services/api'

const ChatContext = createContext(null)

const INITIAL_MESSAGES = [
  {
    role: 'assistant',
    text: 'Hello! I am your AI Career Assistant. I can help analyze your resume, explain skill gaps, prepare for interviews, suggest target roles, and guide your career roadmap. What would you like to explore today?',
    timestamp: new Date().toISOString(),
  },
]

const QUICK_PROMPTS = [
  {
    category: 'Resume Analysis',
    prompt: 'How can I improve my resume score and impact?',
    icon: 'FileText',
  },
  {
    category: 'Skill Gaps',
    prompt: 'What are the most critical missing skills for my target career?',
    icon: 'Layers',
  },
  {
    category: 'Interview Prep',
    prompt: 'Give me 5 essential technical interview questions with tips for my role.',
    icon: 'Shield',
  },
  {
    category: 'Career Roadmap',
    prompt: 'What should be my 30-60-90 day learning plan to become job-ready?',
    icon: 'Compass',
  },
]

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('careerlens_chat_history')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed
        }
      }
    } catch {
      // ignore JSON parse error
    }
    return INITIAL_MESSAGES
  })

  const [sending, setSending] = useState(false)
  const [activeContext, setActiveContext] = useState(null)

  // Save to localStorage whenever messages change
  useEffect(() => {
    try {
      localStorage.setItem('careerlens_chat_history', JSON.stringify(messages))
    } catch {
      // ignore storage quota error
    }
  }, [messages])

  const sendMessage = useCallback(async (rawText, customContext) => {
    const text = String(rawText || '').trim()
    if (!text || sending) return

    const userMessage = {
      role: 'user',
      text,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setSending(true)

    try {
      const contextPayload = customContext || activeContext || ''
      const contextString = typeof contextPayload === 'string' ? contextPayload : (contextPayload ? JSON.stringify(contextPayload) : '')
      const response = await api.post('/chat', {
        message: text,
        context: contextString ? contextString.slice(0, 1000) : '',
      })

      const assistantMessage = {
        role: 'assistant',
        text: response.data?.message || 'I am ready to help you with your resume, career matches, and interview questions. Please feel free to ask!',
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      const errorMessage = {
        role: 'assistant',
        text: 'I could not connect to the AI service right now. Please verify the backend is running on port 8000 and try again.',
        timestamp: new Date().toISOString(),
        isError: true,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setSending(false)
    }
  }, [sending, activeContext])

  const clearChat = useCallback(() => {
    setMessages(INITIAL_MESSAGES)
    try {
      localStorage.removeItem('careerlens_chat_history')
    } catch {
      // ignore
    }
  }, [])

  return (
    <ChatContext.Provider
      value={{
        messages,
        sending,
        sendMessage,
        clearChat,
        quickPrompts: QUICK_PROMPTS,
        activeContext,
        setActiveContext,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
