'use client'

import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { Food } from '../../../data/foods'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

interface FoodTableProps {
  category: 'fruit' | 'vegetable' | 'nut'
  foods: Food[]
}

export default function FoodTable({ category, foods }: FoodTableProps) {
  const { t, i18n } = useTranslation('common')
  const [sortBy, setSortBy] = useState<'calories' | 'sugar' | 'riceComparison'>('calories')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const rice = foods.find(food => food.name.en === 'Rice') || { calories: 130, sugar: 0.1 }

  const handleSort = (column: 'calories' | 'sugar' | 'riceComparison') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  const sortedFoods = [...foods].sort((a, b) => {
    let aValue = sortBy === 'riceComparison' ? a.calories / rice.calories : a[sortBy]
    let bValue = sortBy === 'riceComparison' ? b.calories / rice.calories : b[sortBy]
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
  })

  return (
    <Table>
      <TableCaption>{`${t(category)}${t('perHundredGrams')}`}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>{t('name')}</TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => handleSort('calories')}>
              {t('calories')}
              {sortBy === 'calories' && (sortOrder === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />)}
              {sortBy !== 'calories' && <ArrowUpDown className="ml-2 h-4 w-4" />}
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => handleSort('sugar')}>
              {t('sugar')}
              {sortBy === 'sugar' && (sortOrder === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />)}
              {sortBy !== 'sugar' && <ArrowUpDown className="ml-2 h-4 w-4" />}
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => handleSort('riceComparison')}>
              {t('riceComparison')}
              {sortBy === 'riceComparison' && (sortOrder === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />)}
              {sortBy !== 'riceComparison' && <ArrowUpDown className="ml-2 h-4 w-4" />}
            </Button>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedFoods.map((food) => (
          <TableRow key={food.name[i18n.language as keyof typeof food.name]}>
            <TableCell>{food.name[i18n.language as keyof typeof food.name] || food.name.en}</TableCell>
            <TableCell>{food.calories}</TableCell>
            <TableCell>{food.sugar}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Progress 
                  value={(food.calories / rice.calories) * 100} 
                  className="w-[100px]"
                />
                <span>{((food.calories / rice.calories) * 100).toFixed(0)}%</span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

