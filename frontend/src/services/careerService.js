import { careerMatches } from '../data/mockData'

export function getCareers() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(careerMatches), 700)
  })
}

export function getCareerById(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const career = careerMatches.find((item) => item.id === id)
      if (career) resolve(career)
      else reject(new Error('Career not found'))
    }, 600)
  })
}
