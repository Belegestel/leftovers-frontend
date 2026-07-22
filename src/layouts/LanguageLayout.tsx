import i18n, { supportedLanguages } from '@/i18n';
import { useEffect } from 'react';
import { RootLayout } from './RootLayout';
import { useParams } from 'react-router-dom';

export function LanguageLayout() {
  const { lang } = useParams();

  const language = supportedLanguages.includes(lang ?? '') ? lang : 'en';

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  return <RootLayout />;
}
