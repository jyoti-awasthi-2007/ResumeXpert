import { motion } from 'framer-motion'

export default function QuestionCard({ question, selectedOption, onSelect }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8 rounded-3xl border border-surface">
      <div className="text-sm text-secondary mb-3">{question.skill}</div>
      <h3 className="text-xl font-semibold text-primary mb-6">{question.question}</h3>
      <div className="grid gap-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`w-full rounded-2xl border p-4 text-left transition ${selectedOption === index ? 'border-primary bg-primary/10 text-primary' : 'border-surface bg-surface-secondary text-primary hover:border-primary/30 hover:bg-white'}`}
            onClick={() => onSelect(index)}
          >
            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full mr-4 text-sm font-semibold ${selectedOption === index ? 'border-primary bg-primary text-white' : 'border-surface text-secondary'}`}>
              {String.fromCharCode(65 + index)}
            </span>
            {option}
          </button>
        ))}
      </div>
    </motion.div>
  )
}
