'use client'

import React from 'react'
import { useAtom } from 'jotai'
import { useLanguage } from '@/LanguageContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { calorieResultAtom } from '../atoms/calorieAtoms'

type ActivityLevel = 'sedentary' | 'lightlyActive' | 'moderatelyActive' | 'veryActive' | 'extraActive'

export function CalorieCalculator() {
  const { t } = useLanguage()
  const [gender, setGender] = React.useState<'male' | 'female'>('female')
  const [age, setAge] = React.useState('')
  const [weight, setWeight] = React.useState('')
  const [height, setHeight] = React.useState('')
  const [activityLevel, setActivityLevel] = React.useState<ActivityLevel>('moderatelyActive')
  const [calorieResult, setCalorieResult] = useAtom(calorieResultAtom)

  const calculateBMR = (gender: 'male' | 'female', weight: number, height: number, age: number): number => {
    if (gender === 'male') {
      return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    } else {
      return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
    }
  }

  const calculateCalories = (currentGender: 'male' | 'female' = gender) => {
    const ageNum = parseInt(age)
    const weightNum = parseFloat(weight)
    const heightNum = parseFloat(height)

    if (isNaN(ageNum) || isNaN(weightNum) || isNaN(heightNum)) {
      return
    }

    const bmr = calculateBMR(currentGender, weightNum, heightNum, ageNum)

    const activityMultipliers: Record<ActivityLevel, number> = {
      sedentary: 1.2,
      lightlyActive: 1.375,
      moderatelyActive: 1.55,
      veryActive: 1.725,
      extraActive: 1.9
    }

    const dailyCalories = bmr * activityMultipliers[activityLevel]
    setCalorieResult({ bmr: Math.round(bmr), dailyCalories: Math.round(dailyCalories) })
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{t('calorieCalculatorTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="mb-4">
            <Label className="mb-2 block">{t('gender')}</Label>
            <RadioGroup
              defaultValue="female"
              value={gender}
              onValueChange={(value) => {
                setGender(value as 'male' | 'female');
                if (age && weight && height) {
                  calculateCalories(value as 'male' | 'female');
                }
              }}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">{t('female')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">{t('male')}</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="age">{t('age')}</Label>
            <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="weight">{t('weight')} (kg)</Label>
            <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="height">{t('height')} (cm)</Label>
            <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="activityLevel">{t('activityLevel')}</Label>
            <Select value={activityLevel} onValueChange={(value) => setActivityLevel(value as ActivityLevel)}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectActivityLevel')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">{t('sedentary')}</SelectItem>
                <SelectItem value="lightlyActive">{t('lightlyActive')}</SelectItem>
                <SelectItem value="moderatelyActive">{t('moderatelyActive')}</SelectItem>
                <SelectItem value="veryActive">{t('veryActive')}</SelectItem>
                <SelectItem value="extraActive">{t('extraActive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={() => calculateCalories()}>{t('calculateCalories')}</Button>

          {calorieResult && (
            <div className="mt-4 space-y-2">
              <p>{t('bmrResult')}{calorieResult.bmr}</p>
              <p>{t('dailyCalorieNeeds')}{calorieResult.dailyCalories}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

