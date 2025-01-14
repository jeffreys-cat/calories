'use client'

import React, { createContext, useContext, ReactNode } from 'react';
import { translations, Language } from './translations';
import { useRouter, usePathname } from 'next/navigation';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children, lang }: { children: ReactNode; lang: Language }) {
  const router = useRouter();
  const pathname = usePathname();

  const setLanguage = (newLang: Language) => {
    const currentPathname = pathname;
    const newPathname = currentPathname.replace(/^\/[^\/]+/, `/${newLang}`);
    router.push(newPathname);
  };

  const t = (key: keyof typeof translations['en']) => {
    // First, try to get the translation for the current language
    const translation = translations[lang]?.[key];
    if (translation) return translation;

    // If not found, fall back to English
    const englishTranslation = translations['en'][key];
    if (englishTranslation) return englishTranslation;

    // If still not found, return the key itself
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language: lang, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

