import { describe, expect, it } from 'vitest';
import en from './locales/en.json';
import fr from './locales/fr.json';
import de from './locales/de.json';
import pl from './locales/pl.json';

const languages = {
  en,
  fr,
  de,
  pl,
};

describe('translations', () => {
  it('has language switch translations in every language', () => {
    Object.values(languages).forEach((translation) => {
      expect(translation.language.switchPrompt).toBeDefined();
      expect(translation.language.switch).toBeDefined();
      expect(translation.language.names.en).toBeDefined();
      expect(translation.language.names.fr).toBeDefined();
      expect(translation.language.names.de).toBeDefined();
      expect(translation.language.names.pl).toBeDefined();
    });
  });
});
