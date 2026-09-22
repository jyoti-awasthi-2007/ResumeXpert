import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Send, X, Maximize2, Minimize2, ExternalLink, Sparkles, RefreshCw } from 'lucide-react'
import { useChat } from '../context/ChatContext'
import ChatMessageContent from './ChatMessageContent'
import avatar from '../assets/image.png'

export default function HelpChatbot() {
  const [open, setOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [inputMessage, setInputMessage] = useState('')
  const { messages, sending, sendMessage, quickPrompts } = useChat()
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Auto-scroll to bottom
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, sending, open, isExpanded])

  // If user is already on /ai-assistant full page, we can hide the floating widget to avoid redundancy
  const isFullChatPage = location.pathname === '/ai-assistant'
  if (isFullChatPage) {
    return null
  }

  const handleSend = async (e) => {
    if (e) e.preventDefault()
    const text = inputMessage.trim()
    if (!text || sending) return

    setInputMessage('')
    await sendMessage(text)
  }

  const handleOpenFullPage = () => {
    setOpen(false)
    setIsExpanded(false)
    navigate('/ai-assistant')
  }

  const handleQuickClick = (promptText) => {
    sendMessage(promptText)
  }

  return (
    <>
      {/* Backdrop when in expanded mode */}
      {open && isExpanded && (
        <div
          className="fixed inset-0 z-[65] bg-slate-900/40 backdrop-blur-xs transition-opacity"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <div
        className={
          isExpanded && open
            ? 'fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 pointer-events-none'
            : 'fixed bottom-5 right-5 z-[60]'
        }
      >
        {open && (
          <div
            className={`pointer-events-auto flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl transition-all duration-200 ${
              isExpanded
                ? 'w-full max-w-4xl h-[85vh] max-h-[760px] animate-in fade-in zoom-in-95'
                : 'mb-3 h-[28rem] w-[min(24rem,calc(100vw-2rem))]'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-primary px-4 py-3 text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="chatbot-avatar chatbot-avatar-small relative">
                  <img src={avatar} alt="Career AI" />
                  <i />
                </span>
                <div>
                  <strong className="block text-sm font-semibold leading-tight">ResumeXpert Career AI</strong>
                  <small className="block text-white/75 text-[11px]">
                    {isExpanded ? 'Full Assistant Mode • Online' : 'AI Career Guide • Online'}
                  </small>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-white/80">
                {/* Bigger / Maximize Toggle */}
                <button
                  type="button"
                  onClick={() => setIsExpanded((prev) => !prev)}
                  title={isExpanded ? 'Minimize chat' : 'Make chat bigger (full view)'}
                  className="p-1.5 rounded-lg hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
                  aria-label={isExpanded ? 'Minimize chat' : 'Maximize chat'}
                >
                  {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>

                {/* Open in full page route */}
                <button
                  type="button"
                  onClick={handleOpenFullPage}
                  title="Open dedicated full page"
                  className="p-1.5 rounded-lg hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
                  aria-label="Open full page"
                >
                  <ExternalLink size={16} />
                </button>

                {/* Close */}
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    setIsExpanded(false)
                  }}
                  title="Close chat"
                  className="p-1.5 rounded-lg hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
                  aria-label="Close help chat"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className={`flex-1 space-y-3 overflow-y-auto ${isExpanded ? 'p-5 sm:p-6 space-y-4' : 'p-3'}`}>
              {/* Starter Quick suggestions when expanded or only 1 message */}
              {messages.length <= 1 && (
                <div className={`rounded-xl border border-blue-100 bg-blue-50/50 p-3 text-xs text-secondary ${isExpanded ? 'mb-4' : 'mb-2'}`}>
                  <p className="font-semibold text-primary mb-2 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-accent" /> Popular career questions:
                  </p>
                  <div className={`grid gap-1.5 ${isExpanded ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                    {quickPrompts.slice(0, isExpanded ? 4 : 2).map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleQuickClick(item.prompt)}
                        className="text-left px-2.5 py-1.5 rounded-lg bg-white border border-blue-100 hover:border-accent text-[11px] text-primary hover:text-accent font-medium transition-all truncate"
                      >
                        {item.prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((item, index) => {
                const isAssistant = item.role === 'assistant'
                return (
                  <div
                    key={`${item.role}-${index}`}
                    className={`rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm ${
                      isAssistant
                        ? `bg-surface-secondary text-primary border border-border ${
                            isExpanded ? 'max-w-[85%]' : 'max-w-[90%]'
                          }`
                        : `ml-auto bg-primary text-white ${isExpanded ? 'max-w-[80%]' : 'max-w-[85%]'}`
                    }`}
                  >
                    {isAssistant ? (
                      <ChatMessageContent text={item.text} isExpanded={isExpanded} />
                    ) : (
                      <p className="whitespace-pre-wrap leading-relaxed">{item.text}</p>
                    )}
                  </div>
                )
              })}

              {sending && (
                <div className="max-w-[85%] rounded-2xl bg-surface-secondary border border-border px-3.5 py-2.5 text-xs text-secondary flex items-center gap-2">
                  <RefreshCw size={13} className="animate-spin text-accent" />
                  <span>AI is thinking...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick action chips when conversation is going */}
            {messages.length > 1 && isExpanded && (
              <div className="px-4 py-2 bg-surface-secondary/50 border-t border-border flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
                <span className="text-[11px] text-secondary font-medium shrink-0">Try asking:</span>
                {quickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuickClick(p.prompt)}
                    disabled={sending}
                    className="shrink-0 px-2.5 py-1 rounded-full bg-white hover:bg-blue-50 border border-border text-secondary hover:text-accent text-[11px] transition-colors cursor-pointer"
                  >
                    {p.prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSend} className={`flex gap-2 border-t border-border bg-surface ${isExpanded ? 'p-4' : 'p-3'}`}>
              <input
                value={inputMessage}
                onChange={(event) => setInputMessage(event.target.value)}
                placeholder={isExpanded ? 'Ask about resume enhancements, technical interview prep, skills roadmap...' : 'Ask AI career assistant...'}
                aria-label="Chat message"
                className="min-w-0 flex-1 rounded-xl border border-border bg-surface-secondary px-3.5 py-2.5 text-xs sm:text-sm text-primary placeholder-secondary outline-none focus:border-accent"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || sending}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary hover:bg-primary-dark text-white disabled:opacity-40 transition-colors cursor-pointer"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        )}

        {/* Floating trigger button in bottom-right */}
        {!isExpanded && (
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? 'Close help chat' : 'Open AI Career Assistant'}
            className="chatbot-trigger"
          >
            {open ? (
              <X size={21} className="text-white" />
            ) : (
              <span className="chatbot-avatar">
                <img src={avatar} alt="ResumeXpert AI assistant" />
                <i />
              </span>
            )}
          </button>
        )}
      </div>
    </>
  )
}