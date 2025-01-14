'use client'

import React from 'react'
import { useAtomValue } from 'jotai'
import { useLanguage } from '@/LanguageContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { foods } from '@/data/foods'
import { calorieResultAtom } from '../atoms/calorieAtoms'

interface MealProps {
  mealType: 'breakfast' | 'lunch' | 'dinner'
  calories: number
  foods: Array<{ name: string; grams: number; calories: number }>
}

function MealCard({ mealType, calories, foods }: MealProps) {
  const { t } = useLanguage()

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{t(mealType)} ({calories} {t('calories')})</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {foods.map((food, index) => (
            <li key={index}>
              {food.name}: {food.grams}g ({food.calories} {t('calories')})
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export function MealRecommendations() {
  const { t } = useLanguage()
  const calorieResult = useAtomValue(calorieResultAtom)

  if (!calorieResult) {
    return null
  }

  const { dailyCalories } = calorieResult

  const breakfastCalories = Math.round(dailyCalories * 0.3)
  const lunchCalories = Math.round(dailyCalories * 0.4)
  const dinnerCalories = Math.round(dailyCalories * 0.3)

  const getRandomFoods = (category: string, count: number, totalCalories: number) => {
    const categoryFoods = foods.filter(food => food.category === category)
    const selectedFoods: Array<{ name: string; grams: number; calories: number }> = []
    let remainingCalories = totalCalories

    for (let i = 0; i < count; i++) {
      const food = categoryFoods[Math.floor(Math.random() * categoryFoods.length)]
      const grams = Math.round((remainingCalories / count) / (food.calories / 100))
      const calories = Math.round((grams / 100) * food.calories)

      selectedFoods.push({
        name: food.name.en,
        grams,
        calories
      })

      remainingCalories -= calories
    }

    return selectedFoods
  }

  const breakfastFoods = [...getRandomFoods('fruit', 1, breakfastCalories * 0.3), ...getRandomFoods('staple', 1, breakfastCalories * 0.7)]
  const lunchFoods = [...getRandomFoods('vegetable', 2, lunchCalories * 0.3), ...getRandomFoods('meat', 1, lunchCalories * 0.3), ...getRandomFoods('staple', 1, lunchCalories * 0.4)]
  const dinnerFoods = [...getRandomFoods('vegetable', 2, dinnerCalories * 0.3), ...getRandomFoods('meat', 1, dinnerCalories * 0.3), ...getRandomFoods('staple', 1, dinnerCalories * 0.4)]

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">{t('mealRecommendationsTitle')}</h2>
      <MealCard mealType="breakfast" calories={breakfastCalories} foods={breakfastFoods} />
      <MealCard mealType="lunch" calories={lunchCalories} foods={lunchFoods} />
      <MealCard mealType="dinner" calories={dinnerCalories} foods={dinnerFoods} />
    </div>
  )
}

