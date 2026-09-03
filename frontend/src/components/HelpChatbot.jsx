import { useState } from 'react'
import { Bot, MessageCircle, Send, X } from 'lucide-react'
import api from '../services/api'

export default function HelpChatbot() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I can help with uploads, skills, assessments, and career analysis.' },
  ])
  const [sending, setSending] = useState(false)

  const sendMessage = async (event) => {
    event.preventDefault()
    const text = message.trim()
    if (!text || sending) return

    setMessage('')
    setMessages((current) => [...current, { role: 'user', text }])
    setSending(true)
    try {
      const response = await api.post('/chat', { message: text })
      setMessages((current) => [...current, { role: 'assistant', text: response.data.message }])
    } catch {
      setMessages((current) => [...current, { role: 'assistant', text: 'I could not connect right now. Please check that the backend is running on port 8000.' }])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[60]">
      {open && (
        <div className="mb-3 flex h-[26rem] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-surface bg-surface shadow-xl">
          <div className="flex items-center justify-between bg-primary px-4 py-3 text-white">
            <div className="flex items-center gap-2"><Bot size={18} /><span className="text-sm font-semibold">ResumeXpert Help</span></div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close help chat"><X size={18} /></button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-3">
            {messages.map((item, index) => (
              <div key={`${item.role}-${index}`} className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${item.role === 'user' ? 'ml-auto bg-primary text-white' : 'bg-surface-secondary text-primary'}`}>
                {item.text}
              </div>
            ))}
            {sending && <div className="max-w-[85%] rounded-xl bg-surface-secondary px-3 py-2 text-sm text-secondary">Thinking...</div>}
          </div>
          <form onSubmit={sendMessage} className="flex gap-2 border-t border-surface p-3">
            <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="How can I help?" aria-label="Chat message" className="min-w-0 flex-1 rounded-xl border border-surface bg-surface-secondary px-3 py-2 text-sm text-primary outline-none" />
            <button type="submit" disabled={sending} aria-label="Send message" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white disabled:opacity-50"><Send size={16} /></button>
          </form>
        </div>
      )}
      <button type="button" onClick={() => setOpen((current) => !current)} aria-label={open ? 'Close help chat' : 'Open help chat'} className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg"><MessageCircle size={22} /></button>
    </div>
  )
}