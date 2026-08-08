import { resumeOverview } from '../data/mockData'

export function uploadResume(file) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        fileName: file?.name || 'resume.pdf',
      })
    }, 600)
  })
}

export function analyzeResume() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(resumeOverview)
    }, 1200)
  })
}
