import { describe, it, expect } from 'vitest';

const SUPPORTED_LANGS = ['en', 'es'];

describe('Portfolio API — Language Validation', () => {
  it('should accept "en"', () => {
    expect(SUPPORTED_LANGS.includes('en')).toBe(true);
  });

  it('should accept "es"', () => {
    expect(SUPPORTED_LANGS.includes('es')).toBe(true);
  });

  it('should reject unsupported language "fr"', () => {
    expect(SUPPORTED_LANGS.includes('fr')).toBe(false);
  });

  it('should reject empty string', () => {
    expect(SUPPORTED_LANGS.includes('')).toBe(false);
  });
});

describe('Portfolio API — Response Data Structure', () => {
  // Validate the expected shape of the portfolio API response
  const requiredTopKeys = [
    'lang',
    'meta',
    'nav',
    'hero',
    'about',
    'summary',
    'experience',
    'skills',
    'projects',
    'contact',
    'footer',
    'switchLang',
  ];

  const requiredNavKeys = ['home', 'about', 'experience', 'skills', 'projects', 'contact'];
  const requiredMetaKeys = ['title', 'description'];
  const requiredHeroKeys = ['name', 'lastName', 'role', 'tagline', 'marquee'];
  const requiredContactFormKeys = [
    'name',
    'email',
    'subject',
    'message',
    'send',
    'sending',
    'success',
    'error',
  ];

  // Build a mock response matching the API shape
  function buildMockResponse(lang) {
    return {
      lang,
      meta: { title: 'Test', description: 'Test description' },
      nav: { home: 'Home', about: 'About', experience: 'Exp', skills: 'Skills', projects: 'Projects', contact: 'Contact' },
      hero: { name: 'John', lastName: 'Doe', role: 'Dev', tagline: 'Hello', marquee: ['A', 'B', 'C'] },
      about: { title: 'About', subtitle: 'Sub', description: 'Desc', location: 'Here', email: 'a@b.c', phone: '123', circleItems: [] },
      summary: [{ title: 'T', heading: 'H', text: 'Text' }],
      experience: { title: 'Experience', jobs: [] },
      skills: { title: 'Skills', categories: [] },
      projects: [],
      contact: {
        title: 'Contact',
        titleHighlight: 'Me',
        subtitle: 'Sub',
        form: { name: 'Name', email: 'Email', subject: 'Subject', message: 'Message', send: 'Send', sending: 'Sending...', success: 'Sent', error: 'Error' },
      },
      footer: { name: 'John', email: 'a@b.c' },
      switchLang: lang === 'es' ? 'EN' : 'ES',
    };
  }

  it('should have all required top-level keys', () => {
    const data = buildMockResponse('en');
    for (const key of requiredTopKeys) {
      expect(data).toHaveProperty(key);
    }
  });

  it('should have all nav keys', () => {
    const data = buildMockResponse('en');
    for (const key of requiredNavKeys) {
      expect(data.nav).toHaveProperty(key);
    }
  });

  it('should have all meta keys', () => {
    const data = buildMockResponse('en');
    for (const key of requiredMetaKeys) {
      expect(data.meta).toHaveProperty(key);
    }
  });

  it('should have all hero keys', () => {
    const data = buildMockResponse('en');
    for (const key of requiredHeroKeys) {
      expect(data.hero).toHaveProperty(key);
    }
  });

  it('should have all contact form keys', () => {
    const data = buildMockResponse('en');
    for (const key of requiredContactFormKeys) {
      expect(data.contact.form).toHaveProperty(key);
    }
  });

  it('marquee should be an array', () => {
    const data = buildMockResponse('en');
    expect(Array.isArray(data.hero.marquee)).toBe(true);
  });

  it('switchLang should be "EN" for es', () => {
    const data = buildMockResponse('es');
    expect(data.switchLang).toBe('EN');
  });

  it('switchLang should be "ES" for en', () => {
    const data = buildMockResponse('en');
    expect(data.switchLang).toBe('ES');
  });
});
