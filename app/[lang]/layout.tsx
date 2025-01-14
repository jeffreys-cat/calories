'use client';

import '../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { LanguageProvider, useLanguage } from '@/LanguageContext'
import Link from 'next/link'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LanguageSwitcher from './components/LanguageSwitcher'
import { Language } from '@/translations'
import LanguageWrapper from './LanguageWrapper'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'Food and Calorie Information',
//   description: 'Nutritional information for foods and calorie calculator',
// }

export default function RootLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode
  params: { lang: Language }
}) {
  const { t } = useLanguage()
  const pathname = usePathname()
  const isCalculatorPage = pathname.includes('/calculator')
  const activeTab = isCalculatorPage ? 'calculator' : 'nutrition'

  return (
    <html lang={lang}>
      <body className={inter.className}>
        <LanguageWrapper lang={lang}>
          <div className="container mx-auto p-4">
            <header className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">{t('nutriTrack')}</h1>
              <LanguageSwitcher />
            </header>
            <Tabs defaultValue={activeTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="nutrition" asChild>
                  <Link href={`/${lang}`}>{t('nutritionalInformation')}</Link>
                </TabsTrigger>
                <TabsTrigger value="calculator" asChild>
                  <Link href={`/${lang}/calculator`}>{t('calorieCalculator')}</Link>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            {children}
          </div>
        </LanguageWrapper>
      </body>
    </html>
  )
}

