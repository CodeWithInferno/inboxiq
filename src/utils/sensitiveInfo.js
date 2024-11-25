import { decode } from 'he'; // Optional: For decoding HTML entities

// Function to redact sensitive information in plain text
export function redactSensitiveInfo(text) {
  if (!text) return text;

  const patterns = [
    /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, // Credit card numbers
    /\b\d{9,16}\b/g, // Bank account numbers
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, // Email addresses
    /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g, // Phone numbers
    /https?:\/\/(?:www\.)?[^\s/$.?#].[^\s]*/g, // URLs with or without query parameters
    /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, // IP addresses
    /\b\d{3}-\d{2}-\d{4}\b/g, // Social Security Numbers
    /\b[A-Z0-9]{8,10}\b/g, // Passport numbers
    /\b[A-Z]{1,3}-?\d{1,4}\b/g, // Vehicle license plates
    /\b[A-Z]{2}\d{2}[A-Z0-9]{1,30}\b/g, // IBAN format
  ];

  for (const pattern of patterns) {
    text = text.replace(pattern, '[REDACTED]');
  }

  const contextualReplacements = [
    { pattern: /credit card.*?ending in \d{4}/i, replacement: '[Sensitive Credit Card Info]' },
    { pattern: /outstanding balance of.*?\$?\d+(,\d{3})*(\.\d{2})?/i, replacement: '[Sensitive Financial Info]' },
    { pattern: /account number.*?\d+/i, replacement: '[Sensitive Account Info]' },
    { pattern: /routing number.*?\d+/i, replacement: '[Sensitive Routing Info]' },
    { pattern: /sign-in.*?from.*?(new device|unknown device)/i, replacement: '[Sensitive Sign-in Info]' },
    { pattern: /google\.com.*?sign-in/i, replacement: '[Sensitive Google Sign-in Info]' },
    { pattern: /paypal\.com.*?payment/i, replacement: '[Sensitive PayPal Info]' },
    { pattern: /\b(?:DOB|SSN|PAN|TIN|EIN|NIN):?\s?\d{1,}\b/gi, replacement: '[Sensitive Acronym Info]' },
  ];

  for (const { pattern, replacement } of contextualReplacements) {
    text = text.replace(pattern, replacement);
  }

  return text;
}

// Function to sanitize HTML emails
export function sanitizeHtmlEmail(html) {
  const decodedHtml = decode(html.replace(/<[^>]*>?/gm, '')); // Strip HTML tags and decode entities
  return redactSensitiveInfo(decodedHtml); // Sanitize sensitive info
}
