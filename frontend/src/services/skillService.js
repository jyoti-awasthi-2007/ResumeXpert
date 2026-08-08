import { skills } from '../data/mockData'

export function getSkills() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(skills), 700)
  })
}
