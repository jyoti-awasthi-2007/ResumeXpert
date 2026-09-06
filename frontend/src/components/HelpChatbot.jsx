import { useState } from 'react'
import { Check, MessageCircle, Send, X } from 'lucide-react'
import api from '../services/api'
import avatar from '../assets/image.png'

const isTableRow = (line) => line.trim().startsWith('|') && line.trim().endsWith('|')
const isTableDivider = (line) => /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line.trim())

function sentencePoints(text) {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean)
  return sentences.length > 2 ? sentences : [text]
}

function renderAssistantMessage(text) {
  const lines = String(text || '').replace(/```[\w-]*\n?/g, '').split('\n').map((line) => line.trim()).filter(Boolean)
  const blocks = []
  let index = 0

  while (index < lines.length) {
    if (isTableRow(lines[index]) && index + 1 < lines.length && isTableDivider(lines[index + 1])) {
      const headers = lines[index].split('|').slice(1, -1).map((cell) => cell.trim())
      const rows = []
      index += 2
      while (index < lines.length && isTableRow(lines[index])) {
        rows.push(lines[index].split('|').slice(1, -1).map((cell) => cell.trim()))
        index += 1
      }
      blocks.push({ type: 'table', headers, rows })
      continue
    }

    const bulletLines = []
    while (index < lines.length && /^[-*•]\s+/.test(lines[index])) {
      bulletLines.push(lines[index].replace(/^[-*•]\s+/, ''))
      index += 1
    }
    if (bulletLines.length) {
      blocks.push({ type: 'list', items: bulletLines })
      continue
    }

    const numberedLines = []
    while (index < lines.length && /^\d+[.)]\s+/.test(lines[index])) {
      numberedLines.push(lines[index].replace(/^\d+[.)]\s+/, ''))
      index += 1
    }
    if (numberedLines.length) {
      blocks.push({ type: 'numbered', items: numberedLines })
      continue
    }

    const headingMatch = lines[index].match(/^#{1,3}\s+(.+)|^([^.!?]{3,48}):$/)
    if (headingMatch) {
      blocks.push({ type: 'heading', text: headingMatch[1] || headingMatch[2] })
      index += 1
      continue
    }

    blocks.push({ type: 'paragraph', text: lines[index] })
    index += 1
  }

  return blocks.map((block, blockIndex) => {
    if (block.type === 'table') {
      return <div className="chatbot-table-wrap" key={`table-${blockIndex}`}><table className="chatbot-table"><thead><tr>{block.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{block.rows.map((row, rowIndex) => <tr key={`row-${rowIndex}`}>{row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>)}</tr>)}</tbody></table></div>
    }
    if (block.type === 'heading') return <h4 className="chatbot-message-heading" key={`heading-${blockIndex}`}>{block.text}</h4>
    if (block.type === 'list' || block.type === 'numbered') {
      const List = block.type === 'numbered' ? 'ol' : 'ul'
      return <List className={`chatbot-message-list ${block.type === 'numbered' ? 'chatbot-message-numbered' : ''}`} key={`list-${blockIndex}`}>{block.items.map((item, itemIndex) => <li key={`${blockIndex}-${itemIndex}`}><span className="chatbot-list-marker">{block.type === 'numbered' ? itemIndex + 1 : <Check size={11} />}</span><span>{item}</span></li>)}</List>
    }
    const points = sentencePoints(block.text)
    if (points.length > 1) return <ul className="chatbot-message-list" key={`paragraph-${blockIndex}`}>{points.map((point, pointIndex) => <li key={`${blockIndex}-${pointIndex}`}><span className="chatbot-list-marker"><Check size={11} /></span><span>{point}</span></li>)}</ul>
    return <p className="chatbot-message-paragraph" key={`paragraph-${blockIndex}`}>{block.text}</p>
  })
}

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
      setMessages((current) => [...current, { role: 'assistant', text: 'I could not connect right now. Please try again in a moment.' }])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[60]">
      {open && (
        <div className="mb-3 flex h-[26rem] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-surface bg-surface shadow-xl">
          <div className="flex items-center justify-between bg-primary px-4 py-3 text-white">
            <div className="flex items-center gap-2"><span className="chatbot-avatar chatbot-avatar-small"><img src={avatar} alt="" /><i /></span><span><strong className="block text-sm">ResumeXpert Help</strong><small className="block text-white/70">Career guide online</small></span></div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close help chat"><X size={18} /></button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-3">
            {messages.map((item, index) => (
              <div key={`${item.role}-${index}`} className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${item.role === 'user' ? 'ml-auto bg-primary text-white' : 'bg-surface-secondary text-primary'}`}>
                {item.role === 'assistant' ? renderAssistantMessage(item.text) : item.text}
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
      <button type="button" onClick={() => setOpen((current) => !current)} aria-label={open ? 'Close help chat' : 'Open help chat'} className="chatbot-trigger">{open ? <X size={21} /> : <span className="chatbot-avatar"><img src={avatar} alt="ResumeXpert assistant" /><i /></span>}</button>
    </div>
  )
}