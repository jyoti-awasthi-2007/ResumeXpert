import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Trash2,
  Download,
  Sparkles,
  Bot,
  User as UserIcon,
  HelpCircle,
  Briefcase,
  FileText,
  Layers,
  ArrowRight,
  Shield,
  Compass,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react'
import { useChat } from '../context/ChatContext'
import { useCareerLens } from '../context/CareerLensContext'
import { useAuth } from '../context/AuthContext'
import ChatMessageContent from '../components/ChatMessageContent'
import avatar from '../assets/image.png'

export default function AIAssistantPage() {
  const { messages, sending, sendMessage, clearChat, quickPrompts } = useChat()
  const { selectedCareer, resumeState, skillGap } = useCareerLens()
  const { user, profile } = useAuth()
  const [input, setInput] = useState('')
  const [copiedId, setCopiedId] = useState(null)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'You'

  // Scroll to bottom smoothly when new message arrives
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, sending])

  // Context summary to pass to the AI
  const buildCurrentContext = () => {
    const parts = []
    if (selectedCareer?.title) {
      parts.push(`Target Career: ${selectedCareer.title}`)
    }
    if (resumeState?.analysis?.skills?.length) {
      parts.push(`User Skills: ${resumeState.analysis.skills.slice(0, 8).join(', ')}`)
    }
    if (skillGap?.missingSkills?.length) {
      parts.push(`Missing Skills: ${skillGap.missingSkills.slice(0, 5).map(s => s.name || s).join(', ')}`)
    }
    return parts.join(' | ')
  }

  const handleSend = async (e) => {
    if (e) e.preventDefault()
    const text = input.trim()
    if (!text || sending) return

    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
    await sendMessage(text, buildCurrentContext())
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickPrompt = (promptText) => {
    sendMessage(promptText, buildCurrentContext())
  }

  const handleCopyMessage = (text, index) => {
    navigator.clipboard.writeText(text)
    setCopiedId(index)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleExportChat = () => {
    const transcript = messages
      .map((m) => `[${m.role.toUpperCase()} - ${new Date(m.timestamp || Date.now()).toLocaleTimeString()}]:\n${m.text}\n`)
      .join('\n---\n\n')
    const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `careerlens-chat-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Adjust textarea height on input
  const handleInputChange = (e) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`
  }

  const promptCategoryIcons = {
    FileText,
    Layers,
    Shield,
    Compass,
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] max-w-6xl mx-auto">
      {/* Top Banner / Controls */}
      <div className="bg-surface rounded-2xl border border-border p-4 mb-3 flex flex-wrap items-center justify-between gap-3 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="chatbot-avatar w-11 h-11 border-2 border-white rounded-full overflow-hidden block bg-primary/10 shadow-sm">
              <img src={avatar} alt="Career AI" className="w-full h-full object-contain" />
              <i className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-primary">ResumeXpert Career AI</h2>
              <span className="text-[11px] font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online
              </span>
            </div>
            <p className="text-xs text-secondary">
              Personalized advice for resume tailoring, skill development & interview strategy
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedCareer?.title && (
            <div className="hidden md:flex items-center gap-1.5 text-xs bg-surface-secondary text-primary px-3 py-1.5 rounded-xl border border-border">
              <Briefcase size={13} className="text-accent" />
              <span className="text-secondary">Focus:</span>
              <span className="font-semibold truncate max-w-[140px]">{selectedCareer.title}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleExportChat}
            title="Download conversation"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-border bg-surface hover:bg-surface-secondary text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Clear all conversation messages?')) {
                clearChat()
              }
            }}
            title="Reset conversation"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-border bg-surface hover:bg-red-50 text-secondary hover:text-red-600 transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Main Messages Canvas */}
      <div className="flex-1 bg-surface rounded-2xl border border-border flex flex-col overflow-hidden shadow-sm">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* If only welcome message is present, show Starter Prompts Banner */}
          {messages.length <= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="my-4 p-6 rounded-2xl bg-gradient-to-br from-blue-50/70 via-indigo-50/30 to-amber-50/40 border border-blue-100/80"
            >
              <div className="flex items-center gap-2.5 mb-2 text-primary">
                <Sparkles size={18} className="text-accent" />
                <h3 className="font-semibold text-sm sm:text-base">What would you like assistance with today?</h3>
              </div>
              <p className="text-xs sm:text-sm text-secondary mb-4 leading-relaxed">
                Click any prompt below to explore career insights, or ask your own question about your resume, assessments, or industry targets.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickPrompts.map((item, idx) => {
                  const IconComponent = promptCategoryIcons[item.icon] || Sparkles
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickPrompt(item.prompt)}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-white border border-blue-100 hover:border-accent hover:shadow-md transition-all text-left group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-accent group-hover:bg-accent group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                        <IconComponent size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="block text-[11px] font-bold text-accent uppercase tracking-wider mb-0.5">
                          {item.category}
                        </span>
                        <p className="text-xs text-primary font-medium group-hover:text-accent transition-colors line-clamp-2">
                          {item.prompt}
                        </p>
                      </div>
                      <ArrowRight size={14} className="text-slate-300 group-hover:text-accent shrink-0 mt-1 transition-colors" />
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Conversation Stream */}
          {messages.map((item, index) => {
            const isAssistant = item.role === 'assistant'
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 sm:gap-4 ${isAssistant ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                {/* Avatar */}
                {isAssistant ? (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 overflow-hidden shadow-xs">
                    <img src={avatar} alt="AI" className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                    {displayName[0]?.toUpperCase() || <UserIcon size={16} />}
                  </div>
                )}

                {/* Message Bubble & Content */}
                <div
                  className={`relative group max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 transition-all ${
                    isAssistant
                      ? item.isError
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-surface-secondary border border-border text-primary shadow-xs'
                      : 'bg-primary text-white shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <span
                      className={`text-[11px] font-semibold ${
                        isAssistant ? 'text-primary' : 'text-white/80'
                      }`}
                    >
                      {isAssistant ? 'ResumeXpert Assistant' : displayName}
                    </span>
                    <div className="flex items-center gap-1.5 opacity-70">
                      <span className="text-[10px]">
                        {new Date(item.timestamp || Date.now()).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {isAssistant && (
                        <button
                          type="button"
                          onClick={() => handleCopyMessage(item.text, index)}
                          title="Copy message"
                          className="hover:opacity-100 p-0.5 rounded cursor-pointer transition-opacity"
                        >
                          {copiedId === index ? (
                            <Check size={12} className="text-emerald-500" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {isAssistant ? (
                    <ChatMessageContent text={item.text} isExpanded={true} />
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{item.text}</p>
                  )}
                </div>
              </motion.div>
            )
          })}

          {/* Thinking state */}
          {sending && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
                <img src={avatar} alt="AI" className="w-full h-full object-contain" />
              </div>
              <div className="rounded-2xl bg-surface-secondary border border-border px-4 py-3 text-xs text-secondary flex items-center gap-2 shadow-xs">
                <RefreshCw size={14} className="animate-spin text-accent" />
                <span>Thinking & synthesizing career insights...</span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Bar: Suggested quick chips (if conversation active) */}
        {messages.length > 1 && (
          <div className="px-4 py-2 bg-surface border-t border-border flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
            <span className="text-[11px] text-secondary font-medium shrink-0 flex items-center gap-1">
              <Sparkles size={12} className="text-accent" /> Suggestions:
            </span>
            {quickPrompts.slice(0, 3).map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleQuickPrompt(item.prompt)}
                disabled={sending}
                className="shrink-0 px-2.5 py-1 rounded-full bg-surface-secondary hover:bg-blue-50 hover:text-accent border border-border text-secondary text-[11px] transition-colors cursor-pointer disabled:opacity-50"
              >
                {item.prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 sm:p-4 bg-surface border-t border-border flex items-end gap-2 sm:gap-3">
          <div className="flex-1 relative bg-surface-secondary rounded-2xl border border-border focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/10 transition-all">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your resume, career matches, skill gaps, or interview prep... (Press Enter to send)"
              rows={1}
              className="w-full bg-transparent px-4 py-3 text-sm text-primary placeholder-secondary/70 resize-none outline-none max-h-44"
            />
          </div>

          <button
            type="submit"
            disabled={!input.trim() || sending}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary hover:bg-primary-dark text-white shadow-sm disabled:opacity-40 disabled:hover:bg-primary transition-all cursor-pointer"
            aria-label="Send question"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  )
}
