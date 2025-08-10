// lib/auth.ts
import { NextRequest } from 'next/server';

// Simple authentication check for admin API routes
export function isAuthenticated(request: NextRequest): boolean {
  // Production mode - require admin token
  const adminToken = request.headers.get('x-admin-token');
  
  if (process.env.NODE_ENV === 'development') {
    // Development mode - check for admin token, fallback to env
    return adminToken === process.env.ADMIN_API_TOKEN || adminToken === 'admin-token';
  }
  
  // Production mode - strict token validation
  return adminToken === process.env.ADMIN_API_TOKEN;
}

// Check if request is from admin panel pages
export function isAdminRequest(request: NextRequest): boolean {
  const referer = request.headers.get('referer') || '';
  return referer.includes('/admin');
}

// Rate limiting helper
const requests = new Map<string, number[]>();

export function isRateLimited(ip: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!requests.has(ip)) {
    requests.set(ip, []);
  }
  
  const requestTimes = requests.get(ip)!;
  const recentRequests = requestTimes.filter(time => time > windowStart);
  
  if (recentRequests.length >= limit) {
    return true;
  }
  
  recentRequests.push(now);
  requests.set(ip, recentRequests);
  return false;
}

// Get client IP
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  return real || 'unknown';
}
