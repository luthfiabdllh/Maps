import { describe, it, expect } from 'vitest';
import { getDictionary, isValidLocale, locales, defaultLocale } from '@/lib/i18n';

describe('i18n utilities', () => {
  describe('isValidLocale()', () => {
    it('returns true for "en"', () => {
      expect(isValidLocale('en')).toBe(true);
    });

    it('returns true for "id"', () => {
      expect(isValidLocale('id')).toBe(true);
    });

    it('returns false for unsupported locale', () => {
      expect(isValidLocale('fr')).toBe(false);
    });

    it('returns false for empty string', () => {
      expect(isValidLocale('')).toBe(false);
    });

    it('returns false for random string', () => {
      expect(isValidLocale('xx-XX')).toBe(false);
    });
  });

  describe('locales constant', () => {
    it('contains "en" and "id"', () => {
      expect(locales).toContain('en');
      expect(locales).toContain('id');
    });

    it('has exactly 2 locales', () => {
      expect(locales).toHaveLength(2);
    });
  });

  describe('defaultLocale', () => {
    it('is "en"', () => {
      expect(defaultLocale).toBe('en');
    });
  });

  describe('getDictionary()', () => {
    it('returns English dictionary for "en"', async () => {
      const dict = await getDictionary('en');
      expect(dict.map.searchPlaceholder).toBe('Search locations...');
      expect(dict.map.allCategories).toBe('All Categories');
    });

    it('returns Indonesian dictionary for "id"', async () => {
      const dict = await getDictionary('id');
      expect(dict.map.searchPlaceholder).toBe('Cari lokasi...');
      expect(dict.map.allCategories).toBe('Semua Kategori');
    });

    it('returned dictionary has all required keys', async () => {
      const dict = await getDictionary('en');
      expect(dict).toHaveProperty('common');
      expect(dict).toHaveProperty('map');
      expect(dict).toHaveProperty('errors');
    });
  });
});
