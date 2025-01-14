import { atom } from 'jotai'

export interface CalorieResult {
  bmr: number
  dailyCalories: number
}

export const calorieResultAtom = atom<CalorieResult | null>(null)

