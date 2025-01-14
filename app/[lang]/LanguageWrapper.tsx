'use client'

import { LanguageProvider } from '@/LanguageContext'
import { Language } from '@/translations'

export default function LanguageWrapper({
  children,
  lang,
}: {
  children: React.ReactNode
  lang: Language
}) {
  return <LanguageProvider lang={lang}>{children}</LanguageProvider>
}

