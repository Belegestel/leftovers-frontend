import { supportedLanguages } from '@/i18n';

export function getBrowserLanguage() {
  const languages = navigator.languages ?? [navigator.language];

  return (
    languages
      .map((language) => language.split('-')[0])
      .find((language) => supportedLanguages.includes(language)) ?? null
  );
}
