import { createContext, useContext, useState, useEffect } from 'react';
import translations from '../i18n/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('rgs_lang') || 'en');

  const t = translations[lang];
  const isUrdu = lang === 'ur';

  useEffect(() => {
    localStorage.setItem('rgs_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = isUrdu ? 'rtl' : 'ltr';
  }, [lang, isUrdu]);

  const toggleLang = () => setLang(prev => prev === 'en' ? 'ur' : 'en');

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, isUrdu }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
