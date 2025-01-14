'use client'

import { useState } from 'react'
import { Food, foods } from '@/data/foods'
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { useLanguage } from '@/LanguageContext'
import { Language } from '../../translations'

export default function Home() {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'calories' | 'sugar' | 'riceComparison' | 'gi'>('calories')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const categories: Food['category'][] = ['fruit', 'vegetable', 'nut', 'staple', 'meat']
  const rice = foods.find(food => food.name.en === 'Rice') || { calories: 130, sugar: 0.1, name: { en: 'Rice' } };

  const handleSort = (column: 'calories' | 'sugar' | 'riceComparison' | 'gi') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  const filteredFoods = categories.reduce((acc, category) => {
    acc[category] = foods.filter(food => 
      food.category === category && 
      Object.values(food.name).some(name => 
        name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    return acc;
  }, {} as Record<Food['category'], Food[]>);

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t('nutritionalInformation')}</h2>
      </div>
      
      <div className="mb-4">
        <Input
          type="text"
          placeholder={t('searchPlaceholder')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Tabs defaultValue="fruit">
        <TabsList>
          <TabsTrigger value="fruit">{t('fruits')}</TabsTrigger>
          <TabsTrigger value="vegetable">{t('vegetables')}</TabsTrigger>
          <TabsTrigger value="nut">{t('nuts')}</TabsTrigger>
          <TabsTrigger value="staple">{t('staples')}</TabsTrigger>
          <TabsTrigger value="meat">{t('meats')}</TabsTrigger>
        </TabsList>
        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <FoodTable 
              foods={filteredFoods[category]}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              category={t(category as 'fruits' | 'vegetables' | 'nuts' | 'staples' | 'meats')}
              rice={rice}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

interface FoodTableProps {
  foods: Food[]
  sortBy: 'calories' | 'sugar' | 'riceComparison' | 'gi'
  sortOrder: 'asc' | 'desc'
  onSort: (column: 'calories' | 'sugar' | 'riceComparison' | 'gi') => void
  category: string
  rice: Food
}

function FoodTable({ foods, sortBy, sortOrder, onSort, category, rice }: FoodTableProps) {
  const { t, language } = useLanguage();
  const sortedFoods = [...foods].sort((a, b) => {
    let aValue = sortBy === 'riceComparison' ? (a.calories / rice.calories) || 0 : a[sortBy] || 0;
    let bValue = sortBy === 'riceComparison' ? (b.calories / rice.calories) || 0 : b[sortBy] || 0;
    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
  })

  return (
    <Table>
      <TableCaption>{`${category}${t('perHundredGrams')}`}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>{t('name')}</TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => onSort('calories')}>
              {t('calories')}
              {sortBy === 'calories' && (sortOrder === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />)}
              {sortBy !== 'calories' && <ArrowUpDown className="ml-2 h-4 w-4" />}
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => onSort('sugar')}>
              {t('sugar')}
              {sortBy === 'sugar' && (sortOrder === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />)}
              {sortBy !== 'sugar' && <ArrowUpDown className="ml-2 h-4 w-4" />}
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => onSort('gi')}>
              {t('glycemicIndex')}
              {sortBy === 'gi' && (sortOrder === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />)}
              {sortBy !== 'gi' && <ArrowUpDown className="ml-2 h-4 w-4" />}
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => onSort('riceComparison')}>
              {t('riceComparison')}
              {sortBy === 'riceComparison' && (sortOrder === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />)}
              {sortBy !== 'riceComparison' && <ArrowUpDown className="ml-2 h-4 w-4" />}
            </Button>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedFoods.map((food) => (
          <TableRow key={food.name[language] || food.name.en}>
            <TableCell>{food.name[language] || food.name.en}</TableCell>
            <TableCell>{food.calories}</TableCell>
            <TableCell>{food.sugar}</TableCell>
            <TableCell>{food.gi}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Progress 
                  value={((food.calories / rice.calories) * 100) || 0} 
                  className="w-[100px]"
                />
                <span>{(((food.calories / rice.calories) * 100) || 0).toFixed(0)}%</span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

