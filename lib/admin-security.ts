// lib/admin-security.ts

// Admin login attempt tracking
const LOGIN_ATTEMPTS_KEY = 'admin_login_attempts';
const MAX_ATTEMPTS = 3;
const LOCKOUT_TIME = 10 * 60 * 1000; // 10 minutes

interface LoginAttempt {
  timestamp: number;
  ip?: string;
}

export class AdminSecurity {
  // Check if admin login is rate limited
  static checkLoginAttempts(identifier: string = 'default'): { allowed: boolean; remainingTime?: number; attemptsLeft?: number } {
    if (typeof window === 'undefined') return { allowed: true };
    
    const stored = localStorage.getItem(`${LOGIN_ATTEMPTS_KEY}_${identifier}`);
    const now = Date.now();
    
    if (!stored) {
      return { allowed: true, attemptsLeft: MAX_ATTEMPTS };
    }
    
    const attempts: LoginAttempt[] = JSON.parse(stored);
    const recentAttempts = attempts.filter(attempt => now - attempt.timestamp < LOCKOUT_TIME);
    
    if (recentAttempts.length >= MAX_ATTEMPTS) {
      const oldestAttempt = Math.min(...recentAttempts.map(a => a.timestamp));
      const remainingTime = LOCKOUT_TIME - (now - oldestAttempt);
      return { allowed: false, remainingTime };
    }
    
    const attemptsLeft = MAX_ATTEMPTS - recentAttempts.length;
    return { allowed: true, attemptsLeft };
  }

  // Record a failed login attempt
  static recordFailedAttempt(identifier: string = 'default'): void {
    if (typeof window === 'undefined') return;
    
    const stored = localStorage.getItem(`${LOGIN_ATTEMPTS_KEY}_${identifier}`);
    const now = Date.now();
    
    let attempts: LoginAttempt[] = stored ? JSON.parse(stored) : [];
    
    // Remove old attempts outside the lockout window
    attempts = attempts.filter(attempt => now - attempt.timestamp < LOCKOUT_TIME);
    
    // Add new attempt
    attempts.push({ timestamp: now });
    
    localStorage.setItem(`${LOGIN_ATTEMPTS_KEY}_${identifier}`, JSON.stringify(attempts));
  }

  // Clear login attempts (on successful login)
  static clearLoginAttempts(identifier: string = 'default'): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(`${LOGIN_ATTEMPTS_KEY}_${identifier}`);
  }

  // Format remaining time for display
  static formatRemainingTime(milliseconds: number): string {
    const minutes = Math.ceil(milliseconds / 60000);
    return `${minutes} dakika`;
  }

  // Get client fingerprint for better tracking
  static getClientFingerprint(): string {
    if (typeof window === 'undefined') return 'server';
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Security fingerprint', 2, 2);
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');
    
    // Simple hash
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
  }
}
