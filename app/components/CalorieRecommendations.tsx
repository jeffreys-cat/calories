import React, { useState } from 'react'
import { useLanguage } from '../../LanguageContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type DietType = 'normal' | 'weightLoss'

export function CalorieRecommendations() {
  const { t } = useLanguage()
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [dietType, setDietType] = useState<DietType>('normal')

  const getRecommendation = (gender: 'male' | 'female', dietType: DietType) => {
    const baseCalories = gender === 'male' ? 2500 : 2000
    const weightLossCalories = baseCalories * 0.8 // 20% calorie deficit for weight loss

    return {
      calories: dietType === 'normal' ? baseCalories : Math.round(weightLossCalories),
      sugar: Math.round((dietType === 'normal' ? 50 : 25) * (gender === 'male' ? 1.25 : 1))
    }
  }

  const recommendation = getRecommendation(gender, dietType)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('calorieRecommendationsTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <RadioGroup defaultValue={gender} onValueChange={(value) => setGender(value as 'male' | 'female')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">{t('male')}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">{t('female')}</Label>
            </div>
          </RadioGroup>

          <Select defaultValue={dietType} onValueChange={(value) => setDietType(value as DietType)}>
            <SelectTrigger>
              <SelectValue placeholder={t('selectDietType')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">{t('normalDiet')}</SelectItem>
              <SelectItem value="weightLoss">{t('weightLossDiet')}</SelectItem>
            </SelectContent>
          </Select>

          <div className="mt-4">
            <p>{t('recommendedCalories', { calories: recommendation.calories })}</p>
            <p>{t('recommendedSugar', { sugar: recommendation.sugar })}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

