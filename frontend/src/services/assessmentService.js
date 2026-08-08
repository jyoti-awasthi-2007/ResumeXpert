import { assessmentLevels, assessmentQuestions } from '../data/mockData'

export function getAssessmentLevels() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(assessmentLevels), 400)
  })
}

export function generateAssessment(level) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const questions = assessmentQuestions[level]
      if (questions) resolve(questions)
      else reject(new Error('Assessment level not found'))
    }, 500)
  })
}

export function submitAssessment(answers) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const correct = answers.filter((item) => item.isCorrect).length
      const score = Math.round((correct / answers.length) * 100)
      resolve({ score, correct, incorrect: answers.length - correct, total: answers.length })
    }, 700)
  })
}
