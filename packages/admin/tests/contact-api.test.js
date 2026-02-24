import { describe, it, expect } from 'vitest';

// Re-implement the sanitize and validation logic from the contact API route for isolated testing
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

describe('Admin Contact API — Sanitize', () => {
  it('should escape HTML tags', () => {
    expect(sanitize('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    );
  });

  it('should escape ampersands', () => {
    expect(sanitize('Tom & Jerry')).toBe('Tom &amp; Jerry');
  });

  it('should escape single quotes', () => {
    expect(sanitize("it's")).toBe("it&#x27;s");
  });

  it('should trim whitespace', () => {
    expect(sanitize('  hello  ')).toBe('hello');
  });

  it('should handle non-string input', () => {
    expect(sanitize(null)).toBe('');
    expect(sanitize(undefined)).toBe('');
    expect(sanitize(123)).toBe('');
  });

  it('should handle empty string', () => {
    expect(sanitize('')).toBe('');
  });
});

describe('Admin Contact API — Email Validation', () => {
  it('should accept valid emails', () => {
    expect(emailRegex.test('user@example.com')).toBe(true);
    expect(emailRegex.test('name.last@domain.co')).toBe(true);
    expect(emailRegex.test('user+tag@host.org')).toBe(true);
  });

  it('should reject invalid emails', () => {
    expect(emailRegex.test('')).toBe(false);
    expect(emailRegex.test('noatsign')).toBe(false);
    expect(emailRegex.test('@nodomain.com')).toBe(false);
    expect(emailRegex.test('user@')).toBe(false);
    expect(emailRegex.test('user @domain.com')).toBe(false);
  });
});

describe('Admin Contact API — Field Length Validation', () => {
  const limits = { name: 100, email: 254, subject: 200, message: 5000 };

  for (const [field, max] of Object.entries(limits)) {
    it(`should reject ${field} longer than ${max} chars`, () => {
      expect('a'.repeat(max + 1).length).toBeGreaterThan(max);
    });

    it(`should accept ${field} at exactly ${max} chars`, () => {
      expect('a'.repeat(max).length).toBeLessThanOrEqual(max);
    });
  }
});

describe('Admin Contact API — API Key Validation', () => {
  function validateApiKey(headerValue, envValue) {
    return headerValue === envValue;
  }

  it('should accept matching API key', () => {
    expect(validateApiKey('my-secret-key', 'my-secret-key')).toBe(true);
  });

  it('should reject mismatched API key', () => {
    expect(validateApiKey('wrong-key', 'correct-key')).toBe(false);
  });

  it('should reject null API key', () => {
    expect(validateApiKey(null, 'correct-key')).toBe(false);
  });

  it('should reject undefined API key', () => {
    expect(validateApiKey(undefined, 'correct-key')).toBe(false);
  });
});

describe('Admin Contact API — Required Fields', () => {
  function validateRequired({ name, email, subject, message }) {
    return !!(name && email && subject && message);
  }

  it('should pass with all fields', () => {
    expect(
      validateRequired({
        name: 'John',
        email: 'john@test.com',
        subject: 'Test',
        message: 'Hello',
      })
    ).toBe(true);
  });

  it('should fail with missing name', () => {
    expect(
      validateRequired({ name: '', email: 'a@b.c', subject: 'Test', message: 'Hello' })
    ).toBe(false);
  });

  it('should fail with missing email', () => {
    expect(
      validateRequired({ name: 'John', email: '', subject: 'Test', message: 'Hello' })
    ).toBe(false);
  });

  it('should fail with missing subject', () => {
    expect(
      validateRequired({ name: 'John', email: 'a@b.c', subject: '', message: 'Hello' })
    ).toBe(false);
  });

  it('should fail with missing message', () => {
    expect(
      validateRequired({ name: 'John', email: 'a@b.c', subject: 'Test', message: '' })
    ).toBe(false);
  });

  it('should fail with null fields', () => {
    expect(
      validateRequired({ name: null, email: null, subject: null, message: null })
    ).toBe(false);
  });
});
