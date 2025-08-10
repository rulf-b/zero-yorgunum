// lib/secure-storage.ts

// Simple encryption for client-side storage
function simpleEncrypt(text: string, key: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const textChar = text.charCodeAt(i);
    const keyChar = key.charCodeAt(i % key.length);
    result += String.fromCharCode(textChar ^ keyChar);
  }
  return btoa(result); // Base64 encode
}

function simpleDecrypt(encryptedText: string, key: string): string {
  try {
    const text = atob(encryptedText); // Base64 decode
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const textChar = text.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      result += String.fromCharCode(textChar ^ keyChar);
    }
    return result;
  } catch {
    return '';
  }
}

const STORAGE_KEY = 'app_session';
const ENCRYPTION_KEY = 'secure_key_2024'; // In production, use environment variable

export class SecureStorage {
  static setItem(key: string, value: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      const encrypted = simpleEncrypt(value, ENCRYPTION_KEY);
      localStorage.setItem(`${STORAGE_KEY}_${key}`, encrypted);
    } catch (error) {
      console.error('Secure storage set error:', error);
    }
  }

  static getItem(key: string): string | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const encrypted = localStorage.getItem(`${STORAGE_KEY}_${key}`);
      if (!encrypted) return null;
      
      return simpleDecrypt(encrypted, ENCRYPTION_KEY);
    } catch (error) {
      console.error('Secure storage get error:', error);
      return null;
    }
  }

  static removeItem(key: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(`${STORAGE_KEY}_${key}`);
    } catch (error) {
      console.error('Secure storage remove error:', error);
    }
  }

  static clear(): void {
    if (typeof window === 'undefined') return;
    
    try {
      // Remove only our app's keys
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(STORAGE_KEY)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Secure storage clear error:', error);
    }
  }
}

// Backward compatibility helpers
export function migrateOldStorage(): void {
  if (typeof window === 'undefined') return;
  
  // Migrate old admin2_logged_in to secure storage
  const oldAdmin2 = localStorage.getItem('admin2_logged_in');
  if (oldAdmin2) {
    SecureStorage.setItem('admin2_logged_in', oldAdmin2);
    localStorage.removeItem('admin2_logged_in');
  }
}
