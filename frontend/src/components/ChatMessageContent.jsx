import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

const isTableRow = (line) => line.trim().startsWith('|') && line.trim().endsWith('|')
const isTableDivider = (line) => /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line.trim())

function sentencePoints(text) {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean)
  return sentences.length > 2 ? sentences : [text]
}

export function renderInlineText(rawText) {
  if (!rawText) return null
  const cleaned = String(rawText)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/\uFFFD/g, "'")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2011/g, '-')

  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g
  const parts = cleaned.split(regex)

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-primary">{part.slice(2, -2)}</strong>
    }
    if ((part.startsWith('*') && part.endsWith('*')) || (part.startsWith('_') && part.endsWith('_'))) {
      return <em key={i} className="italic">{part.slice(1, -1)}</em>
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={i} className="px-1.5 py-0.5 rounded bg-surface-secondary text-accent font-mono text-[0.875em]">{part.slice(1, -1)}</code>
    }
    return part
  })
}

export function parseMessageBlocks(text) {
  const rawLines = String(text || '').split('\n')
  const blocks = []
  let index = 0

  while (index < rawLines.length) {
    const trimmed = rawLines[index].trim()

    if (!trimmed) {
      index += 1
      continue
    }

    // Code block detection
    if (trimmed.startsWith('```')) {
      const lang = trimmed.replace(/^```/, '').trim()
      const codeLines = []
      index += 1
      while (index < rawLines.length && !rawLines[index].trim().startsWith('```')) {
        codeLines.push(rawLines[index])
        index += 1
      }
      if (index < rawLines.length) {
        index += 1 // consume closing ```
      }
      blocks.push({ type: 'code', code: codeLines.join('\n'), lang })
      continue
    }

    // Table detection
    if (isTableRow(trimmed) && index + 1 < rawLines.length && isTableDivider(rawLines[index + 1])) {
      const headers = trimmed.split('|').slice(1, -1).map((c) => c.trim())
      const rows = []
      index += 2
      while (index < rawLines.length && isTableRow(rawLines[index])) {
        rows.push(rawLines[index].split('|').slice(1, -1).map((c) => c.trim()))
        index += 1
      }
      blocks.push({ type: 'table', headers, rows })
      continue
    }

    // Bullet list
    if (/^[-*•]\s+/.test(trimmed)) {
      const bulletLines = []
      while (index < rawLines.length && /^[-*•]\s+/.test(rawLines[index].trim())) {
        bulletLines.push(rawLines[index].trim().replace(/^[-*•]\s+/, ''))
        index += 1
      }
      blocks.push({ type: 'list', items: bulletLines })
      continue
    }

    // Numbered list
    if (/^\d+[.)]\s+/.test(trimmed)) {
      const numberedLines = []
      while (index < rawLines.length && /^\d+[.)]\s+/.test(rawLines[index].trim())) {
        numberedLines.push(rawLines[index].trim().replace(/^\d+[.)]\s+/, ''))
        index += 1
      }
      blocks.push({ type: 'numbered', items: numberedLines })
      continue
    }

    // Heading
    const headingMatch = trimmed.match(/^#{1,4}\s+(.+)|^([^.!?]{3,48}):$/)
    if (headingMatch) {
      blocks.push({ type: 'heading', text: headingMatch[1] || headingMatch[2] })
      index += 1
      continue
    }

    // Standard paragraph
    blocks.push({ type: 'paragraph', text: trimmed })
    index += 1
  }

  return blocks
}

export default function ChatMessageContent({ text, isExpanded = false }) {
  const [copiedIndex, setCopiedIndex] = useState(null)
  const blocks = parseMessageBlocks(text)

  const copyCode = (code, index) => {
    navigator.clipboard.writeText(code)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className={`chatbot-rendered-content ${isExpanded ? 'text-base leading-relaxed space-y-3' : 'space-y-2'}`}>
      {blocks.map((block, blockIndex) => {
        if (block.type === 'code') {
          return (
            <div key={`code-${blockIndex}`} className="my-2 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-3 py-1.5 text-slate-400">
                <span className="font-mono text-[11px] uppercase tracking-wider">{block.lang || 'code'}</span>
                <button
                  type="button"
                  onClick={() => copyCode(block.code, blockIndex)}
                  className="flex items-center gap-1 text-[11px] hover:text-white transition-colors"
                >
                  {copiedIndex === blockIndex ? (
                    <>
                      <Check size={12} className="text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto p-3 font-mono text-slate-200">
                <code>{block.code}</code>
              </pre>
            </div>
          )
        }

        if (block.type === 'table') {
          return (
            <div className="chatbot-table-wrap my-2 overflow-x-auto rounded-xl border border-border" key={`table-${blockIndex}`}>
              <table className="chatbot-table w-full text-left">
                <thead>
                  <tr className="bg-surface-secondary">
                    {block.headers.map((header) => (
                      <th key={header} className="px-3 py-2 text-xs font-semibold text-primary">
                        {renderInlineText(header)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {block.rows.map((row, rowIndex) => (
                    <tr key={`row-${rowIndex}`} className="hover:bg-surface-secondary/40 transition-colors">
                      {row.map((cell, cellIndex) => (
                        <td key={`${rowIndex}-${cellIndex}`} className="px-3 py-2 text-xs text-secondary">
                          {renderInlineText(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }

        if (block.type === 'heading') {
          return (
            <h4
              className={`chatbot-message-heading font-semibold text-primary ${isExpanded ? 'text-base mt-3 mb-1' : 'text-xs mt-2 mb-1'}`}
              key={`heading-${blockIndex}`}
            >
              {renderInlineText(block.text)}
            </h4>
          )
        }

        if (block.type === 'list' || block.type === 'numbered') {
          const List = block.type === 'numbered' ? 'ol' : 'ul'
          return (
            <List
              className={`chatbot-message-list space-y-1.5 ${block.type === 'numbered' ? 'chatbot-message-numbered list-decimal list-inside' : ''}`}
              key={`list-${blockIndex}`}
            >
              {block.items.map((item, itemIndex) => (
                <li key={`${blockIndex}-${itemIndex}`} className="flex items-start gap-2">
                  <span className="chatbot-list-marker mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-emerald-50 text-[10px] font-bold text-emerald-600">
                    {block.type === 'numbered' ? itemIndex + 1 : <Check size={11} />}
                  </span>
                  <span className={isExpanded ? 'text-sm text-slate-700' : 'text-xs text-slate-700'}>
                    {renderInlineText(item)}
                  </span>
                </li>
              ))}
            </List>
          )
        }

        const points = sentencePoints(block.text)
        if (points.length > 2 && !isExpanded) {
          return (
            <ul className="chatbot-message-list space-y-1.5" key={`paragraph-${blockIndex}`}>
              {points.map((point, pointIndex) => (
                <li key={`${blockIndex}-${pointIndex}`} className="flex items-start gap-2">
                  <span className="chatbot-list-marker mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-emerald-50 text-[10px] font-bold text-emerald-600">
                    <Check size={11} />
                  </span>
                  <span className="text-xs text-slate-700">{renderInlineText(point)}</span>
                </li>
              ))}
            </ul>
          )
        }

        return (
          <p
            className={`chatbot-message-paragraph leading-relaxed ${isExpanded ? 'text-sm text-slate-700' : 'text-xs text-slate-700'}`}
            key={`paragraph-${blockIndex}`}
          >
            {renderInlineText(block.text)}
          </p>
        )
      })}
    </div>
  )
}
