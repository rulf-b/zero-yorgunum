// lib/password.ts
import crypto from 'crypto';

// Simple password hashing using Node.js built-in crypto
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  try {
    const [salt, hash] = hashedPassword.split(':');
    const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === verifyHash;
  } catch (e) {
    return false;
  }
}

// For backward compatibility - check if password is already hashed
export function isPasswordHashed(password: string): boolean {
  return password.includes(':') && password.length > 50;
}

// Migration helper - gradually hash existing passwords
export function migratePassword(plainPassword: string, storedPassword: string): { password: string; needsUpdate: boolean } {
  if (isPasswordHashed(storedPassword)) {
    // Already hashed
    return { password: storedPassword, needsUpdate: false };
  }
  
  // Plain text password, hash it
  const hashed = hashPassword(plainPassword);
  return { password: hashed, needsUpdate: true };
}
