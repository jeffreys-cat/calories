'use client'

import { useLanguage } from '../../LanguageContext'
import { CalorieCalculator } from '../components/CalorieCalculator'
import { MealRecommendations } from '../components/MealRecommendations'

export default function CalculatorPage() {
  const { t } = useLanguage()

  return (
    <div className="mt-4">
      <h1 className="text-2xl font-bold mb-4">{t('calorieCalculatorTitle')}</h1>
      <CalorieCalculator />
      <MealRecommendations />
    </div>
  )
}

