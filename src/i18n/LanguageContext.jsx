import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';
import { translateText, translateBatch } from '../services/translator';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('afrikdev_lang') || 'fr';
  });

  useEffect(() => {
    localStorage.setItem('afrikdev_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'fr' ? 'en' : 'fr'));
  };

  /**
   * Helper de traduction sécurisé avec support des clés imbriquées (ex: 'nav.home')
   */
  const t = (path, fallback = '') => {
    const keys = path.split('.');
    let current = translations[language] || translations.fr;
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback en français si non traduit en anglais
        let frFallback = translations.fr;
        for (const fKey of keys) {
          if (frFallback && typeof frFallback === 'object' && fKey in frFallback) {
            frFallback = frFallback[fKey];
          } else {
            return fallback || path;
          }
        }
        return frFallback || fallback || path;
      }
    }
    return current || fallback || path;
  };

  /**
   * Traduit dynamiquement un texte arbitraire (ex: post, bio, commentaire) vers la langue active
   */
  const translateDynamic = async (text) => {
    return translateText(text, language, 'auto');
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      toggleLanguage,
      t,
      translateDynamic,
      translateText,
      translateBatch
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      language: 'fr',
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: (path, fallback = '') => fallback || path,
      translateDynamic: async (txt) => txt,
      translateText,
      translateBatch
    };
  }
  return ctx;
}

/**
 * Hook pour traduire automatiquement un texte réactif dès que la langue change
 */
export function useLiveTranslation(text) {
  const { language } = useTranslation();
  const [translated, setTranslated] = useState(text);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (!text) {
      setTranslated('');
      return;
    }

    let isMounted = true;
    setIsTranslating(true);

    translateText(text, language, 'auto').then((res) => {
      if (isMounted) {
        setTranslated(res);
        setIsTranslating(false);
      }
    }).catch(() => {
      if (isMounted) {
        setTranslated(text);
        setIsTranslating(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [text, language]);

  return { translated, isTranslating };
}
