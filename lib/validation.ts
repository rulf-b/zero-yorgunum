// lib/validation.ts

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation (Turkish format)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+90|0)?[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Sanitize string input - Enhanced XSS protection
export function sanitizeString(input: string, maxLength: number = 500): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .slice(0, maxLength)
    // Remove HTML tags completely
    .replace(/<[^>]*>/g, '')
    // Remove script tags (case insensitive)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove javascript: protocols
    .replace(/javascript:/gi, '')
    // Remove data: URLs
    .replace(/data:/gi, '')
    // Remove vbscript: protocols
    .replace(/vbscript:/gi, '')
    // Remove event handlers (onclick, onload, etc.)
    .replace(/on\w+\s*=/gi, '')
    // Remove style attributes that could contain expressions
    .replace(/style\s*=/gi, '')
    // Remove expression() CSS
    .replace(/expression\s*\(/gi, '')
    // Remove potentially dangerous characters
    .replace(/[<>'"]/g, '');
}

// Validate testimonial input
export function validateTestimonial(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.name || data.name.length < 2) {
    errors.push('İsim en az 2 karakter olmalıdır.');
  }
  
  if (!data.comment || data.comment.length < 10) {
    errors.push('Yorum en az 10 karakter olmalıdır.');
  }
  
  if (data.comment && data.comment.length > 1000) {
    errors.push('Yorum 1000 karakterden uzun olamaz.');
  }
  
  if (data.rating && (data.rating < 1 || data.rating > 5)) {
    errors.push('Puan 1-5 arasında olmalıdır.');
  }
  
  return { isValid: errors.length === 0, errors };
}

// Validate contact form
export function validateContactForm(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.name || data.name.length < 2) {
    errors.push('İsim en az 2 karakter olmalıdır.');
  }
  
  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Geçerli bir email adresi giriniz.');
  }
  
  if (!data.phone || !isValidPhone(data.phone)) {
    errors.push('Geçerli bir telefon numarası giriniz.');
  }
  
  if (!data.message || data.message.length < 10) {
    errors.push('Mesaj en az 10 karakter olmalıdır.');
  }
  
  return { isValid: errors.length === 0, errors };
}

// Validate quote form
export function validateQuoteForm(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.name || data.name.length < 2) {
    errors.push('İsim en az 2 karakter olmalıdır.');
  }
  
  if (!data.phone || !isValidPhone(data.phone)) {
    errors.push('Geçerli bir telefon numarası giriniz.');
  }
  
  if (!data.tvBrand || data.tvBrand.length < 2) {
    errors.push('TV markası belirtiniz.');
  }
  
  if (!data.issueType) {
    errors.push('Arıza tipi seçiniz.');
  }
  
  return { isValid: errors.length === 0, errors };
}

// URL validation and sanitization
export function sanitizeUrl(url: string): string {
  if (typeof url !== 'string') return '';
  
  // Remove dangerous protocols
  if (url.match(/^(javascript|data|vbscript|file|about):/i)) {
    return '';
  }
  
  // Allow only http, https, and relative URLs
  if (!url.match(/^(https?:\/\/|\/)/i)) {
    return '';
  }
  
  return url.trim();
}

// Content Security Policy helpers
export function isAllowedImageSource(url: string): boolean {
  const allowedDomains = [
    'localhost',
    '127.0.0.1',
    'ekransitesi.com',
    'www.ekransitesi.com',
    // Add other trusted domains as needed
  ];
  
  try {
    const urlObj = new URL(url);
    return allowedDomains.some(domain => urlObj.hostname.includes(domain)) || url.startsWith('/');
  } catch {
    return url.startsWith('/'); // Relative URLs are OK
  }
}
